/**
 * FormSteps.tsx — Premium Redesign
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FormData, LeadType, ProgramType, Curriculum, Track, ClassMode, Student, QuranStudent } from '../types';
import { GRADES, COUNTRIES, IGCSE_SUBJECTS, TIME_SLOTS, DAYS, QURAN_LEVELS, QURAN_CLASS_TIMES, getGradeValue as getGV } from '../constants';
import { GlassCard, InputField, SelectField, Button, OptionCard, Toggle, PhoneInput } from './UI';
import { HeroCard, ProgramCard, TrustStrip, PROGRAM_CARDS_DATA, Navbar } from './LandingPage';
import {
  School, BookOpen, GraduationCap, CheckCircle, Calendar, AlertTriangle,
  Phone, User, Sparkles, Loader2, UserRound, Clock, ShieldCheck, Globe2, Zap, Star,
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
  background: white;
  border: 1.5px solid rgba(15,45,87,0.10);
  border-radius: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.pf-input-wrap:focus-within {
  border-color: rgba(29,111,206,0.45);
  box-shadow: 0 0 0 3px rgba(29,111,206,0.08);
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

  const goByLead = (lead: LeadType) => {
    if (lead === LeadType.FULL_TIME) updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME });
    else if (lead === LeadType.TUITION) updateData({ leadType: LeadType.TUITION, programType: ProgramType.TUITION });
    else if (lead === LeadType.ONE_ON_ONE_SCHOOLING) updateData({ leadType: LeadType.ONE_ON_ONE_SCHOOLING, programType: ProgramType.ONE_ON_ONE_SCHOOLING });
    else if (lead === LeadType.QURAN) updateData({ leadType: LeadType.QURAN });
    else updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME });
    nextStep();
  };

  return (
    <div className="animate-fade-in-up">
      <Navbar onNavigate={(s) => {
        if (s === 'school-trial') goByLead(LeadType.FULL_TIME);
        if (s === 'tuition-trial') goByLead(LeadType.TUITION);
        if (s === 'quran-trial') goByLead(LeadType.QURAN);
      }} />
      <div className="px-6 md:px-12 py-8 space-y-10">
        <HeroCard
          grade={quickGrade}
          curriculum={quickCurriculum}
          country={quickCountry}
          onStartTrial={() => {
            updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME, grade: quickGrade, country: quickCountry });
            nextStep();
          }}
          onBookConsultation={() => {
            updateData({ leadType: LeadType.TUITION, programType: ProgramType.TUITION });
            nextStep();
          }}
          onQuickSelect={(field, value) => {
            if (field === 'grade') { setQuickGrade(value); updateData({ grade: value }); }
            if (field === 'curriculum') setQuickCurriculum(value);
            if (field === 'country') { setQuickCountry(value); updateData({ country: value }); }
          }}
        />
        <section className="program-grid">
          {PROGRAM_CARDS_DATA.map((cd: any) => (
            <ProgramCard key={String(cd.id)} {...cd} onSelect={(id: LeadType) => goByLead(id)} />
          ))}
        </section>
        <TrustStrip />
      </div>
    </div>
  );
}

export const Step1_Details = ({ data, updateData, errors }: StepProps) => {
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
  const isAgeAboveLimit = ageNum > 17;
  const isAgeBelowLimit = ageNum > 0 && ageNum < 3;
  const gradeVal = getGV(currentGrade);
  const showCurriculum = gradeVal >= 10;

  useEffect(() => {
    if (!currentAge) return;

    if (ageNum >= 3 && ageNum <= 17) {
      if (recommendedGrade && currentGrade !== recommendedGrade) {
        setCurrentGrade(recommendedGrade);
      }
    } else {
      if (currentGrade) setCurrentGrade('');
      if (currentCurriculum) setCurrentCurriculum(null);
    }
  }, [ageNum, currentAge, recommendedGrade]);

  const pendingIsValid =
    currentName.trim().length > 0 &&
    currentAge.length > 0 &&
    ageNum >= 3 &&
    ageNum <= 17 &&
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

  if (data.leadType === LeadType.QURAN) return <QuranForm data={data} updateData={updateData} errors={errors} />;
  if (data.leadType === LeadType.TUITION) return <TuitionForm data={data} updateData={updateData} errors={errors} />;

  return (
    <div className="space-y-5">
      <div className="text-center pf-e1">
        <div className="pf-step-pill mx-auto w-fit mb-4">
          <span className="pf-step-dot" />
          {data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? 'One-to-One Schooling' : 'Step 2 · Student Details'}
        </div>
        <h2 className="pf-heading text-3xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight mb-2">
          {data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? 'One-to-One Schooling' : 'Student Information'}
        </h2>
        <p className="text-sm text-brand-mediumText max-w-xs mx-auto">
          Add each student who will be enrolling — we'll tailor everything.
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
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
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
                    <button onClick={() => editStudent(student)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-[#1d6fce] transition-all"
                      style={{ background: 'rgba(29,111,206,0.08)', border: '1.5px solid rgba(29,111,206,0.18)' }}>
                      Edit
                    </button>
                    <button onClick={() => removeStudent(student.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 transition-all"
                      style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.18)' }}>
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
                {realStudents.length > 0 ? 'Fill in details to enrol another student.' : 'Age auto-fills the grade for you ✨'}
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
                  type="number"
                  value={currentAge}
                  onChange={e => setCurrentAge(e.target.value)}
                  placeholder="e.g. 10"
                  min={1}
                  max={25}
                />
              </div>
              {ageNum > 0 && !isAgeAboveLimit && !isAgeBelowLimit && recommendedGrade && (
                <div className="pf-chip">
                  <Zap className="w-3 h-3" />
                  Auto-set: {recommendedGrade}
                </div>
              )}
            </PField>

            <PField label="Grade" icon={GraduationCap}>
              <div className="pf-input-wrap relative">
                <select value={currentGrade} onChange={e => setCurrentGrade(e.target.value)}>
                  <option value="">Select Grade</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#0f2d57]/40">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </PField>
          </div>

          {(isAgeAboveLimit || isAgeBelowLimit) && (
            <div className="mt-4 flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                {isAgeAboveLimit
                  ? "This age does not match school-grade auto placement. Our advisor will guide you with the best option."
                  : "This age is below the standard school-grade range. Our advisor will guide you with the best option."}
              </p>
            </div>
          )}

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
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
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
  );
};

const QuranForm = ({ data, updateData, errors }: Pick<StepProps, "data" | "updateData" | "errors">) => {
  usePremiumStyles();

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
    <div className="qf-page animate-fade-in-up">
      <style>{`
  .qf-page {
    position: relative;
    min-height: 100%;
    
  }

  .qf-shell {
    position: relative;
    width: 100%;
    max-width: none;
    margin: 0;
    min-height: 100%;
    padding: 0 24px 24px;
    overflow: visible;
  }

  .qf-main {
    position: relative;
    z-index: 3;
    max-width: 640px;
    margin: 0;
  }

  /* LEFT BACKGROUND ART */
  .qf-art-left {
    position: absolute;
    left: -500px;
    top: 310px;
    width: 440px;
    max-width: 32vw;
    opacity: 0.13;
    pointer-events: none;
    user-select: none;
    z-index: 0;
    filter: saturate(0.9) blur(0.2px);
  }

  /* RIGHT BACKGROUND ART - FIXED TO FULL RIGHT */
  .qf-art-right {
    position: fixed;
    right: -530px;
    top: 54%;
    transform: translateY(-50%);
    width: 483px;
    height: auto;
    opacity: 0.14;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    filter:
      saturate(0.82)
      brightness(1.03)
      drop-shadow(0 12px 26px rgba(15, 45, 87, 0.05));
  }

  .qf-art-glow {
    position: fixed;
    right: 35px;
    top: 54%;
    transform: translateY(-50%);
    width: 540px;
    height: 540px;
    border-radius: 999px;
    background: radial-gradient(
      circle,
      rgba(14, 165, 233, 0.07) 0%,
      rgba(14, 165, 233, 0.03) 42%,
      transparent 72%
    );
    filter: blur(28px);
    pointer-events: none;
    z-index: 0;
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

  @media (max-width: 1280px) {
    .qf-art-left {
      left: 10px;
      width: 340px;
      opacity: 0.1;
    }

    .qf-art-right {
      right: 28px;
      width: 360px;
      opacity: 0.12;
    }

    .qf-art-glow {
      right: 0;
      width: 420px;
      height: 420px;
    }
  }

  @media (max-width: 1024px) {
    .qf-art-left,
    .qf-art-right,
    .qf-art-glow {
      display: none;
    }

    .qf-main {
      max-width: 720px;
      margin: 0 auto;
    }
  }

  @media (max-width: 640px) {
    .qf-shell {
      padding: 0 10px 20px;
    }
  }
`}</style>

      <div className="qf-shell">
        {/* Left large Quran background */}
        <img
          src="/images/quran-cover-blue.png"
          alt=""
          aria-hidden="true"
          className="qf-art-left"
        />

        {/* Right lantern/book artwork */}
        <div className="qf-art-glow" />
        <img
          src="/images/quran-lantern-blue.png"
          alt=""
          aria-hidden="true"
          className="qf-art-right"
        />

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
                  type="number"
                  value={data.age}
                  onChange={(e) => updateData({ age: e.target.value })}
                  placeholder="e.g. 10"
                  required
                />
              </div>

              <div className="mt-4 space-y-3">
                <label className="text-sm font-semibold text-brand-darkText block">
                  What does the student want to learn? <span className="text-red-500">*</span>
                </label>

                <div className="grid sm:grid-cols-2 gap-2">
                  {QURAN_SUBJECT_OPTIONS.map((subject) => {
                    const active = (data.quranSubjects || []).includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleQuranSubject(subject)}
                        className={`qf-subject-btn ${active ? "active" : ""}`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>

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
        </div>
      </div>
    </div>
  );
};

const TuitionForm = ({ data, updateData, errors }: Pick<StepProps,'data'|'updateData'|'errors'>) => {
  usePremiumStyles();
  return (
    <div className="space-y-5 animate-fade-in-up">
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
          <InputField label="Age" type="number" value={data.age} onChange={e => updateData({ age: e.target.value })} placeholder="e.g. 12" required error={errors.age} />
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
    <div className="space-y-6 animate-fade-in-up">
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
    <div className="space-y-8 animate-fade-in-up">
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
    <div className="space-y-8 animate-fade-in-up">
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
  <div className="space-y-8 animate-fade-in-up">
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

interface CouponProps{data:FormData;updateData:(f:Partial<FormData>)=>void;}
const CouponCodeSection=({data,updateData}:CouponProps)=>{
  const[input,setInput]=useState(data.couponCode||'');
  const[showPopup,setPopup]=useState(false);
  const[err,setErr]=useState('');
  const[checking,setChecking]=useState(false);
  const apply=()=>{
    if(!input.trim()){setErr('Please enter a code');return;}
    setChecking(true);setErr('');
    setTimeout(()=>{
      const r=validateCoupon(input);
      if(r){updateData({couponCode:input.toUpperCase(),appliedCoupon:r});setPopup(true);}
      else{setErr('Invalid code.');updateData({couponCode:'',appliedCoupon:null});}
      setChecking(false);
    }, 500);
  };

  return (
    <>
      <GlassCard>
        <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg"><ShieldCheck className="w-5 h-5"/></div><div><h4 className="font-bold text-brand-darkText">Coupon / Referral Code</h4><p className="text-xs text-brand-mediumText">Optional</p></div></div>
        {data.appliedCoupon?(
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white"/></div><div><p className="font-semibold text-emerald-700">{data.couponCode}</p><p className="text-xs text-emerald-600">{data.appliedCoupon.discountValue}% off</p></div></div><button onClick={()=>{setInput('');updateData({couponCode:'',appliedCoupon:null});}} className="text-sm text-red-500 font-medium">Remove</button></div>
        ):(
          <div className="space-y-3">
            <div className="flex gap-3"><input type="text" value={input} onChange={e=>{setInput(e.target.value.toUpperCase());setErr('');}} placeholder="e.g. WELCOME2024" className="flex-1 px-4 py-3 rounded-xl border border-brand-lightGray bg-white text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"/><button onClick={apply} disabled={checking||!input.trim()} className="px-5 py-3 bg-brand-burgundy text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">{checking?<><Loader2 className="w-4 h-4 animate-spin"/>Checking…</>:'Apply'}</button></div>
            {err&&<p className="text-sm text-red-500 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/>{err}</p>}
          </div>
        )}
      </GlassCard>
      {showPopup&&data.appliedCoupon&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-br from-brand-burgundy via-brand-orange to-yellow-400 p-8 text-center"><div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg"><Sparkles className="w-10 h-10 text-brand-orange"/></div><h2 className="text-3xl font-display font-bold text-white">🎉 Congratulations!</h2></div>
            <div className="p-8 text-center"><p className="text-lg text-brand-darkText mb-4">You are with the reference of</p><div className="inline-block px-6 py-3 bg-brand-orange/10 rounded-xl border border-brand-orange/30 mb-4"><p className="text-2xl font-bold text-brand-burgundy">{data.appliedCoupon.referrerName}</p></div><p className="text-xl text-brand-darkText font-medium mb-6">{data.appliedCoupon.message}</p><div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6"><CheckCircle className="w-4 h-4"/>{data.appliedCoupon.discountValue}% OFF {data.appliedCoupon.discountType==='REGISTRATION_FEE'?'Registration Fee':'First Month'}</div><button onClick={()=>setPopup(false)} className="w-full py-4 bg-brand-burgundy text-white font-bold rounded-xl hover:bg-brand-burgundy/90 transition-all text-lg">Continue</button></div>
          </div>
          </div>
        )}
      </>
  );
};

export const Step2_FinalSteps = ({ data, updateData }: StepProps) => {
  usePremiumStyles();

  const realStudents = data.students.filter((s) => s.id !== DRAFT_ID);

  const fallbackStudent =
    realStudents[0] ||
    (data.studentName || data.age || data.grade
      ? {
          id: "__preview__",
          name: data.studentName || "-",
          age: data.age || "-",
          grade: data.grade || "-",
          curriculum: data.curriculum || null,
        }
      : null);

  const summaryStudents = realStudents.length > 0 ? realStudents : fallbackStudent ? [fallbackStudent] : [];

  const primaryName = fallbackStudent?.name || "";
  const primaryAge = fallbackStudent?.age || "";
  const primaryGrade = fallbackStudent?.grade || "";
  const primaryCurriculum = fallbackStudent?.curriculum || null;

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
        updateData({
          pendingQuranName: primaryName,
          pendingQuranAge: primaryAge,
          pendingQuranTime: data.pendingQuranTime || data.quranTiming || "",
          pendingQuranSubjects: data.pendingQuranSubjects || [],
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

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center pf-e1">
        <div className="pf-step-pill mx-auto w-fit mb-4">
          <span className="pf-step-dot" />
          Step 3 · Final Review
        </div>
        <h2 className="pf-heading text-3xl font-display font-extrabold">Final Steps</h2>
        <p className="text-brand-mediumText">Review your application and add optional programs.</p>
      </div>

      {(data.leadType === LeadType.TUITION || data.leadType === LeadType.QURAN) && (
        <div className="pf-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="pf-icon">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-brand-darkText text-sm">Full-Time School</h4>
                <p className="text-xs text-brand-mediumText">3-day free trial</p>
              </div>
            </div>
            <Toggle label="Interested?" checked={data.fullTimeInterest} onChange={(v) => updateData({ fullTimeInterest: v })} />
          </div>

          {data.fullTimeInterest && (
            <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-blue-700">Student details are pre-filled from your application. You can edit them below.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <InputField label="Name" value={data.pendingSchoolName} onChange={(e) => updateData({ pendingSchoolName: e.target.value })} placeholder="Ahmed" />
                <InputField label="Age" type="number" value={data.pendingSchoolAge} onChange={(e) => updateData({ pendingSchoolAge: e.target.value })} placeholder="10" />
                <SelectField label="Grade" value={data.pendingSchoolGrade} onChange={(e) => updateData({ pendingSchoolGrade: e.target.value })} options={GRADES} />
              </div>

              <button
                onClick={() => {
                  if (data.pendingSchoolName && data.pendingSchoolAge && data.pendingSchoolGrade) {
                    updateData({
                      upsellSchoolStudents: [
                        ...data.upsellSchoolStudents,
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
                className="w-full py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 font-bold text-sm disabled:opacity-40"
              >
                + Add to Full-Time
              </button>
            </div>
          )}
        </div>
      )}

      {data.leadType !== LeadType.TUITION && (
        <div className="pf-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="pf-icon" style={{ background: "linear-gradient(135deg,#8b5cf6,#a78bfa)" }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-brand-darkText text-sm">1-on-1 Tuition</h4>
                <p className="text-xs text-brand-mediumText">Extra coaching support</p>
              </div>
            </div>
            <Toggle label="Interested?" checked={data.tuitionInterest} onChange={(v) => updateData({ tuitionInterest: v })} />
          </div>

          {data.tuitionInterest && (
            <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4">
              <div className="rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-purple-700">Student details are pre-filled from your application. You can edit them below.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <InputField label="Name" value={data.pendingTuitionName || ""} onChange={(e) => updateData({ pendingTuitionName: e.target.value })} placeholder="Ahmed" />
                <InputField label="Age" type="number" value={data.pendingTuitionAge || ""} onChange={(e) => updateData({ pendingTuitionAge: e.target.value })} placeholder="10" />
              </div>

              <InputField label="Requirements" value={data.pendingTuitionReq || ""} onChange={(e) => updateData({ pendingTuitionReq: e.target.value })} placeholder="e.g. Math Grade 8, Science support, exam prep..." />

              <button
                onClick={() => {
                  if (data.pendingTuitionName && data.pendingTuitionAge) {
                    updateData({
                      upsellTuitionStudents: [
                        ...data.upsellTuitionStudents,
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
                className="w-full py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-700 font-bold text-sm disabled:opacity-40"
              >
                + Add to Tuition
              </button>
            </div>
          )}
        </div>
      )}

      {data.leadType !== LeadType.QURAN && (
        <div className="pf-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="pf-icon pf-icon-green">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-brand-darkText text-sm">Online Quran</h4>
                <p className="text-xs text-brand-mediumText">24/7 · Flexible timings</p>
              </div>
            </div>
            <Toggle label="Interested?" checked={data.quranInterest} onChange={(v) => updateData({ quranInterest: v })} />
          </div>

          {data.quranInterest && (
            <div className="mt-5 pt-5 border-t border-brand-lightGray space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-700">Student details are pre-filled from your application. You can edit them below.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <InputField label="Name" value={data.pendingQuranName || ""} onChange={(e) => updateData({ pendingQuranName: e.target.value })} placeholder="Ahmed" />
                <InputField label="Age" type="number" value={data.pendingQuranAge || ""} onChange={(e) => updateData({ pendingQuranAge: e.target.value })} placeholder="10" />
              </div>

              <div>
                <label className="text-sm font-semibold text-brand-darkText block mb-2">
                  What does the student want to learn?
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {QURAN_SUBJECT_OPTIONS.map(subject => {
                    const active = (data.pendingQuranSubjects || []).includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() =>
                          updateData({
                            pendingQuranSubjects: active
                              ? (data.pendingQuranSubjects || []).filter(x => x !== subject)
                              : [...(data.pendingQuranSubjects || []), subject]
                          })
                        }
                        className={`px-3 py-3 rounded-xl border text-sm font-semibold text-left transition-all ${
                          active
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-white text-brand-darkText border-brand-lightGray hover:border-emerald-400'
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </div>

              <InputField
                label="Timing"
                value={data.pendingQuranTime || ""}
                onChange={(e) => updateData({ pendingQuranTime: e.target.value })}
                placeholder="e.g. 5 PM KSA"
              />

              <button
                onClick={() => {
                  if (data.pendingQuranName && data.pendingQuranAge) {
                    updateData({
                      upsellQuranStudents: [
                        ...data.upsellQuranStudents,
                        {
                          id: Date.now().toString(),
                          name: data.pendingQuranName,
                          age: data.pendingQuranAge,
                          subjects: data.pendingQuranSubjects || [],
                          classDays: [],
                          classTime: data.pendingQuranTime || "Flexible",
                        },
                      ],
                      pendingQuranName: "",
                      pendingQuranAge: "",
                      pendingQuranTime: "",
                      pendingQuranSubjects: [],
                    });
                  }
                }}
                disabled={!data.pendingQuranName || !data.pendingQuranAge}
                className="w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-bold text-sm disabled:opacity-40"
              >
                + Add to Quran
              </button>
            </div>
          )}
        </div>
      )}

      <CouponCodeSection data={data} updateData={updateData} />

      <div className="pf-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
              Application Summary
            </h4>
            <p className="text-sm text-brand-mediumText mt-1">
              Review the main student details before final submission.
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold">
            Students ({summaryStudents.length})
          </div>
        </div>

        <div className="space-y-3">
          {summaryStudents.length > 0 ? (
            summaryStudents.map((s, i) => {
              const gv = getGV(s.grade);
              const displayCurriculum =
                s.curriculum || (gv < 10 && s.grade !== "-" ? "British Curriculum" : "—");

              return (
                <div key={s.id || i} className="pf-student-row flex items-center gap-3 p-4">
                  <div className="pf-badge" style={{ width: 34, height: 34, fontSize: 13 }}>
                    {i + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Name</p>
                      <p className="font-semibold text-[#0f2d57]">{s.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Age</p>
                      <p className="font-semibold text-[#0f2d57]">{s.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Grade</p>
                      <p className="font-semibold text-[#0f2d57]">{s.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Curriculum</p>
                      <p className="font-semibold text-[#0f2d57]">{displayCurriculum}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-800">
              No student details found yet. Please go back and complete student information.
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-black/8 mt-5">
          <div className="rounded-2xl bg-white/70 border border-black/6 p-4">
            <p className="text-gray-500 text-xs mb-1">Program</p>
            <p className="font-bold text-brand-burgundy">
              {data.leadType === LeadType.FULL_TIME
                ? "Full-Time School"
                : data.leadType === LeadType.TUITION
                ? "One-to-One Tuition"
                : data.leadType === LeadType.QURAN
                ? "Quran Classes"
                : "One-to-One Schooling"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 border border-black/6 p-4">
            <p className="text-gray-500 text-xs mb-1">Trial</p>
            {data.leadType === LeadType.TUITION ? (
              <p className="text-sm text-purple-700 font-semibold">📞 Teacher availability</p>
            ) : data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
              <p className="text-sm text-blue-700 font-semibold">📚 Teacher availability</p>
            ) : data.leadType === LeadType.QURAN ? (
              <p className="text-sm text-emerald-700 font-semibold">📖 Flexible Quran schedule</p>
            ) : (
              <div className="space-y-1">
                {summaryStudents.some((s) => getGV(s.grade) >= 10) && (
                  <p className="text-xs text-amber-700 font-semibold">
                    🕒 9:30 AM KSA | 10:30 AM UAE | 11:30 AM PAK
                  </p>
                )}
                {summaryStudents.some((s) => getGV(s.grade) > 0 && getGV(s.grade) < 10) && (
                  <p className="text-xs text-emerald-700 font-semibold">
                    🕒 3:30 PM KSA | 4:30 PM UAE | 5:30 PM PAK
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label className="text-sm font-medium text-brand-darkText mb-2 block">Final notes?</label>
        <textarea
          className="w-full glass-input rounded-xl p-4 text-sm h-24"
          placeholder="Any special requirements..."
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
        />
      </div>
    </div>
  );
};