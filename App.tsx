import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Send, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { FormData, INITIAL_DATA, LeadType } from './types';
import { getUrlBasedCouponState } from './src/utils/coupons';
import { Button } from './components/UI';
import { Step0_Welcome, Step1_Details, Step2_FinalSteps } from './components/FormSteps';
import submitRegistration from './src/services/submitRegistration';
import SuccessScreen from './components/SuccessScreen';
import { playSuccessConfetti } from './src/utils/successEffects';
import { prepareSubmittedSnapshot } from './src/utils/submissionPayloads';
import { getStepValidationResult } from './src/utils/formValidation';
import {
  ensureInitialStepHistory,
  getStepFromHistoryState,
  isSubmittedHistoryState,
  pushStepHistory,
  pushSubmittedHistory,
  replaceStepHistory,
  scrollToTopSmooth,
} from './src/utils/navigation';
import { GuidedBookingShell } from './components/GuidedBooking';

const SmartPanel = lazy(() => import('./components/SmartPanel'));
const AIAssistantMascot = lazy(() => import('./components/LandingPage/AIAssistantMascot'));

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
  const [formData, setFormData] = useState<FormData>(() => ({
    ...INITIAL_DATA,
    ...getUrlBasedCouponState(),
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [playConfetti, setPlayConfetti] = useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<FormData | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const submissionErrorMessage =
    'We couldn’t submit your form right now. Please check your internet connection and try again. If the issue continues, contact us on WhatsApp.';
  useEffect(() => {
    ensureInitialStepHistory();

    const handlePopState = (event: PopStateEvent) => {
      if (isSubmittedHistoryState(event.state)) {
        setIsSubmitted(true);
        setPlayConfetti(false);
        scrollToTopSmooth();
        return;
      }

      setIsSubmitted(false);
      setPlayConfetti(false);
      setStep(getStepFromHistoryState(event.state));

      scrollToTopSmooth();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const urlCouponState = getUrlBasedCouponState();

    setFormData(prev => {
      const sameCouponCode = (prev.couponCode || '') === (urlCouponState.couponCode || '');
      const sameAppliedCoupon =
        JSON.stringify(prev.appliedCoupon || null) === JSON.stringify(urlCouponState.appliedCoupon || null);

      if (sameCouponCode && sameAppliedCoupon) {
        return prev;
      }

      return {
        ...prev,
        couponCode: urlCouponState.couponCode,
        appliedCoupon: urlCouponState.appliedCoupon,
      };
    });
  }, []);

  useEffect(() => {
    if (!playConfetti) return;

    return playSuccessConfetti(() => setPlayConfetti(false));
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

    if (submissionError) {
      setSubmissionError('');
    }

    setFormData(prev => ({ ...prev, ...fields }));

    const newErrors = { ...errors };
    Object.keys(fields).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const validateStep = (currentStep: number): boolean => {
    const validation = getStepValidationResult(currentStep, formData);
    const newErrors = validation.errors;
    let isValid = true;

    if (currentStep === 1) {
      if (formData.leadType === 'full_time' || formData.leadType === 'one_on_one_schooling') {
        if (Object.keys(newErrors).length === 0 && validation.schoolDraft?.pendingStudentIsComplete) {
          const newStudent = {
            id: Date.now().toString(),
            name: formData.studentName.trim(),
            age: formData.age,
            grade: formData.grade,
            curriculum: validation.schoolDraft.needsCurriculum ? formData.curriculum : null,
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
        if (Object.keys(newErrors).length === 0 && validation.quranDraft?.hasPendingStudent) {
          const newStudent = {
            id: Date.now().toString(),
            name: formData.studentName.trim(),
            age: formData.age,
            subjects: formData.quranSubjects || [],
            classDays: formData.quranClassDays,
            classTime: formData.quranClassTime,
            country: formData.quranStudentCountry,
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
      pushStepHistory(newStep);
      scrollToTopSmooth();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      const newStep = step - 1;
      setStep(newStep);
      setIsSubmitted(false);
      pushStepHistory(newStep);
      scrollToTopSmooth();
    }
  };

  const handleStartNewApplication = () => {
    setFormData({
      ...INITIAL_DATA,
      ...getUrlBasedCouponState(),
    });
    setSubmittedSnapshot(null);
    setErrors({});
    setSubmissionError('');
    setIsSubmitted(false);
    setPlayConfetti(false);
    setStep(0);

    replaceStepHistory(0);
    scrollToTopSmooth();
  };

const handleSubmit = async () => {
  if (isSubmitting) return;



  setIsSubmitting(true);
  setSubmissionError('');

  const updatedFormData = prepareSubmittedSnapshot(formData, {
    schoolStudentId: Date.now().toString(),
    tuitionStudentId: (Date.now() + 1).toString(),
    quranStudentId: (Date.now() + 2).toString(),
  });

  try {
    const result = await submitRegistration(updatedFormData);

    if (result.success) {
      setSubmittedSnapshot(updatedFormData);
      setFormData(updatedFormData);

      // 🔥 Fire Meta Pixel Lead event on successful form submission
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead');
      }

      setIsSubmitted(true);
      setPlayConfetti(true);
      pushSubmittedHistory();
      scrollToTopSmooth();
    } else {
      const message = result.error || submissionErrorMessage;
      console.error('Submission failed:', message);
      setSubmissionError(submissionErrorMessage);
    }
  } catch (err) {
    console.error('Unexpected submission error:', err);
    setSubmissionError(submissionErrorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  if (isSubmitted) {
    return (
      <SuccessScreen
        data={submittedSnapshot || formData}
        onStartNewApplication={handleStartNewApplication}
      />
    );
  }

if (step === 0) {
  return (
    <div className="min-h-[100svh] relative z-10">
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
        <Suspense fallback={null}>
          <SmartPanel data={formData} step={step} />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <AIAssistantMascot />
      </Suspense>
    </div>
  );
}

return (
  <div className="min-h-screen relative">
    <style>{GLASS_ACTION_BUTTONS}</style>
    <GuidedBookingShell data={formData} currentStep={step} className="relative z-10" mainClassName="relative">
    <header
      className="
        relative z-40 mb-4 flex justify-center
        md:mb-6
      "
    >
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/60 bg-white/55 backdrop-blur-md shadow-[0_10px_30px_rgba(15,45,87,0.08)] px-3 py-2 sm:px-4 sm:py-2.5 md:bg-transparent md:backdrop-blur-0 md:border-0 md:shadow-none md:p-0">
        <div className="shrink-0 rounded-xl bg-white/80 p-1.5 shadow-[0_6px_16px_rgba(15,45,87,0.08)] md:bg-transparent md:shadow-none md:p-0">
          <img
            src="/images/ivs-logo.webp"
            alt="IVS Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 xl:h-12 xl:w-12 object-contain"
            width={256}
            height={265}
            decoding="async"
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
            "linear-gradient(rgba(255,255,255,0.38),rgba(255,255,255,0.38)), url('/images/quran-cover-bluee.webp')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
    )}

    {isFullTimeDetailsStep && (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.82),rgba(255,255,255,0.82)), url('/images/full-time-school-side.webp')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
    )}

    {isOneToOneDetailsStep && (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.82),rgba(255,255,255,0.82)), url('/images/one-to-one-schooling-bg.webp')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
    )}

    {isTuitionDetailsStep && (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.84),rgba(255,255,255,0.84)), url('/images/tuition-side.webp')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
    )}

    {isFinalStep && (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.86),rgba(255,255,255,0.86)), url('/images/final-step-education.webp')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
    )}

    <div
      className={
        isQuranDetailsStep
          ? 'relative z-10 w-full max-w-[1700px] mx-auto px-4 pt-4 pb-24 md:px-6 md:pt-6 lg:px-8'
          : isFinalStep
          ? 'relative z-10 w-full max-w-[1400px] mx-auto px-4 pt-4 pb-24 md:px-6 md:pt-6 lg:px-8 xl:pt-20'
          : isSchoolStep1Details
          ? 'relative z-10 w-full max-w-[1500px] mx-auto px-4 pt-6 pb-24 md:px-6 md:pt-8 lg:px-8 xl:pt-20'
          : 'relative z-10 w-full max-w-[1550px] mx-auto px-4 pt-4 pb-24 md:px-6 lg:px-8'
      }
    >
      <div
        className={
          isQuranDetailsStep
            ? 'w-full max-w-3xl mx-auto xl:ml-auto xl:mr-0'
            : step === 1
            ? `w-full max-w-3xl mx-auto xl:ml-auto xl:mr-0 pt-4 md:pt-6 xl:pt-0 ${detailsStepShift}`
            : step === 2
            ? 'w-full max-w-3xl mx-auto xl:ml-auto xl:mr-0'
            : 'w-full max-w-3xl mx-auto'
        }
      >
        <div className={isQuranDetailsStep ? 'mb-6' : 'mb-10'}>
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
                <Button onClick={prevStep} variant="secondary" className="glass-action-btn">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                {step < 2 ? (
                  <Button onClick={nextStep} variant="primary" className="glass-action-btn glass-action-btn-primary">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    disabled={isSubmitting}
                    className="glass-action-btn glass-action-btn-success"
                  >
                    {isSubmitting ? (
                      <>
                        Submitting...
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Submit & Get Details <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {submissionError && step === 2 && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/85 px-4 py-3 text-sm font-semibold text-red-600 shadow-[0_8px_24px_rgba(239,68,68,0.06)]">
                  {submissionError}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="ml-3 inline-flex font-bold text-red-700 underline underline-offset-2 disabled:opacity-50"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </GuidedBookingShell>

    <Suspense fallback={null}>
      <AIAssistantMascot />
    </Suspense>
  </div>
);
};

export default App;
