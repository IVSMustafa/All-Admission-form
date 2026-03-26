import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Send } from 'lucide-react';
import { FormData, INITIAL_DATA, LeadType } from './types';
import { validatePhoneLength, formatPhoneForWhatsApp } from './constants';
import SmartPanel from './components/SmartPanel';
import AIAssistantMascot from './components/LandingPage/AIAssistantMascot';
import { Button } from './components/UI';
import { Step0_Welcome, Step1_Details, Step2_FinalSteps } from './components/FormSteps';

const App = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
  const currentState = window.history.state;

  if (!currentState || typeof currentState.step !== 'number') {
    window.history.replaceState({ step: 0 }, '');
  }

const handlePopState = (event: PopStateEvent) => {
  if (event.state?.submitted) {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  setIsSubmitted(false);

  if (event.state && typeof event.state.step === 'number') {
    setStep(event.state.step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []);
const isQuranDetailsStep = step === 1 && formData.leadType === LeadType.QURAN;
const isOneToOneDetailsStep = step === 1 && formData.leadType === LeadType.ONE_ON_ONE_SCHOOLING;
  const updateData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
    const newErrors = { ...errors };
    Object.keys(fields).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (formData.country === 'Other' && !formData.otherCountryName.trim()) {
        newErrors.otherCountryName = 'Required';
      }

      if (!formData.email?.trim()) {
        newErrors.email = 'Required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }

      if (formData.leadType === 'full_time' || formData.leadType === 'one_on_one_schooling') {
        const hasValidPendingStudent = formData.studentName.trim() && formData.age && formData.grade;
        const gradeVal = formData.grade
          ? [
              'KG1',
              'KG2',
              'Grade 1',
              'Grade 2',
              'Grade 3',
              'Grade 4',
              'Grade 5',
              'Grade 6',
              'Grade 7',
              'FS1 (Playgroup)',
              'FS2',
              'FS3',
            ].includes(formData.grade)
            ? 0
            : 10
          : 0;

        const needsCurriculum = gradeVal >= 10;
        const hasCurriculumIfNeeded = !needsCurriculum || formData.curriculum;
        const pendingStudentIsComplete = hasValidPendingStudent && hasCurriculumIfNeeded;
        const totalStudents = formData.students.length + (pendingStudentIsComplete ? 1 : 0);

        if (!formData.parentName) newErrors.parentName = 'Required';
        if (!formData.country) newErrors.country = 'Please select a country';
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = 'Enter valid phone number';
        }

        if (totalStudents === 0) {
          newErrors.students = 'Please add at least one student';
        }

        if (Object.keys(newErrors).length === 0 && pendingStudentIsComplete) {
          const newStudent = {
            id: Date.now().toString(),
            name: formData.studentName.trim(),
            age: formData.age,
            grade: formData.grade,
            curriculum: needsCurriculum ? formData.curriculum : null,
          };

          setFormData(prev => ({
            ...prev,
            students: [...prev.students.filter(s => s.id !== '__draft__'), newStudent],
            studentName: '',
            age: '',
            grade: '',
            curriculum: null,
          }));
        }
      } else if (formData.leadType === 'quran') {
        if (!formData.parentName) newErrors.parentName = 'Required';
        if (!formData.quranStudentCountry) newErrors.quranStudentCountry = 'Required';
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = 'Enter valid phone number';
        }

        const hasPendingStudent =
          formData.studentName.trim() &&
          formData.age &&
          (formData.quranClassDays || []).length > 0 &&
          formData.quranClassTime;

        const existingStudents = formData.quranStudents?.length || 0;
        const totalStudents = existingStudents + (hasPendingStudent ? 1 : 0);

        if (totalStudents === 0) {
          newErrors.quranStudents = 'Please add at least one student';
        }

        if (Object.keys(newErrors).length === 0 && hasPendingStudent) {
          const newStudent = {
            id: Date.now().toString(),
            name: formData.studentName.trim(),
            age: formData.age,
            subjects: formData.quranSubjects || [],
            classDays: formData.quranClassDays,
            classTime: formData.quranClassTime,
          };

          setFormData(prev => ({
            ...prev,
            quranStudents: [...(prev.quranStudents || []), newStudent],
            studentName: '',
            age: '',
            quranSubjects: [],
            quranClassDays: [],
            quranClassTime: '',
          }));
        }
      } else if (formData.leadType === 'tuition') {
        if (!formData.studentName) newErrors.studentName = 'Required';
        if (!formData.age) newErrors.age = 'Required';
        if (!formData.parentName) newErrors.parentName = 'Required';
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = 'Enter valid phone number';
        }
        if (!formData.tuitionRequirements || formData.tuitionRequirements.trim().length < 10) {
          newErrors.tuitionRequirements = 'Please describe your requirements (at least 10 characters)';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

const nextStep = () => {
  if (validateStep(step)) {
    const newStep = step + 1;
    setStep(newStep);
    window.history.pushState({ step: newStep }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevStep = () => {
  if (step > 0) {
    const newStep = step - 1;
    setStep(newStep);
    setIsSubmitted(false);
    window.history.pushState({ step: newStep }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  const handleSubmit = async () => {
    let updatedFormData = { ...formData };

    if (formData.fullTimeInterest && formData.pendingSchoolName && formData.pendingSchoolAge && formData.pendingSchoolGrade) {
     updatedFormData.upsellSchoolStudents = [
  ...(formData.upsellSchoolStudents || []),
        {
          id: Date.now().toString(),
          name: formData.pendingSchoolName,
          age: formData.pendingSchoolAge,
          grade: formData.pendingSchoolGrade,
          curriculum: null,
        },
      ];
      updatedFormData.pendingSchoolName = '';
      updatedFormData.pendingSchoolAge = '';
      updatedFormData.pendingSchoolGrade = '';
    }

    if (formData.tuitionInterest && formData.pendingTuitionName && formData.pendingTuitionAge) {
     updatedFormData.upsellTuitionStudents = [
  ...(formData.upsellTuitionStudents || []),
        {
          id: (Date.now() + 1).toString(),
          name: formData.pendingTuitionName,
          age: formData.pendingTuitionAge,
          requirements: formData.pendingTuitionReq || '',
        },
      ];
      updatedFormData.pendingTuitionName = '';
      updatedFormData.pendingTuitionAge = '';
      updatedFormData.pendingTuitionReq = '';
    }

    if (formData.quranInterest && formData.pendingQuranName && formData.pendingQuranAge) {
   updatedFormData.upsellQuranStudents = [
  ...(formData.upsellQuranStudents || []),
        {
          id: (Date.now() + 2).toString(),
          name: formData.pendingQuranName,
          age: formData.pendingQuranAge,
          subjects: formData.pendingQuranSubjects || [],
          classDays: [],
          classTime: formData.pendingQuranTime || 'Flexible',
        },
      ];
      updatedFormData.pendingQuranName = '';
      updatedFormData.pendingQuranAge = '';
      updatedFormData.pendingQuranTime = '';
      updatedFormData.pendingQuranSubjects = [];
    }

    setFormData(updatedFormData);
    console.log('Submitting Data:', updatedFormData);
    setIsSubmitted(true);
    window.history.pushState({ step: 999, submitted: true }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGradeValue = (grade: string): number => {
    if (!grade) return 0;
    const lowerGrades = [
      'KG1',
      'KG2',
      'FS1 (Playgroup)',
      'FS2',
      'FS3',
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Grade 4',
      'Grade 5',
      'Grade 6',
      'Grade 7',
    ];
    return lowerGrades.includes(grade) ? 1 : 10;
  };

if (isSubmitted) {
  const enrolledStudentsCount =
    formData.leadType === LeadType.QURAN
      ? (formData.quranStudents || []).length
      : formData.leadType === LeadType.TUITION
      ? 1
      : formData.students.length;

  const hasLowerGrades = formData.students.some(s => getGradeValue(s.grade) < 10);
  const hasUpperGrades = formData.students.some(s => getGradeValue(s.grade) >= 10);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 md:px-6 md:py-8 bg-[radial-gradient(circle_at_top,rgba(29,111,206,0.08),transparent_38%),linear-gradient(180deg,#edf6ff_0%,#f8fbff_100%)]">
      <style>{`
        @keyframes ivsSuccessEnter {
          0% {
            opacity: 0;
            transform: translateY(26px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ivsGlowSoft {
          0%, 100% {
            box-shadow:
              0 18px 40px rgba(15,45,87,0.08),
              0 6px 18px rgba(29,111,206,0.05);
          }
          50% {
            box-shadow:
              0 24px 56px rgba(15,45,87,0.12),
              0 10px 24px rgba(29,111,206,0.08);
          }
        }

        @keyframes ivsFloatSoft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes ivsFlipCheck {
          0% { transform: rotateY(0deg) scale(0.92); }
          50% { transform: rotateY(180deg) scale(1.04); }
          100% { transform: rotateY(360deg) scale(1); }
        }

        @keyframes ivsSparkle {
          0%, 100% {
            opacity: 0.4;
            transform: translateY(0px) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-7px) scale(1.08);
          }
        }

        @keyframes ivsShineSweep {
          0% {
            transform: translateX(-160%) skewX(-20deg);
            opacity: 0;
          }
          20% {
            opacity: 0.16;
          }
          100% {
            transform: translateX(220%) skewX(-20deg);
            opacity: 0;
          }
        }

        @keyframes ivsPulseButton {
          0%, 100% {
            box-shadow:
              0 12px 28px rgba(29,111,206,0.18),
              0 0 0 0 rgba(14,165,233,0.20);
          }
          50% {
            box-shadow:
              0 18px 38px rgba(29,111,206,0.24),
              0 0 0 10px rgba(14,165,233,0.00);
          }
        }

        .ivs-success-wrap {
          animation: ivsSuccessEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .ivs-success-main {
          animation: ivsGlowSoft 5s ease-in-out infinite, ivsFloatSoft 6s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .ivs-success-main::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.00) 35%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0.00) 65%,
            transparent 100%
          );
          animation: ivsShineSweep 5.6s ease-in-out infinite;
          pointer-events: none;
        }

        .ivs-check-flip {
          animation: ivsFlipCheck 1.1s cubic-bezier(0.22, 1, 0.36, 1);
          transform-style: preserve-3d;
        }

        .ivs-sparkle-1 {
          animation: ivsSparkle 2.6s ease-in-out infinite;
        }

        .ivs-sparkle-2 {
          animation: ivsSparkle 3.2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .ivs-sparkle-3 {
          animation: ivsSparkle 2.9s ease-in-out infinite;
          animation-delay: 0.95s;
        }

        .ivs-cta-button {
          animation: ivsPulseButton 2.8s ease-in-out infinite;
        }
      `}</style>

      <div className="ivs-success-wrap w-full max-w-[980px]">
        <div className="ivs-success-main rounded-[28px] border border-[rgba(29,111,206,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,249,255,0.96))] px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9">
          <div className="relative text-center">
            <div className="absolute left-[10%] top-1 text-sky-300 text-sm ivs-sparkle-1">✦</div>
            <div className="absolute right-[12%] top-6 text-blue-300 text-xs ivs-sparkle-2">✦</div>
            <div className="absolute left-[21%] top-12 text-cyan-300 text-xs ivs-sparkle-3">✦</div>

            <div className="ivs-check-flip w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-[0_14px_32px_rgba(16,185,129,0.24)]">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-[linear-gradient(135deg,#8b1d5a_0%,#b12f72_32%,#1d6fce_100%)] bg-clip-text text-transparent">
              All Set!
            </h2>

            <p className="mt-3 text-lg sm:text-[22px] text-brand-darkText leading-relaxed">
              Thanks, <strong>{formData.parentName}</strong>! Your request has been received successfully.
            </p>

            <p className="mt-2 text-sm sm:text-base text-brand-mediumText max-w-2xl mx-auto">
              Our coordinator will review everything and contact you shortly with the next details.
            </p>
          </div>

          {formData.appliedCoupon && (
            <div className="mt-7 grid gap-4 md:grid-cols-[1.35fr_180px] items-stretch">
              <div className="rounded-[24px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(135deg,#f3faff_0%,#eaf5ff_50%,#f7fbff_100%)] overflow-hidden shadow-[0_12px_28px_rgba(29,111,206,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  <div className="w-16 h-16 rounded-[18px] flex items-center justify-center bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] text-white text-[28px] shadow-[0_12px_24px_rgba(29,111,206,0.18)] shrink-0">
                    🎁
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#1d6fce] bg-[rgba(29,111,206,0.08)] border-[rgba(29,111,206,0.14)]">
                        Voucher Applied
                      </span>

                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#059669] bg-[rgba(16,185,129,0.10)] border-[rgba(16,185,129,0.18)]">
                        Verified
                      </span>
                    </div>

                    <h4 className="text-[24px] sm:text-[28px] leading-none font-black tracking-[0.01em] text-[#0f2d57]">
                      {formData.couponCode}
                    </h4>

                    <p className="mt-2 text-[15px] font-semibold text-[#23527c]">
                      {formData.appliedCoupon.discountValue}% off on{" "}
                      {formData.appliedCoupon.discountType === "REGISTRATION_FEE"
                        ? "registration fee"
                        : "first month fee"}
                    </p>

                    <p className="mt-2 text-sm text-[#5c7593] leading-relaxed">
                      Referred by <strong>{formData.appliedCoupon.referrerName}</strong>. Your reward is attached to this application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(238,247,255,0.94)_100%)] p-5 flex flex-col items-center justify-center text-center shadow-[0_12px_28px_rgba(29,111,206,0.07)]">
                <p className="text-[11px] uppercase tracking-[0.16em] font-extrabold text-[#6c87a7]">
                  Savings
                </p>
                <p className="mt-1 text-[34px] sm:text-[40px] leading-none font-black bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] bg-clip-text text-transparent">
                  {formData.appliedCoupon.discountValue}%
                </p>
                <p className="mt-1 text-xs font-semibold text-[#5c7593]">
                  Premium Reward
                </p>
              </div>
            </div>
          )}

          <div className="mt-7 grid gap-5">
            {formData.leadType === LeadType.TUITION ? (
              <>
                <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
                  <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
                    Student Information
                  </h4>

                  <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#fafcff,#f3f9ff)] px-4 py-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-extrabold text-base">
                      1
                    </div>

                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                        <p className="text-brand-darkText font-bold text-lg">{formData.studentName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                        <p className="text-brand-darkText font-bold text-lg">{formData.age} yrs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
                  <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
                    Your Requirements
                  </h4>

                  <p className="mt-4 text-[15px] text-brand-darkText rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#ffffff,#f8fbff)] p-4 whitespace-pre-wrap leading-relaxed">
                    {formData.tuitionRequirements}
                  </p>
                </div>

                <div className="rounded-[22px] border border-purple-200 bg-[linear-gradient(135deg,rgba(139,92,246,0.08),rgba(168,85,247,0.04))] p-4 text-center shadow-[0_8px_24px_rgba(139,92,246,0.06)]">
                  <p className="text-sm sm:text-[15px] text-purple-800 font-semibold">
                    📞 Our advisor will contact you on WhatsApp to discuss tutor matching and class timings.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
                  <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
                    Enrolled Students ({enrolledStudentsCount})
                  </h4>

                  <div className="mt-4 space-y-3">
                    {formData.leadType === LeadType.QURAN
                      ? (formData.quranStudents || []).map((student, idx) => (
                          <div
                            key={student.id}
                            className="grid gap-3 md:grid-cols-[56px_1fr] items-center rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-extrabold text-base">
                              {idx + 1}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                                <p className="font-bold text-brand-darkText">{student.name}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                                <p className="font-bold text-brand-darkText">{student.age} yrs</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500">Days</p>
                                <p className="font-bold text-brand-darkText">{student.classDays.map(d => d.slice(0, 3)).join(", ")}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500">Time</p>
                                <p className="font-bold text-brand-darkText">{student.classTime}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      : formData.students.map((student, idx) => {
                          const studentGradeVal = getGradeValue(student.grade);
                          const displayCurriculum = student.curriculum
                            ? student.curriculum
                            : (studentGradeVal < 10 ? "British Curriculum" : "—");

                          return (
                            <div
                              key={student.id}
                              className="grid gap-3 md:grid-cols-[56px_1fr] items-center rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#fafcff,#f3f9ff)] px-4 py-4"
                            >
                              <div className="w-10 h-10 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-extrabold text-base">
                                {idx + 1}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                                  <p className="font-bold text-brand-darkText">{student.name}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                                  <p className="font-bold text-brand-darkText">{student.age} yrs</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-500">Grade</p>
                                  <p className="font-bold text-brand-darkText">{student.grade}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-500">Curriculum</p>
                                  <p className="font-bold text-brand-darkText">{displayCurriculum}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>

                <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
                  <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
                    Trial Schedule ({formData.leadType === LeadType.QURAN ? "3 Days" : "1 Day"})
                  </h4>

                  <div className="mt-4 space-y-3">
                    {formData.leadType === LeadType.QURAN ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_20px_rgba(16,185,129,0.05)]">
                        <p className="text-sm text-emerald-700 font-semibold">📖 3 Days Free Trial</p>
                        <p className="text-lg text-emerald-800 font-extrabold mt-2">
                          Timing based on your local country time
                        </p>
                        <p className="text-sm text-emerald-600 mt-2">
                          Our coordinator will confirm the class schedule on WhatsApp
                        </p>
                      </div>
                    ) : formData.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
                      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-[0_8px_20px_rgba(139,92,246,0.05)]">
                        <p className="text-sm text-purple-700 font-semibold">📚 1 Day Free Trial</p>
                        <p className="text-lg text-purple-800 font-extrabold mt-2">
                          Timing based on teacher availability
                        </p>
                        <p className="text-sm text-purple-600 mt-2">
                          Our agent will guide you on call
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_20px_rgba(16,185,129,0.05)]">
                          <p className="text-sm text-emerald-700 font-semibold">⏰ KSA</p>
                          <p className="text-lg text-emerald-800 font-extrabold mt-2">
                            {hasLowerGrades ? "3:30 PM KSA" : "9:30 AM KSA"}
                          </p>
                          <p className="text-xs text-emerald-600 mt-2">
                            {hasLowerGrades ? "KG1 to Grade 7" : "Grade 8 to 12"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-[0_8px_20px_rgba(59,130,246,0.05)]">
                          <p className="text-sm text-blue-700 font-semibold">⏰ UAE</p>
                          <p className="text-lg text-blue-800 font-extrabold mt-2">
                            {hasLowerGrades ? "4:30 PM UAE" : "10:30 AM UAE"}
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            Teacher guided slot
                          </p>
                        </div>

                        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 shadow-[0_8px_20px_rgba(6,182,212,0.05)]">
                          <p className="text-sm text-cyan-700 font-semibold">⏰ PAK</p>
                          <p className="text-lg text-cyan-800 font-extrabold mt-2">
                            {hasLowerGrades ? "5:30 PM PAK" : "11:30 AM PAK"}
                          </p>
                          <p className="text-xs text-cyan-600 mt-2">
                            Trial timing
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {formData.leadType !== LeadType.TUITION && (
            <div className="mt-6 rounded-[22px] border border-brand-orange/20 bg-[linear-gradient(135deg,rgba(255,248,243,0.95),rgba(255,244,239,0.90))] p-4 text-center shadow-[0_8px_20px_rgba(180,83,9,0.05)]">
              <p className="text-sm sm:text-[15px] text-brand-burgundy">
                📹 We will send the <strong>Zoom link</strong> to{" "}
                <strong>{formatPhoneForWhatsApp(formData.country || "Other", formData.whatsapp)}</strong> shortly.
              </p>
            </div>
          )}

          <p className="mt-6 text-sm text-brand-mediumText text-center">
            {formData.leadType === LeadType.TUITION
              ? "Our advisor will reach out to you shortly on WhatsApp."
              : "If you need immediate help, just message us on WhatsApp."}
          </p>

          <div className="mt-5 text-center">
            <button
              onClick={() => window.location.reload()}
              className="ivs-cta-button inline-flex items-center justify-center rounded-full px-8 py-3.5 text-white font-bold text-base transition-all hover:scale-[1.04] hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#1d6fce 0%,#0ea5e9 100%)",
              }}
            >
              Start New Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  if (step === 0) {
    return (
      <div className="min-h-screen relative z-10">
        <div className="xl:pr-[360px]">
          <Step0_Welcome
            data={formData}
            updateData={updateData}
            nextStep={nextStep}
            errors={errors}
            prevStep={prevStep}
          />
        </div>

        <div className="hidden xl:block fixed top-4 right-4 w-[320px] z-40">
          <SmartPanel data={formData} step={step} />
        </div>

        <AIAssistantMascot />
      </div>
    );
  }

  return (
<div className="min-h-screen relative">
 
  {isQuranDetailsStep && (
  <div
    className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.38),rgba(255,255,255,0.38)),url('/images/quran-cover-bluee.png')] bg-no-repeat bg-cover bg-left-top pointer-events-none"
    aria-hidden="true"
  />
)}
{isOneToOneDetailsStep && (
  <div
    className="fixed inset-0 z-0 pointer-events-none"
    aria-hidden="true"
    style={{
      backgroundImage: "url('/images/one-to-one-schooling-bg.png')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 80%",
      backgroundPosition: "left bottom",
      opacity: 0.22,
    }}
  />
)}

<div
  className={
    isQuranDetailsStep || isOneToOneDetailsStep
      ? "relative z-10 pt-2 md:pt-4 xl:pr-[360px] w-full px-4 md:px-8 xl:px-12"
      : "relative z-10 pt-20 md:pt-24 xl:pr-[360px] max-w-7xl mx-auto p-4 md:p-8"
  }
>
<div
  className={
    isQuranDetailsStep
      ? "w-full max-w-3xl xl:ml-[400px] xl:mr-[380px]"
      : isOneToOneDetailsStep
       ? "w-full max-w-3xl pt-6 md:pt-10 xl:ml-[770px] xl:mr-[380px]"
      : "w-full max-w-3xl mx-auto"
  }
>
<header className="fixed top-4 left-6 md:left-10 xl:left-14 z-40">
  <div className="flex items-start gap-3">
    <img
      src="/images/ivs-logo.png"
      alt="IVS Logo"
      className="h-10 w-10 md:h-12 md:w-12 object-contain"
    />

    <div className="leading-tight">
      <h1 className="font-display font-bold text-[22px] md:text-[30px] tracking-[0.02em] text-brand-burgundy">
        Iqra Virtual School
      </h1>
      <p className="text-[12px] md:text-[13px] text-brand-mediumText">
        Registration Portal
      </p>
    </div>
  </div>
</header>

        <div className="mb-10">
          {step === 1 && (
            <Step1_Details
              data={formData}
              updateData={updateData}
              nextStep={nextStep}
              errors={errors}
              prevStep={prevStep}
            />
          )}
          {step === 2 && (
            <Step2_FinalSteps
              data={formData}
              updateData={updateData}
              nextStep={nextStep}
              errors={errors}
              prevStep={prevStep}
            />
          )}
        </div>

<div
  className={`flex justify-between items-center pt-6 pb-10 md:pb-14 border-t border-brand-burgundy/20 animate-fade-in ${
    isQuranDetailsStep
      ? "xl:ml-[352px]"
      : isOneToOneDetailsStep
      ? "xl:ml-[5px]"
      : ""
  }`}
>
  <Button onClick={prevStep} variant="secondary">
    <ArrowLeft className="w-4 h-4" /> Back
  </Button>

  {step < 2 ? (
    <Button onClick={nextStep} variant="primary">
      Next Step <ArrowRight className="w-4 h-4" />
    </Button>
  ) : (
    <Button
      onClick={handleSubmit}
      variant="primary"
      className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !shadow-emerald-500/20"
    >
      Submit & Get Details <Send className="w-4 h-4" />
    </Button>
  )}
</div>
      </div>
    </div>

    <div className="hidden xl:block fixed top-8 right-8 w-[320px] z-40">
      <SmartPanel data={formData} step={step} />
    </div>

    <AIAssistantMascot />
  </div>
);
};

export default App;