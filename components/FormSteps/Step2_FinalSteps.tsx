import React from 'react';
import { FormData, LeadType, Curriculum } from '../../types';
import { getGradeValue as getGV } from '../../constants';
import { usePremiumStyles, DRAFT_ID, StepProps, FINAL_STEP_QURAN_UI, FINAL_STEP_GLASS_CSS } from './formStepStyles';
import { UpsellSchoolSection } from './UpsellSchoolSection';
import { UpsellTuitionSection } from './UpsellTuitionSection';
import { UpsellQuranSection } from './UpsellQuranSection';
import { FinalSummary } from './FinalSummary';

export const Step2_FinalSteps = ({ data, updateData }: StepProps) => {
  usePremiumStyles();

  type SummaryStudent = {
    id: string;
    name: string;
    age: string;
    grade: string;
    curriculum: string | null;
  };

  const realSchoolStudents = (data.students || []).filter((s) => s.id !== DRAFT_ID);
  const realQuranStudents = data.quranStudents || [];

  const summaryStudents: SummaryStudent[] =
    data.leadType === LeadType.QURAN
      ? realQuranStudents.map((student) => ({
          id: student.id,
          name: student.name || "-",
          age: student.age || "-",
          grade: "Quran Classes",
          curriculum: student.subjects?.length ? student.subjects.join(", ") : "Quran Program",
        }))
      : data.leadType === LeadType.TUITION
      ? data.studentName || data.age || data.tuitionRequirements
        ? [
            {
              id: "__tuition__",
              name: data.studentName || "-",
              age: data.age || "-",
              grade: "1-on-1 Tuition",
              curriculum: data.tuitionRequirements || "—",
            },
          ]
        : []
      : realSchoolStudents.length > 0
      ? realSchoolStudents.map((student) => ({
          id: student.id,
          name: student.name || "-",
          age: student.age || "-",
          grade: student.grade || "-",
          curriculum: student.curriculum || null,
        }))
      : data.studentName || data.age || data.grade
      ? [
          {
            id: "__preview__",
            name: data.studentName || "-",
            age: data.age || "-",
            grade: data.grade || "-",
            curriculum: data.curriculum || null,
          },
        ]
      : [];

  const primarySummaryStudent = summaryStudents[0] || null;

  const primaryName = primarySummaryStudent?.name || "";
  const primaryAge = primarySummaryStudent?.age || "";
  const primaryGrade =
    data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING
      ? primarySummaryStudent?.grade || ""
      : "";
  const primaryCurriculum =
    data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING
      ? (primarySummaryStudent?.curriculum as Curriculum | null) || null
      : null;

const hasLowerGrades =
  data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING
    ? summaryStudents.some((s) => getGV(s.grade) < 10)
    : false;

const hasUpperGrades =
  data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING
    ? summaryStudents.some((s) => getGV(s.grade) >= 10)
    : false;

const schoolTrialTime =
  hasLowerGrades && hasUpperGrades
    ? "Multiple schedules based on grade"
    : hasLowerGrades
    ? "3:30 PM KSA | 4:30 PM UAE | 5:30 PM PAK"
    : "9:30 AM KSA | 10:30 AM UAE | 11:30 AM PAK";

const schoolTrialLabel =
  hasLowerGrades && hasUpperGrades
    ? "KG1 to Grade 12"
    : hasLowerGrades
    ? "KG1 to Grade 7"
    : "Grade 8 to 12";
  const selectedQuranStudent = (data.quranStudents || [])[0];
  const selectedQuranTime =
    selectedQuranStudent?.classTime || data.quranClassTime || "To be confirmed on WhatsApp";

  const selectedQuranDays =
    selectedQuranStudent?.classDays?.length
      ? selectedQuranStudent.classDays.join(", ")
      : "Based on your selected days";

  const hasPackageDeal =
    (data.tuitionInterest && data.quranInterest) ||
    (data.tuitionInterest && data.fullTimeInterest) ||
    (data.quranInterest && data.fullTimeInterest);

  const previewSchoolStudent =
    data.fullTimeInterest && data.pendingSchoolName && data.pendingSchoolAge && data.pendingSchoolGrade
      ? {
          id: "__pending_school__",
          name: data.pendingSchoolName,
          age: data.pendingSchoolAge,
          grade: data.pendingSchoolGrade,
          curriculum: primaryCurriculum,
        }
      : null;

  const previewTuitionStudent =
    data.tuitionInterest && data.pendingTuitionName && data.pendingTuitionAge
      ? {
          id: "__pending_tuition__",
          name: data.pendingTuitionName,
          age: data.pendingTuitionAge,
          requirements: data.pendingTuitionReq || "",
        }
      : null;

  const previewQuranStudent =
    data.quranInterest && data.pendingQuranName && data.pendingQuranAge
      ? {
          id: "__pending_quran__",
          name: data.pendingQuranName,
          age: data.pendingQuranAge,
          subjects: data.pendingQuranSubjects || [],
          classDays: data.pendingQuranDays || [],
          classTime: data.pendingQuranTime || "Flexible",
          country: data.pendingQuranCountry || "",
        }
      : null;

  const visibleUpsellSchoolStudents = [
    ...(data.upsellSchoolStudents || []),
    ...(previewSchoolStudent ? [previewSchoolStudent] : []),
  ];

  const visibleUpsellTuitionStudents = [
    ...(data.upsellTuitionStudents || []),
    ...(previewTuitionStudent ? [previewTuitionStudent] : []),
  ];

  const visibleUpsellQuranStudents = [
    ...(data.upsellQuranStudents || []),
    ...(previewQuranStudent ? [previewQuranStudent] : []),
  ];

  const hasAdditionalPrograms =
    visibleUpsellSchoolStudents.length > 0 ||
    visibleUpsellTuitionStudents.length > 0 ||
    visibleUpsellQuranStudents.length > 0;

 return (
  <div className="final-step-glass space-y-8 transition-all duration-300">
  <style>{FINAL_STEP_GLASS_CSS}</style>
    <style>{FINAL_STEP_QURAN_UI}</style>
      <div className="text-center pf-e1">
        <h2 className="pf-heading text-3xl sm:text-4xl font-display font-extrabold">
          Final Steps
        </h2>
        <p className="text-brand-mediumText text-base sm:text-lg mt-2">
          Review your details and add extra programs if needed.
        </p>
      </div>


      {hasPackageDeal && (
        <div className="pf-card p-5 sm:p-6 border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 shadow-[0_12px_40px_rgba(245,158,11,0.10)]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-[0_10px_25px_rgba(245,158,11,0.22)]">
              🎁
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-amber-800">Package Deal!</h3>
              <p className="text-base text-amber-700 mt-1 leading-relaxed">
                Register for multiple programs and get a discounted package. Our advisor will share details!
              </p>
            </div>
          </div>
        </div>
      )}

      <UpsellSchoolSection
        data={data}
        updateData={updateData}
        primaryName={primaryName}
        primaryAge={primaryAge}
        primaryGrade={primaryGrade}
        primaryCurriculum={primaryCurriculum}
        visibleUpsellSchoolStudents={visibleUpsellSchoolStudents}
      />

      <UpsellTuitionSection
        data={data}
        updateData={updateData}
        primaryName={primaryName}
        primaryAge={primaryAge}
        visibleUpsellTuitionStudents={visibleUpsellTuitionStudents}
      />

      <UpsellQuranSection
        data={data}
        updateData={updateData}
        primaryName={primaryName}
        primaryAge={primaryAge}
        selectedQuranStudent={selectedQuranStudent}
        visibleUpsellQuranStudents={visibleUpsellQuranStudents}
      />

      <FinalSummary
        data={data}
        updateData={updateData}
        summaryStudents={summaryStudents}
        schoolTrialTime={schoolTrialTime}
        schoolTrialLabel={schoolTrialLabel}
        selectedQuranTime={selectedQuranTime}
        selectedQuranDays={selectedQuranDays}
        hasLowerGrades={hasLowerGrades}
        hasUpperGrades={hasUpperGrades}
        hasAdditionalPrograms={hasAdditionalPrograms}
        visibleUpsellTuitionStudents={visibleUpsellTuitionStudents}
        visibleUpsellQuranStudents={visibleUpsellQuranStudents}
        visibleUpsellSchoolStudents={visibleUpsellSchoolStudents}
      />
    </div>
  );
};