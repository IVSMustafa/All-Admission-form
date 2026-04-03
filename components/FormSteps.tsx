/**
 * FormSteps.tsx — Premium Redesign
 */
import '@fontsource/great-vibes';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FormData, LeadType, ProgramType, Curriculum, Track, ClassMode, Student, QuranStudent } from '../types';
import { GRADES, COUNTRIES, IGCSE_SUBJECTS, TIME_SLOTS, DAYS, QURAN_LEVELS, QURAN_CLASS_TIMES, getGradeValue as getGV } from '../constants';
import { GlassCard, InputField, SelectField, OptionCard, Toggle, PhoneInput, Button } from './UI';
import { HeroCard, ProgramCard, TrustStrip, PROGRAM_CARDS_DATA, Navbar } from './LandingPage';

import {
  School, BookOpen, GraduationCap, CheckCircle, Calendar, AlertTriangle,
  Phone, User, Sparkles, Loader2, UserRound, Clock, ShieldCheck, Globe2, Zap, Star, ChevronDown,
  ArrowLeft, ArrowRight,
} from 'lucide-react';

const PREMIUM_CSS = `
@keyframes pf-slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pf-pop-in {
  0%   { opacity: 0; transform: scale(0.75); }
  65%  { transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes pf-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes pf-badge-enter {
  0%   { opacity: 0; transform: scale(0.6) rotate(-10deg); }
  60%  { transform: scale(1.1) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes pf-ready-slide {
  from { opacity: 0; transform: scaleX(0.92) translateY(6px); }
  to   { opacity: 1; transform: scaleX(1) translateY(0); }
}

@keyframes pf-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes pf-shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}

@keyframes pf-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.pf-e1 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0s both;
}

.pf-e2 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s both;
}

.pf-e3 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both;
}

.pf-e4 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.24s both;
}

.pf-e5 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.32s both;
}

.pf-card {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.96);
  border: 1.5px solid rgba(29,111,206,0.10);
  border-radius: 24px;
  box-shadow: 0 2px 16px rgba(15,45,87,0.06), 0 1px 3px rgba(0,0,0,0.03);
  transition:
    box-shadow 0.25s ease,
    transform 0.25s cubic-bezier(0.22,1,0.36,1);
}

.pf-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent);
}

.pf-card:hover {
  box-shadow: 0 8px 32px rgba(29,111,206,0.10), 0 2px 8px rgba(0,0,0,0.04);
  transform: translateY(-1px);
}

.pf-section-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 4px 14px;
  background: rgba(29,111,206,0.07);
  border: 1px solid rgba(29,111,206,0.15);
  border-radius: 99px;
  color: #1d6fce;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.10em;
  text-transform: uppercase;
}

.pf-heading {
  background: linear-gradient(135deg, #0f2d57 0%, #1d6fce 50%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pf-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(29,111,206,0.25);
  animation: pf-float 4s ease-in-out infinite;
}

.pf-icon-gold {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 6px 18px rgba(245,158,11,0.25);
}

.pf-icon-green {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 6px 18px rgba(16,185,129,0.25);
}

.pf-badge {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(29,111,206,0.30);
  color: white;
  font-size: 15px;
  font-weight: 900;
}

.pf-student-row {
  background: rgba(248,251,255,0.9);
  border: 1.5px solid rgba(29,111,206,0.09);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.pf-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pf-label {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 2px;
  color: rgba(15,45,87,0.55);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pf-input-wrap {
  background: rgba(255,255,255,0.78);
  border: 1.5px solid rgba(15,45,87,0.10);
  border-radius: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.pf-input-wrap:focus-within {
  background: #ffffff;
  border-color: rgba(29,111,206,0.45);
  box-shadow: 0 0 0 2px rgba(29,111,206,0.18);
}

.pf-input-wrap input,
.pf-input-wrap select {
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: none;
  border-radius: 14px;
  outline: none;
  color: #0f2d57;
  font-size: 14px;
  font-weight: 600;
}

.pf-input-wrap input:focus,
.pf-input-wrap select:focus {
  outline: none;
  box-shadow: none;
}

.pf-input-wrap select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 42px;
  background-image: none !important;
}

.pf-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(29,111,206,0.08);
  border: 1px solid rgba(29,111,206,0.18);
  border-radius: 20px;
  color: #1d6fce;
  font-size: 11px;
  font-weight: 700;
}

.pf-ready {
  background: linear-gradient(135deg, rgba(16,185,129,0.07), rgba(5,150,105,0.04));
  border: 1.5px solid rgba(16,185,129,0.25);
  border-radius: 16px;
}

.pf-btn-outline {
  background: rgba(29,111,206,0.04);
  border: 2px solid rgba(29,111,206,0.22);
  border-radius: 16px;
  color: #1d6fce;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.18s ease;
}

.pf-btn-outline:hover {
  background: rgba(29,111,206,0.09);
  border-color: rgba(29,111,206,0.40);
}

.pf-curriculum-btn {
  padding: 14px;
  background: white;
  border: 2px solid rgba(15,45,87,0.09);
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.pf-curriculum-btn:hover {
  border-color: rgba(29,111,206,0.30);
}

.pf-curriculum-btn.active {
  background: rgba(240,247,255,0.95);
  border-color: rgba(29,111,206,0.40);
}

.pf-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  background: rgba(29,111,206,0.07);
  border: 1px solid rgba(29,111,206,0.14);
  border-radius: 99px;
  color: #1d6fce;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.pf-step-dot {
  width: 6px;
  height: 6px;
  background: #1d6fce;
  border-radius: 50%;
}

@media (max-width: 640px) {
  .pf-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }

  .pf-card {
    border-radius: 20px;
  }

  .pf-badge {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }
}
`;

function usePremiumStyles() {
  useEffect(() => {
    const id = 'pf-premium-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = PREMIUM_CSS;
      document.head.appendChild(el);
    }
  }, []);
}

function useTilt(intensity = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * intensity;
    const y = -((e.clientY - r.top) / r.height - 0.5) * intensity;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
    el.style.transition = 'transform 0.1s ease';
  }, [intensity]);
  const onMouseLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    el.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

const DRAFT_ID = '__draft__';

const QURAN_SUBJECT_OPTIONS = [
  'Qaida Noraniyya',
  "Nazira Qur'an",
  "Hifz Ul Qur'an (Memorization)",
  'Tajweed',
  'Islamic Studies',
  'Hadith',
];
const cleanAgeInput = (value: string) => value.replace(/[^\d]/g, "");
interface StepProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

function PField({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="pf-field">
      <label className="pf-label">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export function Step0_Welcome({ data, updateData, nextStep }: StepProps) {
  usePremiumStyles();

  const [quickGrade, setQuickGrade] = useState(data.grade || '');
  const [quickCurriculum, setQuickCurriculum] = useState('');
  const [quickCountry, setQuickCountry] = useState(data.country || '');
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const el = cardsRef.current;
  if (!el) return;

  const obs = new IntersectionObserver(
    ([entry]) => {
      setCardsVisible(entry.isIntersecting);
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  obs.observe(el);
  return () => obs.disconnect();
}, []);

  const goByLead = (lead: LeadType) => {
    if (lead === LeadType.FULL_TIME) {
      updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME });
    } else if (lead === LeadType.TUITION) {
      updateData({ leadType: LeadType.TUITION, programType: ProgramType.TUITION });
    } else if (lead === LeadType.ONE_ON_ONE_SCHOOLING) {
      updateData({ leadType: LeadType.ONE_ON_ONE_SCHOOLING, programType: ProgramType.ONE_ON_ONE_SCHOOLING });
    } else if (lead === LeadType.QURAN) {
      updateData({ leadType: LeadType.QURAN });
    } else {
      updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME });
    }
    nextStep();
  };

  return (
    <div className="transition-all duration-300 overflow-x-clip">
      <style>{`
        .ivs-program-section {
          position: relative;
          overflow: visible;
        }

 .ivs-program-card-wrap {
  opacity: 0;
  transform: translateY(80px) scale(0.985);
  transition:
    opacity 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.82s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.ivs-program-card-wrap.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

        @media (prefers-reduced-motion: reduce) {
          .ivs-program-card-wrap,
          .ivs-program-card-wrap.is-visible {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Navbar
        onNavigate={(s) => {
          if (s === 'school-trial') goByLead(LeadType.FULL_TIME);
          if (s === 'tuition-trial') goByLead(LeadType.TUITION);
          if (s === 'quran-trial') goByLead(LeadType.QURAN);
        }}
      />

      <div className="px-6 md:px-12 py-8 space-y-10">
        <HeroCard
          grade={quickGrade}
          curriculum={quickCurriculum}
          country={quickCountry}
          onStartTrial={() => {
            updateData({
              leadType: LeadType.FULL_TIME,
              programType: ProgramType.FULL_TIME,
              grade: quickGrade,
              country: quickCountry,
            });
            nextStep();
          }}
          onBookConsultation={() => {
            updateData({
              leadType: LeadType.TUITION,
              programType: ProgramType.TUITION,
            });
            nextStep();
          }}
          onQuickSelect={(field, value) => {
            if (field === 'grade') {
              setQuickGrade(value);
              updateData({ grade: value });
            }
            if (field === 'curriculum') {
              setQuickCurriculum(value);
            }
            if (field === 'country') {
              setQuickCountry(value);
              updateData({ country: value });
            }
          }}
        />

        <div ref={cardsRef} className="ivs-program-section">
          <section id="program-cards" className="program-grid">
            {PROGRAM_CARDS_DATA.map((cd: any, index: number) => (
              <div
                key={String(cd.id)}
                className={`ivs-program-card-wrap ${cardsVisible ? 'is-visible' : ''}`}
                style={{
                  transitionDelay: cardsVisible ? `${index * 120}ms` : '0ms',
                }}
              >
                <ProgramCard
                  {...cd}
                  onSelect={(id: LeadType) => goByLead(id)}
                />
              </div>
            ))}
          </section>
        </div>

        <TrustStrip />
      </div>
    </div>
  );
}

export const Step1_Details = ({ data, updateData, nextStep, prevStep, errors }: StepProps) => {
  usePremiumStyles();

  const currentName = data.studentName;
  const currentAge = data.age;
  const currentGrade = data.grade;
  const currentCurriculum = data.curriculum;

  const setCurrentName = (v: string) => updateData({ studentName: v });
  const setCurrentAge = (v: string) => updateData({ age: v });
  const setCurrentGrade = (v: string) => updateData({ grade: v });
  const setCurrentCurriculum = (v: Curriculum | null) => updateData({ curriculum: v });

  const AGE_TO_GRADE: Record<number, string> = {
    3: 'FS1 (Playgroup)',
    4: 'FS2',
    5: 'FS3',
    6: 'Grade 1',
    7: 'Grade 2',
    8: 'Grade 3',
    9: 'Grade 4',
    10: 'Grade 5',
    11: 'Grade 6',
    12: 'Grade 7',
    13: 'Grade 8',
    14: 'Grade 9',
    15: 'Grade 10',
    16: 'Grade 11',
    17: 'Grade 12',
  };

   const ageNum = parseInt(currentAge, 10) || 0;
  const recommendedGrade = ageNum >= 3 && ageNum <= 17 ? AGE_TO_GRADE[ageNum] || '' : '';
  
  const gradeVal = getGV(currentGrade);
  const showCurriculum = gradeVal >= 10;


  const pendingIsValid =
    currentName.trim().length > 0 &&
    currentAge.length > 0 &&
    currentGrade.length > 0 &&
    (!showCurriculum || !!currentCurriculum);
  useEffect(() => {
    if (pendingIsValid) {
      const draft: Student = {
        id: DRAFT_ID,
        name: currentName.trim(),
        age: currentAge,
        grade: currentGrade,
        curriculum: showCurriculum ? currentCurriculum : null
      };
      updateData({ students: [...data.students.filter(s => s.id !== DRAFT_ID), draft] });
    } else if (data.students.some(s => s.id === DRAFT_ID)) {
      updateData({ students: data.students.filter(s => s.id !== DRAFT_ID) });
    }
  }, [currentName, currentAge, currentGrade, currentCurriculum, pendingIsValid]);

  const addStudent = () => {
    if (!pendingIsValid) return;
    updateData({
      students: [
        ...data.students.filter(s => s.id !== DRAFT_ID),
        {
          id: Date.now().toString(),
          name: currentName.trim(),
          age: currentAge,
          grade: currentGrade,
          curriculum: showCurriculum ? currentCurriculum : null
        }
      ],
      studentName: '',
      age: '',
      grade: '',
      curriculum: null,
    });
  };

  const removeStudent = (id: string) => updateData({ students: data.students.filter(s => s.id !== id) });
  const editStudent = (s: Student) => updateData({
    students: data.students.filter(x => x.id !== s.id),
    studentName: s.name,
    age: s.age,
    grade: s.grade,
    curriculum: s.curriculum
  });
  const realStudents = data.students.filter(s => s.id !== DRAFT_ID);

  const parentTilt = useTilt(4);
  const addTilt = useTilt(3);



if (data.leadType === LeadType.QURAN) return <QuranForm data={data} updateData={updateData} errors={errors} nextStep={nextStep} prevStep={prevStep} />;
if (data.leadType === LeadType.TUITION) return <TuitionForm data={data} updateData={updateData} errors={errors} />;


return (
  <div className="relative">

    <div className="relative z-10 space-y-8 sm:space-y-10">
        <div className="text-center pf-e1 pt-2 xl:pt-4">
          {data.leadType !== LeadType.ONE_ON_ONE_SCHOOLING && (
            <div className="pf-step-pill mx-auto w-fit mb-5">
              <span className="pf-step-dot" />
              Step 2 · Student Details
            </div>
          )}

          <h2 className="pf-heading text-3xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight mb-3">
            {data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? 'One-to-One Schooling' : 'Student Information'}
          </h2>

          <p className="text-sm text-brand-mediumText max-w-sm mx-auto">
            Add each student who will be enrolling.
          </p>
        </div>

        <div className="pf-e2">
          <div
            ref={parentTilt.ref}
            onMouseMove={parentTilt.onMouseMove}
            onMouseLeave={parentTilt.onMouseLeave}
            className="pf-card p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="pf-icon">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#0f2d57] tracking-tight">Parent / Guardian Details</h3>
                <p className="text-xs text-brand-mediumText mt-0.5">For timings & WhatsApp contact</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InputField
                label="Parent Name"
                value={data.parentName}
                onChange={e => updateData({ parentName: e.target.value })}
                placeholder="e.g. Mr. Khan"
                required
                error={errors.parentName}
              />
              <InputField
                label="Email Address"
                type="email"
                value={data.email}
                onChange={e => updateData({ email: e.target.value })}
                placeholder="e.g. parent@email.com"
                required
                error={errors.email}
              />
              <div className="sm:col-span-2">
                <PhoneInput
                  label="WhatsApp Number"
                  country={data.country || ''}
                  phone={data.whatsapp}
                  onPhoneChange={p => updateData({ whatsapp: p })}
                  onCountryChange={c => updateData({ country: c })}
                  required
                  error={errors.whatsapp}
                />
              </div>
              {data.country === 'Other' && (
                <div className="sm:col-span-2">
                  <InputField
                    label="Country Name"
                    value={data.otherCountryName}
                    onChange={e => updateData({ otherCountryName: e.target.value })}
                    placeholder="e.g. Denmark"
                    required
                    error={errors.otherCountryName}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {realStudents.length > 0 && (
          <div className="pf-e3">
            <div className="pf-card pf-card-green p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="pf-icon pf-icon-green">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0f2d57]">Added Students</h3>
                    <p className="text-xs text-brand-mediumText mt-0.5">
                      {realStudents.length} student{realStudents.length > 1 ? 's' : ''} ready to enrol
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                >
                  {realStudents.length}
                </div>
              </div>

              <div className="space-y-2.5">
                {realStudents.map((student, idx) => (
                  <div key={student.id} className="pf-student-row flex items-center gap-3 p-3 sm:p-4">
                    <div className="pf-badge">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-[#0f2d57] text-sm truncate">{student.name}</p>
                      <p className="text-xs text-brand-mediumText mt-0.5 truncate">
                        Age {student.age} · {student.grade}
                        {student.curriculum ? ` · ${student.curriculum}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => editStudent(student)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-[#1d6fce] transition-all"
                        style={{ background: 'rgba(29,111,206,0.08)', border: '1.5px solid rgba(29,111,206,0.18)' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 transition-all"
                        style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.18)' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pf-e4">
          <div
            ref={addTilt.ref}
            onMouseMove={addTilt.onMouseMove}
            onMouseLeave={addTilt.onMouseLeave}
            className="pf-card p-5 sm:p-6"
            style={{ borderColor: 'rgba(245,158,11,0.14)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="pf-icon pf-icon-gold">
                <span className="text-white text-xl">✏️</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#0f2d57] tracking-tight">
                  {realStudents.length > 0 ? 'Add Another Student' : 'Add Student'}
                </h3>
                <p className="text-xs text-brand-mediumText mt-0.5">
                  {realStudents.length > 0 ? 'Fill in details to enrol another student.' : 'Age helps suggest a grade for you'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PField label="Student Name" icon={User}>
                <div className="pf-input-wrap">
                  <input
                    type="text"
                    value={currentName}
                    onChange={e => setCurrentName(e.target.value)}
                    placeholder="e.g. Ahmed Khan"
                  />
                </div>
              </PField>

<PField label="Age" icon={Zap}>
  <div className="pf-input-wrap">
    <input
      type="text"
      inputMode="numeric"
      value={currentAge}
      onChange={e => setCurrentAge(cleanAgeInput(e.target.value))}
      placeholder="e.g. 10"
    />
  </div>
 {ageNum >= 3 && ageNum <= 17 && recommendedGrade && !currentGrade && (
  <div className="pf-chip">
    <Zap className="w-3 h-3" />
    Suggested: {recommendedGrade}
  </div>
)}
</PField>

              <PField label="Grade" icon={GraduationCap}>
                <div className="pf-input-wrap relative">
                  <select value={currentGrade} onChange={e => setCurrentGrade(e.target.value)}>
                    <option value="">Select Grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </PField>
            </div>



            {showCurriculum && (
              <div className="mt-5 pt-5 border-t border-black/8">
                <div className="pf-section-label">
                  <BookOpen className="w-3 h-3" />
                  Select Curriculum <span className="text-red-500 normal-case">*</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  {([
                    { value: Curriculum.FEDERAL, label: 'Federal Board', desc: 'Matric / FSc', emoji: '🏛️' },
                    { value: Curriculum.IGCSE_O_LEVEL, label: 'IGCSE / O-Level', desc: 'Cambridge', emoji: '🌍' },
                    { value: Curriculum.A_LEVEL, label: 'A-Level', desc: 'Advanced', emoji: '🎓' },
                  ] as const).map(({ value, label, desc, emoji }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCurrentCurriculum(value as Curriculum)}
                      className={`pf-curriculum-btn ${currentCurriculum === value ? 'active' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{emoji}</span>
                        <p className="font-extrabold text-sm text-[#0f2d57]">{label}</p>
                        {currentCurriculum === value && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-[#1d6fce] flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-brand-mediumText pl-7">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pendingIsValid && (
              <div className="pf-ready mt-4 px-4 py-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-emerald-700 truncate">
                    <span className="text-emerald-800">{currentName}</span> is ready to enrol!
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5 truncate">
                    Age {currentAge} · {currentGrade}
                    {showCurriculum && currentCurriculum ? ` · ${currentCurriculum}` : ''} — you can go to Next Step ✓
                  </p>
                </div>
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
              </div>
            )}

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={addStudent}
                disabled={!pendingIsValid}
                className="pf-btn-outline w-full py-3.5 text-sm tracking-wide"
              >
                + Add Another Student
              </button>
              {errors.students && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 font-semibold">{errors.students}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
);
};

const QuranForm = ({
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
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  overflow: hidden;
}

.qf-shell {
  position: relative;
  width: 100%;
  min-height: auto;
  padding: 24px 24px 8px;
}

  .qf-main {
    position: relative;
    max-width: 640px;
    margin-left: auto;
    margin-right: 260px;
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
    border: 1px solid rgba(15, 45, 87, 0.1);
    background: rgba(255, 255, 255, 0.95);
    color: #0f2d57;
    font-size: 13px;
    font-weight: 700;
    text-align: left;
    transition: all 0.18s ease;
  }

  .qf-subject-btn:hover {
    border-color: rgba(16, 185, 129, 0.32);
    transform: translateY(-1px);
  }

  .qf-subject-btn.active {
    background: linear-gradient(135deg, #10b981, #059669);
    border-color: transparent;
    color: white;
    box-shadow: 0 10px 22px rgba(16, 185, 129, 0.18);
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
    border-color: rgba(16, 185, 129, 0.32);
    transform: translateY(-1px);
  }

  .qf-day-btn.active {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border-color: transparent;
    box-shadow: 0 8px 18px rgba(16, 185, 129, 0.18);
  }

  .qf-time-wrap {
    position: relative;
  }

  .qf-time-wrap select {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border-radius: 14px;
    border: 1px solid rgba(15, 45, 87, 0.1);
    background: rgba(255, 255, 255, 0.96);
    color: #0f2d57;
    font-weight: 600;
    outline: none;
    appearance: none;
    transition: all 0.18s ease;
  }

  .qf-time-wrap select:focus {
    border-color: rgba(16, 185, 129, 0.45);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
    color: #7c6a31;
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
    border: 1px solid rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.08);
    color: #059669;
    font-weight: 800;
    transition: all 0.18s ease;
  }

  .qf-add-btn:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.12);
    transform: translateY(-1px);
  }

  .qf-add-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 1400px) {
    .qf-main {
      margin-right: 180px;
    }
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
      padding: 12px 10px 20px;
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
    border: 1px solid rgba(15, 45, 87, 0.12);
    background: rgba(255, 255, 255, 0.96);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: left;
  }

  .qf-multi-trigger:hover {
    border-color: rgba(16, 185, 129, 0.32);
  }

  .qf-multi-trigger.active {
    border-color: rgba(16, 185, 129, 0.45);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
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
    background: rgba(16, 185, 129, 0.10);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #059669;
    font-size: 12px;
    font-weight: 700;
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
    border: 1px solid rgba(15, 45, 87, 0.10);
    background: rgba(255, 255, 255, 0.98);
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
  }

  .qf-multi-option:hover {
    border-color: rgba(16, 185, 129, 0.32);
    transform: translateY(-1px);
  }

  .qf-multi-option.active {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border-color: transparent;
    box-shadow: 0 10px 22px rgba(16, 185, 129, 0.18);
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
                    country={data.country || "Other"}
                    phone={data.whatsapp}
                    onPhoneChange={(p) => updateData({ whatsapp: p })}
                    onCountryChange={(c) => updateData({ country: c })}
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
                    <div key={s.id} className="pf-student-row flex items-center gap-3 p-3">
                      <div className="pf-badge">{i + 1}</div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0f2d57] text-sm truncate">{s.name}</p>
                        <p className="text-xs text-brand-mediumText">
                          Age {s.age} · {(s.subjects || []).join(", ")} ·{" "}
                          {s.classDays.map((d) => d.slice(0, 3)).join(", ")} · {s.classTime}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
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
    <p className="text-xs text-emerald-600 font-semibold">
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
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                    ✓ 24/7 Available
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
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
              <Button onClick={prevStep} variant="secondary">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              <Button onClick={nextStep} variant="primary">
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TuitionForm = ({ data, updateData, errors }: Pick<StepProps,'data'|'updateData'|'errors'>) => {
  usePremiumStyles();
  return (
    <div className="space-y-5 pt-8 xl:pt-12 transition-all duration-300">
      <div className="text-center pf-e1">
        <h2 className="pf-heading text-3xl font-display font-extrabold">One-to-One Tuition</h2>
        <p className="text-brand-mediumText text-sm mt-1">Our advisor will contact you shortly</p>
      </div>

      <div className="pf-card p-5 pf-e2">
        <h3 className="pf-section-label"><UserRound className="w-3 h-3"/>Parent Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <InputField label="Parent Name" value={data.parentName} onChange={e => updateData({ parentName: e.target.value })} placeholder="e.g. Mr. Khan" required error={errors.parentName} />
          <InputField label="Email Address" type="email" value={data.email} onChange={e => updateData({ email: e.target.value })} placeholder="e.g. parent@email.com" required error={errors.email} />
          <div className="sm:col-span-2">
            <PhoneInput label="WhatsApp Number" country={data.country || 'Other'} phone={data.whatsapp} onPhoneChange={p => updateData({ whatsapp: p })} onCountryChange={c => updateData({ country: c })} required error={errors.whatsapp} />
          </div>
        </div>
      </div>

      <div className="pf-card p-5 pf-e3">
        <h3 className="pf-section-label"><User className="w-3 h-3"/>Student Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <InputField label="Student Name" value={data.studentName} onChange={e => updateData({ studentName: e.target.value })} placeholder="e.g. Ahmed Khan" required error={errors.studentName} />
          <InputField label="Age" type="text" value={data.age} onChange={e => updateData({ age: cleanAgeInput(e.target.value) })} placeholder="e.g. 12" required error={errors.age} />
        </div>
      </div>

      <div className="pf-card p-5 pf-e4">
        <h3 className="pf-section-label"><BookOpen className="w-3 h-3"/>Requirements</h3>
        <div className="mt-3 space-y-2">
          <label className="text-sm font-semibold text-brand-darkText block">Describe what you need <span className="text-red-500">*</span></label>
          <textarea
            value={data.tuitionRequirements}
            onChange={e => updateData({ tuitionRequirements: e.target.value })}
            placeholder="e.g. Maths and Science for Grade 8 (Federal Board)..."
            className={`w-full min-h-[120px] p-4 rounded-xl border ${errors.tuitionRequirements ? 'border-red-400' : 'border-brand-lightGray'} bg-white text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all resize-none text-sm`}
          />
          {errors.tuitionRequirements && <p className="text-sm text-red-500 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/>{errors.tuitionRequirements}</p>}
        </div>
      </div>

      <div className="pf-card p-5 pf-e5" style={{background:'linear-gradient(135deg,rgba(29,111,206,0.04),rgba(14,165,233,0.02))'}}>
        <div className="flex items-center gap-3">
          <div className="pf-icon"><Phone className="w-5 h-5 text-white"/></div>
          <div>
            <h4 className="font-extrabold text-[#0f2d57] text-sm">Our Advisor Will Contact You</h4>
            <p className="text-xs text-brand-mediumText mt-0.5">We'll match you with the best tutor and confirm via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Step2_Program = ({ data, updateData }: StepProps) => {
  const ageNum = parseInt(data.age) || 0;
  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="text-center mb-8"><h2 className="text-2xl font-display font-bold">Choose Program</h2><p className="text-brand-mediumText">Select the program that fits your goals.</p></div>
      <div className="grid gap-4">
        <OptionCard title="Full-time School" description="Regular schooling (KG1-12) with daily classes." icon={School} selected={data.programType===ProgramType.FULL_TIME} onClick={()=>updateData({programType:ProgramType.FULL_TIME})}/>
        {!(data.leadType===LeadType.FULL_TIME && ageNum<=20) && <>
          <OptionCard title="Tuition (1-on-1)" description="Personalized coaching for subjects or exam prep." icon={BookOpen} selected={data.programType===ProgramType.TUITION} onClick={()=>updateData({programType:ProgramType.TUITION})}/>
          <OptionCard title="One-to-One Schooling" description="Full curriculum with personal teacher (up to Grade 7)." icon={GraduationCap} selected={data.programType===ProgramType.ONE_ON_ONE_SCHOOLING} onClick={()=>updateData({programType:ProgramType.ONE_ON_ONE_SCHOOLING})}/>
        </>}
      </div>
      {ageNum>20 && data.programType===ProgramType.FULL_TIME && <div className="flex items-center gap-3 text-yellow-300 text-sm bg-yellow-900/30 p-4 rounded-xl border border-yellow-500/30"><AlertTriangle className="w-5 h-5 shrink-0"/><p>We usually recommend Tuition for learners over 20.</p></div>}
    </div>
  );
};

export const Step3_Academics = ({ data, updateData }: StepProps) => {
  useEffect(() => {
    if (data.programType===ProgramType.FULL_TIME && !data.curriculum) {
      const g = getGV(data.grade);
      if (g>=1 && g<=9) updateData({curriculum:Curriculum.BRITISH});
      else if (g>=10) updateData({curriculum:Curriculum.FEDERAL});
    }
  }, [data.programType, data.grade]);

  const toggle = (sub:string) => {
    const c = data.subjects || [];
    updateData({subjects:c.includes(sub)?c.filter(s=>s!==sub):[...c,sub]});
  };

  return (
    <div className="space-y-8 transition-all duration-300">
      <div className="text-center"><h2 className="text-2xl font-display font-bold">Academic Preferences</h2><p className="text-brand-mediumText">Customize the learning path.</p></div>
      {data.programType===ProgramType.FULL_TIME && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <OptionCard title="British Curriculum" description="Cambridge/Edexcel (KG1-Grade 7)" selected={data.curriculum===Curriculum.BRITISH} onClick={()=>updateData({curriculum:Curriculum.BRITISH})}/>
            <OptionCard title="Federal Board (FBISE)" description="Pakistan Federal Board (Grade 8-12)" selected={data.curriculum===Curriculum.FEDERAL} onClick={()=>updateData({curriculum:Curriculum.FEDERAL})}/>
            <OptionCard title="IGCSE / O-Level" description="Preparatory classes" selected={data.curriculum===Curriculum.IGCSE_O_LEVEL} onClick={()=>updateData({curriculum:Curriculum.IGCSE_O_LEVEL})}/>
            <OptionCard title="A-Level Prep" description="Advanced Level" selected={data.curriculum===Curriculum.A_LEVEL} onClick={()=>updateData({curriculum:Curriculum.A_LEVEL})}/>
          </div>
        </div>
      )}
      {(data.programType===ProgramType.TUITION || data.curriculum===Curriculum.IGCSE_O_LEVEL || data.curriculum===Curriculum.A_LEVEL) && (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="font-medium text-brand-burgundy mb-4">Select Subjects</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {IGCSE_SUBJECTS.map(sub => (
                <button key={sub} type="button" onClick={()=>toggle(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${data.subjects.includes(sub)?'bg-brand-orange text-brand-dark border-brand-orange':'bg-white/60 text-brand-mediumText border-brand-lightGray'}`}>
                  {sub}
                </button>
              ))}
            </div>
            <InputField label="Other Subject" value={data.customSubject} onChange={e=>updateData({customSubject:e.target.value})}/>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export const Step4_Trial = ({ data, updateData }: StepProps) => {
  const trialText = getGV(data.grade)>=10
    ? 'Morning: 9:00 AM KSA / 10:00 AM UAE / 11:00 AM PKT'
    : 'Evening: 3:30 PM KSA / 4:30 PM UAE / 5:30 PM PKT';
  const studentName = data.students.filter(s=>s.id!==DRAFT_ID)[0]?.name||data.studentName||'your child';

  return (
    <div className="space-y-8 transition-all duration-300">
      <div className="text-center"><h2 className="text-2xl font-display font-bold">Confirm Trial Class</h2><p className="text-brand-mediumText">Almost there!</p></div>
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-brand-burgundy to-brand-orange">
        <div className="bg-brand-cream rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-brand-mediumText uppercase tracking-widest text-xs font-bold">Assigned Slot</h3>
          <p className="text-xl sm:text-2xl font-bold text-brand-darkText">{trialText}</p>
          <div className="flex items-center justify-center gap-2 text-brand-burgundy text-sm"><Calendar className="w-4 h-4"/><span>Duration: {data.leadType===LeadType.FULL_TIME?'3 Days':'1 Day'}</span></div>
        </div>
      </div>
      <div className="space-y-4">
        <OptionCard title="Yes, I can attend" selected={data.trialConfirmed} onClick={()=>updateData({trialConfirmed:true,trialReason:''})} icon={CheckCircle}/>
        <OptionCard title="Need a different time" selected={!data.trialConfirmed} onClick={()=>updateData({trialConfirmed:false})} icon={Calendar}/>
      </div>
      {!data.trialConfirmed && <GlassCard className="space-y-4"><SelectField label="Reason" value={data.trialReason} onChange={e=>updateData({trialReason:e.target.value})} options={['Schedule Conflict','Timezone Issue','Request Advisor Call Instead']}/>{data.trialReason!=='Request Advisor Call Instead'&&<SelectField label="Preferred Day" value={data.trialPreferredDay} onChange={e=>updateData({trialPreferredDay:e.target.value})} options={DAYS}/>}</GlassCard>}
      <div className="space-y-4 pt-6 border-t border-brand-lightGray">
        <h3 className="text-lg font-semibold text-brand-burgundy flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-orange"/>Add more for {studentName}?</h3>
      </div>
      <div className="pt-6 border-t border-brand-lightGray"><GlassCard><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg"><ShieldCheck className="w-5 h-5"/></div><div><h4 className="font-bold text-brand-darkText">Coupon Code?</h4><p className="text-xs text-brand-mediumText">Optional</p></div></div><InputField label="" value={data.couponCode} onChange={e=>updateData({couponCode:e.target.value.toUpperCase()})} placeholder="e.g. WELCOME2024"/></GlassCard></div>
      <div className="pt-4"><label className="text-sm font-medium text-brand-darkText mb-2 block">Any questions? (Optional)</label><textarea className="w-full glass-input rounded-xl p-4 text-sm h-24" placeholder="Let us know..." value={data.notes} onChange={e=>updateData({notes:e.target.value})}/></div>
    </div>
  );
};

export const Step5_Summary = ({ data, updateData }: StepProps) => (
  <div className="space-y-8 transition-all duration-300">
    <div className="text-center"><h2 className="text-2xl font-display font-bold">Final Steps</h2><p className="text-brand-mediumText">Review and add extras.</p></div>
    <textarea className="w-full glass-input rounded-xl p-4 text-sm h-24" placeholder="Final notes?" value={data.notes} onChange={e=>updateData({notes:e.target.value})}/>
  </div>
);

const validateCoupon=(code:string)=>{
  try{
    const env=(process.env.COUPON_CODES as unknown) as Record<string,string>||{};
    const raw=env[`COUPON_${code.toUpperCase()}`];
    if(!raw)return null;
    const[referrerName,discountType,discountValue,message]=raw.split('|');
    return{valid:true,referrerName,discountType,discountValue:parseInt(discountValue,10),message};
  }catch{return null;}
};

interface CouponProps {
  data: FormData;
  updateData: (f: Partial<FormData>) => void;
}

const CouponCodeSection = ({ data, updateData }: CouponProps) => {
  const [input, setInput] = useState(data.couponCode || "");
  const [showPopup, setPopup] = useState(false);
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(false);
  const [voucherAnimKey, setVoucherAnimKey] = useState(0);
  const [pendingCoupon, setPendingCoupon] = useState<any>(null);
  const [showAppliedVoucher, setShowAppliedVoucher] = useState(!!data.appliedCoupon);
  const [isVoucherFlying, setIsVoucherFlying] = useState(false);

  useEffect(() => {
    setShowAppliedVoucher(!!data.appliedCoupon);
  }, [data.appliedCoupon]);

  const apply = () => {
    if (!input.trim()) {
      setErr("Please enter a code");
      return;
    }

    setChecking(true);
    setErr("");

    setTimeout(() => {
      const r = validateCoupon(input);

      if (r) {
        setPendingCoupon({
          code: input.toUpperCase(),
          data: r,
        });
        setPopup(true);
      } else {
        setErr("Invalid code.");
        setPendingCoupon(null);
        setShowAppliedVoucher(false);
        updateData({
          couponCode: "",
          appliedCoupon: null,
        });
      }

      setChecking(false);
    }, 500);
  };

  const handleRemoveVoucher = () => {
    setInput("");
    setErr("");
    setPendingCoupon(null);
    setShowAppliedVoucher(false);
    updateData({
      couponCode: "",
      appliedCoupon: null,
    });
  };

  return (
    <>
      <style>{`
        @keyframes ivsPopupFlipIn {
          0% {
            opacity: 0;
            transform: perspective(1400px) rotateX(-16deg) scale(0.95) translateY(20px);
          }
          60% {
            opacity: 1;
            transform: perspective(1400px) rotateX(4deg) scale(1.01) translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) rotateX(0deg) scale(1) translateY(0);
          }
        }

        @keyframes ivsPopupFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes ivsPopupGlow {
          0%, 100% {
            box-shadow:
              0 20px 55px rgba(15,45,87,0.18),
              0 8px 24px rgba(29,111,206,0.12);
          }
          50% {
            box-shadow:
              0 26px 70px rgba(15,45,87,0.22),
              0 12px 30px rgba(29,111,206,0.16);
          }
        }

        @keyframes ivsVoucherFlyToCard {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-220px, 240px) scale(0.28);
          }
        }

        @keyframes ivsAppliedCardIn {
          0% {
            opacity: 0;
            transform: translateY(26px) scale(0.94);
            filter: blur(8px);
          }
          60% {
            opacity: 1;
            transform: translateY(-6px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes ivsShine {
          0% {
            transform: translateX(-140%) skewX(-18deg);
            opacity: 0;
          }
          20% {
            opacity: 0.18;
          }
          100% {
            transform: translateX(220%) skewX(-18deg);
            opacity: 0;
          }
        }

        .ivs-popup-card {
          animation: ivsPopupFlipIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        .ivs-popup-card-inner {
          animation: ivsPopupFloat 5s ease-in-out infinite, ivsPopupGlow 4.5s ease-in-out infinite;
        }

        .ivs-popup-fly-away {
          animation: ivsVoucherFlyToCard 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ivs-applied-voucher {
          animation: ivsAppliedCardIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
          position: relative;
          overflow: hidden;
        }

        .ivs-applied-voucher::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.00) 35%,
            rgba(255,255,255,0.22) 50%,
            rgba(255,255,255,0.00) 65%,
            transparent 100%
          );
          animation: ivsShine 4.8s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-darkText">Coupon / Referral Code</h4>
            <p className="text-xs text-brand-mediumText">Optional</p>
          </div>
        </div>

        {data.appliedCoupon && showAppliedVoucher ? (
          <div
            key={voucherAnimKey}
            className="ivs-applied-voucher rounded-[28px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(135deg,rgba(241,250,255,0.98)_0%,rgba(232,246,255,0.98)_48%,rgba(245,251,255,0.98)_100%)] shadow-[0_16px_34px_rgba(29,111,206,0.10),0_6px_16px_rgba(15,45,87,0.05)]"
          >
            <div className="grid md:grid-cols-[1.2fr_auto] items-stretch">
              <div className="relative px-6 py-6 md:px-7 md:py-7">
                <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-[#1d6fce] via-[#38bdf8] to-[#10b981]" />

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-[20px] flex items-center justify-center bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] shadow-[0_12px_24px_rgba(29,111,206,0.22)]">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#1d6fce] bg-[rgba(29,111,206,0.08)] border-[rgba(29,111,206,0.14)]">
                        Voucher Applied
                      </span>

                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#059669] bg-[rgba(16,185,129,0.10)] border-[rgba(16,185,129,0.18)]">
                        Verified
                      </span>
                    </div>

                    <h4 className="mt-3 text-[30px] leading-none font-black tracking-[0.01em] text-[#0f2d57]">
                      {data.couponCode}
                    </h4>

                    <p className="mt-3 text-[16px] font-semibold text-[#23527c]">
                      {data.appliedCoupon.discountValue}% off on{" "}
                      {data.appliedCoupon.discountType === "REGISTRATION_FEE"
                        ? "registration fee"
                        : "first month fee"}
                    </p>

                    <p className="mt-2 text-sm text-[#5c7593] leading-relaxed max-w-[520px]">
                      Your referral reward has been securely attached and is now reserved for this application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative px-5 py-5 md:px-6 md:py-6 flex md:flex-col items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-[rgba(29,111,206,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(235,246,255,0.90)_100%)]">
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-extrabold text-[#6c87a7]">
                    Savings
                  </p>
                  <p className="mt-1 text-[34px] leading-none font-black bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] bg-clip-text text-transparent">
                    {data.appliedCoupon.discountValue}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#5c7593]">
                    Premium Reward
                  </p>
                </div>

                <button
                  onClick={handleRemoveVoucher}
                  className="mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold transition-all hover:scale-[1.04] text-[#b45309] bg-[linear-gradient(135deg,rgba(255,248,236,0.95),rgba(255,242,220,0.95))] border border-[rgba(245,158,11,0.20)] shadow-[0_8px_18px_rgba(245,158,11,0.10)]"
                >
                  Remove voucher
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.toUpperCase());
                  setErr("");
                }}
                placeholder="e.g. WELCOME2024"
                className="flex-1 px-4 py-3 rounded-xl border border-brand-lightGray bg-white text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
              />
              <button
                onClick={apply}
                disabled={checking || !input.trim()}
                className="px-5 py-3 bg-brand-burgundy text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {checking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking…
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            {err && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {err}
              </p>
            )}
          </div>
        )}
      </GlassCard>

      {showPopup && pendingCoupon && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(15,23,42,0.28)] backdrop-blur-[6px] p-4 sm:p-6"
          onClick={() => setPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`ivs-popup-card w-full max-w-[980px] ${isVoucherFlying ? "ivs-popup-fly-away" : ""}`}
          >
            <div className="ivs-popup-card-inner rounded-[34px] overflow-hidden border border-[rgba(180,205,230,0.95)] bg-[#f7fbff]">
              <div className="grid lg:grid-cols-[1.2fr_0.75fr]">
                <div className="relative p-6 sm:p-8 md:p-10 bg-[linear-gradient(135deg,#eef6ff_0%,#dbeeff_46%,#f5fbff_100%)]">
                  <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_40%)]" />

                  <p className="relative z-10 text-[11px] sm:text-[12px] uppercase tracking-[0.28em] font-bold text-[#1d6fce]/80 mb-3">
                    Luxury Discount Voucher
                  </p>

                  <h2 className="relative z-10 font-display text-[34px] sm:text-[44px] leading-none font-extrabold text-[#0f2d57]">
                    Congratulations
                  </h2>

                  <p className="relative z-10 mt-4 text-[15px] sm:text-[18px] leading-relaxed text-[#4d647f] max-w-[500px]">
                    Your referral benefit has been successfully unlocked for this registration.
                  </p>

                  <div className="relative z-10 mt-7 rounded-[24px] border border-[rgba(29,111,206,0.12)] bg-white/75 backdrop-blur-sm px-4 py-4 shadow-[0_8px_20px_rgba(15,45,87,0.06)] flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[18px] flex items-center justify-center text-[28px] bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] text-white shadow-[0_10px_24px_rgba(29,111,206,0.22)]">
                      🎁
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#6e85a0] mb-1">
                        Referred by
                      </p>
                      <p className="text-[24px] sm:text-[28px] font-extrabold text-[#0f2d57] leading-none">
                        {pendingCoupon.data.referrerName}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                    <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 text-sm font-bold shadow-sm">
                      ✓ Verified Referral
                    </div>

                    <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sky-700 text-sm font-bold shadow-sm">
                      ✓ Premium Reward
                    </div>
                  </div>
                </div>

                <div className="relative px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-center justify-center bg-[linear-gradient(160deg,#ffffff_0%,#f6fbff_100%)] border-t lg:border-t-0 lg:border-l border-[rgba(29,111,206,0.12)]">
                  <div className="relative text-center w-full max-w-[240px]">
                    <div className="relative mx-auto w-[190px] h-[190px] rounded-[28px] flex flex-col items-center justify-center bg-[linear-gradient(145deg,#ffffff_0%,#f4faff_52%,#e8f3ff_100%)] border border-[rgba(29,111,206,0.16)] shadow-[0_24px_40px_rgba(15,45,87,0.14),inset_0_2px_0_rgba(255,255,255,0.95)]">
                      <div className="absolute inset-3 rounded-[22px] border-2 border-dashed border-[rgba(29,111,206,0.25)]" />
                      <div className="absolute -top-3 -right-3 rounded-full bg-[linear-gradient(135deg,#0ea5e9,#1d6fce)] text-white text-[11px] font-black px-3 py-2 shadow-[0_10px_22px_rgba(29,111,206,0.26)]">
                        ACTIVE
                      </div>

                      <p className="text-[13px] uppercase tracking-[0.24em] font-black text-[#6a84a0]">
                        Save
                      </p>
                      <p className="text-[64px] leading-none font-black text-[#0f2d57] mt-1">
                        {pendingCoupon.data.discountValue}%
                      </p>
                      <p className="text-[16px] font-bold text-[#1d6fce] tracking-[0.2em] uppercase mt-1">
                        OFF
                      </p>
                    </div>

                    <div className="mt-6 rounded-[22px] border border-[rgba(29,111,206,0.12)] bg-[#f8fbff] px-4 py-4 shadow-[0_8px_20px_rgba(15,45,87,0.05)]">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a8ea5] font-bold">
                        Applied On
                      </p>
                      <p className="mt-2 text-[18px] font-bold text-[#0f2d57] leading-snug">
                        {pendingCoupon.data.discountType === "REGISTRATION_FEE"
                          ? "Registration Fee"
                          : "First Month Fee"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 md:px-10 py-6 sm:py-7 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] border-t border-[rgba(29,111,206,0.10)] text-center">
                <p className="text-[20px] sm:text-[26px] font-semibold text-[#23374f] leading-relaxed">
                  You'll get {pendingCoupon.data.discountValue}% off on{" "}
                  {pendingCoupon.data.discountType === "REGISTRATION_FEE"
                    ? "registration fee"
                    : "first month fee"}
                </p>

                <p className="mt-2 text-sm text-[#6b7f97]">
                  This offer will be attached to your registration details.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVoucherFlying(true);

                      setTimeout(() => {
                        updateData({
                          couponCode: pendingCoupon.code,
                          appliedCoupon: pendingCoupon.data,
                        });
                        setPopup(false);
                        setIsVoucherFlying(false);
                        setPendingCoupon(null);
                        setVoucherAnimKey((prev) => prev + 1);
                        setShowAppliedVoucher(true);
                      }, 800);
                    }}
                    className="w-full py-4 rounded-[18px] text-white font-bold shadow-[0_16px_34px_rgba(29,111,206,0.24)] hover:translate-y-[-1px] transition-all bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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

  const schoolTrialTime = hasLowerGrades
    ? "3:30 PM KSA | 4:30 PM UAE | 5:30 PM PAK"
    : "9:30 PM KSA | 10:30 PM UAE | 11:30 PM PAK";

  const schoolTrialLabel = hasLowerGrades ? "KG1 to Grade 7" : "Grade 8 to 12";

  const selectedQuranStudent = (data.quranStudents || [])[0];
  const selectedQuranTime =
    selectedQuranStudent?.classTime || data.quranClassTime || "To be confirmed on WhatsApp";

  const selectedQuranDays =
    selectedQuranStudent?.classDays?.length
      ? selectedQuranStudent.classDays.join(", ")
      : "Based on your selected days";

  React.useEffect(() => {
    if (data.tuitionInterest) {
      const needsPrefill = !data.pendingTuitionName && !data.pendingTuitionAge;
      if (needsPrefill && primaryName) {
        updateData({
          pendingTuitionName: primaryName,
          pendingTuitionAge: primaryAge,
          pendingTuitionReq: data.pendingTuitionReq || "",
        });
      }
    }
  }, [data.tuitionInterest]);

  React.useEffect(() => {
    if (data.quranInterest) {
      const needsPrefill = !data.pendingQuranName && !data.pendingQuranAge;
      if (needsPrefill && primaryName) {
        const sourceQuranStudent = (data.quranStudents || [])[0];

        updateData({
          pendingQuranName: primaryName,
          pendingQuranAge: primaryAge,
          pendingQuranTime: data.pendingQuranTime || sourceQuranStudent?.classTime || "",
          pendingQuranSubjects: data.pendingQuranSubjects?.length
            ? data.pendingQuranSubjects
            : sourceQuranStudent?.subjects || [],
          pendingQuranCountry: data.pendingQuranCountry || data.quranStudentCountry || "",
          pendingQuranDays: data.pendingQuranDays?.length
            ? data.pendingQuranDays
            : sourceQuranStudent?.classDays || [],
        });
      }
    }
  }, [data.quranInterest]);

  React.useEffect(() => {
    if (data.fullTimeInterest) {
      const needsPrefill = !data.pendingSchoolName && !data.pendingSchoolAge && !data.pendingSchoolGrade;
      if (needsPrefill && primaryName) {
        updateData({
          pendingSchoolName: primaryName,
          pendingSchoolAge: primaryAge,
          pendingSchoolGrade: primaryGrade,
        });
      }
    }
  }, [data.fullTimeInterest]);

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
    <div className="space-y-8 transition-all duration-300">
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

      {(data.leadType === LeadType.TUITION || data.leadType === LeadType.QURAN) && (
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
            <Toggle label="Interested?" checked={data.fullTimeInterest} onChange={(v) => updateData({ fullTimeInterest: v })} />
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
                    <div key={student.id} className="flex items-center justify-between p-4 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-[0_10px_30px_rgba(59,130,246,0.06)]">
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
                <InputField
                  label="Name"
                  value={data.pendingSchoolName}
                  onChange={(e) => updateData({ pendingSchoolName: e.target.value })}
                  placeholder="Ahmed"
                />
                <InputField
                  label="Age"
                  type="text"
                  value={data.pendingSchoolAge}
                  onChange={(e) => updateData({ pendingSchoolAge: cleanAgeInput(e.target.value) })}
                  placeholder="10"
                />
                <SelectField
                  label="Grade"
                  value={data.pendingSchoolGrade}
                  onChange={(e) => updateData({ pendingSchoolGrade: e.target.value })}
                  options={GRADES}
                />
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
      )}

      {data.leadType !== LeadType.TUITION && (
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
            <Toggle label="Interested?" checked={data.tuitionInterest} onChange={(v) => updateData({ tuitionInterest: v })} />
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
                    <div key={student.id} className="flex items-center justify-between p-4 bg-purple-50/80 rounded-2xl border border-purple-200 shadow-[0_10px_30px_rgba(139,92,246,0.06)]">
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
                <InputField
                  label="Name"
                  value={data.pendingTuitionName || ""}
                  onChange={(e) => updateData({ pendingTuitionName: e.target.value })}
                  placeholder="Ahmed"
                />
                <InputField
                  label="Age"
                  type="text"
                  value={data.pendingTuitionAge || ""}
                  onChange={(e) => updateData({ pendingTuitionAge: cleanAgeInput(e.target.value) })}
                  placeholder="10"
                />
              </div>

              <InputField
                label="Requirements"
                value={data.pendingTuitionReq || ""}
                onChange={(e) => updateData({ pendingTuitionReq: e.target.value })}
                placeholder="e.g. Math Grade 8, Science support, exam prep..."
              />

              <button
                type="button"
                onClick={() => {
                  if (data.pendingTuitionName && data.pendingTuitionAge) {
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
                disabled={!data.pendingTuitionName || !data.pendingTuitionAge}
                className="w-full py-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-700 font-bold text-sm disabled:opacity-40 hover:bg-purple-500/15 hover:shadow-[0_10px_30px_rgba(139,92,246,0.10)] transition-all"
              >
                + Add to Tuition
              </button>
            </div>
          )}
        </div>
      )}

      {data.leadType !== LeadType.QURAN && (
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
            <Toggle label="Interested?" checked={data.quranInterest} onChange={(v) => updateData({ quranInterest: v })} />
          </div>

          {data.quranInterest && (
            <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4 animate-fade-in">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 shadow-[0_8px_24px_rgba(16,185,129,0.08)]">
                <p className="text-sm font-semibold text-emerald-700">
                  Student details are pre-filled from your application. You can edit them below.
                </p>
              </div>

              {visibleUpsellQuranStudents.length > 0 && (
                <div className="space-y-3">
                  {visibleUpsellQuranStudents.map((student, idx) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-[0_10px_30px_rgba(16,185,129,0.06)]">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-extrabold shadow-[0_8px_20px_rgba(16,185,129,0.24)]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-emerald-800">{student.name}</p>
                          <p className="text-xs text-emerald-600">
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
                            ? updateData({
                                pendingQuranName: "",
                                pendingQuranAge: "",
                                pendingQuranTime: "",
                                pendingQuranSubjects: [],
                                pendingQuranCountry: "",
                                pendingQuranDays: [],
                              })
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
                <InputField
                  label="Name"
                  value={data.pendingQuranName || ""}
                  onChange={(e) => updateData({ pendingQuranName: e.target.value })}
                  placeholder="Ahmed"
                />

                <InputField
                  label="Age"
                  type="text"
                  value={data.pendingQuranAge || ""}
                  onChange={(e) => updateData({ pendingQuranAge: cleanAgeInput(e.target.value) })}
                  placeholder="10"
                />
              </div>

              <SelectField
                label="Country"
                value={data.pendingQuranCountry || ""}
                onChange={(e) => updateData({ pendingQuranCountry: e.target.value })}
                options={COUNTRIES}
              />

              <div>
                <label className="text-sm font-semibold text-brand-darkText block mb-2">
                  What does the student want to learn?
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
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
                        className={`px-3 py-3 rounded-xl border text-sm font-semibold text-left transition-all ${
                          active
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_10px_22px_rgba(16,185,129,0.16)]"
                            : "bg-white text-brand-darkText border-brand-lightGray hover:border-emerald-400 hover:bg-emerald-50/60"
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-brand-darkText block mb-2">
                  Class Days
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
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
                        className={`qf-day-btn ${active ? "active" : ""}`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="qf-time-wrap">
                <Clock className="w-4 h-4 qf-time-icon" />
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

              <button
                type="button"
                onClick={() => {
                  if (data.pendingQuranName && data.pendingQuranAge) {
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
                className="w-full py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-bold text-sm disabled:opacity-40 hover:bg-emerald-500/15 hover:shadow-[0_10px_30px_rgba(16,185,129,0.10)] transition-all"
              >
                + Add to Quran
              </button>
            </div>
          )}
        </div>
      )}

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
              <p className="text-lg font-extrabold text-emerald-600 uppercase mb-4">
                Quran Classes ({visibleUpsellQuranStudents.length})
              </p>
              <div className="space-y-3">
                {visibleUpsellQuranStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 rounded-3xl border border-emerald-200 bg-white/75 px-5 py-4 shadow-[0_10px_28px_rgba(16,185,129,0.06)]"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-lg font-extrabold shadow-[0_8px_20px_rgba(16,185,129,0.20)]">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-emerald-700 truncate">{student.name}</p>
                      <p className="text-sm text-emerald-600 truncate">
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

      <CouponCodeSection data={data} updateData={updateData} />

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

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4">
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
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-[0_8px_20px_rgba(16,185,129,0.06)]">
                <p className="text-sm text-emerald-700 font-semibold">3 Days Free Trial Classes</p>
                <p className="text-lg text-emerald-800 font-bold mt-1">
                  {selectedQuranTime}
                </p>
                <p className="text-sm text-emerald-600 mt-2">
                  {selectedQuranDays}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[linear-gradient(135deg,#f7fbff_0%,#f1f8ff_100%)] border border-blue-100 shadow-[0_8px_20px_rgba(59,130,246,0.05)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white border border-blue-100 flex items-center justify-center shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <p className="text-sm text-blue-700 font-semibold">3 Days Free Trial Classes</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    {
                      tz: "KSA",
                      time: hasLowerGrades ? "3:30" : "9:30",
                      accent: "text-blue-600",
                      border: "border-blue-100",
                    },
                    {
                      tz: "UAE",
                      time: hasLowerGrades ? "4:30" : "10:30",
                      accent: "text-sky-600",
                      border: "border-blue-100",
                    },
                    {
                      tz: "PAK",
                      time: hasLowerGrades ? "5:30" : "11:30",
                      accent: "text-cyan-600",
                      border: "border-blue-100",
                    },
                  ].map((item) => (
                    <div
                      key={item.tz}
                      className={`rounded-2xl border ${item.border} bg-white px-3 py-3.5 text-center shadow-[0_4px_12px_rgba(15,45,87,0.03)]`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <Clock className={`w-3 h-3 ${item.accent}`} />
                        <p className={`text-[11px] font-bold ${item.accent}`}>{item.tz}</p>
                      </div>

                      <p className="text-lg font-extrabold text-[#0f2d57] leading-none">
                        <span className="block">{item.time}</span>
                        <span className="block mt-2">AM</span>
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-blue-600 mt-4 font-medium">
                  {schoolTrialLabel}
                </p>
              </div>
            )}
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
    </div>
  );
};