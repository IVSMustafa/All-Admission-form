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

export interface Student {
  id: string;
  name: string;
  age: string;
  grade: string;
  curriculum: Curriculum | null;
}

export interface QuranStudent {
  id: string;
  name: string;
  age: string;
  subjects: string[];
  classDays: string[];
  classTime: string;
}

export interface TuitionUpsellStudent {
  id: string;
  name: string;
  age: string;
  requirements: string;
}

export interface FormData {
  leadType: LeadType | null;

  students: Student[];
  otherCountryName: string;

  avatar: string;
  studentName: string;
  age: string;
  grade: string;
  country: string;
  city: string;
  parentName: string;
  whatsapp: string;
  email: string;

  programType: ProgramType | null;

  curriculum: Curriculum | null;
  track: Track | null;
  subjects: string[];
  customSubject: string;
  tuitionBoard: string;
  preferredTimeSlots: string[];

  britishIslamicStudies: boolean;
  britishUrdu: boolean;
  learningNotes: string;

  igcseClassMode: ClassMode | null;
  examSession: string;

  trialConfirmed: boolean;
  trialReason: string;
  trialPreferredDay: string;

  quranInterest: boolean;
  quranTiming: string;
  quranLevel: string;

  quranStudents: QuranStudent[];
  quranSubjects: string[];
  quranClassDays: string[];
  quranClassTime: string;
  quranStudentCountry: string;

  tuitionRequirements: string;

  upsellTuitionStudents: TuitionUpsellStudent[];
  upsellSchoolStudents: Student[];
  upsellQuranStudents: QuranStudent[];
  fullTimeInterest: boolean;

  pendingSchoolName: string;
  pendingSchoolAge: string;
  pendingSchoolGrade: string;

  pendingTuitionName: string;
  pendingTuitionAge: string;
  pendingTuitionReq: string;

  pendingQuranName: string;
  pendingQuranAge: string;
  pendingQuranTime: string;
  pendingQuranSubjects: string[];

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
  otherCountryName: "",
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
  quranSubjects: [],
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
  pendingQuranSubjects: [],

  notes: '',
  couponCode: '',
  appliedCoupon: null,

  tuitionInterest: false,
};