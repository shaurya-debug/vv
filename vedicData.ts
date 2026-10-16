export interface PoojaItem {
  id: string;
  title: string;
  sanskrit: string;
  duration: string;
  price: string;
  description: string;
  iconName: string;
}

export interface YagyaItem {
  id: string;
  title: string;
  sanskrit: string;
  duration: string;
  price: string;
  description: string;
  iconName: string;
}

export interface RitualCategory {
  title: string;
  subtitle: string;
  items: { name: string; note: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  price: string;
  description: string;
  iconName: string;
}

export interface TestimonialItem {
  name: string;
  quote: string;
  rating: number;
}

export interface ZodiacSign {
  id: string;
  rashi: string;
  english: string;
  symbol: string;
  dates: string;
  element: string;
  rulingPlanet: string;
  rulingPlanetHindi: string;
  luckyNumber: string;
  luckyColor: string;
  gemstone: string;
  shubhMuhurat: string;
  dailyPrediction: {
    health: string;
    career: string;
    relationships: string;
    guidance: string;
    vedicMantra: string;
  };
  tomorrowPrediction: {
    health: string;
    career: string;
    relationships: string;
    guidance: string;
    vedicMantra: string;
  };
  weeklyPrediction: {
    overview: string;
    favorableDays: string;
    precaution: string;
    remedy: string;
  };
}

export const ASTROLOGER = {
  name: "Acharya Jitender Shastri",
  brandName: "Vedic Pandit",
  experienceYears: 28,
  titles: "Astrologer • Tantra Samrat • Gem Consultant",
  heroSubtitle: "Acharya Jitender Shastri",
  heroLine: "Astrologer • Vedic Yagya • Gem Consultant • Vastu Cunsultant and Tantra Yagya",
  heroParagraph:
    "Unlocking destiny with 28 years of sacred expertise in authentic Vedic astrology, profound tantra shastra remedies, and certified gemstone therapy rooted in timeless sanatana traditions.",
  aboutHeading: "Master of Vedic Astrology, Tantra & Gemstones",
  aboutParagraph:
    "With over 28 years of unbroken lineage experience, Acharya Jitender Shastri has illuminated the path for thousands across India and worldwide. Revered with the honored title of Tantra Samrat for his mastery in authentic tantric remedies, dosh nivaran, and sacred shanti poojas, he is also a certified gem consultant dedicated to recommending only 100% natural, lab-certified gemstones carefully matched to your natal planetary coordinates.",
  stats: [
    { value: "28+ Years", label: "Experience" },
    { value: "3200+", label: "Consultations" },
    { value: "8", label: "Specializations" },
  ],
  contact: {
    phone: "+91 9466215390",
    email: "jksv390@gmail.com",
    location: "Chandigarh, India",
    hoursWeekday: "Monday - Saturday: 4:00 PM- 8:00 PM",
    hoursSunday: "Sunday: 10:00 AM - 5:00 PM",
  },
  payment: {
    accountName: "Jitender Kumar Sharma",
    upiId: "jksv390-1@okaxis",
    googlePayPhone: "+91 9466215390",
    consultationDakshina: 1100, // INR
    currency: "INR",
  },
  tagline: "Astrologer • Tantra Samrat • Gem Consultant — guiding lives through ancient wisdom.",
};

export const SPECIALTIES = [
  {
    title: "Vedic Astrology",
    description: "Birth chart reading, planetary analysis and life guidance rooted in authentic Vedic tradition.",
    icon: "Compass",
  },
  {
    title: "Tantra Samrat",
    description: "Powerful tantric remedies, shanti pooja and dosh nivaran performed with strict scriptural discipline.",
    icon: "Shield",
  },
  {
    title: "Gem Consultant",
    description: "Ratna parikshan and recommendation of genuine, certified gemstones matched to your planetary positions.",
    icon: "Gem",
  },
];

export const VEDIC_POOJAS: PoojaItem[] = [
  {
    id: "pooja-ganesh",
    title: "Ganesh Pooja",
    sanskrit: "श्री गणेश पूजा",
    duration: "2 hrs",
    price: "₹2,100",
    description: "Vighna nivaran and shubh aarambh — performed before any new venture, griha pravesh or auspicious work.",
    iconName: "Sparkles",
  },
  {
    id: "pooja-navagraha",
    title: "Navagraha Shanti Pooja",
    sanskrit: "नवग्रह शांति पूजा",
    duration: "3 hrs",
    price: "₹5,100",
    description: "Shanti of all nine grahas as per your janma patrika — used for dosh nivaran and overall kshema.",
    iconName: "Sun",
  },
  {
    id: "pooja-lakshmi",
    title: "Lakshmi Pooja",
    sanskrit: "श्री महालक्ष्मी पूजा",
    duration: "2 hrs",
    price: "₹3,100",
    description: "Mahalakshmi sadhana for wealth, stability and growth in business and household finances.",
    iconName: "Coins",
  },
  {
    id: "pooja-satyanarayan",
    title: "Satyanarayan Pooja",
    sanskrit: "श्री सत्यनारायण पूजा",
    duration: "3 hrs",
    price: "₹2,500",
    description: "Kathamrit vidhi with sankalp and prasad — for family welfare, health and fulfilment of a wish.",
    iconName: "BookOpen",
  },
  {
    id: "pooja-rudrabhishek",
    title: "Rudrabhishek",
    sanskrit: "रुद्राभिषेक",
    duration: "2.5 hrs",
    price: "₹4,100",
    description: "Abhishek of Shiv Ling with panchamrit and rudri path — for health, longevity and shanti in the home.",
    iconName: "Flame",
  },
  {
    id: "pooja-pitra",
    title: "Pitra Tarpan & Shradh Pooja",
    sanskrit: "पितृ तर्पण",
    duration: "2 hrs",
    price: "₹2,100",
    description: "Tarpan and pind daan vidhi for pitra dosh nivaran and satisfaction of the ancestors.",
    iconName: "HeartHandshake",
  },
];

export const YAGYAS: YagyaItem[] = [
  {
    id: "yagya-gayatri",
    title: "Gayatri Yagya",
    sanskrit: "श्री गायत्री यज्ञ",
    duration: "1 day",
    price: "₹11,000",
    description: "Gayatri jap havan for vidya, buddhi and pitra kripa — kalash sthapana, purna ahuti ganana and complete samagri.",
    iconName: "Flame",
  },
  {
    id: "yagya-lakshmi-narayan",
    title: "Lakshmi Narayan Yagya",
    sanskrit: "श्री लक्ष्मी नारायण यज्ञ",
    duration: "1 day",
    price: "₹8,100",
    description: "For wealth, business growth and stability in the house — performed in shubh muhurat with panchamrit abhishek.",
    iconName: "Coins",
  },
  {
    id: "yagya-navagraha",
    title: "Navagraha Yagya",
    sanskrit: "नवग्रह यज्ञ",
    duration: "1 day",
    price: "₹11,000",
    description: "Full graha shanti havan for all nine planets as per your janma patrika — for dosh nivaran and overall kshema.",
    iconName: "Sun",
  },
  {
    id: "yagya-rudra",
    title: "Rudra Yagya",
    sanskrit: "रुद्र यज्ञ",
    duration: "1 day",
    price: "₹15,000",
    description: "Ekadash Rudri / Maha Rudra havan for aarogya, longevity and griha shanti with purohit vidhi.",
    iconName: "Shield",
  },
  {
    id: "yagya-chandi",
    title: "Chandi / Durga Yagya",
    sanskrit: "श्री चण्डी यज्ञ",
    duration: "1 day",
    price: "₹11,000",
    description: "Durga Saptashati path with havan for protection, strength and victory over obstacles and shatru.",
    iconName: "Sword",
  },
  {
    id: "yagya-ayushya",
    title: "Ayushya Yagya",
    sanskrit: "आयुष्य यज्ञ",
    duration: "Half day",
    price: "₹7,100",
    description: "Ayushya havan for long life and wellness of a child, an elder or a person running a difficult dasha.",
    iconName: "Heart",
  },
];

export const HINDU_RITUALS_CATEGORIES: RitualCategory[] = [
  {
    title: "Sanskar (Life Rituals)",
    subtitle: "Sacred rites of passage honoring life milestones according to Sanatana Dharma",
    items: [
      { name: "Namkaran Sanskar", note: "Naming ceremony with sankalp, gotra path and shubh muhurat" },
      { name: "Annaprashan", note: "First rice and eating vidhi for the child with shubh muhurat" },
      { name: "Mundan / Chharaam", note: "First haircut ritual with shanti pooja and pitra tarpan" },
      { name: "Upanayan (Janeu)", note: "Sacred thread vidhi, brahmopadesh and gaayatri diksha" },
      { name: "Vivah Sanskar", note: "Complete sanatana vidhi — kanyadaan, saptapadi and sindoor daan" },
    ],
  },
  {
    title: "Griha, Vaastu & Bhoomi",
    subtitle: "Consecration, earth sanctification, and dwelling harmonization",
    items: [
      { name: "Griha Pravesh", note: "Ganesh pooja, vaastu shanti, kalash sthapana and navgrah pooja" },
      { name: "Vaastu Shanti", note: "Vaastu dosh nivaran with asha-dik pujan and shanti havan" },
      { name: "Bhoomi Pooja", note: "Bhoomi vandana and shubh aarambh vidhi before construction" },
      { name: "Shubh Labh (Naya Vyapar)", note: "Pooja for a new shop, office, vehicle or business venture" },
      { name: "Kul Devta & Nazar Nivaran", note: "Kul devta pujan and nazar nivaran for family shanti" },
    ],
  },
  {
    title: "Pitra, Vrat & Karma",
    subtitle: "Ancestral satisfaction, sacred fasts, and scriptural path rituals",
    items: [
      { name: "Pind Daan & Tarpan", note: "Pitra tarpan vidhi for pitra dosh nivaran and pitra kripa" },
      { name: "Shradh Karma", note: "Awas, ekodisht, sapindi and parvan shradh as per tithi" },
      { name: "Solah Shradh", note: "Sixteen-day vidhi performed after the passing of a near and dear" },
      { name: "Solah Somvar / Mangal Gauri Vrat", note: "Vrat vidhi, katha and jaap with sankalp" },
      { name: "Saptashati & Ram Katha Path", note: "Complete path with havan and bhog as per your mannat" },
    ],
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "service-birth-chart",
    title: "Birth Chart Analysis",
    price: "₹2,500",
    description: "Complete analysis of your birth chart to understand your personality, strengths, and life path.",
    iconName: "Compass",
  },
  {
    id: "service-marriage",
    title: "Marriage Compatibility and marriage pooja",
    price: "₹31,000",
    description: "Detailed compatibility analysis for couples planning marriage or seeking relationship guidance and all types of vadic pooja according to sanatana",
    iconName: "HeartHandshake",
  },
  {
    id: "service-career",
    title: "Career Guidance",
    price: "₹2,100",
    description: "Professional consultation to help you choose the right career path based on planetary positions.",
    iconName: "Briefcase",
  },
  {
    id: "service-muhurat",
    title: "Muhurat Selection",
    price: "₹11,000",
    description: "Find the most auspicious time for important events like weddings, business launches,etc..",
    iconName: "Calendar",
  },
  {
    id: "service-gemstone",
    title: "Gemstone Consultation",
    price: "₹2,100",
    description: "Ratna parikshan and guidance on which stone, metal, finger and day to wear for maximum benefit.",
    iconName: "Gem",
  },
  {
    id: "service-tantra",
    title: "Tantra Remedies & Shanti Pooja",
    price: "₹2,100",
    description: "Kaal Sarp, Mangal and Pitra dosh nivaran with tantric shanti pooja and prescribed kavach.",
    iconName: "Shield",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Priya Sharma",
    quote: "Acharya ji's predictions have been remarkably accurate. His guidance helped me make important life decisions.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    quote: "Excellent astrologer with deep knowledge. His marriage compatibility reading was spot on!",
    rating: 5,
  },
  {
    name: "Anita Gupta",
    quote: "Very satisfied with the career guidance and the gemstone he prescribed. Following his advice, I found the perfect job opportunity.",
    rating: 5,
  },
];

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    rashi: "मेष (Mesha)",
    english: "Aries",
    symbol: "♈",
    dates: "Mar 21 – Apr 19",
    element: "Agni (Fire)",
    rulingPlanet: "Mars",
    rulingPlanetHindi: "मंगल (Mangal)",
    luckyNumber: "9 & 1",
    luckyColor: "Sindoor Red & Saffron",
    gemstone: "Red Coral (Moonga)",
    shubhMuhurat: "08:15 AM - 10:30 AM & 06:00 PM - 07:45 PM",
    dailyPrediction: {
      health: "High vitality today. Avoid impulsive physical strain and stay hydrated during midday hours.",
      career: "Mars brings courage in negotiations and pending administrative tasks. Favorable for leadership decisions.",
      relationships: "Warm exchanges with siblings and spouse. Speak gently to avert fiery misunderstandings in the evening.",
      guidance: "Auspicious day to take initiative in business ventures. Offer water to Surya in the morning.",
      vedicMantra: "ॐ अं अंगारकाय नमः (Om Angarakaya Namah)",
    },
    tomorrowPrediction: {
      health: "Sound digestion. Meditate for 10 minutes to balance Mars's fiery energetic transit.",
      career: "Financial inflows possible from earlier efforts. Review contracts carefully before final sign-off.",
      relationships: "Peaceful family atmosphere. A family elder provides reassuring counsel.",
      guidance: "Donate jaggery or red lentils to invite positive planetary vibrations.",
      vedicMantra: "ॐ भौमाय नमः (Om Bhaumaya Namah)",
    },
    weeklyPrediction: {
      overview: "A transformative week propelled by strong Mars transit. Courage, clear vision, and decisive actions will resolve delayed paperwork and restore confidence.",
      favorableDays: "Tuesday, Thursday & Sunday",
      precaution: "Avoid hasty arguments while driving or during financial transactions on Wednesday afternoon.",
      remedy: "Chant the Hanuman Chalisa every Tuesday morning and wear pure copper or red coral.",
    },
  },
  {
    id: "taurus",
    rashi: "वृषभ (Vrishabha)",
    english: "Taurus",
    symbol: "♉",
    dates: "Apr 20 – May 20",
    element: "Prithvi (Earth)",
    rulingPlanet: "Venus",
    rulingPlanetHindi: "शुक्र (Shukra)",
    luckyNumber: "6 & 2",
    luckyColor: "Pearl White & Rose Cream",
    gemstone: "Diamond or White Opal",
    shubhMuhurat: "11:00 AM - 01:15 PM & 05:30 PM - 07:00 PM",
    dailyPrediction: {
      health: "Stable energy. Pay attention to throat and neck comfort; herbal tea with honey is beneficial.",
      career: "Shukra enhances creative ventures, design, luxury goods, and culinary enterprises. Financial stability holds firm.",
      relationships: "Harmonious rapport with loved ones. An evening romantic dinner or family gathering brings joy.",
      guidance: "Express gratitude to Mahalakshmi. Keep your workspace orderly to invite positive prana.",
      vedicMantra: "ॐ शुं शुक्राय नमः (Om Shum Shukraya Namah)",
    },
    tomorrowPrediction: {
      health: "Restorative sleep will renew your stamina. Gentle evening walking recommended.",
      career: "Opportunities for lucrative partnerships or new client acquisitions emerge through friends.",
      relationships: "Sweetness in marital bonds; appreciation and thoughtful gestures bring mutual happiness.",
      guidance: "Sprinkle rose water or light sandalwood incense in the southwest corner of your house.",
      vedicMantra: "ॐ महालक्ष्म्यै नमः (Om Mahalakshmyai Namah)",
    },
    weeklyPrediction: {
      overview: "Steady growth and artistic clarity define this period. Financial investments in property or long-term funds show promising trends under Venus's grace.",
      favorableDays: "Friday & Monday",
      precaution: "Do not overindulge in heavy sweets or procrastinate on scheduled meetings.",
      remedy: "Offer white fragrant flowers to Goddess Lakshmi on Friday and feed cows fresh grass.",
    },
  },
  {
    id: "gemini",
    rashi: "मिथुन (Mithuna)",
    english: "Gemini",
    symbol: "♊",
    dates: "May 21 – Jun 20",
    element: "Vayu (Air)",
    rulingPlanet: "Mercury",
    rulingPlanetHindi: "बुध (Budh)",
    luckyNumber: "5 & 3",
    luckyColor: "Emerald Green & Light Parrot",
    gemstone: "Emerald (Panna)",
    shubhMuhurat: "09:30 AM - 11:45 AM & 04:00 PM - 06:15 PM",
    dailyPrediction: {
      health: "Sharp mental agility. Keep nervous energy calm through conscious deep abdominal breathing.",
      career: "Outstanding day for communication, IT, media, writing, and client presentations. Quick intellect shines.",
      relationships: "Engaging conversations with friends and relatives. Helpful advice received from a mentor.",
      guidance: "Trust your communication talents. Worship Lord Ganesha with Durva grass for obstacle removal.",
      vedicMantra: "ॐ बुं बुधाय नमः (Om Bum Budhaya Namah)",
    },
    tomorrowPrediction: {
      health: "Balance eye strain from screens with cold water rinses and brief resting periods.",
      career: "New project proposals or email correspondences yield positive responses before evening.",
      relationships: "Lively banter and lighthearted laughter lift the mood in your domestic circle.",
      guidance: "Feed green grass or spinach to birds or cows to strengthen Mercury.",
      vedicMantra: "ॐ गं गणपतये नमः (Om Gam Ganapataye Namah)",
    },
    weeklyPrediction: {
      overview: "A week of dynamic communication, fruitful trade, and educational breakthroughs. Budh graha sharpens your intellect for commercial expansion.",
      favorableDays: "Wednesday, Thursday & Saturday",
      precaution: "Avoid signing agreements in haste without reading fine print on Thursday.",
      remedy: "Worship Shri Ganesh with five modaks or durva blades on Wednesday morning.",
    },
  },
  {
    id: "cancer",
    rashi: "कर्क (Karka)",
    english: "Cancer",
    symbol: "♋",
    dates: "Jun 21 – Jul 22",
    element: "Jal (Water)",
    rulingPlanet: "Moon",
    rulingPlanetHindi: "चन्द्र (Chandra)",
    luckyNumber: "2 & 7",
    luckyColor: "Chandra Silver & Pure Milk White",
    gemstone: "Natural Pearl (Moti)",
    shubhMuhurat: "07:30 AM - 09:45 AM & 06:45 PM - 08:30 PM",
    dailyPrediction: {
      health: "Emotional balance brings physical vitality. Stay close to natural water or serene spiritual environs.",
      career: "Intuitive decision-making yields great dividends in real estate, education, and domestic services.",
      relationships: "Deep emotional bonding with mother and elders. A home sanctuary brings deep inner peace.",
      guidance: "Perform Shiva pooja with fresh milk or water on Monday mornings for mental stillness.",
      vedicMantra: "ॐ सों सोमाय नमः (Om Som Somaya Namah)",
    },
    tomorrowPrediction: {
      health: "Hydrate adequately. Calming chamomile or warm milk with saffron aids restful sleep.",
      career: "Support from superiors or female colleagues proves instrumental in your current assignments.",
      relationships: "Nurturing conversations resolve an old domestic concern with gentle clarity.",
      guidance: "Touch your mother's feet in the morning for heartfelt maternal blessings.",
      vedicMantra: "ॐ नमः शिवाय (Om Namah Shivaya)",
    },
    weeklyPrediction: {
      overview: "Chandra's soothing transit enhances intuition and home harmony. Financial gains through property or maternal lineage are indicated.",
      favorableDays: "Monday & Thursday",
      precaution: "Guard against sudden mood swings or oversensitivity in professional discussions.",
      remedy: "Fast or consume satvik food on Mondays; offer arghya of raw milk and water to the Moon.",
    },
  },
  {
    id: "leo",
    rashi: "सिंह (Simha)",
    english: "Leo",
    symbol: "♌",
    dates: "Jul 23 – Aug 22",
    element: "Agni (Fire)",
    rulingPlanet: "Sun",
    rulingPlanetHindi: "सूर्य (Surya)",
    luckyNumber: "1 & 4",
    luckyColor: "Royal Gold, Copper & Saffron",
    gemstone: "Ruby (Manikya)",
    shubhMuhurat: "08:00 AM - 10:15 AM & 03:30 PM - 05:00 PM",
    dailyPrediction: {
      health: "Radiant aura and strong stamina. Maintain balanced posture and protect eyes from midday glare.",
      career: "Surya grants administrative authority, government approvals, and respect in high circles.",
      relationships: "Warm magnanimity wins hearts. Lead your family with generous warmth rather than pride.",
      guidance: "Offer Arghya (water with kumkum and red flowers) to Lord Surya at sunrise for tejas.",
      vedicMantra: "ॐ सूर्याय नमः (Om Suryaya Namah)",
    },
    tomorrowPrediction: {
      health: "Elevated spirits and physical stamina. Excellent for outdoor exercise and pranayama.",
      career: "Your strategic suggestions receive commendation from leadership and senior partners.",
      relationships: "A joyful event or celebratory announcement in the family circle brings pride.",
      guidance: "Chant the Aditya Hridaya Stotram for victory in competitive situations.",
      vedicMantra: "ॐ घृणिः सूर्याय नमः (Om Ghrinih Suryaya Namah)",
    },
    weeklyPrediction: {
      overview: "A majestic week where your personal authority, leadership, and public reputation ascend. Surya Bhagwan bestows clarity and victory over hurdles.",
      favorableDays: "Sunday, Tuesday & Thursday",
      precaution: "Guard against arrogance or dismissive attitude towards subordinates.",
      remedy: "Wear pure copper or ruby in gold on ring finger after energizing with Surya Gayatri.",
    },
  },
  {
    id: "virgo",
    rashi: "कन्या (Kanya)",
    english: "Virgo",
    symbol: "♍",
    dates: "Aug 23 – Sep 22",
    element: "Prithvi (Earth)",
    rulingPlanet: "Mercury",
    rulingPlanetHindi: "बुध (Budh)",
    luckyNumber: "5 & 7",
    luckyColor: "Panna Green & Ivory",
    gemstone: "Emerald (Panna)",
    shubhMuhurat: "10:15 AM - 12:30 PM & 04:30 PM - 06:45 PM",
    dailyPrediction: {
      health: "Digestive system thrives with satvik, fresh warm meals. Avoid rushed eating during work.",
      career: "Superb analytical acumen. Auditing, calculations, coding, and strategic planning succeed seamlessly.",
      relationships: "Practical support and reliable assistance strengthen friendships and marriage bonds.",
      guidance: "Pay attention to detail without getting lost in perfectionism. Chant Vishnu Sahasranama.",
      vedicMantra: "ॐ नमो भगवते वासुदेवाय (Om Namo Bhagavate Vasudevaya)",
    },
    tomorrowPrediction: {
      health: "Practice mindful walking barefoot on morning grass to ground your thoughts.",
      career: "Resolving lingering administrative tasks clears room for lucrative new responsibilities.",
      relationships: "Your thoughtful advice aids a close associate facing a dilemma.",
      guidance: "Donate green moong dal or stationery to students in need on Wednesday.",
      vedicMantra: "ॐ बुं बुधाय नमः (Om Bum Budhaya Namah)",
    },
    weeklyPrediction: {
      overview: "Meticulous planning pays handsome dividends. Professional audits, research, and financial consolidation progress smoothly under Budh's illumination.",
      favorableDays: "Wednesday & Friday",
      precaution: "Do not overanalyze minor flaws; celebrate incremental progress.",
      remedy: "Keep a green handkerchief or energize an Emerald in bronze/gold on the little finger.",
    },
  },
  {
    id: "libra",
    rashi: "तुला (Tula)",
    english: "Libra",
    symbol: "♎",
    dates: "Sep 23 – Oct 22",
    element: "Vayu (Air)",
    rulingPlanet: "Venus",
    rulingPlanetHindi: "शुक्र (Shukra)",
    luckyNumber: "6 & 8",
    luckyColor: "Sky Blue, Pastel Pink & Silver",
    gemstone: "Diamond or White Zircon",
    shubhMuhurat: "11:30 AM - 01:45 PM & 06:00 PM - 07:30 PM",
    dailyPrediction: {
      health: "Graceful balance in body and mind. Regular stretching and kidney hydration recommended.",
      career: "Diplomatic finesse mediates conflicts. Legal, partnership, and aesthetic ventures flourish.",
      relationships: "Harmony and mutual affection in romantic and marital life. Beautiful conversations await.",
      guidance: "Uphold justice and fairness in all transactions. Light a ghee lamp for Goddess Lakshmi.",
      vedicMantra: "ॐ श्रीं महालक्ष्म्यै नमः (Om Shreem Mahalakshmyai Namah)",
    },
    tomorrowPrediction: {
      health: "Pleasant tranquility. Enjoying classical devotional music will soothe your nervous system.",
      career: "Negotiations and joint contracts tilt in your favor with graceful diplomacy.",
      relationships: "Quality time with your partner brings warmth and renewed shared aspirations.",
      guidance: "Wear clean, light-colored clothing and fragrant natural attar.",
      vedicMantra: "ॐ भार्गवाय नमः (Om Bhargavaya Namah)",
    },
    weeklyPrediction: {
      overview: "Balance and beauty return to relationships and career. Auspicious period for buying vehicles, jewelry, or upgrading domestic comforts.",
      favorableDays: "Friday & Saturday",
      precaution: "Avoid indecisiveness when a prompt business call is required.",
      remedy: "Worship Shri Radha Krishna and offer white sweets (mishri/makhan) on Friday.",
    },
  },
  {
    id: "scorpio",
    rashi: "वृश्चिक (Vrishchika)",
    english: "Scorpio",
    symbol: "♏",
    dates: "Oct 23 – Nov 21",
    element: "Jal (Water)",
    rulingPlanet: "Mars & Ketu",
    rulingPlanetHindi: "मंगल एवं केतु (Mangal & Ketu)",
    luckyNumber: "9 & 4",
    luckyColor: "Dark Crimson, Blood Red & Maroon",
    gemstone: "Red Coral (Moonga) / Cat's Eye",
    shubhMuhurat: "08:45 AM - 11:00 AM & 07:15 PM - 09:00 PM",
    dailyPrediction: {
      health: "High endurance and resilience. Channel intensity into yoga and spiritual meditation.",
      career: "Penetrating research, investigative problem solving, and confidential dealings thrive.",
      relationships: "Deep emotional fidelity. Release old grudges to allow divine grace to heal old wounds.",
      guidance: "Embrace inner spiritual transformation. Worship Lord Kartikeya or Lord Shiva with bilva patra.",
      vedicMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kram Kreem Kroum Sah Bhaumaya Namah)",
    },
    tomorrowPrediction: {
      health: "Vitality is strong. Warm water with lemon in the morning helps metabolic cleansing.",
      career: "Sudden breakthrough in an enigmatic puzzle or overdue recovery of funds.",
      relationships: "Intimate and honest conversation clears unspoken misunderstandings completely.",
      guidance: "Recite the Mangal Kavach or visit a Hanuman temple for courage.",
      vedicMantra: "ॐ हनुमते नमः (Om Hanumate Namah)",
    },
    weeklyPrediction: {
      overview: "A powerful week for occult study, healing, and overcoming competitors. Your willpower is unmatched; channel it toward constructive spiritual ends.",
      favorableDays: "Tuesday & Thursday",
      precaution: "Do not let possessiveness or suspicion cloud transparent communication.",
      remedy: "Light a mustard oil lamp before Lord Hanuman on Tuesday evening.",
    },
  },
  {
    id: "sagittarius",
    rashi: "धनु (Dhanu)",
    english: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 – Dec 21",
    element: "Agni (Fire)",
    rulingPlanet: "Jupiter",
    rulingPlanetHindi: "बृहस्पति (Guru / Brihaspati)",
    luckyNumber: "3 & 9",
    luckyColor: "Haldi Yellow & Kesari Gold",
    gemstone: "Yellow Sapphire (Pukhraj)",
    shubhMuhurat: "09:00 AM - 11:15 AM & 03:00 PM - 04:30 PM",
    dailyPrediction: {
      health: "Optimistic disposition promotes wellness. Take care of liver health with light turmeric milk.",
      career: "Guru brings wisdom, academic elevation, spiritual teaching, and visionary expansion.",
      relationships: "Inspiring bond with gurus, father figures, and children. Uplifting philosophical talks.",
      guidance: "Seek dharma in all actions. Donate yellow fruits or chana dal to a respected scholar or temple.",
      vedicMantra: "ॐ बृं बृहस्पतये नमः (Om Brim Brihaspataye Namah)",
    },
    tomorrowPrediction: {
      health: "Energetic and expansive. Long walks in spiritual gardens or nature recommended.",
      career: "Travel for pilgrimage, higher study, or institutional alliances proves fruitful.",
      relationships: "Family atmosphere is joyful and filled with reverence for traditional values.",
      guidance: "Apply a tilak of saffron or sandalwood to your forehead for Guru's grace.",
      vedicMantra: "ॐ गुरुवे नमः (Om Guruve Namah)",
    },
    weeklyPrediction: {
      overview: "Jupiter's benediction opens doorways to spiritual knowledge, financial wisdom, and long-awaited travels. Auspicious for family ceremonies and higher study.",
      favorableDays: "Thursday & Sunday",
      precaution: "Avoid taking on too many commitments beyond realistic bandwidth.",
      remedy: "Wear Yellow Sapphire in gold on the index finger on Thursday morning after puja.",
    },
  },
  {
    id: "capricorn",
    rashi: "मकर (Makara)",
    english: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 – Jan 19",
    element: "Prithvi (Earth)",
    rulingPlanet: "Saturn",
    rulingPlanetHindi: "शनि (Shani Dev)",
    luckyNumber: "8 & 4",
    luckyColor: "Navy Blue, Charcoal & Steel Grey",
    gemstone: "Blue Sapphire (Neelam) or Amethyst",
    shubhMuhurat: "10:30 AM - 12:45 PM & 05:00 PM - 06:45 PM",
    dailyPrediction: {
      health: "Strong bone and joint resilience. Gentle joint mobility exercises and sesame oil massage advised.",
      career: "Shani rewards diligent, ethical labor. Long-term corporate infrastructure and industrial projects prosper.",
      relationships: "Steadfast loyalty in relationships. Mutual respect and maturity sustain the home.",
      guidance: "Patience is your greatest armor. Serve underprivileged workers and respect seniors.",
      vedicMantra: "ॐ शं शनैश्चराय नमः (Om Sham Shanaishcharaya Namah)",
    },
    tomorrowPrediction: {
      health: "Maintain regular sleep rhythms. Warm herbal decoctions soothe the nervous system.",
      career: "Your disciplined persistence earns respect from authorities and brings steady returns.",
      relationships: "Quiet understanding with family. Fulfill domestic responsibilities with diligence.",
      guidance: "Feed black sesame seeds or mustard oil preparations to crows or stray animals.",
      vedicMantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    },
    weeklyPrediction: {
      overview: "Enduring stability and professional consolidation. Karma yogi dedication yields solid outcomes that withstand the test of time.",
      favorableDays: "Saturday & Wednesday",
      precaution: "Do not succumb to unnecessary pessimism or harsh self-criticism.",
      remedy: "Light a mustard oil lamp beneath a Peepal tree on Saturday evening.",
    },
  },
  {
    id: "aquarius",
    rashi: "कुम्भ (Kumbha)",
    english: "Aquarius",
    symbol: "♒",
    dates: "Jan 20 – Feb 18",
    element: "Vayu (Air)",
    rulingPlanet: "Saturn & Rahu",
    rulingPlanetHindi: "शनि एवं राहु (Shani & Rahu)",
    luckyNumber: "8 & 7",
    luckyColor: "Electric Blue, Violet & Ultramarine",
    gemstone: "Blue Sapphire or Hessonite (Gomed)",
    shubhMuhurat: "08:30 AM - 10:45 AM & 06:15 PM - 08:00 PM",
    dailyPrediction: {
      health: "Circulatory health is steady. Practice pranayama to circulate fresh oxygen and clear stagnant prana.",
      career: "Visionary insights in technology, scientific inquiry, community reform, and collective projects.",
      relationships: "Warm companionship with like-minded friends and broad social circles. Inspiring fellowship.",
      guidance: "Channel your intellect toward humanitarian welfare. Recite the Maha Mrityunjaya Mantra.",
      vedicMantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् (Maha Mrityunjaya Mantra)",
    },
    tomorrowPrediction: {
      health: "Keep ankles and lower legs relaxed. Avoid standing in one posture for prolonged hours.",
      career: "Innovative ideas proposed in team meetings get approved with enthusiasm.",
      relationships: "A philanthropic or cultural gathering connects you with inspiring souls.",
      guidance: "Help an ailing or elderly person with medicine or food.",
      vedicMantra: "ॐ शं शनैश्चराय नमः (Om Sham Shanaishcharaya Namah)",
    },
    weeklyPrediction: {
      overview: "Intellectual breakthroughs and expansion of beneficial networks. Your forward-thinking ideas gain traction among influential collaborators.",
      favorableDays: "Saturday & Thursday",
      precaution: "Avoid emotional detachment in personal marital relationships.",
      remedy: "Donate black blankets or iron utensils to the needy on Saturday.",
    },
  },
  {
    id: "pisces",
    rashi: "मीन (Meena)",
    english: "Pisces",
    symbol: "♓",
    dates: "Feb 19 – Mar 20",
    element: "Jal (Water)",
    rulingPlanet: "Jupiter",
    rulingPlanetHindi: "बृहस्पति (Guru)",
    luckyNumber: "3 & 7",
    luckyColor: "Sea Green, Pale Gold & Haldi Yellow",
    gemstone: "Yellow Sapphire (Pukhraj)",
    shubhMuhurat: "07:45 AM - 10:00 AM & 05:15 PM - 07:00 PM",
    dailyPrediction: {
      health: "Soothing emotional equilibrium. Keep feet warm and practice peaceful meditation before sleep.",
      career: "Healing professions, creative arts, spiritual writing, and foreign transactions receive divine blessings.",
      relationships: "Soulful empathy and unconditional compassion enrich bonds with loved ones.",
      guidance: "Trust divine providence. Chant the sacred Gayatri Mantra for spiritual illumination.",
      vedicMantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    },
    tomorrowPrediction: {
      health: "Peaceful dreams and restful nights. Stay hydrated with warm herbal water.",
      career: "Unexpected support from international contacts or spiritual mentors clarifies direction.",
      relationships: "Deep emotional understanding and mutual forgiveness dissolve old friction.",
      guidance: "Feed flour dough balls to fish in a holy river or pond for spiritual merit.",
      vedicMantra: "ॐ विष्णवे नमः (Om Vishnave Namah)",
    },
    weeklyPrediction: {
      overview: "Deep spiritual awakening and heightened intuitive vision. Financial blessings arrive through ethical avenues and guru's blessings.",
      favorableDays: "Thursday & Monday",
      precaution: "Stay grounded in practical realities while pursuing idealistic dreams.",
      remedy: "Worship Lord Vishnu with Tulsi leaves and chant Vishnu Sahasranama on Thursdays.",
    },
  },
];
