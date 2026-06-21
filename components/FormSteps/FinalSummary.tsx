import React from 'react';
import { FormData, LeadType } from '../../types';
import { getGradeValue as getGV } from '../../constants';
import { Clock } from 'lucide-react';
import { CouponCodeSection } from './CouponCodeSection';

type SummaryStudent = {
  id: string;
  name: string;
  age: string;
  grade: string;
  curriculum: string | null;
};

interface FinalSummaryProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  summaryStudents: SummaryStudent[];
  schoolTrialTime: string;
  schoolTrialLabel: string;
  selectedQuranTime: string;
  selectedQuranDays: string;
  hasLowerGrades: boolean;
  hasUpperGrades: boolean;
  hasAdditionalPrograms: boolean;
  visibleUpsellTuitionStudents: Array<{ id: string; name: string; age: string; requirements: string }>;
  visibleUpsellQuranStudents: Array<{ id: string; name: string; age: string; subjects?: string[]; classDays?: string[]; classTime?: string; country?: string }>;
  visibleUpsellSchoolStudents: Array<{ id: string; name: string; age: string; grade: string }>;
}

export const FinalSummary = ({
  data,
  updateData,
  summaryStudents,
  schoolTrialTime,
  schoolTrialLabel,
  selectedQuranTime,
  selectedQuranDays,
  hasLowerGrades,
  hasUpperGrades,
  hasAdditionalPrograms,
  visibleUpsellTuitionStudents,
  visibleUpsellQuranStudents,
  visibleUpsellSchoolStudents,
}: FinalSummaryProps) => {
  return (
    <>
      {hasAdditionalPrograms && (
        <div className="pf-card p-6 sm:p-8 border border-amber-200 bg-gradient-to-br from-amber-50/90 via-orange-50/75 to-amber-50/80 shadow-[0_16px_45px_rgba(245,158,11,0.10)]">
          <h4 className="text-lg sm:text-xl font-extrabold text-amber-800 border-b border-amber-200 pb-4 mb-6 flex items-center gap-3 uppercase tracking-wide">
            <span className="text-3xl">🎁</span>
            Additional Programs (Package Deal)
          </h4>

          {visibleUpsellTuitionStudents.length > 0 && (
            <div className="mb-6">
              <p className="text-lg font-extrabold text-purple-600 uppercase mb-4">
                1-on-1 Tuition ({visibleUpsellTuitionStudents.length})
              </p>
              <div className="space-y-3">
                {visibleUpsellTuitionStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 rounded-3xl border border-purple-200 bg-white/75 px-5 py-4 shadow-[0_10px_28px_rgba(139,92,246,0.06)]"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center text-lg font-extrabold shadow-[0_8px_20px_rgba(139,92,246,0.20)]">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-purple-700 truncate">{student.name}</p>
                      <p className="text-sm text-purple-500 truncate">
                        Age {student.age}
                        {student.requirements ? ` • ${student.requirements}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleUpsellQuranStudents.length > 0 && (
            <div className="mb-6">
              <p className="text-lg font-extrabold text-blue-600 uppercase mb-4">
                Quran Classes ({visibleUpsellQuranStudents.length})
              </p>
              <div className="space-y-3">
                {visibleUpsellQuranStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 rounded-3xl border border-blue-200 bg-white/75 px-5 py-4 shadow-[0_10px_28px_rgba(16,185,129,0.06)]"
                  >
<div className="min-w-[48px] w-12 h-12 min-h-[48px] shrink-0 grow-0 basis-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 text-white inline-flex items-center justify-center text-lg font-extrabold leading-none shadow-[0_8px_20px_rgba(16,185,129,0.20)]">
  {idx + 1}
</div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-blue-700 truncate">{student.name}</p>
                      <p className="text-sm text-blue-600 truncate">
                        Age {student.age}
                        {student.subjects?.length ? ` • ${student.subjects.join(", ")}` : ""}
                        {student.classDays?.length ? ` • ${student.classDays.join(", ")}` : ""}
                        {student.classTime ? ` • ${student.classTime}` : ""}
                        {student.country ? ` • ${student.country}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleUpsellSchoolStudents.length > 0 && (
            <div>
              <p className="text-lg font-extrabold text-blue-600 uppercase mb-4">
                Full-Time School ({visibleUpsellSchoolStudents.length})
              </p>
              <div className="space-y-3">
                {visibleUpsellSchoolStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 rounded-3xl border border-blue-200 bg-white/75 px-5 py-4 shadow-[0_10px_28px_rgba(59,130,246,0.06)]"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 text-white flex items-center justify-center text-lg font-extrabold shadow-[0_8px_20px_rgba(59,130,246,0.20)]">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-blue-700 truncate">{student.name}</p>
                      <p className="text-sm text-blue-600 truncate">
                        Age {student.age} • {student.grade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="final-step-referral-wrap">
  <CouponCodeSection data={data} updateData={updateData} />
</div>

      <div className="pf-card p-5 sm:p-6 border border-brand-lightGray bg-white/80 shadow-[0_12px_34px_rgba(15,45,87,0.05)]">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
              Application Summary
            </h4>
            <p className="text-sm text-brand-mediumText mt-1">
              Review the main student details before final submission.
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold shadow-sm">
            Students ({summaryStudents.length})
          </div>
        </div>

        <div className="space-y-3">
          {summaryStudents.length > 0 ? (
            summaryStudents.map((s, i) => {
              const isQuranSummary = data.leadType === LeadType.QURAN;
              const isTuitionSummary = data.leadType === LeadType.TUITION;

              const gv = !isQuranSummary && !isTuitionSummary ? getGV(s.grade) : 0;

              const displayCurriculum = isQuranSummary
                ? s.curriculum || "Quran Program"
                : isTuitionSummary
                ? s.curriculum || "—"
                : s.curriculum || (gv < 10 && s.grade !== "-" ? "British Curriculum" : "—");

              return (
                <div
                  key={s.id || i}
                  className="rounded-[22px] border border-[rgba(29,111,206,0.10)] bg-[linear-gradient(135deg,#fbfdff_0%,#f4f9ff_100%)] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_8px_22px_rgba(15,45,87,0.04)]"
                >
                  <div className="grid gap-4 md:grid-cols-[64px_1fr] items-start">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[linear-gradient(135deg,#1d6fce,#0ea5e9)] text-white flex items-center justify-center text-lg sm:text-xl font-extrabold shadow-[0_10px_22px_rgba(29,111,206,0.20)]">
                      {i + 1}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.10em] text-gray-500 font-semibold mb-1">
                          Name
                        </p>
                        <p className="text-[15px] sm:text-[16px] font-bold text-[#163761] leading-snug break-words">
                          {s.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.10em] text-gray-500 font-semibold mb-1">
                          Age
                        </p>
                        <p className="text-[15px] sm:text-[16px] font-bold text-[#163761] leading-snug">
                          {s.age} yrs
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.10em] text-gray-500 font-semibold mb-1">
                          {data.leadType === LeadType.QURAN
                            ? "Program"
                            : data.leadType === LeadType.TUITION
                            ? "Program"
                            : "Grade"}
                        </p>
                        <p className="text-[15px] sm:text-[16px] font-bold text-[#163761] leading-snug break-words">
                          {s.grade}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.10em] text-gray-500 font-semibold mb-1">
                          {data.leadType === LeadType.QURAN
                            ? "Subjects"
                            : data.leadType === LeadType.TUITION
                            ? "Requirements"
                            : "Curriculum"}
                        </p>
                        <p className="text-[15px] sm:text-[16px] font-bold text-[#163761] leading-snug break-words">
                          {displayCurriculum}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-800">
              No student details yet. Please go back and complete student information.
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-black/8 mt-5">
          <div className="rounded-2xl bg-white/80 border border-black/6 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
            <p className="text-gray-500 text-xs mb-1">Program</p>
            <p className="font-bold text-brand-burgundy text-2xl sm:text-3xl leading-tight">
              {data.leadType === LeadType.FULL_TIME
                ? "Full-Time School"
                : data.leadType === LeadType.TUITION
                ? "One-to-One Tuition"
                : data.leadType === LeadType.QURAN
                ? "Quran Classes"
                : "One-to-One Schooling"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 border border-black/6 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
            <p className="text-gray-500 text-xs mb-3">
              Trial Schedule ({data.leadType === LeadType.QURAN || data.leadType === LeadType.FULL_TIME ? "3 Days" : "1 Day"})
            </p>

            {data.leadType === LeadType.TUITION ? (
  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 shadow-[0_8px_20px_rgba(139,92,246,0.06)]">
    <p className="text-sm text-purple-700 font-semibold">1 Day Free Trial</p>
    <p className="text-lg text-purple-800 font-bold mt-1">
      Timing based on teacher availability
    </p>
    <p className="text-sm text-purple-600 mt-2">
      Our advisor will guide you on call
    </p>
  </div>
) : data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 shadow-[0_8px_20px_rgba(139,92,246,0.06)]">
    <p className="text-sm text-purple-700 font-semibold">1 Day Free Trial</p>
    <p className="text-lg text-purple-800 font-bold mt-1">
      {schoolTrialTime}
    </p>
    <p className="text-sm text-purple-600 mt-2">
      {schoolTrialLabel}
    </p>
  </div>
) : data.leadType === LeadType.QURAN ? (
  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 shadow-[0_8px_20px_rgba(16,185,129,0.06)]">
    <p className="text-sm text-blue-700 font-semibold">
      3 Days Free Trial Classes
    </p>
    <p className="text-lg text-blue-800 font-bold mt-1">
      {selectedQuranTime}
    </p>
    <p className="text-sm text-blue-600 mt-2">
      {selectedQuranDays}
    </p>
  </div>
) : data.leadType === LeadType.FULL_TIME ? (
  <div className="space-y-3">
    {hasLowerGrades && (
      <div className="p-4 rounded-2xl bg-[linear-gradient(135deg,#f7fbff_0%,#f1f8ff_100%)] border border-blue-100 shadow-[0_8px_20px_rgba(59,130,246,0.05)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white border border-blue-100 flex items-center justify-center shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-sm text-blue-700 font-semibold">
            3 Days Free Trial Classes
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { tz: "KSA", time: "3:30 PM", accent: "text-blue-600" },
            { tz: "UAE", time: "4:30 PM", accent: "text-sky-600" },
            { tz: "PAK", time: "5:30 PM", accent: "text-cyan-600" },
          ].map((item) => (
            <div
              key={item.tz}
              className="rounded-2xl border border-blue-100 bg-white px-3 py-3.5 text-center shadow-[0_4px_12px_rgba(15,45,87,0.03)]"
            >
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className={`w-3 h-3 ${item.accent}`} />
                <p className={`text-[11px] font-bold ${item.accent}`}>
                  {item.tz}
                </p>
              </div>

              <p className="text-lg font-extrabold text-[#0f2d57] leading-none">
                {item.time}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-blue-600 mt-4 font-medium">
          KG1 to Grade 7
        </p>
      </div>
    )}

    {hasUpperGrades && (
      <div className="p-4 rounded-2xl bg-[linear-gradient(135deg,#f7fbff_0%,#f1f8ff_100%)] border border-blue-100 shadow-[0_8px_20px_rgba(59,130,246,0.05)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white border border-blue-100 flex items-center justify-center shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-sm text-blue-700 font-semibold">
            3 Days Free Trial Classes
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { tz: "KSA", time: "9:30 AM", accent: "text-blue-600" },
            { tz: "UAE", time: "10:30 AM", accent: "text-sky-600" },
            { tz: "PAK", time: "11:30 AM", accent: "text-cyan-600" },
          ].map((item) => (
            <div
              key={item.tz}
              className="rounded-2xl border border-blue-100 bg-white px-3 py-3.5 text-center shadow-[0_4px_12px_rgba(15,45,87,0.03)]"
            >
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className={`w-3 h-3 ${item.accent}`} />
                <p className={`text-[11px] font-bold ${item.accent}`}>
                  {item.tz}
                </p>
              </div>

              <p className="text-lg font-extrabold text-[#0f2d57] leading-none">
                {item.time}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-blue-600 mt-4 font-medium">
          Grade 8 to 12
        </p>
      </div>
    )}
  </div>
)  : null}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label className="text-sm font-medium text-brand-darkText mb-2 block">
          Final notes?
        </label>
        <textarea
          className="w-full glass-input rounded-2xl p-4 text-sm h-28 shadow-[0_10px_25px_rgba(15,45,87,0.03)]"
          placeholder="Any special requirements..."
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
        />
      </div>
    </>
  );
};
