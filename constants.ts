// constants.ts

/* =========================
   Grades
   ========================= */

export const GRADES = [
  "FS1 (Playgroup)",
  "FS2",
  "FS3",
  "KG1",
  "KG2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

// One-to-One Schooling only allows up to Grade 7
export const ONE_ON_ONE_GRADES = [
  "FS1 (Playgroup)",
  "FS2",
  "FS3",
  "KG1",
  "KG2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
];

// Helper to determine numeric value for comparison
export const getGradeValue = (grade: string): number => {
  const map: Record<string, number> = {
    "FS1 (Playgroup)": 0,
    FS2: 0,
    FS3: 0,

    KG1: 1,
    KG2: 2,

    "Grade 1": 3,
    "Grade 2": 4,
    "Grade 3": 5,
    "Grade 4": 6,
    "Grade 5": 7,
    "Grade 6": 8,
    "Grade 7": 9,

    "Grade 8": 10,
    "Grade 9": 11,
    "Grade 10": 12,
    "Grade 11": 13,
    "Grade 12": 14,
  };
  return map[grade] ?? 0;
};

/* =========================
   Country phone data (WhatsApp)
   ✅ Flags included
   ✅ "Other" works as fallback
   ========================= */

export const COUNTRY_PHONE_DATA: Record<
  string,
  { code: string; flag: string; digits: number; example: string }
> = {
  // --- Gulf & Middle East ---
  "Saudi Arabia": { code: "+966", flag: "🇸🇦", digits: 9, example: "5XXXXXXXX" },
  "United Arab Emirates": { code: "+971", flag: "🇦🇪", digits: 9, example: "5XXXXXXXX" },
  Qatar: { code: "+974", flag: "🇶🇦", digits: 8, example: "XXXXXXXX" },
  Kuwait: { code: "+965", flag: "🇰🇼", digits: 8, example: "XXXXXXXX" },
  Oman: { code: "+968", flag: "🇴🇲", digits: 8, example: "9XXXXXXX" },
  Bahrain: { code: "+973", flag: "🇧🇭", digits: 8, example: "3XXXXXXX" },
  Jordan: { code: "+962", flag: "🇯🇴", digits: 9, example: "7XXXXXXXX" },
  Lebanon: { code: "+961", flag: "🇱🇧", digits: 8, example: "XXXXXXXX" },
  Iraq: { code: "+964", flag: "🇮🇶", digits: 10, example: "7XXXXXXXXX" },
  Yemen: { code: "+967", flag: "🇾🇪", digits: 9, example: "7XXXXXXXX" },
  Turkey: { code: "+90", flag: "🇹🇷", digits: 10, example: "5XXXXXXXXX" },
  Iran: { code: "+98", flag: "🇮🇷", digits: 10, example: "9XXXXXXXXX" },

  // --- South & Central Asia ---
  Pakistan: { code: "+92", flag: "🇵🇰", digits: 10, example: "3XXXXXXXXX" },
  India: { code: "+91", flag: "🇮🇳", digits: 10, example: "9XXXXXXXXX" },
  Bangladesh: { code: "+880", flag: "🇧🇩", digits: 10, example: "1XXXXXXXXX" },
  "Sri Lanka": { code: "+94", flag: "🇱🇰", digits: 9, example: "7XXXXXXXX" },
  Nepal: { code: "+977", flag: "🇳🇵", digits: 10, example: "98XXXXXXXX" },
  Afghanistan: { code: "+93", flag: "🇦🇫", digits: 9, example: "7XXXXXXXX" },
  Kazakhstan: { code: "+7", flag: "🇰🇿", digits: 10, example: "7XXXXXXXXX" },
  Uzbekistan: { code: "+998", flag: "🇺🇿", digits: 9, example: "9XXXXXXXX" },

  // --- East & Southeast Asia ---
  China: { code: "+86", flag: "🇨🇳", digits: 11, example: "1XXXXXXXXXX" },
  "Hong Kong": { code: "+852", flag: "🇭🇰", digits: 8, example: "XXXXXXXX" },
  Taiwan: { code: "+886", flag: "🇹🇼", digits: 9, example: "9XXXXXXXX" },
  Japan: { code: "+81", flag: "🇯🇵", digits: 10, example: "90XXXXXXXX" },
  "South Korea": { code: "+82", flag: "🇰🇷", digits: 10, example: "10XXXXXXXX" },
  Malaysia: { code: "+60", flag: "🇲🇾", digits: 9, example: "1XXXXXXXX" },
  Indonesia: { code: "+62", flag: "🇮🇩", digits: 11, example: "8XXXXXXXXXX" },
  Philippines: { code: "+63", flag: "🇵🇭", digits: 10, example: "9XXXXXXXXX" },
  Singapore: { code: "+65", flag: "🇸🇬", digits: 8, example: "8XXXXXXX" },
  Thailand: { code: "+66", flag: "🇹🇭", digits: 9, example: "8XXXXXXXX" },
  Vietnam: { code: "+84", flag: "🇻🇳", digits: 9, example: "9XXXXXXXX" },
  Myanmar: { code: "+95", flag: "🇲🇲", digits: 9, example: "9XXXXXXXX" },
  Cambodia: { code: "+855", flag: "🇰🇭", digits: 9, example: "1XXXXXXXX" },

  // --- North America ---
  USA: { code: "+1", flag: "🇺🇸", digits: 10, example: "XXXXXXXXXX" },
  Canada: { code: "+1", flag: "🇨🇦", digits: 10, example: "XXXXXXXXXX" },
  Mexico: { code: "+52", flag: "🇲🇽", digits: 10, example: "XXXXXXXXXX" },

  // --- Europe ---
  "United Kingdom": { code: "+44", flag: "🇬🇧", digits: 10, example: "7XXXXXXXXX" },
  Germany: { code: "+49", flag: "🇩🇪", digits: 11, example: "15XXXXXXXXX" },
  France: { code: "+33", flag: "🇫🇷", digits: 9, example: "6XXXXXXXX" },
  Italy: { code: "+39", flag: "🇮🇹", digits: 10, example: "3XXXXXXXXX" },
  Spain: { code: "+34", flag: "🇪🇸", digits: 9, example: "6XXXXXXXX" },
  Netherlands: { code: "+31", flag: "🇳🇱", digits: 9, example: "6XXXXXXXX" },
  Belgium: { code: "+32", flag: "🇧🇪", digits: 9, example: "4XXXXXXXX" },
  Switzerland: { code: "+41", flag: "🇨🇭", digits: 9, example: "7XXXXXXXX" },
  Sweden: { code: "+46", flag: "🇸🇪", digits: 9, example: "7XXXXXXXX" },
  Norway: { code: "+47", flag: "🇳🇴", digits: 8, example: "4XXXXXXX" },
  Denmark: { code: "+45", flag: "🇩🇰", digits: 8, example: "XXXXXXXX" },
  Poland: { code: "+48", flag: "🇵🇱", digits: 9, example: "XXXXXXXXX" },
  Russia: { code: "+7", flag: "🇷🇺", digits: 10, example: "9XXXXXXXXX" },
  Ukraine: { code: "+380", flag: "🇺🇦", digits: 9, example: "XXXXXXXXX" },
  Greece: { code: "+30", flag: "🇬🇷", digits: 10, example: "69XXXXXXXX" },
  Portugal: { code: "+351", flag: "🇵🇹", digits: 9, example: "9XXXXXXXX" },
  Ireland: { code: "+353", flag: "🇮🇪", digits: 9, example: "8XXXXXXXX" },

  // --- Oceania ---
  Australia: { code: "+61", flag: "🇦🇺", digits: 9, example: "4XXXXXXXX" },
  "New Zealand": { code: "+64", flag: "🇳🇿", digits: 9, example: "2XXXXXXXX" },

  // --- South America ---
  Brazil: { code: "+55", flag: "🇧🇷", digits: 11, example: "9XXXXXXXXXX" },
  Argentina: { code: "+54", flag: "🇦🇷", digits: 10, example: "9XXXXXXXXX" },
  Colombia: { code: "+57", flag: "🇨🇴", digits: 10, example: "3XXXXXXXXX" },
  Chile: { code: "+56", flag: "🇨🇱", digits: 9, example: "9XXXXXXXX" },
  Peru: { code: "+51", flag: "🇵🇪", digits: 9, example: "9XXXXXXXX" },

  // --- Africa ---
  Egypt: { code: "+20", flag: "🇪🇬", digits: 10, example: "1XXXXXXXXX" },
  "South Africa": { code: "+27", flag: "🇿🇦", digits: 9, example: "XXXXXXXXX" },
  Nigeria: { code: "+234", flag: "🇳🇬", digits: 10, example: "8XXXXXXXXX" },
  Kenya: { code: "+254", flag: "🇰🇪", digits: 9, example: "7XXXXXXXX" },
  Morocco: { code: "+212", flag: "🇲🇦", digits: 9, example: "6XXXXXXXX" },
  Ghana: { code: "+233", flag: "🇬🇭", digits: 9, example: "2XXXXXXXX" },

  // --- Fallback ---
  // ✅ Other = user will type FULL international number (country code + number)
  Other: { code: "+", flag: "🌍", digits: 15, example: "CountryCode + Number" },
};

/* =========================
   Countries list (for dropdowns like Quran country)
   ✅ Includes ALL keys from COUNTRY_PHONE_DATA
   ✅ Core countries first, rest auto added, Other last
   ========================= */

const CORE_COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Pakistan",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "United Kingdom",
  "USA",
  "Canada",
  "Australia",
];

export const COUNTRIES = [
  ...CORE_COUNTRIES.filter((c) => c in COUNTRY_PHONE_DATA),
  ...Object.keys(COUNTRY_PHONE_DATA)
    .filter((c) => c !== "Other" && !CORE_COUNTRIES.includes(c))
    .sort((a, b) => a.localeCompare(b)),
  "Other",
];



/* =========================
   Subjects + Time slots
   ========================= */

export const IGCSE_SUBJECTS = [
  "English",
  "Mathematics",
  "Biology",
  "Physics",
  "Chemistry",
  "Pakistan Studies",
  "Computer Science",
  "ICT",
  "Islamic Studies",
  "Accounting",
  "Economics",
  "Business Studies",
];

export const TIME_SLOTS = [
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 8 PM)",
  "Night (8 PM - 11 PM)",
  "Weekends Only",
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const QURAN_LEVELS = ["Beginner (Qaida)", "Intermediate (Nazra)", "Advanced (Tajweed/Hifz)"];

// Quran class time slots (30-minute classes)
export const QURAN_CLASS_TIMES = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM",
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM",
  "9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM",
];