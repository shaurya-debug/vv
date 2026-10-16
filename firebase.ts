import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with configured database ID
export const db = getFirestore(app);

// Test Firestore connection on boot
export const testFirestoreConnection = async () => {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Verify network configuration.');
    }
  }
};

// Google Auth Provider with Workspace scopes (Calendar, Gmail, Meet, Chat)
const provider = new GoogleAuthProvider();
export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/meetings.space.readonly',
  'https://www.googleapis.com/auth/meetings.space.settings',
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.create',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.memberships',
  'https://www.googleapis.com/auth/chat.memberships.readonly',
];

SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// In-memory token cache (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If logged in via email/password or reloaded without in-memory token
        if (onAuthSuccess) onAuthSuccess(user, null);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google (requests Calendar, Gmail, Meet, Chat scopes)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google sign in');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign-in Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Email & Password Sign Up
export const signUpWithEmail = async (
  email: string,
  pass: string,
  displayName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

// Email & Password Sign In
export const signInWithEmail = async (email: string, pass: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// Get current in-memory access token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Set token manually
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Log out
export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consultationDate?: string; // YYYY-MM-DD
  consultationTime?: string; // e.g. "17:00"
}

export interface StoredBooking extends BookingDetails {
  id?: string;
  userId?: string;
  userEmail?: string;
  meetLink?: string;
  calendarEventId?: string;
  paymentStatus: 'pending' | 'paid' | 'waived';
  paymentMethod?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentTransactionId?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// ✦ Google Calendar Event Creation with automatic Google Meet video conference
export const createCalendarEvent = async (
  token: string,
  details: BookingDetails
): Promise<any> => {
  const targetDate = details.consultationDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const targetTime = details.consultationTime || '17:00'; // Default 5:00 PM IST

  const startDateTime = `${targetDate}T${targetTime}:00+05:30`;
  const [h, m] = targetTime.split(':').map(Number);
  const endHour = (h + 1).toString().padStart(2, '0');
  const endDateTime = `${targetDate}T${endHour}:${(m || 0).toString().padStart(2, '0')}:00+05:30`;

  const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const eventPayload = {
    summary: `Vedic Consultation: ${details.name} — ${details.service}`,
    description: `Vedic Pandit Consultation Appointment with Acharya Jitender Shastri\n\nClient Name: ${details.name}\nPhone: ${details.phone}\nEmail: ${details.email || 'Not provided'}\nService / Pooja: ${details.service}\n\nClient Notes & Birth Details:\n${details.message || 'No additional notes'}\n\nAstrologer Contact:\nAcharya Jitender Shastri\nPhone: +91 9466215390\nEmail: jksv390@gmail.com\nChandigarh, India`,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Kolkata',
    },
    location: 'Google Meet Video Consultation / Chandigarh',
    attendees: details.email ? [{ email: details.email }] : [],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 120 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Calendar Error (${response.status}): ${errorText}`);
  }

  return response.json();
};

// ✦ Google Meet API Direct Space Creation (v2)
export const createGoogleMeetSpace = async (token: string): Promise<{ meetingUri: string; name: string } | null> => {
  try {
    const res = await fetch('https://meet.googleapis.com/v2/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        meetingUri: data.meetingUri || `https://meet.google.com/${data.name?.replace('spaces/', '')}`,
        name: data.name,
      };
    }
  } catch (e) {
    console.warn('Google Meet API v2 notice:', e);
  }
  return null;
};

// ✦ Google Chat API Integration (Send updates to Google Chat spaces)
export const listGoogleChatSpaces = async (token: string): Promise<any[]> => {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.spaces || [];
    }
  } catch (e) {
    console.warn('Google Chat spaces listing notice:', e);
  }
  return [];
};

export const sendGoogleChatMessage = async (
  token: string,
  spaceName: string,
  text: string
): Promise<any> => {
  const cleanSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const res = await fetch(`https://chat.googleapis.com/v1/${cleanSpace}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Chat Error (${res.status}): ${err}`);
  }
  return res.json();
};

// ✦ Firestore Booking Operations
export const saveBookingToFirestore = async (booking: StoredBooking): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (e) {
    console.error('Firestore save booking error:', e);
    throw e;
  }
};

export const getUserBookings = async (userId: string): Promise<StoredBooking[]> => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as StoredBooking) }));
  } catch (e) {
    console.warn('Error fetching bookings from Firestore:', e);
    return [];
  }
};

// ✦ Firestore Vedic Consultation Chat Messages
export interface ChatMessageData {
  id?: string;
  userId?: string;
  userName: string;
  sender: 'user' | 'pandit';
  text: string;
  timestamp: string;
}

export const saveChatMessageToFirestore = async (msg: ChatMessageData): Promise<string> => {
  const docRef = await addDoc(collection(db, 'chatMessages'), {
    ...msg,
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
};

export const subscribeToChatMessages = (
  callback: (messages: ChatMessageData[]) => void
) => {
  const q = query(
    collection(db, 'chatMessages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessageData[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as ChatMessageData),
    }));
    callback(messages);
  });
};

// Helper to construct pre-filled mailto link for direct sending to Acharya ji
export const createDirectEmailMailtoUrl = (
  details: BookingDetails,
  astrologerEmail: string = 'jksv390@gmail.com'
): string => {
  const subject = `[Vedic Consultation] ${details.name} — ${details.service}`;
  const body = `Pranam Acharya Jitender Shastri Ji,

I would like to schedule a Vedic consultation appointment with you.

--- Client & Booking Details ---
Client Name: ${details.name}
Phone Number: ${details.phone}
Email Address: ${details.email || 'N/A'}
Service / Pooja: ${details.service}
Preferred Date: ${details.consultationDate || 'Next Auspicious Muhurat'}
Preferred Time Slot: ${details.consultationTime || 'Evening Slot'} IST

Birth Details / Query / Gotra:
${details.message || 'Please let me know the available muhurat and preparation instructions.'}

Warm regards,
${details.name}
Phone: ${details.phone}`;

  return `mailto:${astrologerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// Send Email via Gmail API directly to Acharya ji
export const sendGmailNotification = async (
  token: string,
  details: BookingDetails,
  astrologerEmail: string = 'jksv390@gmail.com',
  meetLink?: string,
  paymentInfo?: { status: string; amount: number; transactionId?: string }
): Promise<any> => {
  const subject = `✦ [Vedic Pandit] New Consultation Booking: ${details.name} — ${details.service}`;

  const bodyHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 28px; border-radius: 14px; border: 2px solid #eab308; max-width: 650px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px solid #334155; padding-bottom: 18px; margin-bottom: 20px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #facc15; font-weight: bold; background: rgba(250, 204, 21, 0.15); padding: 4px 12px; rounded-full: 9999px; border: 1px solid rgba(250, 204, 21, 0.3);">Vedic Pandit Consultation Desk</span>
        <h2 style="color: #facc15; margin: 12px 0 4px 0; font-size: 24px; font-weight: 700;">New Consultation Request</h2>
        <p style="font-size: 14px; color: #94a3b8; margin: 0;">For <strong>Acharya Jitender Shastri</strong> (Astrologer, Tantra Samrat & Gem Consultant)</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; width: 140px; font-weight: 500;">Client Name:</td>
          <td style="padding: 10px 0; color: #ffffff; font-weight: bold; font-size: 15px;">${details.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Phone Number:</td>
          <td style="padding: 10px 0;">
            <a href="tel:${details.phone.replace(/\\s+/g, '')}" style="color: #facc15; font-weight: bold; text-decoration: none;">${details.phone}</a>
            <span style="color: #64748b; font-size: 12px; margin-left: 8px;">(Tap to call)</span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Client Email:</td>
          <td style="padding: 10px 0;">
            ${details.email ? `<a href="mailto:${details.email}" style="color: #38bdf8; text-decoration: none;">${details.email}</a>` : '<span style="color: #64748b;">Not provided</span>'}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Service / Pooja:</td>
          <td style="padding: 10px 0; color: #facc15; font-weight: bold;">${details.service}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Requested Date:</td>
          <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${details.consultationDate || 'Next Shubh Muhurat'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Time Slot:</td>
          <td style="padding: 10px 0; color: #facc15; font-weight: 600;">${details.consultationTime || 'Evening Slot'} IST</td>
        </tr>
        ${meetLink ? `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Google Meet Link:</td>
          <td style="padding: 10px 0;">
            <a href="${meetLink}" style="color: #34d399; font-weight: bold; text-decoration: underline;">${meetLink}</a>
          </td>
        </tr>
        ` : ''}
        ${paymentInfo ? `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8; font-weight: 500;">Google Pay:</td>
          <td style="padding: 10px 0; color: #22c55e; font-weight: bold;">
            ₹${paymentInfo.amount} (${paymentInfo.status.toUpperCase()}) ${paymentInfo.transactionId ? `- ID: ${paymentInfo.transactionId}` : ''}
          </td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 12px 0; color: #94a3b8; vertical-align: top; font-weight: 500;">Query &amp; Birth Details:</td>
          <td style="padding: 12px 0; color: #e2e8f0; white-space: pre-wrap; line-height: 1.5; background: #1e1b4b; padding: 12px; border-radius: 8px; border: 1px solid #334155;">${details.message || 'No additional note provided'}</td>
        </tr>
      </table>

      ${meetLink ? `
      <div style="margin-top: 18px; text-align: center; background: rgba(52, 211, 153, 0.1); border: 1px solid #059669; border-radius: 10px; padding: 14px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #6ee7b7; font-weight: bold;">📹 Google Meet Video Consultation Scheduled</p>
        <a href="${meetLink}" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: bold; font-size: 14px; text-decoration: none; padding: 10px 24px; border-radius: 8px;">Join Google Meet Room</a>
      </div>
      ` : ''}

      <div style="margin-top: 24px; padding: 16px; background-color: #1e1b4b; border-radius: 10px; border-left: 4px solid #facc15;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #ffffff; font-weight: bold;">
          Acharya Jitender Shastri
        </p>
        <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          Astrologer • Tantra Samrat • Certified Gem Consultant<br />
          Phone: +91 9466215390 | Location: Chandigarh, India<br />
          Consultation Hours: Mon - Sat (4:00 PM - 8:00 PM), Sun (10:00 AM - 5:00 PM)
        </p>
      </div>

      <div style="margin-top: 18px; text-align: center;">
        <a href="https://wa.me/919466215390" style="display: inline-block; background-color: #25D366; color: #ffffff; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 8px; margin: 4px;">WhatsApp Acharya Ji</a>
        ${details.phone ? `<a href="https://wa.me/${details.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #facc15; color: #000000; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 8px; margin: 4px;">Reply to Client WhatsApp</a>` : ''}
      </div>
    </div>
  `;

  const utf8Subject = `=?utf-8?B?${btoa(encodeURIComponent(subject).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))}?=`;

  const headers: string[] = [
    `To: ${astrologerEmail}`,
  ];
  if (details.email && details.email.trim()) {
    headers.push(`Cc: ${details.email.trim()}`);
    headers.push(`Reply-To: ${details.email.trim()}`);
  }
  headers.push(`Subject: ${utf8Subject}`);
  headers.push('MIME-Version: 1.0');
  headers.push('Content-Type: text/html; charset=utf-8');
  headers.push('Content-Transfer-Encoding: 8bit');

  const rawMessage = `${headers.join('\r\n')}\r\n\r\n${bodyHtml}`;

  const utf8Bytes = new TextEncoder().encode(rawMessage);
  let binaryString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
  const encodedMessage = btoa(binaryString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API Error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('Gmail sent successfully to Acharya ji:', result);
  return result;
};

// List upcoming calendar events for schedule viewer
export const fetchUpcomingConsultations = async (token: string): Promise<any[]> => {
  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    timeMin
  )}&maxResults=10&singleEvents=true&orderBy=startTime&conferenceDataVersion=1`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.items || [];
};
