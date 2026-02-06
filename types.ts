export enum LeadType {
  FULL_TIME = 'full_time',
  TUITION = 'tuition',
  ONE_ON_ONE_SCHOOLING = 'one_on_one_schooling',
  QURAN = 'quran',
}

export enum ProgramType {
  FULL_TIME = 'Full-time School',
  TUITION = 'Tuition (1-on-1)',
  ONE_ON_ONE_SCHOOLING = 'One-to-One Schooling',
}

export enum Curriculum {
  BRITISH = 'British Curriculum',
  FEDERAL = 'Federal Board (FBISE)',
  IGCSE_O_LEVEL = 'IGCSE / O-Level Prep',
  A_LEVEL = 'A-Level Prep',
  OTHER = 'Other'
}

export enum Track {
  SCIENCE = 'Science Group',
  ARTS = 'Arts/Humanities',
  COMPUTER = 'Computer Science',
  NOT_SURE = 'Not Sure',
}

export enum ClassMode {
  GROUP = 'Group Class',
  ONE_ON_ONE = 'One-on-One',
}

// Student entry for multi-student support
export interface Student {
  id: string;
  name: string;
  age: string;
  grade: string;
  curriculum: Curriculum | null;
}

// Quran student entry for multi-student support
export interface QuranStudent {
  id: string;
  name: string;
  age: string;
  classDays: string[];
  classTime: string;
}

// Tuition upsell student entry
export interface TuitionUpsellStudent {
  id: string;
  name: string;
  age: string;
  requirements: string;
}

export interface FormData {
  // Step 0
  leadType: LeadType | null;

  // Multi-student support
  students: Student[];

  // Step 1
  avatar: string; // Base64 or URL
  studentName: string;
  age: string; // Keeping as string to handle empty state easily in inputs
  grade: string;
  country: string;
  city: string;
  parentName: string;
  whatsapp: string;
  email: string;

  // Step 2
  programType: ProgramType | null;

  // Step 3
  curriculum: Curriculum | null;
  track: Track | null; // For Federal
  subjects: string[]; // For IGCSE/Tuition
  customSubject: string;
  tuitionBoard: string;
  preferredTimeSlots: string[];
  // Removed crashCourseAgreement (was for Crash Course)

  // Specific toggles
  britishIslamicStudies: boolean;
  britishUrdu: boolean;
  learningNotes: string;

  // IGCSE / O / A specific
  igcseClassMode: ClassMode | null;
  examSession: string;

  // Step 4
  trialConfirmed: boolean;
  trialReason: string; // 'Missed' | 'Different Day' | 'Call'
  trialPreferredDay: string;

  // Step 5
  quranInterest: boolean;
  quranTiming: string;
  quranLevel: string;

  // Quran Form Specific (when leadType is QURAN)
  quranStudents: QuranStudent[];
  quranClassDays: string[];
  quranClassTime: string;
  quranStudentCountry: string;

  // Tuition specific
  tuitionRequirements: string; // Short answer for subjects, grades, class type

  // Upsell data
  upsellTuitionStudents: TuitionUpsellStudent[]; // For tuition upsell from school/quran
  upsellSchoolStudents: Student[]; // For school upsell from tuition/quran
  upsellQuranStudents: QuranStudent[]; // For quran upsell
  fullTimeInterest: boolean; // For school upsell toggle

  // Pending upsell form fields (separate for each upsell type)
  pendingSchoolName: string;
  pendingSchoolAge: string;
  pendingSchoolGrade: string;
  pendingTuitionName: string;
  pendingTuitionAge: string;
  pendingTuitionReq: string;
  pendingQuranName: string;
  pendingQuranAge: string;
  pendingQuranTime: string;

  // Final
  notes: string;
  couponCode: string;
  appliedCoupon: {
    referrerName: string;
    discountType: string;
    discountValue: number;
    message: string;
  } | null;
  tuitionInterest: boolean;
}

export const INITIAL_DATA: FormData = {
  leadType: null,
  students: [],
  avatar: '',
  studentName: '',
  age: '',
  grade: '',
  country: '',
  city: '',
  parentName: '',
  whatsapp: '',
  email: '',
  programType: null,
  curriculum: null,
  track: null,
  subjects: [],
  customSubject: '',
  tuitionBoard: '',
  preferredTimeSlots: [],
  // crashCourseAgreement removed
  britishIslamicStudies: false,
  britishUrdu: false,
  learningNotes: '',
  igcseClassMode: null,
  examSession: '',
  trialConfirmed: true,
  trialReason: '',
  trialPreferredDay: '',
  quranInterest: false,
  quranTiming: '',
  quranLevel: '',
  quranStudents: [],
  quranClassDays: [],
  quranClassTime: '',
  quranStudentCountry: '',
  tuitionRequirements: '',
  upsellTuitionStudents: [],
  upsellSchoolStudents: [],
  upsellQuranStudents: [],
  fullTimeInterest: false,
  pendingSchoolName: '',
  pendingSchoolAge: '',
  pendingSchoolGrade: '',
  pendingTuitionName: '',
  pendingTuitionAge: '',
  pendingTuitionReq: '',
  pendingQuranName: '',
  pendingQuranAge: '',
  pendingQuranTime: '',
  notes: '',
  couponCode: '',
  appliedCoupon: null,
  tuitionInterest: false,
};