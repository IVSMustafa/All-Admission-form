import type { FormData } from '../../types';
import { validatePhoneLength } from './validation';

export type ValidationErrors = Record<string, string>;

type SchoolDraftValidation = {
  pendingStudentIsComplete: boolean;
  needsCurriculum: boolean;
};

type QuranDraftValidation = {
  hasPendingStudent: boolean;
};

export type StepValidationResult = {
  errors: ValidationErrors;
  schoolDraft: SchoolDraftValidation | null;
  quranDraft: QuranDraftValidation | null;
};

const LOWER_SCHOOL_GRADES = [
  'KG1',
  'KG2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'FS1 (Playgroup)',
  'FS2',
  'FS3',
];

const getSchoolDraftValidation = (data: FormData): SchoolDraftValidation => {
  const hasValidPendingStudent = Boolean(data.studentName.trim() && data.age && data.grade);
  const gradeVal = data.grade ? (LOWER_SCHOOL_GRADES.includes(data.grade) ? 0 : 10) : 0;
  const needsCurriculum = gradeVal >= 10;
  const hasCurriculumIfNeeded = Boolean(!needsCurriculum || data.curriculum);

  return {
    pendingStudentIsComplete: hasValidPendingStudent && hasCurriculumIfNeeded,
    needsCurriculum,
  };
};

const getQuranDraftValidation = (data: FormData): QuranDraftValidation => ({
  hasPendingStudent: Boolean(
    data.studentName.trim() &&
      data.age &&
      (data.quranSubjects || []).length > 0 &&
      (data.quranClassDays || []).length > 0 &&
      data.quranClassTime
  ),
});

export const getStepValidationResult = (
  currentStep: number,
  data: FormData
): StepValidationResult => {
  const errors: ValidationErrors = {};
  let schoolDraft: SchoolDraftValidation | null = null;
  let quranDraft: QuranDraftValidation | null = null;

  if (currentStep === 1) {
    if (data.country === 'Other' && !data.otherCountryName.trim()) {
      errors.otherCountryName = 'Required';
    }

    if (!data.email?.trim()) {
      errors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (data.leadType === 'full_time' || data.leadType === 'one_on_one_schooling') {
      schoolDraft = getSchoolDraftValidation(data);
      const totalStudents = data.students.length + (schoolDraft.pendingStudentIsComplete ? 1 : 0);

      if (!data.parentName) errors.parentName = 'Required';
      if (!data.country) errors.country = 'Please select a country';
      if (!data.whatsapp || !validatePhoneLength(data.country || 'Other', data.whatsapp)) {
        errors.whatsapp = 'Enter valid phone number';
      }

      if (totalStudents === 0) {
        errors.students = 'Please add at least one student';
      }
    } else if (data.leadType === 'quran') {
      const quranCountry = data.quranStudentCountry || 'Other';
      quranDraft = getQuranDraftValidation(data);
      const existingStudents = data.quranStudents?.length || 0;
      const totalStudents = existingStudents + (quranDraft.hasPendingStudent ? 1 : 0);

      if (!data.parentName) errors.parentName = 'Required';
      if (!data.quranStudentCountry) errors.quranStudentCountry = 'Required';
      if (!data.whatsapp || !validatePhoneLength(quranCountry, data.whatsapp)) {
        errors.whatsapp = 'Enter valid phone number';
      }

      if (totalStudents === 0) {
        errors.quranStudents = 'Please add at least one student';
      }
    } else if (data.leadType === 'tuition') {
      if (!data.studentName) errors.studentName = 'Required';
      if (!data.age) errors.age = 'Required';
      if (!data.parentName) errors.parentName = 'Required';
      if (!data.whatsapp || !validatePhoneLength(data.country || 'Other', data.whatsapp)) {
        errors.whatsapp = 'Enter valid phone number';
      }
      if (!data.tuitionRequirements || data.tuitionRequirements.trim().length < 10) {
        errors.tuitionRequirements = 'Please describe your requirements (at least 10 characters)';
      }
    }
  }

  return {
    errors,
    schoolDraft,
    quranDraft,
  };
};
