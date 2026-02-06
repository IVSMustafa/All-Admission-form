import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Send } from 'lucide-react';
import { FormData, INITIAL_DATA, LeadType } from './types';
import { validatePhoneLength, formatPhoneForWhatsApp } from './constants';
import { WEBHOOK_URL } from './env/webhook';
import SmartPanel from './components/SmartPanel';
import VoiceAgent from './components/VoiceAgent';
import { Button } from './components/UI';
import { Step0_Welcome, Step1_Details, Step2_FinalSteps } from './components/FormSteps';

const App = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
    // Clear errors for fields being updated
    const newErrors = { ...errors };
    Object.keys(fields).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      // For Full-Time and One-on-One Schooling, check for pending student to add
      if (formData.leadType === 'full_time' || formData.leadType === 'one_on_one_schooling') {
        // Check if there's a pending student to add
        const hasValidPendingStudent = formData.studentName.trim() && formData.age && formData.grade;
        const gradeVal = formData.grade ? ['KG1', 'KG2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'].includes(formData.grade) ? 0 : 10 : 0;
        const needsCurriculum = gradeVal >= 10;
        const hasCurriculumIfNeeded = !needsCurriculum || formData.curriculum;

        // Calculate total students (existing + pending if valid)
        const pendingStudentIsComplete = hasValidPendingStudent && hasCurriculumIfNeeded;
        const totalStudents = formData.students.length + (pendingStudentIsComplete ? 1 : 0);

        // Validate required fields
        if (!formData.parentName) newErrors.parentName = "Required";
        if (!formData.country) newErrors.country = "Please select a country";
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = "Enter valid phone number";
        }

        if (totalStudents === 0) {
          newErrors.students = "Please add at least one student";
        }

        // If there are no errors, auto-add the pending student
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
            students: [...prev.students, newStudent],
            studentName: '',
            age: '',
            grade: '',
            curriculum: null
          }));
        }
      } else if (formData.leadType === 'quran') {
        // Quran-specific validation with multi-student support
        // Validate parent info
        if (!formData.parentName) newErrors.parentName = "Required";
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = "Enter valid phone number";
        }
        if (!formData.quranStudentCountry) newErrors.quranStudentCountry = "Required";

        // Check for pending student to add
        const hasPendingStudent = formData.studentName.trim() && formData.age &&
          (formData.quranClassDays || []).length > 0 && formData.quranClassTime;

        // Calculate total students
        const existingStudents = formData.quranStudents?.length || 0;
        const totalStudents = existingStudents + (hasPendingStudent ? 1 : 0);

        if (totalStudents === 0) {
          newErrors.quranStudents = "Please add at least one student";
        }

        // If no parent errors and pending student is complete, auto-add it
        if (Object.keys(newErrors).length === 0 && hasPendingStudent) {
          const newStudent = {
            id: Date.now().toString(),
            name: formData.studentName.trim(),
            age: formData.age,
            classDays: formData.quranClassDays,
            classTime: formData.quranClassTime,
          };
          setFormData(prev => ({
            ...prev,
            quranStudents: [...(prev.quranStudents || []), newStudent],
            studentName: '',
            age: '',
            quranClassDays: [],
            quranClassTime: '',
          }));
        }
      } else if (formData.leadType === 'tuition') {
        // For Tuition - simplified validation
        if (!formData.studentName) newErrors.studentName = "Required";
        if (!formData.age) newErrors.age = "Required";
        if (!formData.parentName) newErrors.parentName = "Required";
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = "Enter valid phone number";
        }
        if (!formData.tuitionRequirements || formData.tuitionRequirements.trim().length < 10) {
          newErrors.tuitionRequirements = "Please describe your requirements (at least 10 characters)";
        }
      } else {
        // For other lead types (fallback)
        if (!formData.studentName) newErrors.studentName = "Required";
        if (!formData.age) newErrors.age = "Required";
        if (!formData.grade) newErrors.grade = "Required";
        if (!formData.country) newErrors.country = "Required";
        if (!formData.city) newErrors.city = "Required";
        if (!formData.parentName) newErrors.parentName = "Required";
        if (!formData.whatsapp || !validatePhoneLength(formData.country || 'Other', formData.whatsapp)) {
          newErrors.whatsapp = "Enter valid phone number";
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
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Auto-add any pending upsell students before submission
    let updatedFormData = { ...formData };

    // Auto-add pending school upsell student
    if (formData.fullTimeInterest && formData.pendingSchoolName && formData.pendingSchoolAge && formData.pendingSchoolGrade) {
      updatedFormData.upsellSchoolStudents = [...formData.upsellSchoolStudents, {
        id: Date.now().toString(),
        name: formData.pendingSchoolName,
        age: formData.pendingSchoolAge,
        grade: formData.pendingSchoolGrade,
        curriculum: null
      }];
      updatedFormData.pendingSchoolName = '';
      updatedFormData.pendingSchoolAge = '';
      updatedFormData.pendingSchoolGrade = '';
    }

    // Auto-add pending tuition upsell student
    if (formData.tuitionInterest && formData.pendingTuitionName && formData.pendingTuitionAge) {
      updatedFormData.upsellTuitionStudents = [...formData.upsellTuitionStudents, {
        id: (Date.now() + 1).toString(),
        name: formData.pendingTuitionName,
        age: formData.pendingTuitionAge,
        requirements: formData.pendingTuitionReq || ''
      }];
      updatedFormData.pendingTuitionName = '';
      updatedFormData.pendingTuitionAge = '';
      updatedFormData.pendingTuitionReq = '';
    }

    // Auto-add pending quran upsell student
    if (formData.quranInterest && formData.pendingQuranName && formData.pendingQuranAge) {
      updatedFormData.upsellQuranStudents = [...formData.upsellQuranStudents, {
        id: (Date.now() + 2).toString(),
        name: formData.pendingQuranName,
        age: formData.pendingQuranAge,
        classDays: [],
        classTime: formData.pendingQuranTime || 'Flexible'
      }];
      updatedFormData.pendingQuranName = '';
      updatedFormData.pendingQuranAge = '';
      updatedFormData.pendingQuranTime = '';
    }

    setFormData(updatedFormData);

    const whatsappNumber = formatPhoneForWhatsApp(updatedFormData.country || 'Other', updatedFormData.whatsapp);
    const payload = {
      ...updatedFormData,
      whatsapp: whatsappNumber,
    };

    // Here you would typically send data to backend/webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Webhook submission failed:', error);
    }
    console.log("Submitting Data:", payload);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to get grade value for timing determination
  const getGradeValue = (grade: string): number => {
    if (!grade) return 0;
    const lowerGrades = ['KG1', 'KG2', 'FS1 (Playgroup)', 'FS2', 'FS3', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];
    return lowerGrades.includes(grade) ? 1 : 10;
  };

  if (isSubmitted) {
    // Get all student names for display
    const studentNames = formData.students.map(s => s.name).join(', ') || formData.studentName;
    const hasLowerGrades = formData.students.some(s => getGradeValue(s.grade) < 10);
    const hasUpperGrades = formData.students.some(s => getGradeValue(s.grade) >= 10);

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl max-w-2xl w-full space-y-6 animate-fade-in-up">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-brand-burgundy mt-4">All Set!</h2>
            <p className="text-brand-darkText leading-relaxed mt-2">
              Thanks, <strong>{formData.parentName}</strong>! Our coordinator has received your request.
            </p>
          </div>

          {/* Student Details */}
          {formData.leadType === LeadType.TUITION ? (
            /* Tuition Confirmation - Student + Requirements */
            <div className="space-y-4">
              <div className="bg-white/60 rounded-2xl p-5 border border-brand-lightGray space-y-3">
                <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2">
                  Student Information
                </h4>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-sm">
                    1
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Name</p>
                      <p className="text-brand-darkText font-medium">{formData.studentName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Age</p>
                      <p className="text-brand-darkText font-medium">{formData.age} yrs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 rounded-2xl p-5 border border-brand-lightGray space-y-3">
                <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2">
                  Your Requirements
                </h4>
                <p className="text-sm text-brand-darkText bg-white/70 rounded-xl p-4 whitespace-pre-wrap">
                  {formData.tuitionRequirements}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-orange/10 to-emerald-500/10 border border-brand-orange/20">
                <p className="text-sm text-brand-burgundy text-center">
                  📞 Our advisor will review your requirements and contact you via WhatsApp to discuss tutor matching and class timings.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 rounded-2xl p-5 border border-brand-lightGray space-y-3">
              <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2">
                Enrolled Students ({formData.leadType === LeadType.QURAN ? (formData.quranStudents || []).length : formData.students.length})
              </h4>

              {formData.leadType === LeadType.QURAN ? (
                /* Quran Students */
                (formData.quranStudents || []).map((student, idx) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-sm">
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
                ))
              ) : (
                /* Regular School Students */
                formData.students.map((student, idx) => {
                  const studentGradeVal = getGradeValue(student.grade);
                  const displayCurriculum = student.curriculum
                    ? student.curriculum
                    : (studentGradeVal < 10 ? 'British Curriculum' : '-');

                  return (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-sm">
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
                })
              )}
            </div>
          )}

          {/* Trial Timings / Class Schedule - Only for non-tuition */}
          {formData.leadType !== LeadType.TUITION && (
            <div className="bg-white/60 rounded-2xl p-5 border border-brand-lightGray">
              <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2 mb-3">
                {formData.leadType === LeadType.QURAN ? 'Class Schedule' : `Trial Schedule (${formData.leadType === LeadType.FULL_TIME ? '3 Days' : '1 Day'})`}
              </h4>
              <div className="space-y-2">
                {formData.leadType === LeadType.QURAN ? (
                  /* Quran Schedule Info */
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-emerald-700 font-semibold">📖 Quran Classes - Available 24/7</p>
                    <p className="text-sm text-emerald-800 font-medium mt-1">
                      Timings will be confirmed based on {formData.quranStudentCountry || 'your'} local time
                    </p>
                    <p className="text-xs text-emerald-600 mt-2">
                      Our coordinator will contact you via WhatsApp to finalize the schedule.
                    </p>
                  </div>
                ) : formData.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
                  /* One-to-One Schooling Schedule Info */
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold">📚 One-to-One Schooling - 1 Day Free Trial</p>
                    <p className="text-sm text-purple-800 font-medium mt-1">
                      Timing will be shared based on teacher availability
                    </p>
                    <p className="text-xs text-purple-600 mt-2">
                      Our agent will guide you on call to arrange your trial class.
                    </p>
                  </div>
                ) : (
                  /* Full-Time School Schedule */
                  <>
                    {hasUpperGrades && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-xs text-amber-700 font-semibold">🕒 Grade 8 to 12 (Fed, IGCSE, O&A Levels):</p>
                        <p className="text-sm text-amber-800 font-medium mt-1">
                          9:30 AM KSA | 10:30 AM UAE | 11:30 AM PAK
                        </p>
                      </div>
                    )}
                    {hasLowerGrades && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                        <p className="text-xs text-emerald-700 font-semibold">🕒 KG1 to Grade 7:</p>
                        <p className="text-sm text-emerald-800 font-medium mt-1">
                          3:30 PM KSA | 4:30 PM UAE | 5:30 PM PAK
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* UPSELL PROGRAMS - Show if any upsell students exist */}
          {(formData.upsellSchoolStudents.length > 0 || formData.upsellTuitionStudents.length > 0 || formData.upsellQuranStudents.length > 0) && (
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl p-5 border border-amber-200">
              <h4 className="text-sm uppercase tracking-wider font-bold text-amber-700 border-b border-amber-200 pb-2 mb-3 flex items-center gap-2">
                🎁 Additional Programs (Package Deal)
              </h4>
              <div className="space-y-3">
                {/* School Upsell Students */}
                {formData.upsellSchoolStudents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-blue-600 uppercase font-semibold">Full-Time School ({formData.upsellSchoolStudents.length})</p>
                    {formData.upsellSchoolStudents.map((student, idx) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-blue-800">{student.name}</p>
                          <p className="text-xs text-blue-600">Age {student.age} • {student.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tuition Upsell Students */}
                {formData.upsellTuitionStudents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-purple-600 uppercase font-semibold">1-on-1 Tuition ({formData.upsellTuitionStudents.length})</p>
                    {formData.upsellTuitionStudents.map((student, idx) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-purple-800">{student.name}</p>
                          <p className="text-xs text-purple-600">Age {student.age} {student.requirements && `• ${student.requirements}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quran Upsell Students */}
                {formData.upsellQuranStudents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-emerald-600 uppercase font-semibold">Quran Classes ({formData.upsellQuranStudents.length})</p>
                    {formData.upsellQuranStudents.map((student, idx) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-emerald-800">{student.name}</p>
                          <p className="text-xs text-emerald-600">Age {student.age} • {student.classTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zoom Link Confirmation - Only for non-tuition */}
          {formData.leadType !== LeadType.TUITION && (
            <div className="bg-brand-orange/10 p-4 rounded-xl border border-brand-orange/30 text-center">
              <p className="text-sm text-brand-burgundy">
                📹 We will send the <strong>Zoom link</strong> to <strong>{formatPhoneForWhatsApp(formData.country || 'Other', formData.whatsapp)}</strong> shortly.
              </p>
            </div>
          )}

          {/* Help Note */}
          <p className="text-xs text-brand-mediumText text-center">
            {formData.leadType === LeadType.TUITION
              ? 'Our advisor will reach out to you within 24 hours. Reply "HELP" on WhatsApp if urgent.'
              : 'Need to speak to someone right now during the trial? Reply "ADVISOR" on WhatsApp.'
            }
          </p>

          <div className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Start New Application
            </Button>
          </div>
        </div>
        <VoiceAgent />
      </div>
    );
  }

  // Landing page (step 0) - full width layout
  if (step === 0) {
    return (
      <div className="min-h-screen">
        {/* Main Landing Content */}
        <div className="flex flex-col lg:flex-row">
          {/* LEFT: Main landing content - takes more space */}
          <div className="flex-1 lg:pr-6">
            <Step0_Welcome data={formData} updateData={updateData} nextStep={nextStep} errors={errors} prevStep={prevStep} />
          </div>

          {/* RIGHT PANEL: SMART ADVISOR & VOICE AGENT (Desktop) */}
          <div className="hidden lg:flex flex-col gap-6 w-96 p-4 sticky top-0 h-screen overflow-y-auto">
            <SmartPanel data={formData} step={step} />
            <VoiceAgent variant="sidebar" />
          </div>
        </div>

        {/* MOBILE VOICE AGENT (Floating) */}
        <div className="lg:hidden">
          <VoiceAgent variant="floating" />
        </div>
      </div>
    );
  }

  // Form steps (1-5) - constrained layout
  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto p-4 md:p-8 gap-8">

      {/* LEFT CONTENT: FORM */}
      <div className="flex-1 w-full max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-2">
            <img src="/Public/IVS Logo.png" alt="IVS Logo" className="h-20 w-20 object-contain" />
            <span className="font-display font-bold text-lg tracking-wide hidden sm:block text-brand-burgundy">Iqra Virtual School</span>
          </div>
        </header>

        {/* Step Rendering */}
        <div className="mb-10">
          {step === 1 && <Step1_Details data={formData} updateData={updateData} nextStep={nextStep} errors={errors} prevStep={prevStep} />}
          {step === 2 && <Step2_FinalSteps data={formData} updateData={updateData} nextStep={nextStep} errors={errors} prevStep={prevStep} />}
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-brand-burgundy/20 animate-fade-in">
          <Button onClick={prevStep} variant="secondary">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {step < 2 ? (
            <Button onClick={nextStep} variant="primary">
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="primary" className="!bg-gradient-to-r !from-emerald-500 !to-green-600 !shadow-emerald-500/20">
              Submit & Get Details <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: SMART ADVISOR & VOICE AGENT (Desktop) */}
      <div className="hidden lg:flex flex-col gap-6 w-80 sticky top-8 h-fit">
        <SmartPanel data={formData} step={step} />
        {/* Desktop Inline Agent */}
        <VoiceAgent variant="sidebar" />
      </div>

      {/* MOBILE VOICE AGENT (Floating) */}
      <div className="lg:hidden">
        <VoiceAgent variant="floating" />
      </div>

    </div>
  );
};

export default App;
