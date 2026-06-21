import React from 'react';
import { FormData, LeadType, Curriculum } from '../../types';
import { GRADES } from '../../constants';
import { InputField, SelectField, Toggle } from '../UI';
import { School } from 'lucide-react';
import { cleanAgeInput } from './formStepStyles';

interface UpsellSchoolSectionProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  primaryName: string;
  primaryAge: string;
  primaryGrade: string;
  primaryCurriculum: Curriculum | null;
  visibleUpsellSchoolStudents: Array<{
    id: string;
    name: string;
    age: string;
    grade: string;
    curriculum: Curriculum | null;
  }>;
}

export const UpsellSchoolSection = ({
  data,
  updateData,
  primaryName,
  primaryAge,
  primaryGrade,
  primaryCurriculum,
  visibleUpsellSchoolStudents,
}: UpsellSchoolSectionProps) => {
  if (data.leadType !== LeadType.TUITION && data.leadType !== LeadType.QURAN) return null;

  return (
    <div className="pf-card p-5 sm:p-6 shadow-[0_18px_50px_rgba(29,111,206,0.06)]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="pf-icon">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-brand-darkText text-base">Full-Time School</h4>
            <p className="text-sm text-brand-mediumText">1-day free trial</p>
          </div>
        </div>
        <Toggle
          label="Interested?"
          checked={data.fullTimeInterest}
          onChange={(v) =>
            updateData(
              v
                ? {
                  fullTimeInterest: true,
                  pendingSchoolName: data.pendingSchoolName || primaryName,
                  pendingSchoolAge: data.pendingSchoolAge || primaryAge,
                  pendingSchoolGrade: data.pendingSchoolGrade || primaryGrade,
                }
                : {
                  fullTimeInterest: false,
                  pendingSchoolName: "",
                  pendingSchoolAge: "",
                  pendingSchoolGrade: "",
                }
            )
          }
        />
      </div>

      {data.fullTimeInterest && (
        <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-3 shadow-[0_8px_24px_rgba(59,130,246,0.08)]">
            <p className="text-sm font-semibold text-blue-700">
              Student details are pre-filled from your application. You can edit them below.
            </p>
          </div>

          {visibleUpsellSchoolStudents.length > 0 && (
            <div className="space-y-3">
              {visibleUpsellSchoolStudents.map((student, idx) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-3 p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-[0_10px_30px_rgba(59,130,246,0.06)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-full flex items-center justify-center text-sm font-extrabold shadow-[0_8px_20px_rgba(59,130,246,0.24)]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-blue-800">{student.name}</p>
                      <p className="text-xs text-blue-600">
                        Age {student.age} • {student.grade}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      student.id === "__pending_school__"
                        ? updateData({
                          pendingSchoolName: "",
                          pendingSchoolAge: "",
                          pendingSchoolGrade: "",
                        })
                        : updateData({
                          upsellSchoolStudents: (data.upsellSchoolStudents || []).filter((s) => s.id !== student.id),
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

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <InputField
                label="Name"
                value={data.pendingSchoolName}
                onChange={(e) => updateData({ pendingSchoolName: e.target.value })}
                placeholder="Ahmed"
              />

            </div>

            <div>
              <InputField
                label="Age"
                type="text"
                value={data.pendingSchoolAge}
                onChange={(e) => updateData({ pendingSchoolAge: cleanAgeInput(e.target.value) })}
                placeholder="10"
              />

            </div>

            <div>
              <SelectField
                label="Grade"
                value={data.pendingSchoolGrade}
                onChange={(e) => updateData({ pendingSchoolGrade: e.target.value })}
                options={GRADES}
              />

            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (data.pendingSchoolName && data.pendingSchoolAge && data.pendingSchoolGrade) {
                updateData({
                  upsellSchoolStudents: [
                    ...(data.upsellSchoolStudents || []),
                    {
                      id: Date.now().toString(),
                      name: data.pendingSchoolName,
                      age: data.pendingSchoolAge,
                      grade: data.pendingSchoolGrade,
                      curriculum: primaryCurriculum,
                    },
                  ],
                  pendingSchoolName: "",
                  pendingSchoolAge: "",
                  pendingSchoolGrade: "",
                });
              }
            }}
            disabled={!data.pendingSchoolName || !data.pendingSchoolAge || !data.pendingSchoolGrade}
            className="w-full py-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 font-bold text-sm disabled:opacity-40 hover:bg-blue-500/15 hover:shadow-[0_10px_30px_rgba(59,130,246,0.10)] transition-all"
          >
            + Add to Full-Time
          </button>


        </div>
      )}
    </div>
  );
};
