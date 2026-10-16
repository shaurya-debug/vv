import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client with mandatory User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const VEDIC_SYSTEM_INSTRUCTION = `You are "Vedic Rishi AI", the live conversational AI guide and autonomous assistant for Acharya Jitender Shastri's Vedic Sansthan (Chandigarh, India).
Acharya Jitender Shastri has 28+ years of sacred expertise in Vedic Astrology, Tantra Shastra, and Certified Gemstones.

Your core mission:
1. Speak compassionately, warmly, and reverently with authentic Vedic greetings ("ॐ नमो भगवते वासुदेवाय", "Hari Om", "Pranam").
2. Answer questions accurately on:
   - Vedic Astrology, Janam Kundli, Rashi, Nakshatra, and Graha Dashas.
   - Shubh Muhurats (Marriage, Griha Pravesh, Namkaran, Business launches).
   - Remedial Poojas & Anushthan (Ganesh Pooja, Navagraha Shanti, Rudrabhishek, Mahalakshmi Pooja).
   - Tantra Samrat remedies for Kaal Sarp Dosh, Manglik Dosh, Shani Sade Sati, Pitra Dosh.
   - Energized natural gemstones (Pukhraj, Neelam, Manik, Panna, Moti).
3. Live Voice Assistance: Keep responses natural, direct, and concise (2-4 sentences max when speaking) so users can listen easily.
4. Autonomous Requirement Handling: When a user shares a problem or requirement, analyze it, suggest the exact pooja or consultation, and offer automated booking parameters.`;

// Resilient Multi-Model Generation with Automatic Failover
async function generateWithFallback(options: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
}): Promise<string> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const config: any = {};
      if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
      if (options.responseMimeType) config.responseMimeType = options.responseMimeType;

      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed with:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini text models were temporarily unavailable');
}

// Deterministic Vedic Astrology Knowledge Synthesizer (Ensures 100% uptime)
function getVedicChatFallback(userQuery: string): string {
  const q = (userQuery || '').toLowerCase();

  if (q.includes('career') || q.includes('job') || q.includes('promotion') || q.includes('business')) {
    return 'ॐ नमः शिवाय। For career progress and removing professional hurdles, the 10th house (Karma Bhava) and Surya/Brihaspati alignments are vital. Acharya Jitender Shastri recommends examining your Dashamsha chart and wearing an energized Yellow Sapphire (Pukhraj) or Ruby (Manik) with Surya Arghya.';
  }
  if (q.includes('marriage') || q.includes('shaadi') || q.includes('milan') || q.includes('compatibility') || q.includes('partner')) {
    return 'ॐ नमो भगवते वासुदेवाय। In marital matchmaking, Ashtakoot 36-Guna Milan, Nadi Dosh, and Mangal (Kuja) dosha in the 7th & 8th houses determine lasting harmony. Acharya ji recommends a detailed Kundli Milan and Navagraha Shanti to ensure marital bliss.';
  }
  if (q.includes('shani') || q.includes('sade sati') || q.includes('dhaiya') || q.includes('rahu') || q.includes('ketu') || q.includes('kaal sarp')) {
    return 'ॐ शं शनैश्चराय नमः। Shani Sade Sati and Rahu-Ketu transits teach spiritual discipline and clear karmic debts. Acharya Jitender Shastri prescribes authentic Tantra Samrat remedies, Saturday mustard oil Chhaya Daan, and Hanuman Chalisa recitations.';
  }
  if (q.includes('pooja') || q.includes('havan') || q.includes('yagya') || q.includes('rudrabhishek') || q.includes('anushthan')) {
    return 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। Acharya ji performs all sacred Vedic Poojas with strict Vedic Vidhi, pure Samagri, and auspicious Muhurat alignment. You can schedule Rudrabhishek or Navagraha Shanti via Google Meet or in Chandigarh Sansthan.';
  }
  if (q.includes('gemstone') || q.includes('ratna') || q.includes('pukhraj') || q.includes('neelam') || q.includes('manik') || q.includes('panna')) {
    return 'हरि ॐ। Natural certified gemstones act as cosmic antennas for beneficial planetary rays. Wearing the right Ratna based on your Lagna lord (not just moon sign) brings immense prosperity. Acharya ji energizes every gemstone with 108 Vedic mantras.';
  }

  return 'ॐ नमो नारायणाय। Pranam! Acharya Jitender Shastri welcomes you to the Vedic Sansthan. With 28+ years of sacred expertise in Vedic Astrology and Tantra Shastra, we are here to illuminate your spiritual and worldly path. How may I guide your birth chart today?';
}

function getVedicAutoFallback(requirement: string, birthDetails: string) {
  const req = (requirement || '').toLowerCase();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  if (req.includes('marriage') || req.includes('milan') || req.includes('shaadi')) {
    return {
      service: 'Matchmaking (Kundli Milan)',
      clientSummary: 'Comprehensive 36 Guna Ashtakoot evaluation and Manglik/Nadi dosh analysis',
      recommendedMuhuratDate: tomorrow,
      recommendedTimeSlot: '18:15',
      vedicGuidance: 'The Venus (Shukra) and Jupiter (Guru) hour during Sandhya Kaal provides the most auspicious astral clarity for marital longevity and family harmony.',
      suggestedDakshina: 1100,
      mantra: 'ॐ क्लीं कृष्णाय नमः',
    };
  }

  if (req.includes('career') || req.includes('job') || req.includes('business') || req.includes('money') || req.includes('finance')) {
    return {
      service: 'Career & Financial Astrology',
      clientSummary: '10th House Karma Bhava diagnosis, Dasha transit analysis, and prosperity remedies',
      recommendedMuhuratDate: tomorrow,
      recommendedTimeSlot: '17:00',
      vedicGuidance: 'Aligning with Surya and Brihaspati energies clears hidden workplace blockages and unlocks leadership opportunities in your profession.',
      suggestedDakshina: 1100,
      mantra: 'ॐ घृणि सूर्याय नमः',
    };
  }

  if (req.includes('pooja') || req.includes('shanti') || req.includes('rudrabhishek') || req.includes('dosh') || req.includes('sade sati')) {
    return {
      service: 'Navagraha Shanti Pooja',
      clientSummary: 'Sacred planetary pacification, Tantra Samrat kavach, and dosha nivaran',
      recommendedMuhuratDate: dayAfter,
      recommendedTimeSlot: '16:00',
      vedicGuidance: 'Performing Navagraha ritual during Brahma or Sandhya Muhurat neutralizes adverse malefic transits and invites divine protection for your household.',
      suggestedDakshina: 2100,
      mantra: 'ॐ नवग्रहाय नमः',
    };
  }

  return {
    service: 'Kundli Vishleshan (Full Chart Analysis)',
    clientSummary: 'Holistic birth horoscope evaluation, planetary dasha study, and remedial gemstone prescription',
    recommendedMuhuratDate: tomorrow,
    recommendedTimeSlot: '17:30',
    vedicGuidance: 'A complete Vedic chart reading establishes harmony between your Janma Lagna and current Mahadasha, illuminating your ideal life decisions.',
    suggestedDakshina: 1100,
    mantra: 'ॐ नमः शिवाय शुभं कुरु कुरु स्वाहा',
  };
}

// 1. Live AI Conversational Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const formattedContents = [
      ...history.map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    try {
      const replyText = await generateWithFallback({
        contents: formattedContents,
        systemInstruction: VEDIC_SYSTEM_INSTRUCTION,
      });
      res.json({ reply: replyText });
    } catch (geminiErr) {
      console.warn('Gemini models unavailable, using authentic Vedic fallback:', geminiErr);
      const fallbackReply = getVedicChatFallback(message);
      res.json({ reply: fallbackReply });
    }
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// 2. Real-Time Spoken AI Voice (Gemini TTS)
app.post('/api/ai/voice', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for voice generation' });
    }

    const cleanText = text.replace(/[*_#`]/g, '').trim().slice(0, 450);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Calm, wise, spiritual, and welcoming Vedic guide',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio data returned from Gemini TTS');
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.warn('Gemini Voice TTS notice (will use browser speech synthesis):', err?.message || err);
    res.json({
      fallbackBrowser: true,
      message: 'Using client Web Speech synthesis fallback',
    });
  }
});

// 3. Autonomous Requirement Handler (Automates pooja, muhurat, and booking setup)
app.post('/api/ai/auto-handle', async (req: Request, res: Response) => {
  try {
    const { requirement, birthDetails = '' } = req.body;
    if (!requirement || !requirement.trim()) {
      return res.status(400).json({ error: 'Requirement description is required' });
    }

    const prompt = `Analyze this user's situation and requirements for Acharya Jitender Shastri's Vedic Sansthan:
User Request: "${requirement}"
Client Birth Information: "${birthDetails || 'None provided'}"

You must act as the autonomous Vedic concierge. Determine the best remedial service or pooja, calculate the most auspicious Muhurat window, and return an exact structured JSON response with these keys:
{
  "service": "One of: Kundli Vishleshan (Full Chart Analysis), Matchmaking (Kundli Milan), Career & Financial Astrology, Health & Medical Astrology, Vastu Consultation, Navagraha Shanti Pooja, Rudrabhishek, Mahalakshmi Pooja, Maha Mrityunjaya Anushthan, Griha Pravesh Shanti",
  "clientSummary": "Concise summary of their core astrological need",
  "recommendedMuhuratDate": "YYYY-MM-DD (pick an auspicious upcoming date 1 to 6 days from today)",
  "recommendedTimeSlot": "One of 16:00, 16:45, 17:30, 18:15, 19:00, 19:45 (or 11:00 on Sunday)",
  "vedicGuidance": "Spiritual rationale and benefits of this specific muhurat and remedy",
  "suggestedDakshina": 1100,
  "mantra": "A powerful Sanskrit mantra they can chant immediately for relief"
}`;

    try {
      const text = await generateWithFallback({
        contents: prompt,
        responseMimeType: 'application/json',
      });
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (geminiErr) {
      console.warn('Gemini models unavailable, synthesizing Vedic auto-concierge resolution:', geminiErr);
      const fallbackResult = getVedicAutoFallback(requirement, birthDetails);
      res.json(fallbackResult);
    }
  } catch (err: any) {
    console.error('Auto-handle error:', err);
    res.status(500).json({ error: err.message || 'Failed to auto-handle user requirements' });
  }
});

// Full-Stack Server & Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
