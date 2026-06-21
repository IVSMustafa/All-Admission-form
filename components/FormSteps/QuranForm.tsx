import '@fontsource/great-vibes/400.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FormData, LeadType, ProgramType, Curriculum, Track, ClassMode, Student, QuranStudent } from '../../types';
import { GRADES, COUNTRIES, IGCSE_SUBJECTS, TIME_SLOTS, DAYS, QURAN_LEVELS, QURAN_CLASS_TIMES, getGradeValue as getGV } from '../../constants';
import { GlassCard, InputField, SelectField, OptionCard, Toggle, PhoneInput, Button } from '../UI';
import { HeroCard, ProgramCard, TrustStrip, PROGRAM_CARDS_DATA, Navbar } from '../LandingPage';
import {
  School, BookOpen, GraduationCap, CheckCircle, Calendar, AlertTriangle,
  Phone, User, Sparkles, Loader2, UserRound, Clock, ShieldCheck, Globe2, Zap, Star, ChevronDown,
  ArrowLeft, ArrowRight,
} from 'lucide-react';
import { QURAN_SUBJECT_OPTIONS } from '../../src/config/formOptions';
import { 
  usePremiumStyles, useTilt, DRAFT_ID, cleanAgeInput, StepProps, PField 
} from './formStepStyles';

import { Step0_Welcome } from './Step0_Welcome';
import { Step1_Details } from './Step1_Details';
import { TuitionForm } from './TuitionForm';
import { Step2_Program } from './Step2_Program';
import { Step3_Academics } from './Step3_Academics';
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export const QuranForm = ({
  data,
  updateData,
  errors,
  nextStep,
  prevStep,
}: Pick<StepProps, "data" | "updateData" | "errors" | "nextStep" | "prevStep">) => {
  usePremiumStyles();
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const toggleDay = (day: string) => {
    const d = data.quranClassDays || [];
    updateData({
      quranClassDays: d.includes(day) ? d.filter((x) => x !== day) : [...d, day],
    });
  };

  const toggleQuranSubject = (subject: string) => {
    const current = data.quranSubjects || [];
    updateData({
      quranSubjects: current.includes(subject)
        ? current.filter((x) => x !== subject)
        : [...current, subject],
    });
  };

  const addQ = () => {
    if (
      !data.studentName.trim() ||
      !data.age ||
      !(data.quranSubjects || []).length ||
      !(data.quranClassDays || []).length ||
      !data.quranClassTime
    ) {
      return;
    }

    updateData({
      quranStudents: [
        ...(data.quranStudents || []),
        {
          id: Date.now().toString(),
          name: data.studentName.trim(),
          age: data.age,
          subjects: data.quranSubjects,
          classDays: data.quranClassDays,
          classTime: data.quranClassTime,
        },
      ],
      studentName: "",
      age: "",
      quranSubjects: [],
      quranClassDays: [],
      quranClassTime: "",
    });
  };

  const removeQ = (id: string) =>
    updateData({
      quranStudents: (data.quranStudents || []).filter((s) => s.id !== id),
    });

  const editQ = (s: QuranStudent) =>
    updateData({
      quranStudents: (data.quranStudents || []).filter((x) => x.id !== s.id),
      studentName: s.name,
      age: s.age,
      quranSubjects: s.subjects || [],
      quranClassDays: s.classDays,
      quranClassTime: s.classTime,
    });

  const canAdd =
    data.studentName.trim() &&
    data.age &&
    (data.quranSubjects || []).length > 0 &&
    (data.quranClassDays || []).length > 0 &&
    data.quranClassTime;

  return (
    <div className="qf-page transition-all duration-300">
<style>{`
.qf-page {
  position: relative;
  min-height: auto;
  width: 100%;
  overflow-x: clip;
  overflow-y: visible;
}

.qf-shell {
  position: relative;
  width: 100%;
  min-height: auto;
  padding: 24px 16px 8px;
  max-width: 100%;
  box-sizing: border-box;
}
.qf-main {
  position: relative;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

  .qf-head {
    text-align: center;
    margin-bottom: 18px;
  }

  .qf-head p {
    font-size: 13px;
  }

  .qf-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .qf-card-soft {
    box-shadow:
      0 10px 28px rgba(15, 45, 87, 0.06),
      0 2px 8px rgba(15, 45, 87, 0.03);
  }

.qf-subject-btn {
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(201,225,255,0.86);
  background: rgba(255,255,255,0.95);
  color: #0f2d57;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  transition: all 0.18s ease;
}
.qf-subject-btn:hover {
  border-color: rgba(29,111,206,0.34);
  transform: translateY(-1px);
}

.qf-subject-btn.active {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  border-color: transparent;
  color: white;
  box-shadow: 0 10px 22px rgba(29,111,206,0.18);
}

.qf-day-btn {
  padding: 9px 10px;
  border-radius: 12px;
  border: 1px solid rgba(15, 45, 87, 0.1);
  background: rgba(255, 255, 255, 0.95);
  color: rgba(15, 45, 87, 0.7);
  font-size: 11px;
  font-weight: 800;
  transition: all 0.18s ease;
}
.qf-day-btn:hover {
  border-color: rgba(29,111,206,0.34);
  transform: translateY(-1px);
}

.qf-day-btn.active {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9) !important;
  color: white !important;
  border-color: transparent !important;
  box-shadow:
    0 12px 24px rgba(29,111,206,0.20),
    0 6px 12px rgba(15,45,87,0.06) !important;
}

  .qf-time-wrap {
    position: relative;
  }

.qf-time-wrap select {
  width: 100%;
  padding: 13px 14px 13px 42px;
  border-radius: 14px;
  border: 1px solid rgba(201,225,255,0.86);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  );
  color: #0f2d57;
  font-weight: 600;
  outline: none;
  appearance: none;
  transition: all 0.18s ease;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.94),
    inset 0 -10px 22px rgba(255,255,255,0.08),
    0 16px 30px rgba(15,45,87,0.12),
    0 5px 12px rgba(15,45,87,0.06);
}

.qf-time-wrap select:focus {
  border-color: rgba(29,111,206,0.46);
  box-shadow: 0 0 0 3px rgba(29,111,206,0.10);
}

  .qf-time-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(15, 45, 87, 0.55);
    pointer-events: none;
  }

.qf-note {
  font-size: 12px;
  color: #8a6a16;
  background: #fff8e8;
  border: 1px solid #f3d98a;
  border-radius: 12px;
  padding: 10px 12px;
}

  .qf-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #dc2626;
    margin-top: 4px;
    font-weight: 600;
  }

.qf-add-btn {
  width: 100%;
  border-radius: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(29,111,206,0.26);
  background: rgba(29,111,206,0.08);
  color: #1d6fce;
  font-weight: 800;
  transition: all 0.18s ease;
}

.qf-add-btn:hover:not(:disabled) {
  background: rgba(29,111,206,0.12);
  transform: translateY(-1px);
}


  .qf-add-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }



  @media (max-width: 1024px) {
    .qf-page {
      background-position: center center;
      background-size: cover;
    }

    .qf-shell {
      padding: 18px 14px 24px;
      min-height: auto;
    }

    .qf-main {
      max-width: 720px;
      margin: 0 auto;
    }
  }

@media (max-width: 640px) {
  .qf-shell {
    padding: 12px 12px 20px;
  }
}

  @keyframes ivsVoucherFlyToCoupon {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateZ(0deg);
  }
  35% {
    opacity: 1;
    transform: translate3d(0, -18px, 0) scale(0.96) rotateZ(-2deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(-280px, 320px, 0) scale(0.26) rotateZ(-12deg);
  }
}

@keyframes ivsCouponStickyPop {
  0% {
    opacity: 0;
    transform: scale(0.82) rotate(-2deg);
  }
  55% {
    opacity: 1;
    transform: scale(1.05) rotate(1deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.ivs-voucher-fly-away {
  animation: ivsVoucherFlyToCoupon 0.82s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.ivs-coupon-sticky-pop {
  animation: ivsCouponStickyPop 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}



  .qf-multi {
    position: relative;
  }

.qf-multi-trigger {
  width: 100%;
  min-height: 58px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(201,225,255,0.86);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.94),
    inset 0 -10px 22px rgba(255,255,255,0.08),
    0 16px 30px rgba(15,45,87,0.12),
    0 5px 12px rgba(15,45,87,0.06);
}

.qf-multi-trigger:hover {
  border-color: rgba(29,111,206,0.34);
}

.qf-multi-trigger.active {
  border-color: rgba(29,111,206,0.46);
  box-shadow: 0 0 0 3px rgba(29,111,206,0.08);
}

  .qf-multi-value {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
  }

  .qf-multi-placeholder {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 600;
  }

.qf-multi-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  border: 1px solid transparent;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(29,111,206,0.18);
}

  .qf-multi-menu {
    margin-top: 10px;
    padding: 10px;
    border-radius: 16px;
    border: 1px solid rgba(15, 45, 87, 0.10);
    background: rgba(255, 255, 255, 0.98);
    box-shadow:
      0 16px 36px rgba(15, 45, 87, 0.08),
      0 4px 12px rgba(15, 45, 87, 0.04);
    display: grid;
    gap: 8px;
    max-height: 280px;
    overflow-y: auto;
  }

.qf-multi-option {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.84);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  );
  color: #0f2d57;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  transition: all 0.18s ease;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.94),
    inset 0 -10px 20px rgba(255,255,255,0.06),
    0 12px 26px rgba(15,45,87,0.08),
    0 4px 10px rgba(15,45,87,0.04);
}
.qf-multi-option:hover {
  border-color: rgba(29,111,206,0.34);
  transform: translateY(-1px);
}

.qf-multi-option.active {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  color: white;
  border-color: transparent;
  box-shadow: 0 10px 22px rgba(29,111,206,0.18);
}

  .qf-multi-check {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    border: 2px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 900;
    flex-shrink: 0;
  }
`}</style>

      <div className="qf-shell">


        <div className="qf-main">
          <div className="qf-head pf-e1">
            <h2 className="pf-heading text-3xl font-display font-extrabold">
              Quran Classes Registration
            </h2>
            <p className="text-brand-mediumText mt-1">
              Available 24/7 for your convenience
            </p>
          </div>

          <div className="qf-stack">
            <div className="pf-card qf-card-soft p-5 pf-e2">
              <h3 className="pf-section-label">
                <UserRound className="w-3 h-3" />
                Parent Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <InputField
                  label="Parent Name"
                  value={data.parentName}
                  onChange={(e) => updateData({ parentName: e.target.value })}
                  placeholder="e.g. Mr. Khan"
                  required
                  error={errors.parentName}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData({ email: e.target.value })}
                  placeholder="e.g. parent@email.com"
                  required
                  error={errors.email}
                />
                <div className="sm:col-span-2">
                  <PhoneInput
                    label="WhatsApp Number"
                    country={data.quranStudentCountry || "Other"}
                    phone={data.whatsapp}
                    onPhoneChange={(p) => updateData({ whatsapp: p })}
                    onCountryChange={(c) => updateData({ quranStudentCountry: c })}
                    required
                    error={errors.whatsapp}
                  />
                </div>
              </div>
            </div>

            <div className="pf-card qf-card-soft p-5 pf-e3">
              <h3 className="pf-section-label">
                <Globe2 className="w-3 h-3" />
                Location
              </h3>

              <div className="mt-3 space-y-3">
                <SelectField
                  label="Country You Live In"
                  value={data.quranStudentCountry}
                  onChange={(e) => updateData({ quranStudentCountry: e.target.value })}
                  options={COUNTRIES}
                  required
                  error={errors.quranStudentCountry}
                />
                <p className="qf-note">
                  <strong>Note:</strong> We confirm timing based on your local time.
                </p>
              </div>
            </div>

            {(data.quranStudents || []).length > 0 && (
              <div className="pf-card qf-card-soft p-5 pf-e4">
                <h3 className="pf-section-label">
                  <CheckCircle className="w-3 h-3" />
                  Enrolled ({data.quranStudents.length})
                </h3>

                <div className="space-y-2.5 mt-3">
                  {data.quranStudents.map((s, i) => (
                    <div key={s.id} className="pf-student-row flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                      <div className="pf-badge">{i + 1}</div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0f2d57] text-sm truncate">{s.name}</p>
                        <p className="text-xs text-brand-mediumText">
                          Age {s.age} · {(s.subjects || []).join(", ")} ·{" "}
                          {s.classDays.map((d) => d.slice(0, 3)).join(", ")} · {s.classTime}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => editQ(s)}
                          className="px-3 py-1 rounded-full text-xs font-bold text-[#1d6fce]"
                          style={{
                            background: "rgba(29,111,206,0.08)",
                            border: "1.5px solid rgba(29,111,206,0.18)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeQ(s.id)}
                          className="px-3 py-1 rounded-full text-xs font-bold text-red-600"
                          style={{
                            background: "rgba(239,68,68,0.07)",
                            border: "1.5px solid rgba(239,68,68,0.18)",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pf-card qf-card-soft p-5 pf-e5" style={{ borderColor: "rgba(245,158,11,0.14)" }}>
              <h3 className="pf-section-label">
                <User className="w-3 h-3" />
                {(data.quranStudents || []).length > 0 ? "Add Another Student" : "Add Student"}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <InputField
                  label="Student Name"
                  value={data.studentName}
                  onChange={(e) => updateData({ studentName: e.target.value })}
                  placeholder="e.g. Ahmed Khan"
                  required
                />
               <InputField
  label="Age"
  type="text"
  value={data.age}
  onChange={(e) => updateData({ age: cleanAgeInput(e.target.value) })}
  placeholder="e.g. 10"
  required
/>
              </div>

<div className="mt-4 space-y-3">
  <label className="text-sm font-semibold text-brand-darkText block">
    What does the student want to learn? <span className="text-red-500">*</span>
  </label>

  <div className="qf-multi">
    <button
      type="button"
      onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
      className={`qf-multi-trigger ${isSubjectDropdownOpen ? "active" : ""}`}
    >
      <div className="qf-multi-value">
        {(data.quranSubjects || []).length > 0 ? (
          (data.quranSubjects || []).map((subject) => (
            <span key={subject} className="qf-multi-chip">
              {subject}
            </span>
          ))
        ) : (
          <span className="qf-multi-placeholder">Select one or more lessons</span>
        )}
      </div>

      <ChevronDown
        className={`w-5 h-5 shrink-0 transition-transform ${isSubjectDropdownOpen ? "rotate-180" : ""}`}
      />
    </button>

    {isSubjectDropdownOpen && (
      <div className="qf-multi-menu">
        {QURAN_SUBJECT_OPTIONS.map((subject) => {
          const active = (data.quranSubjects || []).includes(subject);
          return (
            <button
              key={subject}
              type="button"
              onClick={() => toggleQuranSubject(subject)}
              className={`qf-multi-option ${active ? "active" : ""}`}
            >
              <span>{subject}</span>
              <span className="qf-multi-check">{active ? "✓" : ""}</span>
            </button>
          );
        })}
      </div>
    )}
  </div>

  {(data.quranSubjects || []).length > 0 && (
    <p className="text-xs text-blue-600 font-semibold">
      {(data.quranSubjects || []).length} lesson{(data.quranSubjects || []).length > 1 ? "s" : ""} selected
    </p>
  )}

  {errors.quranSubjects && (
    <p className="qf-error">
      <AlertTriangle className="w-4 h-4" />
      {errors.quranSubjects}
    </p>
  )}
</div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-brand-darkText">
                    Class Days <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-semibold">
                    ✓ 24/7 Available
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`qf-day-btn ${(data.quranClassDays || []).includes(day) ? "active" : ""}`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-brand-darkText block mb-2">
                  Preferred Time <span className="text-red-500">*</span>
                </label>

                <div className="qf-time-wrap">
                  <Clock className="w-4 h-4 qf-time-icon" />
                  <select
                    value={data.quranClassTime}
                    onChange={(e) => updateData({ quranClassTime: e.target.value })}
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

              <button onClick={addQ} disabled={!canAdd} className="qf-add-btn mt-4">
                + Add Student
              </button>
            </div>

            {errors.quranStudents && (
              <p className="qf-error justify-center">
                <AlertTriangle className="w-4 h-4" />
                {errors.quranStudents}
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-brand-burgundy/20 pt-6">
            <div className="flex items-center justify-between gap-3">
<Button
  onClick={prevStep}
  variant="secondary"
  className="glass-action-btn"
>
  <ArrowLeft className="w-4 h-4" /> Back
</Button>

<Button
  onClick={nextStep}
  variant="primary"
  className="glass-action-btn glass-action-btn-primary"
>
  Next Step <ArrowRight className="w-4 h-4" />
</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
