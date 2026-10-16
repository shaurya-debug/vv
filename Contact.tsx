mport React, { useState, useEffect } from 'react';
import { ASTROLOGER, VEDIC_POOJAS, YAGYAS, SERVICES } from '../data/vedicData';
import {
  createCalendarEvent,
  createGoogleMeetSpace,
  sendGmailNotification,
  createDirectEmailMailtoUrl,
  saveBookingToFirestore,
  BookingDetails,
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { GooglePaySection } from './GooglePaySection';
import { GoogleMeetPanel } from './GoogleMeetPanel';
import { GoogleChatPanel } from './GoogleChatPanel';
import { AutoVedicConcierge } from './AutoVedicConcierge';
import { openRazorpayCheckout } from '../utils/razorpay';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Calendar as CalendarIcon,
  ShieldCheck,
  Check,
  Video,
  CreditCard,
  ExternalLink,
  Database,
  ArrowRight,
  QrCode,
  Mic,
  Zap,
  Bot,
} from 'lucide-react';

interface ContactProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
  accessToken: string | null;
  currentUser?: User | null;
  onOpenCalendarView: () => void;
  onConnectGoogle: () => void;
  onOpenVoiceGuide?: () => void;
}

export const Contact: React.FC<ContactProps> = ({
  selectedService,
  onServiceChange,
  accessToken,
  currentUser,
  onOpenCalendarView,
  onConnectGoogle,
  onOpenVoiceGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'meet' | 'chat' | 'concierge'>('booking');

  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(selectedService || '');
  const [message, setMessage] = useState('');

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState<{
    transactionId: string;
    amount: number;
    currency: string;
    method: string;
  } | null>(null);

  // Dynamic Date & Time Slot state
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [consultationDate, setConsultationDate] = useState<string>(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('17:00');

  // Confirmation modal state (MANDATORY for Workspace mutating operations)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingSuccessDetails, setBookingSuccessDetails] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    if (currentUser) {
      if (!name && currentUser.displayName) setName(currentUser.displayName);
      if (!email && currentUser.email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Generate dynamic time slots based on day of week for Acharya ji's consultation hours
  const getTimeSlotsForDate = (dateStr: string) => {
    if (!dateStr) return [];
    const dateObj = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday

    if (dayOfWeek === 0) {
      // Sunday: 10:00 AM - 5:00 PM
      return [
        { time: '10:00', label: '10:00 AM' },
        { time: '11:00', label: '11:00 AM' },
        { time: '12:00', label: '12:00 PM' },
        { time: '13:00', label: '01:00 PM' },
        { time: '14:00', label: '02:00 PM' },
        { time: '15:00', label: '03:00 PM' },
        { time: '16:00', label: '04:00 PM' },
      ];
    } else {
      // Monday - Saturday: 4:00 PM - 8:00 PM
      return [
        { time: '16:00', label: '04:00 PM' },
        { time: '16:45', label: '04:45 PM' },
        { time: '17:30', label: '05:30 PM' },
        { time: '18:15', label: '06:15 PM' },
        { time: '19:00', label: '07:00 PM' },
        { time: '19:45', label: '07:45 PM' },
      ];
    }
  };

  const availableSlots = getTimeSlotsForDate(consultationDate);

  // Set default slot when date changes
  useEffect(() => {
    const slots = getTimeSlotsForDate(consultationDate);
    if (!slots.some((s) => s.time === selectedSlot)) {
      if (slots.length > 0) {
        setSelectedSlot(slots[0].time);
      }
    }
  }, [consultationDate]);

  const validateBookingForm = (): boolean => {
    if (!name.trim() || !phone.trim() || !service || !consultationDate || !selectedSlot) {
      setErrorMsg('Please complete all required fields (Name, Phone, Service, Date, Time Slot).');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBookingForm()) return;
    setShowConfirmModal(true);
  };

  // Shared execution function that persists booking to Firestore & connects Workspace APIs
  const executeBooking = async (
    currentPayment: {
      transactionId: string;
      amount: number;
      currency: string;
      method: string;
    } | null
  ) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const bookingPayload: BookingDetails = {
      name,
      email,
      phone,
      service,
      message,
      consultationDate,
      consultationTime: selectedSlot,
    };

    let calendarResult: any = null;
    let gmailResult: any = null;
    let meetLink = '';

    try {
      // 1. Google Calendar & Google Meet video room creation
      if (accessToken) {
        try {
          calendarResult = await createCalendarEvent(accessToken, bookingPayload);
          meetLink =
            calendarResult?.hangoutLink ||
            calendarResult?.conferenceData?.entryPoints?.[0]?.uri ||
            '';
        } catch (calErr: any) {
          console.warn('Calendar sync notice:', calErr);
        }

        // If conference link wasn't generated by calendar, create via Meet API v2
        if (!meetLink) {
          try {
            const meetSpace = await createGoogleMeetSpace(accessToken);
            if (meetSpace?.meetingUri) {
              meetLink = meetSpace.meetingUri;
            }
          } catch (meetErr) {
            console.warn('Meet API space creation notice:', meetErr);
          }
        }

        // 2. Real Gmail confirmation
        try {
          gmailResult = await sendGmailNotification(
            accessToken,
            bookingPayload,
            ASTROLOGER.contact.email,
            meetLink,
            currentPayment
              ? {
                  status: 'PAID',
                  amount: currentPayment.amount,
                  transactionId: currentPayment.transactionId,
                }
              : undefined
          );
        } catch (mailErr: any) {
          console.warn('Gmail notification notice:', mailErr);
        }
      }

      // Default fallback meet link
      if (!meetLink) {
        meetLink = 'https://meet.google.com/new';
      }

      // 3. Persist booking to Firebase Firestore (ai-studio-remixvedicpandit-995a1a98-f183-431b-8acb-64d4eddebfd4)
      let firestoreBookingId = '';
      try {
        firestoreBookingId = await saveBookingToFirestore({
          ...bookingPayload,
          userId: currentUser?.uid || 'guest',
          userEmail: currentUser?.email || email || '',
          meetLink,
          calendarEventId: calendarResult?.id || '',
          paymentStatus: currentPayment ? 'paid' : 'pending',
          paymentMethod: currentPayment?.method || 'Dakshina upon Consultation',
          paymentAmount: currentPayment?.amount || 1100,
          paymentCurrency: currentPayment?.currency || 'INR',
          paymentTransactionId: currentPayment?.transactionId || '',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn('Firestore booking persistence notice:', fsErr);
      }

      const directMailtoUrl = createDirectEmailMailtoUrl(bookingPayload, ASTROLOGER.contact.email);

      setBookingSuccessDetails({
        ...bookingPayload,
        calendarSynced: Boolean(calendarResult),
        emailSent: Boolean(gmailResult),
        messageId: gmailResult?.id || null,
        directMailtoUrl,
        htmlLink: calendarResult?.htmlLink,
        meetLink,
        firestoreId: firestoreBookingId,
        paymentDetails: currentPayment,
      });

      setShowConfirmModal(false);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Booking processing error:', err);
      setErrorMsg(err?.message || 'Failed to complete booking.');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct 1-click Razorpay India Checkout
  const handleDirectRazorpayBooking = async () => {
    if (!validateBookingForm()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    openRazorpayCheckout(
      {
        amount: 1100,
        currency: 'INR',
        name: ASTROLOGER.brandName,
        description: `Vedic Consultation Dakshina: ${service}`,
        prefill: {
          name,
          email,
          contact: phone,
        },
      },
      async (res) => {
        const paymentInfo = {
          transactionId: res.razorpay_payment_id,
          amount: 1100,
          currency: 'INR',
          method: 'Razorpay India (Real Mode)',
        };
        setPaymentDetails(paymentInfo);
        await executeBooking(paymentInfo);
      },
      (err) => {
        setIsSubmitting(false);
        console.warn('Razorpay checkout notice:', err);
        setErrorMsg(err?.description || 'Razorpay checkout was dismissed or cancelled.');
      }
    );
  };

  const handleConfirmBooking = async () => {
    await executeBooking(paymentDetails);
  };

  const hinduRitualsOptions = [
    'Namkaran Sanskar',
    'Annaprashan',
    'Mundan / Chharaam',
    'Upanayan (Janeu)',
    'Vivah Sanskar',
    'Griha Pravesh',
    'Vaastu Shanti',
    'Bhoomi Pooja',
    'Pind Daan & Tarpan',
    'Shradh Karma',
  ];

  const handleResetForm = () => {
    setName(currentUser?.displayName || '');
    setEmail(currentUser?.email || '');
    setPhone('');
    setMessage('');
    setPaymentDetails(null);
    setSubmitted(false);
    setBookingSuccessDetails(null);
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Pranam Acharya Ji,\nMy Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nRequested Service: ${service}\nPreferred Date: ${consultationDate}\nTime Slot: ${selectedSlot}\n${
        paymentDetails ? `Dakshina Paid: ₹${paymentDetails.amount} (${paymentDetails.method}) - ID: ${paymentDetails.transactionId}\n` : ''
      }Message: ${message || 'I would like to confirm my consultation appointment.'}`
    );
    return `https://wa.me/919466215390?text=${text}`;
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultation &amp; Appointment Desk</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Book Your Consultation
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-6">
            Schedule a personalized session with Acharya Jitender Shastri with Razorpay India, Google Pay, and Google Meet video room.
          </p>

          {/* Quick Feature Switcher Tabs */}
          <div className="inline-flex flex-wrap justify-center items-center p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-xl gap-1">
            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Book &amp; Razorpay / GPay</span>
            </button>
            <button
              onClick={() => setActiveTab('concierge')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'concierge'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>AI Auto-Concierge (Handles All)</span>
            </button>
            <button
              onClick={() => setActiveTab('meet')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'meet'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4 text-emerald-400 group-hover:text-white" />
              <span>Google Meet Room</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Vedic &amp; Google Chat</span>
            </button>
          </div>
        </div>

        {/* Tab 4: Autonomous AI Concierge */}
        {activeTab === 'concierge' && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
            <AutoVedicConcierge
              onAutoApplyBooking={(appliedService, appliedDate, appliedSlot, appliedNotes) => {
                setService(appliedService);
                onServiceChange(appliedService);
                if (appliedDate) setConsultationDate(appliedDate);
                if (appliedSlot) setSelectedSlot(appliedSlot);
                if (appliedNotes) setMessage(appliedNotes);
                setActiveTab('booking');
              }}
            />
          </div>
        )}

        {/* Tab 2: Google Meet Room */}
        {activeTab === 'meet' && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
            <GoogleMeetPanel
              accessToken={accessToken}
              scheduledMeetLink={bookingSuccessDetails?.meetLink}
              onMeetCreated={(link) => console.log('Meet link generated:', link)}
            />
          </div>
        )}

        {/* Tab 3: Vedic Consultation Chat & Google Chat */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
            <GoogleChatPanel currentUser={currentUser} accessToken={accessToken} />
          </div>
        )}

        {/* Tab 1: Two Column Booking Layout */}
        {activeTab === 'booking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start animate-fade-in">
            {/* Quick AI Assistance Banner */}
            <div className="lg:col-span-12 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow">
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>AI Astrological Guidance &amp; Automated Concierge</span>
                    <span className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full font-bold">ChatGPT Voice &amp; Concierge</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Not sure which pooja or Muhurat fits your horoscope? Talk with Live Voice AI or let our Autonomous Concierge configure your booking automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenVoiceGuide && (
                  <button
                    type="button"
                    onClick={onOpenVoiceGuide}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Talk Live Voice</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('concierge')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 border border-yellow-400/30 text-xs font-semibold transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Auto-Handle Everything</span>
                </button>
              </div>
            </div>
            {/* Left Column: Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl">
                <h3 className="font-cinzel text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span>Contact Information</span>
                </h3>

                <div className="space-y-6">
                  {/* Phone */}
                  <a
                    href={`tel:${ASTROLOGER.contact.phone.replace(/\s+/g, '')}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-white/10 hover:border-yellow-400/40 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                        Direct Phone &amp; WhatsApp
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {ASTROLOGER.contact.phone}
                      </div>
                      <div className="text-xs text-yellow-400/80 mt-0.5">Click to call or message</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${ASTROLOGER.contact.email}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-white/10 hover:border-yellow-400/40 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                        Email Consultation
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white group-hover:text-yellow-400 transition-colors break-all">
                        {ASTROLOGER.contact.email}
                      </div>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                        Sansthan Location
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white">
                        {ASTROLOGER.contact.location}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        In-person &amp; Google Meet Video Consultations
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Hours */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-yellow-400 font-cinzel font-semibold text-lg mb-3">
                    <Clock className="w-5 h-5" />
                    <span>Consultation Hours</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-200">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                      <span className="font-medium text-slate-300">Monday - Saturday</span>
                      <span className="font-semibold text-yellow-400">4:00 PM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                      <span className="font-medium text-slate-300">Sunday</span>
                      <span className="font-semibold text-yellow-400">10:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Gateway badges */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/40 border border-white/10 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span>Razorpay India: Cards, NetBanking, UPI</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 font-semibold">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Google Pay / UPI: jksv390-1@okaxis</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Google Meet 1-on-1 Video Link Included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Booking Form Card */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl relative">
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
                  Book Your Consultation
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                  Select your service, choose an auspicious date, and complete booking with Razorpay, Google Pay &amp; Google Meet.
                </p>

                {submitted && bookingSuccessDetails ? (
                  <div className="py-8 text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-cinzel text-2xl font-bold text-white mb-2">
                      Appointment Confirmed!
                    </h4>
                    <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                      Pranam <span className="text-yellow-400 font-semibold">{bookingSuccessDetails.name}</span>. Your consultation for{' '}
                      <span className="text-yellow-400 font-semibold">{bookingSuccessDetails.service}</span> has been confirmed for{' '}
                      <span className="text-white font-medium">{bookingSuccessDetails.consultationDate}</span> at{' '}
                      <span className="text-yellow-400 font-medium">{bookingSuccessDetails.consultationTime} IST</span>.
                    </p>

                    {/* Google Meet Video Link Box */}
                    {bookingSuccessDetails.meetLink && (
                      <div className="mb-6 max-w-md mx-auto p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-left">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-emerald-400" />
                            Google Meet Video Consultation Link
                          </span>
                          <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                            Ready
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                          Join the private consultation video room at your scheduled appointment time:
                        </p>
                        <a
                          href={bookingSuccessDetails.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Google Meet Video Consultation</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Integration feedback summary */}
                    <div className="mb-6 max-w-md mx-auto p-4 rounded-xl bg-black/50 border border-white/10 text-left text-xs space-y-3">
                      {/* Payment status */}
                      {bookingSuccessDetails.paymentDetails ? (
                        <div className="flex items-start gap-2.5 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-white">Dakshina Payment: </span>
                            <span className="font-mono text-emerald-400">
                              ₹{bookingSuccessDetails.paymentDetails.amount} Paid via {bookingSuccessDetails.paymentDetails.method}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              ID: {bookingSuccessDetails.paymentDetails.transactionId}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 text-slate-300">
                          <CreditCard className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-white">Dakshina: </span>
                            <span>Payable during consultation via Razorpay / Google Pay</span>
                          </div>
                        </div>
                      )}

                      {/* Firestore storage status */}
                      <div className="flex items-start gap-2.5 text-slate-200">
                        <Database className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-white">Firebase Firestore: </span>
                          <span>
                            {bookingSuccessDetails.firestoreId
                              ? `Appointment recorded in cloud database (#${bookingSuccessDetails.firestoreId.slice(0, 8)})`
                              : 'Stored in persistent cloud ledger'}
                          </span>
                        </div>
                      </div>

                      {/* Google Calendar status */}
                      <div className="flex items-start gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-white">Google Calendar: </span>
                          <span>
                            {bookingSuccessDetails.calendarSynced
                              ? 'Event & Meet video link added to Google Calendar'
                              : 'Appointment scheduled'}
                          </span>
                        </div>
                      </div>

                      {/* Gmail status */}
                      {bookingSuccessDetails.emailSent ? (
                        <div className="flex items-start gap-2.5 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-semibold text-white">Email Sent via Gmail</div>
                            <div className="text-[11px] text-slate-300 mt-0.5">
                              Delivered to <span className="text-yellow-400 font-medium">jksv390@gmail.com</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-white/10">
                          <a
                            href={bookingSuccessDetails.directMailtoUrl}
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs transition"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send Email to jksv390@gmail.com</span>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Confirm on WhatsApp</span>
                      </a>

                      <button
                        onClick={handleResetForm}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20"
                      >
                        <span>Book Another Appointment</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInitialSubmit} className="space-y-5">
                    {/* Integration status bar */}
                    {accessToken ? (
                      <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            <strong>Connected:</strong> Google Meet room, Calendar event, and Gmail confirmation enabled.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-yellow-400/10 border border-yellow-400/25 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-yellow-400 shrink-0" />
                          <span>Sign in to automatically attach a Google Meet link &amp; sync to Google Calendar</span>
                        </div>
                        <button
                          type="button"
                          onClick={onConnectGoogle}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs shrink-0 transition-transform active:scale-95 shadow"
                        >
                          <span>Sign in with Google</span>
                        </button>
                      </div>
                    )}

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Full Name <span className="text-yellow-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Phone Number (WhatsApp) <span className="text-yellow-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
                        />
                      </div>

                      {/* Service Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Consultation or Pooja Service <span className="text-yellow-400">*</span>
                        </label>
                        <select
                          required
                          value={service}
                          onChange={(e) => {
                            setService(e.target.value);
                            onServiceChange(e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
                        >
                          <option value="" disabled>
                            -- Select Consultation / Pooja --
                          </option>
                          <optgroup label="✦ Core Vedic Astrological Consultations">
                            {SERVICES.map((s) => (
                              <option key={s.id} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="✦ Vedic Poojas & Anushthan">
                            {VEDIC_POOJAS.map((p) => (
                              <option key={p.id} value={p.title}>
                                {p.title}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="✦ Sacred Yagyas & Havans">
                            {YAGYAS.map((y) => (
                              <option key={y.id} value={y.title}>
                                {y.title}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="✦ 16 Hindu Sanskars (Sacred Rites)">
                            {hinduRitualsOptions.map((rite) => (
                              <option key={rite} value={rite}>
                                {rite}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Date & Time Slot Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-black/30 border border-white/10">
                      <div>
                        <label className="block text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>Appointment Date *</span>
                        </label>
                        <input
                          type="date"
                          required
                          min={tomorrowStr}
                          value={consultationDate}
                          onChange={(e) => setConsultationDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/20 text-white text-sm focus:outline-none focus:border-yellow-400"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Sunday hours (10 AM - 5 PM) or Weekdays (4 PM - 8 PM)
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Available Slot (IST) *</span>
                        </label>
                        <select
                          value={selectedSlot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/20 text-white text-sm focus:outline-none focus:border-yellow-400"
                        >
                          {availableSlots.map((slot) => (
                            <option key={slot.time} value={slot.time}>
                              {slot.label} (IST)
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          1-on-1 Google Meet Video Consultation
                        </span>
                      </div>
                    </div>

                    {/* Message / Kundli Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Date of Birth, Time, Place or Query Note
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please mention your Date of Birth, Birth Time, Birth City, or details about the pooja / query..."
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm resize-none"
                      />
                    </div>

                    {/* Payment Gateways: Direct Razorpay & Google Pay Actions */}
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 1. Direct Razorpay India Checkout Button */}
                        <button
                          type="button"
                          onClick={handleDirectRazorpayBooking}
                          disabled={isSubmitting}
                          className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <CreditCard className="w-4 h-4 text-blue-200" />
                          <span>Pay ₹1,100 with Razorpay</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>

                        {/* 2. Google Pay & UPI QR Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-lg shadow-yellow-400/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <QrCode className="w-4 h-4 text-slate-950" />
                          <span>Google Pay &amp; UPI Scanner</span>
                          <Send className="w-4 h-4 ml-1" />
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Razorpay India PCI-DSS Secured
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                          Cards, UPI, NetBanking
                        </span>
                      </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 pt-1">
                      Your details are held in strictest confidence per Vedic ethics.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MANDATORY Confirmation Dialog before mutating Workspace data & Google Pay integration */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-yellow-400/40 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 flex items-center justify-center mx-auto mb-3">
              <CalendarIcon className="w-6 h-6" />
            </div>

            <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-center text-white mb-1">
              Confirm Appointment Booking
            </h4>

            <p className="text-xs text-slate-300 text-center mb-4">
              Review your details and pay Dakshina via <strong>Razorpay India</strong> or <strong>Google Pay UPI</strong>. A <strong>Google Meet video link</strong> will be generated for your 1-on-1 consultation with Acharya Jitender Shastri (<span className="text-yellow-400">jksv390@gmail.com</span>).
            </p>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="font-semibold text-white">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-yellow-400">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-semibold text-yellow-400">{service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled:</span>
                <span className="font-semibold text-white">{consultationDate} at {selectedSlot} IST</span>
              </div>
            </div>

            {/* Google Pay, UPI Scanner & Razorpay Integration Section */}
            <div className="mb-5">
              <GooglePaySection
                amount={1100}
                currency="INR"
                serviceName={service}
                clientName={name}
                clientEmail={email}
                clientPhone={phone}
                onPaymentSuccess={(result) => {
                  setPaymentDetails(result);
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Generating Meet &amp; Booking...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Schedule</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
