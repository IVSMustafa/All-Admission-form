import confetti from 'canvas-confetti';
import React, { useEffect, useState } from 'react';
import { Check, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { FormData, INITIAL_DATA, LeadType } from './types';
import { validatePhoneLength, formatPhoneForWhatsApp } from './constants';
import SmartPanel from './components/SmartPanel';
import AIAssistantMascot from './components/LandingPage/AIAssistantMascot';
import { Button } from './components/UI';
import { Step0_Welcome, Step1_Details, Step2_FinalSteps } from './components/FormSteps';
import { supabase } from './src/supabaseClient';

const GLASS_ACTION_BUTTONS = `
.glass-action-btn {
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  ) !important;
  border: 1px solid rgba(255,255,255,0.90) !important;
  color: #163761 !important;
  border-radius: 18px !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.97),
    inset 0 -10px 22px rgba(255,255,255,0.06),
    0 16px 30px rgba(15,45,87,0.12),
    0 5px 12px rgba(15,45,87,0.06) !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease !important;
}

.glass-action-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(255,255,255,0.98) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 24px rgba(255,255,255,0.08),
    0 18px 34px rgba(15,45,87,0.14),
    0 6px 14px rgba(15,45,87,0.08) !important;
}

.glass-action-btn svg {
  color: inherit !important;
}

.glass-action-btn-primary {
  color: #1d6fce !important;
  border-color: rgba(191,219,254,0.95) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 24px rgba(255,255,255,0.07),
    0 18px 34px rgba(29,111,206,0.10),
    0 6px 14px rgba(15,45,87,0.06) !important;
}

.glass-action-btn-primary:hover {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.99),
    inset 0 -10px 24px rgba(255,255,255,0.08),
    0 20px 36px rgba(29,111,206,0.14),
    0 8px 16px rgba(15,45,87,0.07) !important;
}

.glass-action-btn-success {
  color: #059669 !important;
  border-color: rgba(167,243,208,0.95) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 24px rgba(255,255,255,0.07),
    0 18px 34px rgba(16,185,129,0.10),
    0 6px 14px rgba(15,45,87,0.06) !important;
}

.glass-action-btn-success:hover {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.99),
    inset 0 -10px 24px rgba(255,255,255,0.08),
    0 20px 36px rgba(16,185,129,0.14),
    0 8px 16px rgba(15,45,87,0.07) !important;
}
`;

const App = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [playConfetti, setPlayConfetti] = useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<FormData | null>(null);

  useEffect(() => {
    const currentState = window.history.state;

    if (!currentState || typeof currentState.step !== 'number') {
      window.history.replaceState({ step: 0 }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.submitted) {
        setIsSubmitted(true);
        setPlayConfetti(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setIsSubmitted(false);
      setPlayConfetti(false);
      if (event.state && typeof event.state.step === 'number') {
        setStep(event.state.step);
      } else {
        setStep(0);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!playConfetti) return;

    const duration = 1600;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 22,
      spread: 70,
      ticks: 140,
      gravity: 1.05,
      scalar: 0.95,
      zIndex: 999,
      disableForReducedMotion: true,
      colors: [
        '#1d6fce',
        '#0ea5e9',
        '#10b981',
        '#8b5cf6',
        '#f59e0b',
        '#ffffff',
      ],
    };

    confetti({
      ...defaults,
      particleCount: 70,
      origin: { x: 0.5, y: 0 },
      spread: 90,
    });

    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.2, y: 0 },
      angle: 65,
      spread: 60,
    });

    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.8, y: 0 },
      angle: 115,
      spread: 60,
    });

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        window.clearInterval(interval);
        setPlayConfetti(false);
        return;
      }

      const particleCount = Math.max(8, Math.round(16 * (timeLeft / duration)));

      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.15 + Math.random() * 0.7, y: 0 },
        angle: 90,
        spread: 55,
      });
    }, 240);

    return () => {
      window.clearInterval(interval);
    };
  }, [playConfetti]);

  const isQuranDetailsStep = step === 1 && formData.leadType === LeadType.QURAN;
  const isOneToOneDetailsStep = step === 1 && formData.leadType === LeadType.ONE_ON_ONE_SCHOOLING;
  const isFullTimeDetailsStep = step === 1 && formData.leadType === LeadType.FULL_TIME;
  const isTuitionDetailsStep = step === 1 && formData.leadType === LeadType.TUITION;
  const isSchoolStep1Details = isFullTimeDetailsStep || isOneToOneDetailsStep;
  const isFinalStep = step === 2;

  const detailsStepShift = '';
  
  const updateData = (fields: Partial<FormData>) => {
    if (submittedSnapshot) {
      setSubmittedSnapshot(null);
    }

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
          (formData.quranSubjects || []).length > 0 &&
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

  const handleStartNewApplication = () => {
    setFormData(INITIAL_DATA);
    setSubmittedSnapshot(null);
    setErrors({});
    setIsSubmitted(false);
    setPlayConfetti(false);
    setStep(0);

    window.history.replaceState({ step: 0 }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    let updatedFormData = { ...formData };

    if (
      formData.fullTimeInterest &&
      formData.pendingSchoolName &&
      formData.pendingSchoolAge &&
      formData.pendingSchoolGrade
    ) {
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

    if (
      formData.tuitionInterest &&
      formData.pendingTuitionName &&
      formData.pendingTuitionAge
    ) {
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

    if (
      formData.quranInterest &&
      formData.pendingQuranName &&
      formData.pendingQuranAge
    ) {
      updatedFormData.upsellQuranStudents = [
        ...(formData.upsellQuranStudents || []),
        {
          id: (Date.now() + 2).toString(),
          name: formData.pendingQuranName,
          age: formData.pendingQuranAge,
          subjects: formData.pendingQuranSubjects || [],
          classDays: formData.pendingQuranDays || [],
          classTime: formData.pendingQuranTime || 'Flexible',
          country: formData.pendingQuranCountry || '',
        },
      ];
      updatedFormData.pendingQuranName = '';
      updatedFormData.pendingQuranAge = '';
      updatedFormData.pendingQuranTime = '';
      updatedFormData.pendingQuranSubjects = [];
      updatedFormData.pendingQuranDays = [];
      updatedFormData.pendingQuranCountry = '';
    }

    setSubmittedSnapshot(updatedFormData);
    console.log('Submitting Data:', updatedFormData);

    // --- SUPABASE & WEBHOOK INTEGRATION ---
    try {
      // 1. Map React formData to Supabase Postgres Schema (registrations table)
      const supabasePayload = {
        submission_id: `IVS-${Date.now()}`,
        source: 'website',
        status: 'submitted',
        lead_type: updatedFormData.leadType,
        parent_name: updatedFormData.parentName,
        email: updatedFormData.email,
        whatsapp: updatedFormData.whatsapp,
        country: updatedFormData.country,
        other_country: updatedFormData.otherCountryName,
        student_name: updatedFormData.studentName,
        age: updatedFormData.age,
        grade: updatedFormData.grade,
        curriculum: updatedFormData.curriculum,
        quran_interest: updatedFormData.quranInterest || false,
        tuition_interest: updatedFormData.tuitionInterest || false,
        school_interest: updatedFormData.fullTimeInterest || false,
        coupon_code: updatedFormData.couponCode || null,
        discount_type: updatedFormData.appliedCoupon?.discountType || null,
        discount_value: updatedFormData.appliedCoupon?.discountValue || null,
        referrer_name: updatedFormData.appliedCoupon?.referrerName || null,
        students: updatedFormData.students || [],
        quran_students: updatedFormData.quranStudents || [],
        upsell_tuition: updatedFormData.upsellTuitionStudents || [],
        upsell_school: updatedFormData.upsellSchoolStudents || [],
        upsell_quran: updatedFormData.upsellQuranStudents || [],
        raw_data: updatedFormData 
      };

      // 2. Fire requests concurrently
      await Promise.allSettled([
        // Send mapped payload to the correct 'registrations' table
        supabase.from('registrations').insert([supabasePayload]),
        
        // Send raw payload to Webhook
        fetch(import.meta.env.VITE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFormData)
        })
      ]);
    } catch (error) {
      console.error('Integration Error:', error);
    }
    // ---------------------------------------

    setIsSubmitted(true);
    setPlayConfetti(true);
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
    const successData = submittedSnapshot || formData;
    const enrolledStudentsCount =
      successData.leadType === LeadType.QURAN
        ? (successData.quranStudents || []).length
        : successData.leadType === LeadType.TUITION
        ? 1
        : successData.students.length;

    const hasLowerGrades = successData.students.some(s => getGradeValue(s.grade) < 10);
    const hasUpperGrades = successData.students.some(s => getGradeValue(s.grade) >= 10);
    const submittedUpsellSchoolStudents = successData.upsellSchoolStudents || [];
    const submittedUpsellTuitionStudents = successData.upsellTuitionStudents || [];
    const submittedUpsellQuranStudents = successData.upsellQuranStudents || [];

    const hasSubmittedAdditionalPrograms =
      submittedUpsellSchoolStudents.length > 0 ||
      submittedUpsellTuitionStudents.length > 0 ||
      submittedUpsellQuranStudents.length > 0;
    
    return (
      <div className="success-glass-scope min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-6 md:px-6 md:py-8 bg-[radial-gradient(circle_at_top,rgba(29,111,206,0.08),transparent_38%),linear-gradient(180deg,#edf6ff_0%,#f8fbff_100%)]">
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
              opacity: 0.35;
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

          @keyframes ivsLuxuryFall {
            0% {
              opacity: 0;
              transform: translate3d(0,-120px,0) rotate(0deg) scale(0.82);
            }
            8% {
              opacity: 1;
            }
            85% {
              opacity: 0.95;
            }
            100% {
              opacity: 0;
              transform: translate3d(var(--drift, 0px), 860px, 0) rotate(460deg) scale(1.05);
            }
          }

          @keyframes ivsLuxuryTwinkle {
            0%, 100% {
              opacity: 0.18;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.18);
            }
          }

          @keyframes ivsLuxuryFirework {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.22);
            }
            20% {
              opacity: 1;
            }
            46% {
              opacity: 0.95;
              transform: translateY(-6px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-28px) scale(1.28);
            }
          }

          @keyframes ivsLuxuryHalo {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            28% {
              opacity: 0.22;
            }
            100% {
              opacity: 0;
              transform: scale(1.45);
            }
          }

          @keyframes ivsStreamerDrop {
            0% {
              opacity: 0;
              transform: translateY(-80px) rotate(10deg);
            }
            12% {
              opacity: 0.9;
            }
            100% {
              opacity: 0.15;
              transform: translateY(90px) rotate(-8deg);
            }
          }

          @keyframes ivsOrbFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.18;
            }
            50% {
              transform: translateY(-10px) scale(1.06);
              opacity: 0.28;
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

          .ivs-celebration-layer {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
          }

          .ivs-lux-piece {
            position: absolute;
            top: -120px;
            opacity: 0;
            animation: ivsLuxuryFall linear infinite;
            box-shadow: 0 10px 24px rgba(183,134,11,0.10);
            filter: drop-shadow(0 8px 18px rgba(255,215,120,0.16));
          }

          .ivs-lux-piece.round { border-radius: 999px; }
          .ivs-lux-piece.soft { border-radius: 10px; }
          .ivs-lux-piece.diamond { transform: rotate(45deg); border-radius: 6px; }

          .ivs-piece-1  { left: 5%;  width: 8px;  height: 28px; --drift: 18px;  background: linear-gradient(180deg,#fff7d6,#f4d58d); animation-duration: 6.3s; animation-delay: 0.2s; }
          .ivs-piece-2  { left: 11%; width: 10px; height: 22px; --drift: -14px; background: linear-gradient(180deg,#ffffff,#f6e6b8); animation-duration: 5.8s; animation-delay: 1s; }
          .ivs-piece-3  { left: 17%; width: 7px;  height: 24px; --drift: 24px;  background: linear-gradient(180deg,#ffe39a,#e8b95f); animation-duration: 6.8s; animation-delay: 0.8s; }
          .ivs-piece-4  { left: 25%; width: 9px;  height: 20px; --drift: -18px; background: linear-gradient(180deg,#fff4cf,#f0cc7a); animation-duration: 6.1s; animation-delay: 1.5s; }
          .ivs-piece-5  { left: 33%; width: 6px;  height: 22px; --drift: 12px;  background: linear-gradient(180deg,#ffffff,#ead9a3); animation-duration: 5.7s; animation-delay: 0.5s; }
          .ivs-piece-6  { left: 41%; width: 10px; height: 26px; --drift: -20px; background: linear-gradient(180deg,#ffe8ad,#efc86c); animation-duration: 6.5s; animation-delay: 1.4s; }
          .ivs-piece-7  { left: 49%; width: 8px;  height: 24px; --drift: 22px;  background: linear-gradient(180deg,#fff8e1,#f6d78e); animation-duration: 6.2s; animation-delay: 0.7s; }
          .ivs-piece-8  { left: 57%; width: 7px;  height: 22px; --drift: -12px; background: linear-gradient(180deg,#ffffff,#ecd39b); animation-duration: 5.9s; animation-delay: 1.9s; }
          .ivs-piece-9  { left: 65%; width: 10px; height: 20px; --drift: 16px;  background: linear-gradient(180deg,#ffe5a1,#e6b95b); animation-duration: 6.7s; animation-delay: 0.9s; }
          .ivs-piece-10 { left: 73%; width: 8px;  height: 26px; --drift: -22px; background: linear-gradient(180deg,#fff6d2,#f1d083); animation-duration: 6.4s; animation-delay: 1.2s; }
          .ivs-piece-11 { left: 81%; width: 9px;  height: 22px; --drift: 20px;  background: linear-gradient(180deg,#ffffff,#f2dfb1); animation-duration: 6s; animation-delay: 0.4s; }
          .ivs-piece-12 { left: 89%; width: 7px;  height: 24px; --drift: -16px; background: linear-gradient(180deg,#ffe39e,#edc470); animation-duration: 6.9s; animation-delay: 1.7s; }
          .ivs-piece-13 { left: 94%; width: 8px;  height: 20px; --drift: 14px;  background: linear-gradient(180deg,#fff5d8,#eec873); animation-duration: 5.6s; animation-delay: 0.6s; }
          .ivs-piece-14 { left: 2%;  width: 6px;  height: 18px; --drift: 10px;  background: linear-gradient(180deg,#fffaf0,#f0d799); animation-duration: 6.6s; animation-delay: 1.3s; }
          .ivs-piece-15 { left: 29%; width: 12px; height: 12px; --drift: -12px; background: linear-gradient(135deg,#fff3c5,#e4b860); animation-duration: 6.2s; animation-delay: 2.1s; }
          .ivs-piece-16 { left: 61%; width: 12px; height: 12px; --drift: 15px;  background: linear-gradient(135deg,#fff8de,#f0ca71); animation-duration: 5.9s; animation-delay: 2.4s; }
          .ivs-piece-17 { left: 77%; width: 11px; height: 11px; --drift: -10px; background: linear-gradient(135deg,#ffffff,#ebd6a0); animation-duration: 6.4s; animation-delay: 2s; }
          .ivs-piece-18 { left: 46%; width: 11px; height: 11px; --drift: 9px;  background: linear-gradient(135deg,#ffefba,#ddb05f); animation-duration: 5.8s; animation-delay: 2.2s; }

          .ivs-lux-twinkle {
            position: absolute;
            color: #f2cc6b;
            opacity: 0;
            animation: ivsLuxuryTwinkle ease-in-out infinite;
            text-shadow:
              0 0 8px rgba(255,224,138,0.55),
              0 0 18px rgba(255,255,255,0.28);
          }

          .ivs-twinkle-1 { top: 7%;  left: 10%; font-size: 13px; animation-duration: 2.8s; animation-delay: 0.4s; }
          .ivs-twinkle-2 { top: 12%; left: 20%; font-size: 10px; animation-duration: 3.2s; animation-delay: 1.1s; }
          .ivs-twinkle-3 { top: 10%; left: 34%; font-size: 12px; animation-duration: 2.9s; animation-delay: 0.8s; }
          .ivs-twinkle-4 { top: 6%;  left: 51%; font-size: 14px; animation-duration: 3.1s; animation-delay: 1.5s; }
          .ivs-twinkle-5 { top: 9%;  right: 33%; font-size: 11px; animation-duration: 2.7s; animation-delay: 0.6s; }
          .ivs-twinkle-6 { top: 13%; right: 22%; font-size: 10px; animation-duration: 3.3s; animation-delay: 1.8s; }
          .ivs-twinkle-7 { top: 8%;  right: 11%; font-size: 13px; animation-duration: 2.8s; animation-delay: 1.2s; }
          .ivs-twinkle-8 { top: 17%; left: 72%; font-size: 9px;  animation-duration: 3s; animation-delay: 0.9s; }

          .ivs-lux-firework {
            position: absolute;
            width: 170px;
            height: 170px;
            border-radius: 999px;
            opacity: 0;
            animation: ivsLuxuryFirework 4.8s ease-out infinite;
            filter: drop-shadow(0 12px 24px rgba(194,148,32,0.10));
          }

          .ivs-lux-firework::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle, rgba(255,240,184,0.96) 0 3px, transparent 3.8px) 50% 8px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(245,208,110,0.95) 0 3px, transparent 3.8px) 114px 24px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,255,255,0.96) 0 3px, transparent 3.8px) 142px 68px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(229,190,92,0.94) 0 3px, transparent 3.8px) 120px 118px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,232,158,0.95) 0 3px, transparent 3.8px) 76px 142px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,255,255,0.95) 0 3px, transparent 3.8px) 28px 122px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(238,199,96,0.94) 0 3px, transparent 3.8px) 8px 70px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,242,196,0.95) 0 3px, transparent 3.8px) 24px 22px / 16px 16px no-repeat;
          }

          .ivs-lux-firework::after {
            content: "";
            position: absolute;
            inset: 28px;
            border-radius: 999px;
            border: 1px solid rgba(241,212,136,0.28);
            animation: ivsLuxuryHalo 4.8s ease-out infinite;
          }

          .ivs-firework-1 { top: 5%; left: 5%; animation-delay: 0.3s; }
          .ivs-firework-2 { top: 8%; right: 6%; animation-delay: 1.8s; transform: scale(0.92); }
          .ivs-firework-3 { top: 16%; left: 50%; margin-left: -85px; animation-delay: 3s; transform: scale(0.82); }
          .ivs-firework-4 { top: 22%; right: 18%; animation-delay: 2.4s; transform: scale(0.72); }

          .ivs-streamer {
            position: absolute;
            top: -90px;
            width: 5px;
            height: 150px;
            border-radius: 999px;
            opacity: 0.45;
            animation: ivsStreamerDrop 4.4s ease-in-out infinite;
          }

          .ivs-streamer-1 { left: 14%; background: linear-gradient(180deg,rgba(255,244,205,0.96),transparent); }
          .ivs-streamer-2 { left: 31%; background: linear-gradient(180deg,rgba(241,205,118,0.95),transparent); animation-delay: 0.8s; }
          .ivs-streamer-3 { left: 52%; background: linear-gradient(180deg,rgba(255,255,255,0.95),transparent); animation-delay: 1.2s; }
          .ivs-streamer-4 { right: 27%; background: linear-gradient(180deg,rgba(234,196,95,0.96),transparent); animation-delay: 1.7s; }
          .ivs-streamer-5 { right: 11%; background: linear-gradient(180deg,rgba(255,241,198,0.96),transparent); animation-delay: 2.1s; }

          .ivs-lux-orb {
            position: absolute;
            border-radius: 999px;
            background: radial-gradient(circle,rgba(255,240,197,0.55),rgba(255,255,255,0));
            animation: ivsOrbFloat 5.2s ease-in-out infinite;
          }

          .ivs-orb-1 { width: 120px; height: 120px; top: 4%; left: 22%; }
          .ivs-orb-2 { width: 90px; height: 90px; top: 12%; right: 24%; animation-delay: 1.1s; }
          .ivs-orb-3 { width: 70px; height: 70px; top: 24%; left: 66%; animation-delay: 2s; }

          @media (max-width: 640px) {
            .ivs-lux-firework {
              width: 110px;
              height: 110px;
            }

            .ivs-streamer {
              height: 92px;
            }

            .ivs-orb-1,
            .ivs-orb-2,
            .ivs-orb-3 {
              display: none;
            }
          }
          @keyframes ivsPhonePeekIn {
            0% {
              opacity: 0;
              transform: translateY(-50%) translateX(-70px) scale(0.92);
            }
            100% {
              opacity: 1;
              transform: translateY(-50%) translateX(0) scale(1);
            }
          }

          @keyframes ivsPhoneSoftFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .ivs-success-wrap {
            overflow: visible;
          }

          .ivs-phone-peek {
            position: absolute;
            top: 58%;
            right: -80px;
            width: 210px;
            z-index: 1;
            pointer-events: none;
            animation: ivsPhonePeekIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
          }

          .ivs-phone-peek-inner {
            animation: ivsPhoneSoftFloat 6s ease-in-out infinite;
          }

          .ivs-phone-peek img {
            width: 100%;
            height: auto;
            display: block;
            filter:
              drop-shadow(0 24px 36px rgba(15,45,87,0.18))
              drop-shadow(0 8px 18px rgba(29,111,206,0.10));
          }

          @media (max-width: 1180px) {
            .ivs-phone-peek {
              display: none;
            }
          }

          .success-glass-scope .ivs-success-main,
          .success-glass-scope .ivs-applied-voucher,
          .success-glass-scope div[class*="rounded-[24px]"],
          .success-glass-scope div[class*="rounded-[22px]"],
          .success-glass-scope div[class*="rounded-2xl"] {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-color: rgba(201, 225, 255, 0.82) !important;
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.60),
              0 16px 34px rgba(15,45,87,0.07),
              0 6px 14px rgba(15,45,87,0.04) !important;
          }
        `}</style>

        <div className="ivs-success-wrap relative z-10 w-full max-w-[980px] pl-[70px]">
          <div
            className="absolute left-[-400px] top-[55%] -translate-y-1/2 z-0 hidden xl:block pointer-events-none"
            aria-hidden="true"
          >
            <img
              src="/images/success-side-education.png"
              alt=""
              className="w-[500px] select-none"
              style={{
                opacity: 0.9,
              }}
            />
          </div>
          <div className="ivs-success-main relative z-10 mr-auto w-full max-w-[760px] rounded-[28px] border border-[rgba(29,111,206,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,249,255,0.96))] px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9">
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
                Thanks, <strong>{successData.parentName}</strong>! Your request has been received successfully.
              </p>

              <p className="mt-2 text-sm sm:text-base text-brand-mediumText max-w-2xl mx-auto">
                Our coordinator will review everything and contact you shortly with the next details.
              </p>
            </div>

            {successData.appliedCoupon && (
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
                        {successData.couponCode}
                      </h4>

                      <p className="mt-2 text-[15px] font-semibold text-[#23527c]">
                        {successData.appliedCoupon.discountValue}% off on{" "}
                        {successData.appliedCoupon.discountType === "REGISTRATION_FEE"
                          ? "registration fee"
                          : "first month fee"}
                      </p>

                      <p className="mt-2 text-sm text-[#5c7593] leading-relaxed">
                        Referred by <strong>{successData.appliedCoupon.referrerName}</strong>. Your reward is attached to this application.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(238,247,255,0.94)_100%)] p-5 flex flex-col items-center justify-center text-center shadow-[0_12px_28px_rgba(29,111,206,0.07)]">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-extrabold text-[#6c87a7]">
                    Savings
                  </p>
                  <p className="mt-1 text-[34px] sm:text-[40px] leading-none font-black bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] bg-clip-text text-transparent">
                    {successData.appliedCoupon.discountValue}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#5c7593]">
                    Premium Reward
                  </p>
                </div>
              </div>
            )}

            <div className="mt-7 grid gap-5">
              {successData.leadType === LeadType.TUITION ? (
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
                          <p className="text-brand-darkText font-bold text-lg">{successData.studentName}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                          <p className="text-brand-darkText font-bold text-lg">{successData.age} yrs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
                    <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
                      Your Requirements
                    </h4>

                    <p className="mt-4 text-[15px] text-brand-darkText rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#ffffff,#f8fbff)] p-4 whitespace-pre-wrap leading-relaxed">
                      {successData.tuitionRequirements}
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
                      {successData.leadType === LeadType.QURAN
                        ? (successData.quranStudents || []).map((student, idx) => (
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
                        : successData.students.map((student, idx) => {
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
                      Trial Schedule ({successData.leadType === LeadType.QURAN ? "3 Days" : "1 Day"})
                    </h4>

                    <div className="mt-4 space-y-3">
                      {successData.leadType === LeadType.QURAN ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_20px_rgba(16,185,129,0.05)]">
                          <p className="text-sm text-emerald-700 font-semibold">📖 3 Days Free Trial</p>
                          <p className="text-lg text-emerald-800 font-extrabold mt-2">
                            Timing based on your local country time
                          </p>
                          <p className="text-sm text-emerald-600 mt-2">
                            Our coordinator will confirm the class schedule on WhatsApp
                          </p>
                        </div>
                      ) : successData.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
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
            
            {hasSubmittedAdditionalPrograms && (
              <div className="rounded-[24px] border border-amber-200 bg-[linear-gradient(135deg,#fffaf0,#fff7ed)] p-5 shadow-[0_8px_24px_rgba(245,158,11,0.08)] mt-7">
                <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-amber-700 border-b border-amber-200 pb-3">
                  Additional Programs From Final Step
                </h4>

                <div className="mt-4 space-y-4">
                  {submittedUpsellSchoolStudents.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-blue-700 mb-2">
                        Full-Time School ({submittedUpsellSchoolStudents.length})
                      </p>
                      <div className="space-y-2">
                        {submittedUpsellSchoolStudents.map((student, idx) => (
                          <div
                            key={student.id}
                            className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3"
                          >
                            <p className="font-bold text-blue-900">
                              {idx + 1}. {student.name}
                            </p>
                            <p className="text-sm text-blue-700">
                              Age {student.age} • {student.grade}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {submittedUpsellTuitionStudents.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-purple-700 mb-2">
                        1-on-1 Tuition ({submittedUpsellTuitionStudents.length})
                      </p>
                      <div className="space-y-2">
                        {submittedUpsellTuitionStudents.map((student, idx) => (
                          <div
                            key={student.id}
                            className="rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-3"
                          >
                            <p className="font-bold text-purple-900">
                              {idx + 1}. {student.name}
                            </p>
                            <p className="text-sm text-purple-700">
                              Age {student.age}
                              {student.requirements ? ` • ${student.requirements}` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {submittedUpsellQuranStudents.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-emerald-700 mb-2">
                        Quran Classes ({submittedUpsellQuranStudents.length})
                      </p>
                      <div className="space-y-2">
                        {submittedUpsellQuranStudents.map((student, idx) => (
                          <div
                            key={student.id}
                            className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3"
                          >
                            <p className="font-bold text-emerald-900">
                              {idx + 1}. {student.name}
                            </p>
                            <p className="text-sm text-emerald-700">
                              Age {student.age}
                              {student.subjects?.length ? ` • ${student.subjects.join(", ")}` : ""}
                              {student.classDays?.length ? ` • ${student.classDays.join(", ")}` : ""}
                              {student.classTime ? ` • ${student.classTime}` : ""}
                              {student.country ? ` • ${student.country}` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {successData.leadType !== LeadType.TUITION && (
              <div className="mt-6 rounded-[22px] border border-brand-orange/20 bg-[linear-gradient(135deg,rgba(255,248,243,0.95),rgba(255,244,239,0.90))] p-4 text-center shadow-[0_8px_20px_rgba(180,83,9,0.05)]">
                <p className="text-sm sm:text-[15px] text-brand-burgundy">
                  📹 We will send the <strong>Zoom link</strong> to{" "}
                  <strong>{formatPhoneForWhatsApp(successData.country || "Other", successData.whatsapp)}</strong> shortly.
                </p>
              </div>
            )}

            <p className="mt-6 text-sm text-brand-mediumText text-center">
              {successData.leadType === LeadType.TUITION
                ? "Our advisor will reach out to you shortly on WhatsApp."
                : "If you need immediate help, just message us on WhatsApp."}
            </p>

            <div className="mt-5 text-center">
              <button
                onClick={handleStartNewApplication}
                className="ivs-cta-button inline-flex items-center justify-center rounded-full px-8 py-3.5 text-white font-bold text-base transition-all hover:scale-[1.04] hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg,#1d6fce 0%,#0ea5e9 100%)",
                }}
              >
                Start New Application
              </button>
            </div>
          </div>

          <div className="ivs-phone-peek" aria-hidden="true">
            <div className="ivs-phone-peek-inner">
              <img
                src="/images/ivs-whatsapp-phone.png"
                alt="Official IVS WhatsApp QR"
              />
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

        <div className="hidden 2xl:block fixed top-6 right-6 w-[320px] z-40">
          <SmartPanel data={formData} step={step} />
        </div>

        <AIAssistantMascot />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <style>{GLASS_ACTION_BUTTONS}</style>
      <header
        className="
          relative z-40 mb-4 flex justify-center
          md:mb-6
          xl:fixed xl:top-5 xl:left-6 xl:mb-0 xl:justify-start
        "
      >
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/60 bg-white/55 backdrop-blur-md shadow-[0_10px_30px_rgba(15,45,87,0.08)] px-3 py-2 sm:px-4 sm:py-2.5 md:bg-transparent md:backdrop-blur-0 md:border-0 md:shadow-none md:p-0">
          <div className="shrink-0 rounded-xl bg-white/80 p-1.5 shadow-[0_6px_16px_rgba(15,45,87,0.08)] md:bg-transparent md:shadow-none md:p-0">
            <img
              src="/images/ivs-logo.png"
              alt="IVS Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 xl:h-12 xl:w-12 object-contain"
            />
          </div>

          <div className="leading-tight text-center xl:text-left">
            <h1 className="font-display font-bold text-[17px] sm:text-[20px] md:text-[24px] xl:text-[30px] tracking-[0.01em] text-brand-burgundy">
              Iqra Virtual School
            </h1>
            <p className="text-[11px] sm:text-[12px] md:text-[12px] xl:text-[13px] text-brand-mediumText font-medium">
              Registration Portal
            </p>
          </div>
        </div>
      </header>

      {isQuranDetailsStep && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.38),rgba(255,255,255,0.38)), url('/images/quran-cover-bluee.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      )}

      {isFullTimeDetailsStep && (
        <div
          className="fixed inset-0 z-0 pointer-events-none hidden xl:block"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.76),rgba(255,255,255,0.76)), url('/images/full-time-school-side.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      )}

      {isOneToOneDetailsStep && (
        <div
          className="fixed inset-0 z-0 pointer-events-none hidden xl:block"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.76),rgba(255,255,255,0.76)), url('/images/one-to-one-schooling-bg.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      )}

      {isTuitionDetailsStep && (
        <div
          className="fixed inset-0 z-0 pointer-events-none hidden xl:block"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.76),rgba(255,255,255,0.76)), url('/images/tuition-side.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      )}

      {isFinalStep && (
        <div
          className="fixed inset-0 z-0 pointer-events-none hidden xl:block"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.82),rgba(255,255,255,0.82)), url('/images/final-step-education.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      )}

      <div
        className={
          isQuranDetailsStep
            ? "relative z-10 w-full max-w-6xl mx-auto px-4 pt-4 pb-24 md:px-6 md:pt-6 lg:px-8 2xl:pr-[360px]"
            : isFinalStep
            ? "relative z-10 w-full max-w-6xl mx-auto px-4 pt-4 pb-24 md:px-6 md:pt-6 lg:px-8 xl:pt-20 2xl:pr-[360px]"
            : isSchoolStep1Details
            ? "relative z-10 w-full max-w-6xl mx-auto px-4 pt-6 pb-24 md:px-6 md:pt-8 lg:px-8 xl:pt-20 2xl:pr-[360px]"
            : "relative z-10 w-full max-w-6xl mx-auto px-4 pt-4 pb-24 md:px-6 lg:px-8 2xl:pr-[360px]"
        }
      >
        <div
          className={
            isQuranDetailsStep
              ? "w-full max-w-3xl mx-auto"
              : step === 1
              ? `w-full max-w-3xl mx-auto pt-4 md:pt-6 xl:pt-0 ${detailsStepShift}`
              : "w-full max-w-3xl mx-auto"
          }
        >
          <div className={isQuranDetailsStep ? "mb-6" : "mb-10"}>
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
          {step > 0 && !isQuranDetailsStep && (
            <div className="pt-6 pb-10 md:pb-14">
              <div className="border-t border-brand-burgundy/20 pt-6 animate-fade-in">
                <div className="flex items-center justify-between gap-3">
                  <Button
                    onClick={prevStep}
                    variant="secondary"
                    className="glass-action-btn"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>

                  {step < 2 ? (
                    <Button
                      onClick={nextStep}
                      variant="primary"
                      className="glass-action-btn glass-action-btn-primary"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      variant="primary"
                      className="glass-action-btn glass-action-btn-success"
                    >
                      Submit & Get Details <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden 2xl:block fixed top-8 right-6 w-[320px] z-40">
        <SmartPanel data={formData} step={step} />
      </div>

      <AIAssistantMascot />
    </div>
  );
};

export default App;