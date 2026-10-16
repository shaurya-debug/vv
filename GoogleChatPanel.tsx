import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Clock, ExternalLink } from 'lucide-react';
import {
  saveChatMessageToFirestore,
  subscribeToChatMessages,
  sendGoogleChatMessage,
  listGoogleChatSpaces,
  ChatMessageData,
} from '../lib/firebase';
import { ASTROLOGER } from '../data/vedicData';

interface GoogleChatPanelProps {
  currentUser: any;
  accessToken: string | null;
}

export const GoogleChatPanel: React.FC<GoogleChatPanelProps> = ({
  currentUser,
  accessToken,
}) => {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatSpaces, setChatSpaces] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [syncWithGoogleChat, setSyncWithGoogleChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from Pandit Ji
  const initialWelcome: ChatMessageData = {
    id: 'welcome-0',
    userName: ASTROLOGER.name,
    sender: 'pandit',
    text: `ॐ नमो भगवते वासुदेवाय। Hari Om! Welcome to Vedic Consultation Desk. I am ${ASTROLOGER.name}. You may ask any question regarding your Janam Kundli, Shubh Muhurat, Graha Dosh, or Pooja preparations here.`,
    timestamp: new Date().toISOString(),
  };

  useEffect(() => {
    // Subscribe to real-time Firestore chat messages
    const unsubscribe = subscribeToChatMessages((firestoreMsgs) => {
      if (firestoreMsgs.length > 0) {
        setMessages(firestoreMsgs);
      } else {
        setMessages([initialWelcome]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch available Google Chat spaces if user has access token
    if (accessToken) {
      listGoogleChatSpaces(accessToken).then((spaces) => {
        setChatSpaces(spaces);
        if (spaces.length > 0) {
          setSelectedSpace(spaces[0].name);
        }
      });
    }
  }, [accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');
    setIsSending(true);

    const clientName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Seeker';

    const newMsg: ChatMessageData = {
      userId: currentUser?.uid || 'guest',
      userName: clientName,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    };

    try {
      // 1. Save to Firebase Firestore
      await saveChatMessageToFirestore(newMsg);

      // 2. Optionally forward to real Google Chat Space if enabled
      if (syncWithGoogleChat && accessToken && selectedSpace) {
        try {
          await sendGoogleChatMessage(
            accessToken,
            selectedSpace,
            `[Vedic Inquiry from ${clientName}]: ${userText}`
          );
        } catch (chatErr) {
          console.warn('Google Chat space sync error:', chatErr);
        }
      }

      // 3. Automated compassionate Vedic Pandit guidance response
      setTimeout(async () => {
        let answer = `Pranam ${clientName}. Your inquiry "${userText.slice(0, 45)}..." has been received at the Ashram consultation desk. For specific planetary charts, please provide your exact Date, Time, and City of Birth, or book an appointment slot so we can review your Janam Kundli in detail.`;

        const lower = userText.toLowerCase();
        if (lower.includes('muhurat') || lower.includes('date') || lower.includes('time')) {
          answer = `Shubh Muhurat calculations require checking the Hindu Panchang (Tithi, Nakshatra, Yoga, and Karana). Please schedule a 1-on-1 consultation so Acharya Ji can provide the exact Lagna Muhurat.`;
        } else if (lower.includes('gem') || lower.includes('stone') || lower.includes('ratna')) {
          answer = `Ratna (Gemstone) consultation requires evaluating the functional benefic planets in your horoscope (Lagnesh, Bhagyesh, and Yogakaraka). We recommend certified natural gemstones energized with Vedic mantras.`;
        } else if (lower.includes('shani') || lower.includes('sade') || lower.includes('mangal') || lower.includes('dosh')) {
          answer = `For Graha Dosh shanti (Shani, Mangal, or Rahu-Ketu), daily recitation of Hanuman Chalisa or Maha Mrityunjaya Mantra along with specific Vedic havans brings auspicious relief.`;
        }

        const panditReply: ChatMessageData = {
          userName: ASTROLOGER.name,
          sender: 'pandit',
          text: answer,
          timestamp: new Date().toISOString(),
        };

        try {
          await saveChatMessageToFirestore(panditReply);
        } catch (err) {
          console.warn('Reply save error:', err);
        }
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Auspicious Muhurat for Griha Pravesh?',
    'Remedies for Shani Sade Sati?',
    'Kundli Milan for Marriage?',
    'Best Gemstone for Career Growth?',
  ];

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Vedic Consultation Chat &amp; Google Chat
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Firestore Live
              </span>
            </h4>
            <p className="text-xs text-slate-400">Direct spiritual guidance &amp; queries with Pandit Ji</p>
          </div>
        </div>

        {chatSpaces.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <label className="text-slate-400 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncWithGoogleChat}
                onChange={(e) => setSyncWithGoogleChat(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
              <span className="text-[11px] text-amber-300">Sync to Google Chat</span>
            </label>
          </div>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m, idx) => {
          const isPandit = m.sender === 'pandit';
          return (
            <div
              key={m.id || idx}
              className={`flex gap-2.5 ${isPandit ? 'justify-start' : 'justify-end'}`}
            >
              {isPandit && (
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 text-xs font-bold mt-1">
                  🕉
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs shadow-md ${
                  isPandit
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-sm'
                    : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1">
                  <span className="font-semibold">{m.userName}</span>
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
              {!isPandit && (
                <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 shrink-0 text-xs mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="pt-2 pb-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 text-[10px] shrink-0 font-medium">Quick:</span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => setInputText(p)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 border border-slate-700/60 transition text-[10px]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Pandit Ji about Kundli, Muhurat, or Pooja..."
          className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
