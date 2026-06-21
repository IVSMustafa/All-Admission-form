import React from 'react';
import { FormData, LeadType, QuranStudent } from '../../types';
import { COUNTRIES, DAYS, QURAN_CLASS_TIMES } from '../../constants';
import { InputField, SelectField, Toggle } from '../UI';
import { BookOpen, Clock, ChevronDown } from 'lucide-react';
import { cleanAgeInput } from './formStepStyles';
import { QURAN_SUBJECT_OPTIONS } from '../../src/config/formOptions';

interface UpsellQuranSectionProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  primaryName: string;
  primaryAge: string;
  selectedQuranStudent: QuranStudent | undefined;
  visibleUpsellQuranStudents: Array<{
    id: string;
    name: string;
    age: string;
    subjects?: string[];
    classDays?: string[];
    classTime?: string;
    country?: string;
  }>;
}

export const UpsellQuranSection = ({
  data,
  updateData,
  primaryName,
  primaryAge,
  selectedQuranStudent,
  visibleUpsellQuranStudents,
}: UpsellQuranSectionProps) => {
  const [isFinalQuranSubjectDropdownOpen, setIsFinalQuranSubjectDropdownOpen] = React.useState(false);

  if (data.leadType === LeadType.QURAN) return null;

  return (
  <div className="pf-card p-5 sm:p-6 shadow-[0_18px_50px_rgba(16,185,129,0.06)]">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="pf-icon pf-icon-green">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-extrabold text-brand-darkText text-base">Online Quran</h4>
          <p className="text-sm text-brand-mediumText">3-day free trial</p>
        </div>
      </div>
     <Toggle
  label="Interested?"
  checked={data.quranInterest}
  onChange={(v) =>
    updateData(
      v
        ? {
            quranInterest: true,
            pendingQuranName: data.pendingQuranName || primaryName,
            pendingQuranAge: data.pendingQuranAge || primaryAge,
            pendingQuranTime: data.pendingQuranTime || selectedQuranStudent?.classTime || "",
            pendingQuranSubjects:
              data.pendingQuranSubjects?.length
                ? data.pendingQuranSubjects
                : selectedQuranStudent?.subjects || [],
            pendingQuranCountry: data.pendingQuranCountry || data.quranStudentCountry || "",
            pendingQuranDays:
              data.pendingQuranDays?.length
                ? data.pendingQuranDays
                : selectedQuranStudent?.classDays || [],
          }
        : {
            quranInterest: false,
            pendingQuranName: "",
            pendingQuranAge: "",
            pendingQuranTime: "",
            pendingQuranSubjects: [],
            pendingQuranCountry: "",
            pendingQuranDays: [],
          }
    )
  }
/>
    </div>

    {data.quranInterest && (
      <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4 animate-fade-in">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-3 shadow-[0_8px_24px_rgba(16,185,129,0.08)]">
          <p className="text-sm font-semibold text-blue-700">
            Student details are pre-filled from your application. You can edit them below.
          </p>
        </div>

        {visibleUpsellQuranStudents.length > 0 && (
          <div className="space-y-3">
            {visibleUpsellQuranStudents.map((student, idx) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-[0_10px_30px_rgba(16,185,129,0.06)]"
              >
                <div className="flex items-center gap-3">
<span className="min-w-[36px] w-9 h-9 min-h-[36px] shrink-0 grow-0 basis-9 bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-full inline-flex items-center justify-center text-sm font-extrabold leading-none shadow-[0_8px_20px_rgba(16,185,129,0.24)]">
  {idx + 1}
</span>
                  <div>
                    <p className="text-sm font-bold text-blue-800">{student.name}</p>
                    <p className="text-xs text-blue-600">
                      Age {student.age}
                      {student.subjects?.length ? ` • ${student.subjects.join(", ")}` : ""}
                      {student.classDays?.length ? ` • ${student.classDays.join(", ")}` : ""}
                      {student.classTime ? ` • ${student.classTime}` : ""}
                      {student.country ? ` • ${student.country}` : ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    student.id === "__pending_quran__"
                      ? (
                          setIsFinalQuranSubjectDropdownOpen(false),
                          updateData({
                            pendingQuranName: "",
                            pendingQuranAge: "",
                            pendingQuranTime: "",
                            pendingQuranSubjects: [],
                            pendingQuranCountry: "",
                            pendingQuranDays: [],
                          })
                        )
                      : updateData({
                          upsellQuranStudents: (data.upsellQuranStudents || []).filter((s) => s.id !== student.id),
                        })
                  }
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <InputField
              label="Name"
              value={data.pendingQuranName || ""}
              onChange={(e) => updateData({ pendingQuranName: e.target.value })}
              placeholder="Ahmed"
            />

          </div>

          <div>
            <InputField
              label="Age"
              type="text"
              value={data.pendingQuranAge || ""}
              onChange={(e) => updateData({ pendingQuranAge: cleanAgeInput(e.target.value) })}
              placeholder="10"
            />

          </div>
        </div>

        <div>
          <SelectField
            label="Country"
            value={data.pendingQuranCountry || ""}
            onChange={(e) => updateData({ pendingQuranCountry: e.target.value })}
            options={COUNTRIES}
          />

        </div>

        <p className="final-quran-note">
          <strong>Note:</strong>{" "}
          {data.pendingQuranCountry
            ? `Class timing will be confirmed according to local time in ${data.pendingQuranCountry}.`
            : "Class timing will be confirmed according to your local country time."}
        </p>

        <div>
          <label className="text-sm font-semibold text-brand-darkText block mb-2">
            What does the student want to learn?
          </label>

          <div className="final-quran-multi">
            <button
              type="button"
              onClick={() => setIsFinalQuranSubjectDropdownOpen((prev) => !prev)}
              className={`final-quran-multi-trigger ${isFinalQuranSubjectDropdownOpen ? "active" : ""}`}
            >
              <div className="final-quran-multi-value">
                {(data.pendingQuranSubjects || []).length > 0 ? (
                  (data.pendingQuranSubjects || []).map((subject) => (
                    <span key={subject} className="final-quran-multi-chip">
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="final-quran-multi-placeholder">Select one or more lessons</span>
                )}
              </div>

              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform ${
                  isFinalQuranSubjectDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFinalQuranSubjectDropdownOpen && (
              <div className="final-quran-multi-menu">
                {QURAN_SUBJECT_OPTIONS.map((subject) => {
                  const active = (data.pendingQuranSubjects || []).includes(subject);

                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() =>
                        updateData({
                          pendingQuranSubjects: active
                            ? (data.pendingQuranSubjects || []).filter((x) => x !== subject)
                            : [...(data.pendingQuranSubjects || []), subject],
                        })
                      }
                      className={`final-quran-multi-option ${active ? "active" : ""}`}
                    >
                      <span>{subject}</span>
                      <span className="final-quran-multi-check">{active ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {(data.pendingQuranSubjects || []).length > 0 && (
          <p className="text-xs text-blue-600 font-semibold">
            {(data.pendingQuranSubjects || []).length} lesson
            {(data.pendingQuranSubjects || []).length > 1 ? "s" : ""} selected
          </p>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-brand-darkText">Class Days</label>
            <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-semibold">
              ✓ 24/7 Available
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {DAYS.map((day) => {
              const active = (data.pendingQuranDays || []).includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() =>
                    updateData({
                      pendingQuranDays: active
                        ? (data.pendingQuranDays || []).filter((x) => x !== day)
                        : [...(data.pendingQuranDays || []), day],
                    })
                  }
                  className={`final-quran-day-btn ${active ? "active" : ""}`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>

        </div>

        <div>
          <label className="text-sm font-semibold text-brand-darkText block mb-2">
            Preferred Time
          </label>

          <div className="final-quran-time-wrap">
            <Clock className="w-4 h-4 final-quran-time-icon" />
            <select
              value={data.pendingQuranTime || ""}
              onChange={(e) => updateData({ pendingQuranTime: e.target.value })}
            >
              <option value="">Select time</option>
              {QURAN_CLASS_TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (
              data.pendingQuranName &&
              data.pendingQuranAge &&
              (data.pendingQuranSubjects || []).length > 0 &&
              (data.pendingQuranDays || []).length > 0 &&
              data.pendingQuranTime &&
              data.pendingQuranCountry
            ) {
              updateData({
                upsellQuranStudents: [
                  ...(data.upsellQuranStudents || []),
                  {
                    id: Date.now().toString(),
                    name: data.pendingQuranName,
                    age: data.pendingQuranAge,
                    subjects: data.pendingQuranSubjects || [],
                    classDays: data.pendingQuranDays || [],
                    classTime: data.pendingQuranTime || "Flexible",
                    country: data.pendingQuranCountry || "",
                  },
                ],
                pendingQuranName: "",
                pendingQuranAge: "",
                pendingQuranTime: "",
                pendingQuranSubjects: [],
                pendingQuranCountry: "",
                pendingQuranDays: [],
              });
              setIsFinalQuranSubjectDropdownOpen(false);
            }
          }}
          disabled={
            !data.pendingQuranName ||
            !data.pendingQuranAge ||
            !(data.pendingQuranSubjects || []).length ||
            !(data.pendingQuranDays || []).length ||
            !data.pendingQuranTime ||
            !data.pendingQuranCountry
          }
          className="w-full py-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 font-bold text-sm disabled:opacity-40 hover:bg-blue-500/15 hover:shadow-[0_10px_30px_rgba(16,185,129,0.10)] transition-all"
        >
          + Add to Quran
        </button>


      </div>
    )}
  </div>
  );
};
