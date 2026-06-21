import type { FormData } from '../../types';

type SubmittedSnapshotIds = {
  schoolStudentId: string;
  tuitionStudentId: string;
  quranStudentId: string;
};

export const buildSubmissionId = (timestamp: number): string => `IVS-${timestamp}`;

export const prepareSubmittedSnapshot = (
  data: FormData,
  ids: SubmittedSnapshotIds
): FormData => {
  let updatedFormData = { ...data };

  if (
    data.fullTimeInterest &&
    data.pendingSchoolName &&
    data.pendingSchoolAge &&
    data.pendingSchoolGrade
  ) {
    updatedFormData = {
      ...updatedFormData,
      upsellSchoolStudents: [
        ...(data.upsellSchoolStudents || []),
        {
          id: ids.schoolStudentId,
          name: data.pendingSchoolName,
          age: data.pendingSchoolAge,
          grade: data.pendingSchoolGrade,
          curriculum: null,
        },
      ],
      pendingSchoolName: '',
      pendingSchoolAge: '',
      pendingSchoolGrade: '',
    };
  }

  if (
    data.tuitionInterest &&
    data.pendingTuitionName &&
    data.pendingTuitionAge &&
    data.pendingTuitionReq?.trim()
  ) {
    updatedFormData = {
      ...updatedFormData,
      upsellTuitionStudents: [
        ...(data.upsellTuitionStudents || []),
        {
          id: ids.tuitionStudentId,
          name: data.pendingTuitionName,
          age: data.pendingTuitionAge,
          requirements: data.pendingTuitionReq || '',
        },
      ],
      pendingTuitionName: '',
      pendingTuitionAge: '',
      pendingTuitionReq: '',
    };
  }

  if (
    data.quranInterest &&
    data.pendingQuranName &&
    data.pendingQuranAge &&
    data.pendingQuranCountry &&
    data.pendingQuranTime &&
    (data.pendingQuranSubjects || []).length > 0 &&
    (data.pendingQuranDays || []).length > 0
  ) {
    updatedFormData = {
      ...updatedFormData,
      upsellQuranStudents: [
        ...(data.upsellQuranStudents || []),
        {
          id: ids.quranStudentId,
          name: data.pendingQuranName,
          age: data.pendingQuranAge,
          subjects: data.pendingQuranSubjects || [],
          classDays: data.pendingQuranDays || [],
          classTime: data.pendingQuranTime || 'Flexible',
          country: data.pendingQuranCountry || '',
        },
      ],
      pendingQuranName: '',
      pendingQuranAge: '',
      pendingQuranTime: '',
      pendingQuranSubjects: [],
      pendingQuranDays: [],
      pendingQuranCountry: '',
    };
  }

  return updatedFormData;
};
