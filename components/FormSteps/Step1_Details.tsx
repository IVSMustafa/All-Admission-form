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
import { 
  usePremiumStyles, useTilt, DRAFT_ID,  cleanAgeInput, StepProps, PField 
} from './formStepStyles';

import { Step0_Welcome } from './Step0_Welcome';
import { QuranForm } from './QuranForm';
import { TuitionForm } from './TuitionForm';
import { Step2_Program } from './Step2_Program';
import { Step3_Academics } from './Step3_Academics';
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

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
  <div className="relative overflow-x-clip">
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
                  <div key={student.id} className="pf-student-row flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
                    <div className="pf-badge">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-[#0f2d57] text-sm truncate">{student.name}</p>
                      <p className="text-xs text-brand-mediumText mt-0.5 break-words">
                        Age {student.age} · {student.grade}
                        {student.curriculum ? ` · ${student.curriculum}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
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
                  <p className="text-sm font-extrabold text-blue-700 truncate">
                    <span className="text-blue-800">{currentName}</span> is ready to enrol!
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5 truncate">
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