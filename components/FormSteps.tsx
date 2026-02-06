import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FormData, LeadType, ProgramType, Curriculum, Track, ClassMode, Student, QuranStudent, TuitionUpsellStudent } from '../types';
import { GRADES, ONE_ON_ONE_GRADES, COUNTRIES, IGCSE_SUBJECTS, TIME_SLOTS, DAYS, QURAN_LEVELS, QURAN_CLASS_TIMES, getGradeValue as getGV } from '../constants';
import { GlassCard, InputField, SelectField, Button, OptionCard, Toggle, PhoneInput } from './UI';
import { HeroCard, ProgramCard, TrustStrip, PROGRAM_CARDS_DATA, Navbar } from './LandingPage';
import { School, BookOpen, GraduationCap, CheckCircle, Calendar, MessageSquare, AlertTriangle, ArrowRight, ArrowLeft, Phone, Mail, User, Upload, Sparkles, Loader2, UserRound, Clock, ShieldCheck, Globe2 } from 'lucide-react';

interface StepProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

// --- STEP 0: WELCOME / LANDING PAGE ---
export function Step0_Welcome({ data, updateData, nextStep }: StepProps) {
  // Track quick selector values (local state that syncs with form)
  const [quickGrade, setQuickGrade] = useState(data.grade || '');
  const [quickCurriculum, setQuickCurriculum] = useState('');
  const [quickCountry, setQuickCountry] = useState(data.country || '');

  const pickProgram = (id: LeadType) => {
    updateData({ leadType: id });
    nextStep();
  };

  const handleStartTrial = () => {
    // Default to Full-Time when clicking hero CTA
    updateData({
      leadType: LeadType.FULL_TIME,
      grade: quickGrade,
      country: quickCountry
    });
    nextStep();
  };

  const handleBookConsultation = () => {
    // Could open a modal or navigate to consultation booking
    // For now, go to tuition path
    updateData({ leadType: LeadType.TUITION });
    nextStep();
  };

  const handleQuickSelect = (field: string, value: string) => {
    if (field === 'grade') {
      setQuickGrade(value);
      updateData({ grade: value });
    } else if (field === 'curriculum') {
      setQuickCurriculum(value);
    } else if (field === 'country') {
      setQuickCountry(value);
      updateData({ country: value });
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* TOP NAVBAR */}
      <Navbar onNavigate={(section) => {
        // Handle navigation - scroll to program cards or trigger specific actions
        if (section === 'school-trial') {
          updateData({ leadType: LeadType.FULL_TIME });
          nextStep();
        } else if (section === 'tuition-trial') {
          updateData({ leadType: LeadType.TUITION });
          nextStep();
        } else if (section === 'quran-trial') {
          updateData({ leadType: LeadType.QURAN });
          nextStep();
        }
      }} />

      {/* MAIN CONTENT - Full width with padding */}
      <div className="px-6 md:px-12 py-8 space-y-10">
        {/* HERO CARD - Full Width */}
        <HeroCard
          grade={quickGrade}
          curriculum={quickCurriculum}
          country={quickCountry}
          onStartTrial={handleStartTrial}
          onBookConsultation={handleBookConsultation}
          onQuickSelect={handleQuickSelect}
        />

        {/* PROGRAM CARDS - 2x2 Grid */}
        <section className="program-grid">
          {PROGRAM_CARDS_DATA.map((cardData) => (
            <ProgramCard
              key={cardData.id}
              {...cardData}
              onSelect={pickProgram}
            />
          ))}
        </section>

        {/* TRUST STRIP */}
        <TrustStrip />
      </div>
    </div>
  );
}


// --- STEP 1: STUDENT DETAILS (Simplified for Full-Time) ---
export const Step1_Details = ({ data, updateData, errors }: StepProps) => {
  // Use formData fields for pending student (synced in real-time for SmartPanel)
  const currentName = data.studentName;
  const currentAge = data.age;
  const currentGrade = data.grade;
  const currentCurriculum = data.curriculum;

  // Setters that sync to formData
  const setCurrentName = (name: string) => updateData({ studentName: name });
  const setCurrentAge = (age: string) => updateData({ age });
  const setCurrentGrade = (grade: string) => updateData({ grade });
  const setCurrentCurriculum = (curriculum: Curriculum | null) => updateData({ curriculum });

  // Age to Grade recommendation mapping
  const getRecommendedGrade = (age: number): string => {
    const mapping: Record<number, string> = {
      3: 'FS1 (Playgroup)', 4: 'FS2', 5: 'FS3',
      6: 'Grade 1', 7: 'Grade 2', 8: 'Grade 3', 9: 'Grade 4', 10: 'Grade 5',
      11: 'Grade 6', 12: 'Grade 7', 13: 'Grade 8', 14: 'Grade 9', 15: 'Grade 10',
      16: 'Grade 11', 17: 'Grade 12',
    };
    return mapping[age] || '';
  };

  const ageNum = parseInt(currentAge) || 0;
  const recommendedGrade = getRecommendedGrade(ageNum);
  const isAgeAboveLimit = ageNum > 17;

  const gradeVal = getGV(currentGrade);
  const showCurriculum = gradeVal >= 10; // Grade 8 or higher

  const addStudent = () => {
    if (!currentName.trim() || !currentAge || !currentGrade) return;
    if (showCurriculum && !currentCurriculum) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      name: currentName.trim(),
      age: currentAge,
      grade: currentGrade,
      curriculum: showCurriculum ? currentCurriculum : null,
    };

    // Add student and clear pending fields
    updateData({
      students: [...data.students, newStudent],
      studentName: '',
      age: '',
      grade: '',
      curriculum: null
    });
  };

  const removeStudent = (id: string) => {
    updateData({ students: data.students.filter(s => s.id !== id) });
  };

  const editStudent = (student: Student) => {
    // Remove from list and populate pending fields for editing
    updateData({
      students: data.students.filter(s => s.id !== student.id),
      studentName: student.name,
      age: student.age,
      grade: student.grade,
      curriculum: student.curriculum
    });
  };

  // For Full-Time and One-on-One Schooling lead types, show multi-student form
  if (data.leadType === LeadType.FULL_TIME || data.leadType === LeadType.ONE_ON_ONE_SCHOOLING) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-brand-darkText">
            {data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? 'One-to-One Schooling' : 'Student Information'}
          </h2>
          <p className="text-brand-mediumText text-sm mt-1">Add each student who will be enrolling</p>
        </div>

        {/* Parent/Guardian Info - Always visible */}
        <div className="p-6 rounded-2xl bg-white/60 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide">Parent / Guardian Details</h3>
          <div className="space-y-4">
            <InputField
              label="Parent Name"
              value={data.parentName}
              onChange={(e) => updateData({ parentName: e.target.value })}
              placeholder="e.g. Mr. Khan"
              required
              error={errors.parentName}
            />
            <PhoneInput
              label="WhatsApp Number"
              country={data.country || 'Other'}
              phone={data.whatsapp}
              onPhoneChange={(phone) => updateData({ whatsapp: phone })}
              onCountryChange={(country) => updateData({ country })}
              required
              error={errors.whatsapp}
            />
          </div>
        </div>

        {/* Added Students List */}
        {data.students.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-brand-mediumText">Added Students ({data.students.length})</h3>
            {data.students.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-4 rounded-xl bg-white/70 border border-brand-lightGray">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-brand-darkText">{student.name}</p>
                    <p className="text-xs text-brand-mediumText">
                      Age {student.age} • {student.grade}
                      {student.curriculum && ` • ${student.curriculum}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => editStudent(student)}
                    className="text-brand-burgundy hover:text-brand-orange text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeStudent(student.id)}
                    className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Student Form */}
        <div className="p-6 rounded-2xl bg-white/50 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide">
            {data.students.length > 0 ? 'Add Another Student' : 'Add Student'}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <InputField
              label="Student Name"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="e.g. Ahmed Khan"
              required
            />
            <InputField
              label="Age"
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="e.g. 10"
              required
            />
            <SelectField
              label="Grade"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              options={GRADES}
              required
            />
          </div>

          {/* Age-based recommendation */}
          {ageNum > 0 && !isAgeAboveLimit && recommendedGrade && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              <strong>Recommended:</strong> Based on age {ageNum}, we suggest <strong>{recommendedGrade}</strong>
            </div>
          )}

          {isAgeAboveLimit && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
              <strong>Don't worry!</strong> Our advisor will guide you through the best options for your child's age.
            </div>
          )}

          {/* Curriculum Selection for Grade 8+ */}
          {showCurriculum && (
            <div className="pt-4 border-t border-brand-lightGray/50">
              <p className="text-sm font-medium text-brand-burgundy mb-3">Select Curriculum <span className="text-red-500">*</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: Curriculum.FEDERAL, label: 'Federal Board', desc: 'Matric/FSc' },
                  { value: Curriculum.IGCSE_O_LEVEL, label: 'IGCSE / O-Level', desc: 'Cambridge' },
                  { value: Curriculum.A_LEVEL, label: 'A-Level', desc: 'Advanced' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCurrentCurriculum(value)}
                    className={`p-4 rounded-xl border text-left transition-all ${currentCurriculum === value
                      ? 'bg-brand-orange/10 border-brand-orange text-brand-burgundy'
                      : 'bg-white/60 border-brand-lightGray text-brand-mediumText hover:border-brand-orange/30'
                      }`}
                  >
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs opacity-70">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={addStudent}
            disabled={!currentName.trim() || !currentAge || !currentGrade || (showCurriculum && !currentCurriculum)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-burgundy font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-lg">+</span> Add Student
          </button>
        </div>
      </div>
    );
  }

  // Quran-specific form with multi-student support
  if (data.leadType === LeadType.QURAN) {
    const handleDayToggle = (day: string) => {
      const currentDays = data.quranClassDays || [];
      if (currentDays.includes(day)) {
        updateData({ quranClassDays: currentDays.filter(d => d !== day) });
      } else {
        updateData({ quranClassDays: [...currentDays, day] });
      }
    };

    const addQuranStudent = () => {
      if (!data.studentName.trim() || !data.age || (data.quranClassDays || []).length === 0 || !data.quranClassTime) return;

      const newStudent: QuranStudent = {
        id: Date.now().toString(),
        name: data.studentName.trim(),
        age: data.age,
        classDays: data.quranClassDays,
        classTime: data.quranClassTime,
      };

      updateData({
        quranStudents: [...(data.quranStudents || []), newStudent],
        studentName: '',
        age: '',
        quranClassDays: [],
        quranClassTime: '',
      });
    };

    const removeQuranStudent = (id: string) => {
      updateData({ quranStudents: (data.quranStudents || []).filter(s => s.id !== id) });
    };

    const editQuranStudent = (student: QuranStudent) => {
      updateData({
        quranStudents: (data.quranStudents || []).filter(s => s.id !== student.id),
        studentName: student.name,
        age: student.age,
        quranClassDays: student.classDays,
        quranClassTime: student.classTime,
      });
    };

    const canAddStudent = data.studentName.trim() && data.age && (data.quranClassDays || []).length > 0 && data.quranClassTime;

    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-brand-darkText">Quran Classes Registration</h2>
          <p className="text-brand-mediumText text-sm mt-1">We are available 24/7 for your convenience</p>
        </div>

        {/* Parent/Guardian Info - Always visible at top */}
        <div className="p-6 rounded-2xl bg-white/60 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide flex items-center gap-2">
            <UserRound className="w-4 h-4" />
            Parent / Guardian Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Parent Name"
              value={data.parentName}
              onChange={(e) => updateData({ parentName: e.target.value })}
              placeholder="e.g. Mr. Khan"
              required
              error={errors.parentName}
            />
            <PhoneInput
              label="WhatsApp Number"
              country={data.country || 'Other'}
              phone={data.whatsapp}
              onPhoneChange={(phone) => updateData({ whatsapp: phone })}
              onCountryChange={(country) => updateData({ country })}
              required
              error={errors.whatsapp}
            />
          </div>
        </div>

        {/* Country for Time Confirmation - Shared by all students */}
        <div className="p-6 rounded-2xl bg-white/60 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            Location (for Time Confirmation)
          </h3>
          <SelectField
            label="Country You Live In"
            value={data.quranStudentCountry}
            onChange={(e) => updateData({ quranStudentCountry: e.target.value })}
            options={COUNTRIES}
            required
            error={errors.quranStudentCountry}
          />
          <p className="text-xs text-brand-mediumText bg-amber-50 p-3 rounded-lg border border-amber-200">
            <strong>Note:</strong> We will confirm the class timing based on your country's local time.
          </p>
        </div>

        {/* Added Students List */}
        {(data.quranStudents || []).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-brand-mediumText flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Enrolled Students ({data.quranStudents.length})
            </h3>
            {data.quranStudents.map((student, idx) => (
              <div key={student.id} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-brand-darkText">{student.name}</p>
                      <p className="text-xs text-brand-mediumText">Age {student.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editQuranStudent(student)}
                      className="text-brand-burgundy hover:text-brand-orange text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeQuranStudent(student.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-200/50">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {student.classTime}
                    </span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {student.classDays.map(d => d.slice(0, 3)).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Student Form */}
        <div className="p-6 rounded-2xl bg-white/50 border border-brand-lightGray border-dashed space-y-5">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4" />
            {(data.quranStudents || []).length > 0 ? 'Add Another Student' : 'Add Student'}
          </h3>

          {/* Student Name & Age */}
          <div className="grid md:grid-cols-2 gap-4">
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

          {/* Class Days - Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-darkText">
                Class Days <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                ✓ Available 24/7
              </span>
            </div>
            <p className="text-xs text-brand-mediumText">Select preferred class days (you can choose any days)</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all ${(data.quranClassDays || []).includes(day)
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-white/70 text-brand-mediumText border-brand-lightGray hover:border-emerald-400 hover:bg-emerald-50'
                    }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Class Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-darkText block">
              Preferred Class Time <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-brand-mediumText">Each class is 30 minutes duration</p>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-mediumText" />
              <select
                value={data.quranClassTime}
                onChange={(e) => updateData({ quranClassTime: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-lightGray bg-white/70 text-brand-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select your preferred time</option>
                {QURAN_CLASS_TIMES.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Student Button */}
          <button
            onClick={addQuranStudent}
            disabled={!canAddStudent}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-lg">+</span> Add Student
          </button>
        </div>

        {/* Validation Error for Students */}
        {errors.quranStudents && (
          <p className="text-sm text-red-500 flex items-center gap-1 justify-center">
            <AlertTriangle className="w-4 h-4" />
            {errors.quranStudents}
          </p>
        )}
      </div>
    );
  }

  // Tuition-specific form with simplified fields
  if (data.leadType === LeadType.TUITION) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-brand-darkText">One-to-One Tuition Classes</h2>
          <p className="text-brand-mediumText text-sm mt-1">Tell us about your requirements - our advisor will contact you shortly</p>
        </div>

        {/* Parent/Guardian Info */}
        <div className="p-6 rounded-2xl bg-white/60 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide flex items-center gap-2">
            <UserRound className="w-4 h-4" />
            Parent / Guardian Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Parent Name"
              value={data.parentName}
              onChange={(e) => updateData({ parentName: e.target.value })}
              placeholder="e.g. Mr. Khan"
              required
              error={errors.parentName}
            />
            <PhoneInput
              label="WhatsApp Number"
              country={data.country || 'Other'}
              phone={data.whatsapp}
              onPhoneChange={(phone) => updateData({ whatsapp: phone })}
              onCountryChange={(country) => updateData({ country })}
              required
              error={errors.whatsapp}
            />
          </div>
        </div>

        {/* Student Info */}
        <div className="p-6 rounded-2xl bg-white/60 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4" />
            Student Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Student Name"
              value={data.studentName}
              onChange={(e) => updateData({ studentName: e.target.value })}
              placeholder="e.g. Ahmed Khan"
              required
              error={errors.studentName}
            />
            <InputField
              label="Age"
              type="number"
              value={data.age}
              onChange={(e) => updateData({ age: e.target.value })}
              placeholder="e.g. 12"
              required
              error={errors.age}
            />
          </div>
        </div>

        {/* Requirements Text Area */}
        <div className="p-6 rounded-2xl bg-white/60 border border-brand-lightGray space-y-4">
          <h3 className="text-sm font-semibold text-brand-burgundy uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Class Requirements
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-darkText block">
              Describe what you're looking for <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-brand-mediumText">
              Please mention the subjects, current grade, and type of classes you need (e.g., exam prep, regular tuition, homework help)
            </p>
            <textarea
              value={data.tuitionRequirements}
              onChange={(e) => updateData({ tuitionRequirements: e.target.value })}
              placeholder="e.g., Looking for Mathematics and Science tuition for Grade 8 student (Federal Board). Need help with exam preparation and regular weekly classes..."
              className={`w-full min-h-[140px] p-4 rounded-xl border ${errors.tuitionRequirements ? 'border-red-400' : 'border-brand-lightGray'} bg-white/70 text-brand-darkText placeholder:text-brand-mediumText/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all resize-none`}
              required
            />
            {errors.tuitionRequirements && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.tuitionRequirements}
              </p>
            )}
          </div>
        </div>

        {/* Agent Contact Info Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-orange/10 to-emerald-500/10 border border-brand-orange/20 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-burgundy/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-brand-burgundy" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-burgundy">Our Advisor Will Contact You</h4>
              <p className="text-sm text-brand-mediumText">
                Based on your requirements, we'll match you with the best tutor and confirm class timings via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default form for Crash Course (similar to old tuition form)
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold">Student Details</h2>
        <p className="text-brand-mediumText">We need this to assign the correct program.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Student Full Name"
          value={data.studentName}
          onChange={(e) => updateData({ studentName: e.target.value })}
          placeholder="e.g. John Doe"
          required
          error={errors.studentName}
        />
        <SelectField
          label="Current Grade"
          value={data.grade}
          onChange={(e) => updateData({ grade: e.target.value })}
          options={GRADES}
          required
          error={errors.grade}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SelectField
          label="Country"
          value={data.country}
          onChange={(e) => updateData({ country: e.target.value })}
          options={COUNTRIES}
          required
          error={errors.country}
        />
        <InputField
          label="City"
          value={data.city}
          onChange={(e) => updateData({ city: e.target.value })}
          placeholder="e.g. Riyadh"
          required
          error={errors.city}
        />
      </div>

      <div className="border-t border-brand-lightGray pt-6">
        <h3 className="text-lg font-medium text-brand-burgundy mb-4">Parent/Contact Info</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Parent/Guardian Name"
            value={data.parentName}
            onChange={(e) => updateData({ parentName: e.target.value })}
            required
            error={errors.parentName}
          />
          <PhoneInput
            label="WhatsApp Number"
            country={data.country || 'Other'}
            phone={data.whatsapp}
            onPhoneChange={(phone) => updateData({ whatsapp: phone })}
            onCountryChange={(country) => updateData({ country })}
            required
            error={errors.whatsapp}
          />
          <InputField
            label="Email Address"
            icon={Mail}
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="parent@example.com"
            error={errors.email}
          />
        </div>
      </div>
    </div>
  );
};

// --- STEP 2: PROGRAM ---
export const Step2_Program = ({ data, updateData }: StepProps) => {
  // Auto-logic for preselection is handled in parent, but we enforce visuals here
  const ageNum = parseInt(data.age) || 0;

  const isSchoolLocked = data.leadType === LeadType.FULL_TIME;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold">Choose Program</h2>
        <p className="text-brand-mediumText">Select the program that fits your academic goals.</p>
      </div>

      <div className="grid gap-4">
        <OptionCard
          title="Full-time School"
          description="Regular schooling (KG1-12) with daily classes, assignments, and exams."
          icon={School}
          selected={data.programType === ProgramType.FULL_TIME}
          onClick={() => updateData({ programType: ProgramType.FULL_TIME })}
        />

        {isSchoolLocked && ageNum <= 20 ? null : (
          <>
            <OptionCard
              title="Tuition (1-on-1)"
              description="Personalized coaching for specific subjects or exam prep."
              icon={BookOpen}
              selected={data.programType === ProgramType.TUITION}
              onClick={() => updateData({ programType: ProgramType.TUITION })}
            />
            <OptionCard
              title="One-to-One Schooling"
              description="Full school curriculum with personal teacher (up to Grade 7)."
              icon={GraduationCap}
              selected={data.programType === ProgramType.ONE_ON_ONE_SCHOOLING}
              onClick={() => updateData({ programType: ProgramType.ONE_ON_ONE_SCHOOLING })}
            />
          </>
        )}
      </div>

      {ageNum > 20 && data.programType === ProgramType.FULL_TIME && (
        <div className="flex items-center gap-3 text-yellow-300 text-sm bg-yellow-900/30 p-4 rounded-xl border border-yellow-500/30">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>We usually recommend Tuition for learners over 20, but you may proceed if applying for Grade 11/12 specific credits.</p>
        </div>
      )}
    </div>
  );
};

// --- STEP 3: ACADEMICS ---
export const Step3_Academics = ({ data, updateData }: StepProps) => {
  // Auto-set defaults based on previous inputs
  useEffect(() => {
    if (data.programType === ProgramType.FULL_TIME && !data.curriculum) {
      const gradeVal = getGV(data.grade);
      if (gradeVal >= 1 && gradeVal <= 9) updateData({ curriculum: Curriculum.BRITISH });
      else if (gradeVal >= 10) updateData({ curriculum: Curriculum.FEDERAL });
    }
  }, [data.programType, data.grade]);

  const handleSubjectToggle = (sub: string) => {
    const current = data.subjects || [];
    if (current.includes(sub)) {
      updateData({ subjects: current.filter(s => s !== sub) });
    } else {
      updateData({ subjects: [...current, sub] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold">Academic Preferences</h2>
        <p className="text-brand-mediumText">Customize the learning path.</p>
      </div>

      {/* FULL TIME LOGIC */}
      {data.programType === ProgramType.FULL_TIME && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <OptionCard
              title="British Curriculum"
              description="Cambridge/Edexcel style (KG1 - Grade 7)"
              selected={data.curriculum === Curriculum.BRITISH}
              onClick={() => updateData({ curriculum: Curriculum.BRITISH })}
            />
            <OptionCard
              title="Federal Board (FBISE)"
              description="Pakistan Federal Board (Grade 8 - 12)"
              selected={data.curriculum === Curriculum.FEDERAL}
              onClick={() => updateData({ curriculum: Curriculum.FEDERAL })}
            />
            <OptionCard
              title="IGCSE / O-Level Prep"
              description="Preparatory classes"
              selected={data.curriculum === Curriculum.IGCSE_O_LEVEL}
              onClick={() => updateData({ curriculum: Curriculum.IGCSE_O_LEVEL })}
            />
            <OptionCard
              title="A-Level Prep"
              description="Advanced Level Preparatory"
              selected={data.curriculum === Curriculum.A_LEVEL}
              onClick={() => updateData({ curriculum: Curriculum.A_LEVEL })}
            />
          </div>

          {/* Sub-options for British */}
          {data.curriculum === Curriculum.BRITISH && (
            <GlassCard className="space-y-4">
              <h4 className="font-medium text-brand-burgundy">Optional Subjects</h4>
              <Toggle label="Include Islamic Studies?" checked={data.britishIslamicStudies} onChange={(v) => updateData({ britishIslamicStudies: v })} />
              <Toggle label="Include Urdu?" checked={data.britishUrdu} onChange={(v) => updateData({ britishUrdu: v })} />
              <div className="pt-2">
                <label className="text-sm text-brand-mediumText mb-1 block">Learning Support Notes (Optional)</label>
                <textarea
                  className="w-full glass-input rounded-xl p-3 text-sm h-24"
                  placeholder="Any specific learning needs?"
                  value={data.learningNotes}
                  onChange={(e) => updateData({ learningNotes: e.target.value })}
                />
              </div>
            </GlassCard>
          )}

          {/* Sub-options for Federal */}
          {data.curriculum === Curriculum.FEDERAL && (
            <GlassCard className="space-y-4">
              {data.grade === 'Grade 8' && (
                <div className="text-sm text-brand-burgundy bg-brand-orange/10 p-3 rounded-lg border border-cyan-500/20">
                  Note: Grade 8 follows the Pre-9th curriculum foundation.
                </div>
              )}
              <SelectField
                label="Select Track/Group"
                value={data.track || ''}
                onChange={(e) => updateData({ track: e.target.value as Track })}
                options={[Track.SCIENCE, Track.ARTS, Track.COMPUTER, Track.NOT_SURE]}
                required
              />
            </GlassCard>
          )}
        </div>
      )}

      {/* TUITION / IGCSE / A-Level LOGIC */}
      {(data.programType === ProgramType.TUITION || data.curriculum === Curriculum.IGCSE_O_LEVEL || data.curriculum === Curriculum.A_LEVEL) && (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="font-medium text-brand-burgundy mb-4">Select Subjects</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {IGCSE_SUBJECTS.map(sub => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSubjectToggle(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${data.subjects.includes(sub)
                    ? 'bg-brand-orange text-brand-dark border-brand-orange'
                    : 'bg-white/60 text-brand-mediumText border-brand-lightGray hover:border-brand-burgundy/30'
                    }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            <InputField
              label="Other Subject (if not listed)"
              value={data.customSubject}
              onChange={(e) => updateData({ customSubject: e.target.value })}
            />
          </GlassCard>

          {data.programType === ProgramType.TUITION && (
            <GlassCard>
              <div className="text-sm text-green-400 mb-4 bg-green-900/20 p-2 rounded border border-green-500/20 text-center">
                Discounts of 10–15% may apply depending on subject bundles.
              </div>
              <SelectField
                label="Board / Curriculum"
                value={data.tuitionBoard}
                onChange={(e) => updateData({ tuitionBoard: e.target.value })}
                options={[Curriculum.FEDERAL, Curriculum.BRITISH, Curriculum.IGCSE_O_LEVEL, Curriculum.A_LEVEL, Curriculum.OTHER]}
              />
            </GlassCard>
          )}

          {/* Class Mode for IGCSE/O/A */}
          {(data.curriculum === Curriculum.IGCSE_O_LEVEL || data.curriculum === Curriculum.A_LEVEL) && (
            <div className="grid grid-cols-2 gap-4">
              <OptionCard
                title="Group Class"
                description="Collaborative learning"
                selected={data.igcseClassMode === ClassMode.GROUP}
                onClick={() => updateData({ igcseClassMode: ClassMode.GROUP })}
              />
              <OptionCard
                title="One-on-One"
                description="Premium attention"
                selected={data.igcseClassMode === ClassMode.ONE_ON_ONE}
                onClick={() => updateData({ igcseClassMode: ClassMode.ONE_ON_ONE })}
              />
            </div>
          )}

          <GlassCard>
            <h4 className="font-medium text-brand-burgundy mb-2">Preferred Time Slots (Select up to 3)</h4>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    const current = data.preferredTimeSlots;
                    if (current.includes(slot)) updateData({ preferredTimeSlots: current.filter(s => s !== slot) });
                    else if (current.length < 3) updateData({ preferredTimeSlots: [...current, slot] });
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${data.preferredTimeSlots.includes(slot)
                    ? 'bg-brand-orange text-brand-darkText border-brand-orange'
                    : 'bg-white/60 text-brand-mediumText border-brand-lightGray'
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

// --- STEP 4: TRIAL CONFIRMATION + UPSELL + COUPON ---
export const Step4_Trial = ({ data, updateData }: StepProps) => {
  const gradeVal = getGV(data.grade);
  const isMorning = gradeVal >= 10;

  const trialText = isMorning
    ? "Morning: 9:00 AM KSA / 10:00 AM UAE / 11:00 AM PKT"
    : "Evening: 3:30 PM KSA / 4:30 PM UAE / 5:30 PM PKT";

  // Get first student name for personalization
  const studentName = data.students.length > 0 ? data.students[0].name : data.studentName || 'your child';

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold">Confirm Trial Class</h2>
        <p className="text-brand-mediumText">Almost there! Just a few more details.</p>
      </div>

      {/* Trial Time Slot */}
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-brand-burgundy to-brand-orange">
        <div className="bg-brand-cream rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-brand-mediumText uppercase tracking-widest text-xs font-bold">Assigned Slot</h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-darkText leading-relaxed">{trialText}</p>
          <div className="flex items-center justify-center gap-2 text-brand-burgundy text-sm">
            <Calendar className="w-4 h-4" />
            <span>Duration: {data.leadType === LeadType.FULL_TIME ? '3 Days' : '1 Day'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <OptionCard
          title="Yes, I can attend this time"
          selected={data.trialConfirmed}
          onClick={() => updateData({ trialConfirmed: true, trialReason: '' })}
          icon={CheckCircle}
        />
        <OptionCard
          title="Need a different day / time"
          selected={!data.trialConfirmed}
          onClick={() => updateData({ trialConfirmed: false })}
          icon={Calendar}
        />
      </div>

      {!data.trialConfirmed && (
        <GlassCard className="animate-fade-in space-y-4">
          <SelectField
            label="Reason for change"
            value={data.trialReason}
            onChange={(e) => updateData({ trialReason: e.target.value })}
            options={['Schedule Conflict', 'Timezone Issue', 'Request Advisor Call Instead']}
          />
          {data.trialReason !== 'Request Advisor Call Instead' && (
            <SelectField
              label="Preferred Day to Start"
              value={data.trialPreferredDay}
              onChange={(e) => updateData({ trialPreferredDay: e.target.value })}
              options={DAYS}
            />
          )}
        </GlassCard>
      )}

      {/* UPSELL SECTION - Tuition & Quran */}
      <div className="space-y-4 pt-6 border-t border-brand-lightGray">
        <h3 className="text-lg font-semibold text-brand-burgundy flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-orange" />
          Would you like to add more for {studentName}?
        </h3>

        {/* Tuition Upsell */}
        {data.leadType !== LeadType.TUITION && (
          <GlassCard highlight={data.tuitionInterest} className="transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-darkText">1-on-1 Tuition Classes</h4>
                  <p className="text-xs text-brand-mediumText">Extra subject coaching for better grades</p>
                </div>
              </div>
              <Toggle
                label="Interested?"
                checked={data.tuitionInterest}
                onChange={(v) => updateData({ tuitionInterest: v })}
              />
            </div>
          </GlassCard>
        )}

        {/* Quran Classes Upsell */}
        <GlassCard highlight={data.quranInterest} className="transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-darkText">Online Quran Classes</h4>
                <p className="text-xs text-brand-mediumText">Available 24/7 (Extra charges apply)</p>
              </div>
            </div>
            <Toggle
              label="Interested?"
              checked={data.quranInterest}
              onChange={(v) => updateData({ quranInterest: v })}
            />
          </div>

          {data.quranInterest && (
            <div className="grid md:grid-cols-2 gap-4 mt-4 animate-fade-in border-t border-brand-lightGray pt-4">
              <SelectField
                label="Level"
                value={data.quranLevel}
                onChange={(e) => updateData({ quranLevel: e.target.value })}
                options={QURAN_LEVELS}
              />
              <InputField
                label="Preferred Timing"
                value={data.quranTiming}
                onChange={(e) => updateData({ quranTiming: e.target.value })}
                placeholder="e.g. 5 PM KSA"
              />
            </div>
          )}
        </GlassCard>
      </div>

      {/* COUPON CODE SECTION */}
      <div className="pt-6 border-t border-brand-lightGray">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-brand-darkText">Have a Coupon Code?</h4>
              <p className="text-xs text-brand-mediumText">Optional – Enter your promo code if you have one</p>
            </div>
          </div>
          <InputField
            label=""
            value={data.couponCode}
            onChange={(e) => updateData({ couponCode: e.target.value.toUpperCase() })}
            placeholder="e.g. WELCOME2024"
          />
        </GlassCard>
      </div>

      {/* FINAL NOTES */}
      <div className="pt-4">
        <label className="text-sm font-medium text-brand-darkText mb-2 block">
          Any questions or special requests? (Optional)
        </label>
        <textarea
          className="w-full glass-input rounded-xl p-4 text-sm h-24"
          placeholder="Let us know if you have any specific requirements..."
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
        />
      </div>
    </div>
  );
};

// --- STEP 5: SUMMARY & ADDONS ---
export const Step5_Summary = ({ data, updateData }: StepProps) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold">Final Steps</h2>
        <p className="text-brand-mediumText">Review and add extras.</p>
      </div>

      {/* QURAN ADDON */}
      <GlassCard highlight={data.quranInterest}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-brand-darkText">Online Quran Classes</h4>
              <p className="text-xs text-brand-mediumText">Available 24/7 (Extra charges apply)</p>
            </div>
          </div>
          <Toggle label="Interested?" checked={data.quranInterest} onChange={(v) => updateData({ quranInterest: v })} />
        </div>

        {data.quranInterest && (
          <div className="grid md:grid-cols-2 gap-4 mt-4 animate-fade-in border-t border-brand-lightGray pt-4">
            <SelectField
              label="Level"
              value={data.quranLevel}
              onChange={(e) => updateData({ quranLevel: e.target.value })}
              options={QURAN_LEVELS}
            />
            <InputField
              label="Preferred Timing"
              value={data.quranTiming}
              onChange={(e) => updateData({ quranTiming: e.target.value })}
              placeholder="e.g. 5 PM KSA"
            />
          </div>
        )}
      </GlassCard>

      {/* SUMMARY */}
      <div className="bg-white/50 rounded-2xl p-6 space-y-4 border border-brand-lightGray">
        <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2">Application Summary</h4>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/70 overflow-hidden flex-shrink-0 border border-brand-burgundy/20">
            {data.avatar ? (
              <img src={data.avatar} className="w-full h-full object-cover" alt="Student" />
            ) : (
              <User className="w-full h-full p-3 text-gray-600" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm flex-1">
            <div>
              <p className="text-gray-600">Student</p>
              <p className="text-brand-darkText font-medium">{data.studentName}</p>
            </div>
            <div>
              <p className="text-gray-600">Grade & Age</p>
              <p className="text-brand-darkText font-medium">{data.grade}, {data.age} yrs</p>
            </div>
            <div>
              <p className="text-gray-600">Program</p>
              <p className="text-brand-burgundy font-medium">{data.programType}</p>
            </div>
            <div>
              <p className="text-gray-600">Curriculum</p>
              <p className="text-brand-darkText font-medium">{data.curriculum || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Trial Schedule</p>
              <p className={`font-medium ${data.trialConfirmed ? 'text-green-400' : 'text-yellow-400'}`}>
                {data.trialConfirmed ? 'Confirmed Standard Slot' : `Custom Request: ${data.trialReason}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <textarea
          className="w-full glass-input rounded-xl p-4 text-sm h-24"
          placeholder="Any final notes or questions for the coordinator?"
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
        />
      </div>
    </div>
  );
};

// --- COUPON CODE SECTION COMPONENT ---
interface CouponSectionProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
}

// Coupon validation function - validates against env variables
const validateCoupon = (code: string): { valid: boolean; referrerName: string; discountType: string; discountValue: number; message: string } | null => {
  try {
    const couponCodes = (process.env.COUPON_CODES as unknown) as Record<string, string> || {};
    const couponKey = `COUPON_${code.toUpperCase()}`;
    const couponData = couponCodes[couponKey];

    if (couponData) {
      const [referrerName, discountType, discountValue, message] = couponData.split('|');
      return {
        valid: true,
        referrerName,
        discountType,
        discountValue: parseInt(discountValue, 10),
        message
      };
    }
    return null;
  } catch {
    return null;
  }
};

const CouponCodeSection = ({ data, updateData }: CouponSectionProps) => {
  const [couponInput, setCouponInput] = useState(data.couponCode || '');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      const result = validateCoupon(couponInput);

      if (result) {
        updateData({
          couponCode: couponInput.toUpperCase(),
          appliedCoupon: {
            referrerName: result.referrerName,
            discountType: result.discountType,
            discountValue: result.discountValue,
            message: result.message
          }
        });
        setShowPopup(true);
        setError('');
      } else {
        setError('Invalid coupon code. Please try again.');
        updateData({ couponCode: '', appliedCoupon: null });
      }
      setIsValidating(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    setCouponInput('');
    updateData({ couponCode: '', appliedCoupon: null });
    setError('');
  };

  return (
    <>
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-darkText">Coupon or Referral Code</h4>
            <p className="text-xs text-brand-mediumText">Optional – Enter if you have one</p>
          </div>
        </div>

        {data.appliedCoupon ? (
          // Applied coupon display
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">{data.couponCode}</p>
                <p className="text-xs text-emerald-600">{data.appliedCoupon.discountValue}% discount applied</p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          // Coupon input with Apply button
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="e.g. WELCOME2024"
                  className="w-full px-4 py-3 rounded-xl border border-brand-lightGray bg-white/70 text-brand-darkText placeholder:text-brand-mediumText/50 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={isValidating || !couponInput.trim()}
                className="px-6 py-3 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
        )}
      </GlassCard>

      {/* Congratulations Popup Modal */}
      {showPopup && data.appliedCoupon && (
        <div className="coupon-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Confetti/Celebration Header */}
            <div className="bg-gradient-to-br from-brand-burgundy via-brand-orange to-yellow-400 p-8 text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  🎉 Congratulations!
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <p className="text-lg text-brand-darkText mb-4">
                You are with the reference of
              </p>
              <div className="inline-block px-6 py-3 bg-brand-orange/10 rounded-xl border border-brand-orange/30 mb-4">
                <p className="text-2xl font-bold text-brand-burgundy">
                  {data.appliedCoupon.referrerName}
                </p>
              </div>
              <p className="text-xl text-brand-darkText font-medium mb-6">
                {data.appliedCoupon.message}
              </p>

              {/* Discount Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
                <CheckCircle className="w-4 h-4" />
                {data.appliedCoupon.discountValue}% OFF {data.appliedCoupon.discountType === 'REGISTRATION_FEE' ? 'Registration Fee' : 'First Month Fee'}
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-4 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-bold rounded-xl transition-all text-lg"
              >
                Continue Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- STEP 2: FINAL STEPS (Upsell + Summary) ---
export const Step2_FinalSteps = ({ data, updateData }: StepProps) => {
  // Get student info for display
  const firstStudent = data.students[0];
  const studentName = firstStudent?.name || data.studentName || 'Student';
  const studentGrade = firstStudent?.grade || data.grade || '-';
  const studentAge = firstStudent?.age || data.age || '-';
  const studentCurriculum = firstStudent?.curriculum || data.curriculum || '-';

  // Trial timing based on grade
  const gradeVal = getGV(studentGrade);
  const isMorning = gradeVal >= 10;
  const trialText = isMorning
    ? "Morning: 9:00 AM KSA"
    : "Evening: 3:30 PM KSA";

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-brand-darkText">Final Steps</h2>
        <p className="text-brand-mediumText">Review and add extras.</p>
      </div>

      {/* DISCOUNT PACKAGE BANNER - Show when multiple programs selected */}
      {((data.tuitionInterest && (data.quranInterest || data.fullTimeInterest)) ||
        (data.quranInterest && data.fullTimeInterest) ||
        (data.tuitionInterest && data.quranInterest)) && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h4 className="font-bold text-amber-800">Package Deal!</h4>
                <p className="text-sm text-amber-700">Register for multiple programs and get a discounted package. Our advisor will share details!</p>
              </div>
            </div>
          </div>
        )}

      {/* FULL-TIME SCHOOL UPSELL - Show for Tuition and Quran users */}
      {(data.leadType === LeadType.TUITION || data.leadType === LeadType.QURAN) && (
        <GlassCard highlight={data.fullTimeInterest} className="transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-darkText">Full-Time School</h4>
                <p className="text-xs text-brand-mediumText">Complete curriculum with 3-day free trial</p>
              </div>
            </div>
            <Toggle
              label="Interested?"
              checked={data.fullTimeInterest}
              onChange={(v) => updateData({ fullTimeInterest: v })}
            />
          </div>

          {/* Inline Form for School Upsell */}
          {data.fullTimeInterest && (
            <div className="mt-4 pt-4 border-t border-brand-lightGray animate-fade-in space-y-4">
              <p className="text-xs text-brand-mediumText">Add student for Full-Time School:</p>

              {/* Added School Upsell Students */}
              {data.upsellSchoolStudents.length > 0 && (
                <div className="space-y-2">
                  {data.upsellSchoolStudents.map((student, idx) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-blue-800">{student.name}</p>
                          <p className="text-xs text-blue-600">Age {student.age} • {student.grade}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateData({ upsellSchoolStudents: data.upsellSchoolStudents.filter(s => s.id !== student.id) })}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-3">
                <InputField
                  label="Student Name"
                  value={data.pendingSchoolName}
                  onChange={(e) => updateData({ pendingSchoolName: e.target.value })}
                  placeholder="e.g. Ahmed"
                />
                <InputField
                  label="Age"
                  type="number"
                  value={data.pendingSchoolAge}
                  onChange={(e) => updateData({ pendingSchoolAge: e.target.value })}
                  placeholder="e.g. 10"
                />
                <SelectField
                  label="Grade"
                  value={data.pendingSchoolGrade}
                  onChange={(e) => updateData({ pendingSchoolGrade: e.target.value })}
                  options={GRADES}
                />
              </div>
              <button
                onClick={() => {
                  if (data.pendingSchoolName && data.pendingSchoolAge && data.pendingSchoolGrade) {
                    updateData({
                      upsellSchoolStudents: [...data.upsellSchoolStudents, {
                        id: Date.now().toString(),
                        name: data.pendingSchoolName,
                        age: data.pendingSchoolAge,
                        grade: data.pendingSchoolGrade,
                        curriculum: null
                      }],
                      pendingSchoolName: '',
                      pendingSchoolAge: '',
                      pendingSchoolGrade: ''
                    });
                  }
                }}
                disabled={!data.pendingSchoolName || !data.pendingSchoolAge || !data.pendingSchoolGrade}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-700 font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + Add Student to Full-Time
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* TUITION UPSELL - Show for Full-Time, Quran, and One-to-One users */}
      {data.leadType !== LeadType.TUITION && (
        <GlassCard highlight={data.tuitionInterest} className="transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-darkText">1-on-1 Tuition Classes</h4>
                <p className="text-xs text-brand-mediumText">Extra subject coaching for better performance</p>
              </div>
            </div>
            <Toggle
              label="Interested?"
              checked={data.tuitionInterest}
              onChange={(v) => updateData({ tuitionInterest: v })}
            />
          </div>

          {/* Inline Form for Tuition Upsell */}
          {data.tuitionInterest && (
            <div className="mt-4 pt-4 border-t border-brand-lightGray animate-fade-in space-y-4">
              <p className="text-xs text-brand-mediumText">Add student for Tuition classes:</p>

              {/* Added Tuition Upsell Students */}
              {data.upsellTuitionStudents.length > 0 && (
                <div className="space-y-2">
                  {data.upsellTuitionStudents.map((student, idx) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-purple-800">{student.name}</p>
                          <p className="text-xs text-purple-600">Age {student.age}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateData({ upsellTuitionStudents: data.upsellTuitionStudents.filter(s => s.id !== student.id) })}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                <InputField
                  label="Student Name"
                  value={data.pendingTuitionName || ''}
                  onChange={(e) => updateData({ pendingTuitionName: e.target.value })}
                  placeholder="e.g. Ahmed"
                />
                <InputField
                  label="Age"
                  type="number"
                  value={data.pendingTuitionAge || ''}
                  onChange={(e) => updateData({ pendingTuitionAge: e.target.value })}
                  placeholder="e.g. 10"
                />
              </div>
              <InputField
                label="What subjects/requirements?"
                value={data.pendingTuitionReq || ''}
                onChange={(e) => updateData({ pendingTuitionReq: e.target.value })}
                placeholder="e.g. Math Grade 8, Science revision..."
              />
              <button
                onClick={() => {
                  if (data.pendingTuitionName && data.pendingTuitionAge) {
                    updateData({
                      upsellTuitionStudents: [...data.upsellTuitionStudents, {
                        id: Date.now().toString(),
                        name: data.pendingTuitionName,
                        age: data.pendingTuitionAge,
                        requirements: data.pendingTuitionReq || ''
                      }],
                      pendingTuitionName: '',
                      pendingTuitionAge: '',
                      pendingTuitionReq: ''
                    });
                  }
                }}
                disabled={!data.pendingTuitionName || !data.pendingTuitionAge}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + Add Student to Tuition
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* QURAN ADDON - Show for all except when Quran is the main program */}
      {data.leadType !== LeadType.QURAN && (
        <GlassCard highlight={data.quranInterest}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-darkText">Online Quran Classes</h4>
                <p className="text-xs text-brand-mediumText">Available 24/7 • Flexible scheduling</p>
              </div>
            </div>
            <Toggle label="Interested?" checked={data.quranInterest} onChange={(v) => updateData({ quranInterest: v })} />
          </div>

          {/* Inline Form for Quran Upsell */}
          {data.quranInterest && (
            <div className="mt-4 pt-4 border-t border-brand-lightGray animate-fade-in space-y-4">
              <p className="text-xs text-brand-mediumText">Add student for Quran classes:</p>

              {/* Added Quran Upsell Students */}
              {data.upsellQuranStudents.length > 0 && (
                <div className="space-y-2">
                  {data.upsellQuranStudents.map((student, idx) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-emerald-800">{student.name}</p>
                          <p className="text-xs text-emerald-600">Age {student.age} • {student.classDays.join(', ')} • {student.classTime}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateData({ upsellQuranStudents: data.upsellQuranStudents.filter(s => s.id !== student.id) })}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                <InputField
                  label="Student Name"
                  value={data.pendingQuranName || ''}
                  onChange={(e) => updateData({ pendingQuranName: e.target.value })}
                  placeholder="e.g. Ahmed"
                />
                <InputField
                  label="Age"
                  type="number"
                  value={data.pendingQuranAge || ''}
                  onChange={(e) => updateData({ pendingQuranAge: e.target.value })}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <SelectField
                  label="Level"
                  value={data.quranLevel}
                  onChange={(e) => updateData({ quranLevel: e.target.value })}
                  options={QURAN_LEVELS}
                />
                <InputField
                  label="Preferred Timing"
                  value={data.pendingQuranTime || ''}
                  onChange={(e) => updateData({ pendingQuranTime: e.target.value })}
                  placeholder="e.g. 5 PM KSA"
                />
              </div>
              <button
                onClick={() => {
                  if (data.pendingQuranName && data.pendingQuranAge) {
                    updateData({
                      upsellQuranStudents: [...data.upsellQuranStudents, {
                        id: Date.now().toString(),
                        name: data.pendingQuranName,
                        age: data.pendingQuranAge,
                        classDays: [],
                        classTime: data.pendingQuranTime || 'Flexible'
                      }],
                      pendingQuranName: '',
                      pendingQuranAge: '',
                      pendingQuranTime: ''
                    });
                  }
                }}
                disabled={!data.pendingQuranName || !data.pendingQuranAge}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + Add Student to Quran Classes
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* COUPON / REFERRAL CODE */}
      <CouponCodeSection data={data} updateData={updateData} />

      {/* APPLICATION SUMMARY */}
      <div className="bg-white/50 rounded-2xl p-6 space-y-4 border border-brand-lightGray">
        <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2">
          Application Summary
        </h4>

        {/* All Students List - conditionally show based on lead type */}
        {data.leadType === LeadType.QURAN ? (
          /* Quran Students */
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Students ({(data.quranStudents || []).length})
            </p>
            {(data.quranStudents || []).map((student, idx) => (
              <div key={student.id} className="flex items-center gap-4 p-3 bg-white/60 rounded-xl border border-brand-lightGray/50">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="text-brand-darkText font-medium">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Age</p>
                    <p className="text-brand-darkText font-medium">{student.age} yrs</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Class Days</p>
                    <p className="text-brand-darkText font-medium">{student.classDays.map(d => d.slice(0, 3)).join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Class Time</p>
                    <p className="text-brand-darkText font-medium">{student.classTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.leadType === LeadType.TUITION ? (
          /* Tuition Student - uses direct data fields */
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Student Details
            </p>
            <div className="p-4 bg-white/60 rounded-xl border border-brand-lightGray/50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Student Name</p>
                  <p className="text-brand-darkText font-medium">{data.studentName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Age</p>
                  <p className="text-brand-darkText font-medium">{data.age ? `${data.age} yrs` : '-'}</p>
                </div>
              </div>
              {data.tuitionRequirements && (
                <div className="mt-4 pt-4 border-t border-brand-lightGray/50">
                  <p className="text-gray-500 text-xs mb-1">Requirements</p>
                  <p className="text-brand-darkText text-sm leading-relaxed">{data.tuitionRequirements}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Regular School Students */
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Students ({data.students.length})
            </p>
            {data.students.map((student, idx) => {
              // Determine curriculum display - British for KG to Grade 7 if not set
              const studentGradeVal = getGV(student.grade);
              const displayCurriculum = student.curriculum
                ? student.curriculum
                : (studentGradeVal < 10 ? 'British Curriculum' : '-');

              return (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-white/60 rounded-xl border border-brand-lightGray/50">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Name</p>
                      <p className="text-brand-darkText font-medium">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Age</p>
                      <p className="text-brand-darkText font-medium">{student.age} yrs</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Grade</p>
                      <p className="text-brand-darkText font-medium">{student.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Curriculum</p>
                      <p className="text-brand-darkText font-medium">{displayCurriculum}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Program & Trial Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-brand-lightGray/50">
          <div>
            <p className="text-gray-600 text-xs">Program</p>
            <p className="text-brand-burgundy font-medium">
              {data.leadType === LeadType.FULL_TIME ? 'Full-Time School' :
                data.leadType === LeadType.TUITION ? 'Tuition' :
                  data.leadType === LeadType.QURAN ? 'Quran Classes' :
                    data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? 'One-to-One Schooling' : '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Trial Schedule ({data.leadType === LeadType.FULL_TIME ? '3 Days' : '1 Day'})</p>
            <div className="space-y-1 mt-1">
              {/* Tuition - advisor will confirm */}
              {data.leadType === LeadType.TUITION ? (
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                    📞 Our advisor will contact you to confirm timing
                  </p>
                </div>
              ) : data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
                /* One-to-One Schooling - timing based on teacher availability */
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                    📚 1 Day Free Trial
                  </p>
                  <p className="text-sm text-purple-800 font-medium">
                    Timing based on teacher availability
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Our agent will guide you on call
                  </p>
                </div>
              ) : (
                <>
                  {/* Check if any student is Grade 8+ */}
                  {data.students.some(s => getGV(s.grade) >= 10) && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                        🕒 Grade 8 to 12 (Fed, IGCSE, O&A Levels):
                      </p>
                      <p className="text-sm text-amber-800 font-medium">
                        9:30 AM KSA | 10:30 AM UAE | 11:30 AM PAK
                      </p>
                    </div>
                  )}
                  {/* Check if any student is KG1 to Grade 7 */}
                  {data.students.some(s => getGV(s.grade) < 10) && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        🕒 KG1 to Grade 7:
                      </p>
                      <p className="text-sm text-emerald-800 font-medium">
                        3:30 PM KSA | 4:30 PM UAE | 5:30 PM PAK
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* UPSELL PROGRAMS SUMMARY */}
      {(data.upsellSchoolStudents.length > 0 || data.upsellTuitionStudents.length > 0 || data.upsellQuranStudents.length > 0 ||
        (data.fullTimeInterest && data.pendingSchoolName) ||
        (data.tuitionInterest && data.pendingTuitionName) ||
        (data.quranInterest && data.pendingQuranName)) && (
          <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl p-6 space-y-4 border border-amber-200">
            <h4 className="text-sm uppercase tracking-wider font-bold text-amber-700 border-b border-amber-200 pb-2 flex items-center gap-2">
              🎁 Additional Programs (Package Deal)
            </h4>

            {/* School Upsell Students */}
            {(data.upsellSchoolStudents.length > 0 || (data.fullTimeInterest && data.pendingSchoolName)) && (
              <div className="space-y-2">
                <p className="text-xs text-blue-600 uppercase font-semibold flex items-center gap-2">
                  <School className="w-4 h-4" /> Full-Time School ({data.upsellSchoolStudents.length + (data.pendingSchoolName ? 1 : 0)})
                </p>
                {data.upsellSchoolStudents.map((student, idx) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800">{student.name}</p>
                      <p className="text-xs text-blue-600">Age {student.age} • {student.grade}</p>
                    </div>
                  </div>
                ))}
                {/* Pending School Student */}
                {data.fullTimeInterest && data.pendingSchoolName && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border-2 border-dashed border-blue-300">
                    <span className="w-6 h-6 bg-blue-400 text-white rounded-full flex items-center justify-center text-xs font-bold">{data.upsellSchoolStudents.length + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">{data.pendingSchoolName}</p>
                      <p className="text-xs text-blue-600">Age {data.pendingSchoolAge} • {data.pendingSchoolGrade || 'Grade pending'}</p>
                    </div>
                    <span className="text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">Will be added on submit</span>
                  </div>
                )}
              </div>
            )}

            {/* Tuition Upsell Students */}
            {(data.upsellTuitionStudents.length > 0 || (data.tuitionInterest && data.pendingTuitionName)) && (
              <div className="space-y-2">
                <p className="text-xs text-purple-600 uppercase font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> 1-on-1 Tuition ({data.upsellTuitionStudents.length + (data.pendingTuitionName ? 1 : 0)})
                </p>
                {data.upsellTuitionStudents.map((student, idx) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-purple-800">{student.name}</p>
                      <p className="text-xs text-purple-600">Age {student.age} {student.requirements && `• ${student.requirements}`}</p>
                    </div>
                  </div>
                ))}
                {/* Pending Tuition Student */}
                {data.tuitionInterest && data.pendingTuitionName && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border-2 border-dashed border-purple-300">
                    <span className="w-6 h-6 bg-purple-400 text-white rounded-full flex items-center justify-center text-xs font-bold">{data.upsellTuitionStudents.length + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-800">{data.pendingTuitionName}</p>
                      <p className="text-xs text-purple-600">Age {data.pendingTuitionAge} {data.pendingTuitionReq && `• ${data.pendingTuitionReq}`}</p>
                    </div>
                    <span className="text-xs text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full">Will be added on submit</span>
                  </div>
                )}
              </div>
            )}

            {/* Quran Upsell Students */}
            {(data.upsellQuranStudents.length > 0 || (data.quranInterest && data.pendingQuranName)) && (
              <div className="space-y-2">
                <p className="text-xs text-emerald-600 uppercase font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Quran Classes ({data.upsellQuranStudents.length + (data.pendingQuranName ? 1 : 0)})
                </p>
                {data.upsellQuranStudents.map((student, idx) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-emerald-800">{student.name}</p>
                      <p className="text-xs text-emerald-600">Age {student.age} • {student.classTime}</p>
                    </div>
                  </div>
                ))}
                {/* Pending Quran Student */}
                {data.quranInterest && data.pendingQuranName && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border-2 border-dashed border-emerald-300">
                    <span className="w-6 h-6 bg-emerald-400 text-white rounded-full flex items-center justify-center text-xs font-bold">{data.upsellQuranStudents.length + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-800">{data.pendingQuranName}</p>
                      <p className="text-xs text-emerald-600">Age {data.pendingQuranAge} • {data.pendingQuranTime || 'Flexible'}</p>
                    </div>
                    <span className="text-xs text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full">Will be added on submit</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* FINAL NOTES */}
      <div className="pt-2">
        <label className="text-sm font-medium text-brand-darkText mb-2 block">
          Any final notes or questions for the coordinator?
        </label>
        <textarea
          className="w-full glass-input rounded-xl p-4 text-sm h-24"
          placeholder="Let us know any special requirements..."
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
        />
      </div>
    </div>
  );
};

function HowItWorksCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white/50 border border-brand-burgundy/10">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-brand-orange/15 border border-brand-orange/25 flex items-center justify-center font-mono text-sm text-brand-burgundy">
          {step}
        </div>
        <div className="font-semibold text-brand-darkText">{title}</div>
      </div>
      <p className="text-sm text-brand-mediumText mt-3 leading-relaxed">{desc}</p>
    </div>
  );
}
