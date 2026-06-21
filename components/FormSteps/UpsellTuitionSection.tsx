import React from 'react';
import { FormData, LeadType } from '../../types';
import { InputField, Toggle } from '../UI';
import { GraduationCap } from 'lucide-react';
import { cleanAgeInput } from './formStepStyles';

interface UpsellTuitionSectionProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  primaryName: string;
  primaryAge: string;
  visibleUpsellTuitionStudents: Array<{
    id: string;
    name: string;
    age: string;
    requirements: string;
  }>;
}

export const UpsellTuitionSection = ({
  data,
  updateData,
  primaryName,
  primaryAge,
  visibleUpsellTuitionStudents,
}: UpsellTuitionSectionProps) => {
  if (data.leadType === LeadType.TUITION) return null;

  return (
        <div className="pf-card p-5 sm:p-6 shadow-[0_18px_50px_rgba(139,92,246,0.06)]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="pf-icon" style={{ background: "linear-gradient(135deg,#8b5cf6,#a78bfa)" }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-brand-darkText text-base">1-on-1 Tuition</h4>
                <p className="text-sm text-brand-mediumText">1-day free trial</p>
              </div>
            </div>
            <Toggle
  label="Interested?"
  checked={data.tuitionInterest}
  onChange={(v) =>
    updateData(
      v
        ? {
            tuitionInterest: true,
            pendingTuitionName: data.pendingTuitionName || primaryName,
            pendingTuitionAge: data.pendingTuitionAge || primaryAge,
            pendingTuitionReq: data.pendingTuitionReq || "",
          }
        : {
            tuitionInterest: false,
            pendingTuitionName: "",
            pendingTuitionAge: "",
            pendingTuitionReq: "",
          }
    )
  }
/>
          </div>

          {data.tuitionInterest && (
            <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4 animate-fade-in">
              <div className="rounded-2xl border border-purple-200 bg-purple-50/80 px-4 py-3 shadow-[0_8px_24px_rgba(139,92,246,0.08)]">
                <p className="text-sm font-semibold text-purple-700">
                  Student details are pre-filled from your application. You can edit them below.
                </p>
              </div>

              {visibleUpsellTuitionStudents.length > 0 && (
                <div className="space-y-3">
                  {visibleUpsellTuitionStudents.map((student, idx) => (
                   <div
  key={student.id}
  className="flex flex-col gap-3 p-4 bg-purple-50/80 rounded-2xl border border-purple-200 shadow-[0_10px_30px_rgba(139,92,246,0.06)] sm:flex-row sm:items-center sm:justify-between"
>
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center text-sm font-extrabold shadow-[0_8px_20px_rgba(139,92,246,0.24)]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-purple-800">{student.name}</p>
                          <p className="text-xs text-purple-600">
                            Age {student.age}
                            {student.requirements ? ` • ${student.requirements}` : ""}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          student.id === "__pending_tuition__"
                            ? updateData({
                                pendingTuitionName: "",
                                pendingTuitionAge: "",
                                pendingTuitionReq: "",
                              })
                            : updateData({
                                upsellTuitionStudents: (data.upsellTuitionStudents || []).filter((s) => s.id !== student.id),
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
                    value={data.pendingTuitionName || ""}
                    onChange={(e) => updateData({ pendingTuitionName: e.target.value })}
                    placeholder="Ahmed"
                  />

                </div>

                <div>
                  <InputField
                    label="Age"
                    type="text"
                    value={data.pendingTuitionAge || ""}
                    onChange={(e) => updateData({ pendingTuitionAge: cleanAgeInput(e.target.value) })}
                    placeholder="10"
                  />

                </div>
              </div>

              <div>
                <InputField
                  label="Requirements"
                  value={data.pendingTuitionReq || ""}
                  onChange={(e) => updateData({ pendingTuitionReq: e.target.value })}
                  placeholder="e.g. Math Grade 8, Science support, exam prep..."
                />

              </div>

              <button
                type="button"
                onClick={() => {
                  if (
                    data.pendingTuitionName &&
                    data.pendingTuitionAge &&
                    data.pendingTuitionReq?.trim()
                  ) {
                    updateData({
                      upsellTuitionStudents: [
                        ...(data.upsellTuitionStudents || []),
                        {
                          id: Date.now().toString(),
                          name: data.pendingTuitionName,
                          age: data.pendingTuitionAge,
                          requirements: data.pendingTuitionReq || "",
                        },
                      ],
                      pendingTuitionName: "",
                      pendingTuitionAge: "",
                      pendingTuitionReq: "",
                    });
                  }
                }}
                disabled={
                  !data.pendingTuitionName ||
                  !data.pendingTuitionAge ||
                  !data.pendingTuitionReq?.trim()
                }
                className="w-full py-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-700 font-bold text-sm disabled:opacity-40 hover:bg-purple-500/15 hover:shadow-[0_10px_30px_rgba(139,92,246,0.10)] transition-all"
              >
                + Add to Tuition
              </button>

            </div>
          )}
        </div>
  );
};
