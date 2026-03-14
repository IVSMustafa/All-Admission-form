import React, { useState } from 'react';
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
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    let updatedFormData = { ...formData };

    if (formData.fullTimeInterest && formData.pendingSchoolName && formData.pendingSchoolAge && formData.pendingSchoolGrade) {
      updatedFormData.upsellSchoolStudents = [
        ...formData.upsellSchoolStudents,
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
        ...formData.upsellTuitionStudents,
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
        ...formData.upsellQuranStudents,
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
    const hasLowerGrades = formData.students.some(s => getGradeValue(s.grade) < 10);
    const hasUpperGrades = formData.students.some(s => getGradeValue(s.grade) >= 10);

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl max-w-2xl w-full space-y-6 animate-fade-in-up">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-brand-burgundy mt-4">All Set!</h2>
            <p className="text-brand-darkText leading-relaxed mt-2">
              Thanks, <strong>{formData.parentName}</strong>! Our coordinator has received your request.
            </p>
          </div>

          {formData.leadType === LeadType.TUITION ? (
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
                formData.students.map((student, idx) => {
                  const studentGradeVal = getGradeValue(student.grade);
                  const displayCurriculum = student.curriculum
                    ? student.curriculum
                    : studentGradeVal < 10
                    ? 'British Curriculum'
                    : '-';

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

          {formData.leadType !== LeadType.TUITION && (
            <div className="bg-white/60 rounded-2xl p-5 border border-brand-lightGray">
              <h4 className="text-sm uppercase tracking-wider font-bold text-gray-600 border-b border-brand-lightGray pb-2 mb-3">
                {formData.leadType === LeadType.QURAN ? 'Class Schedule' : `Trial Schedule (${formData.leadType === LeadType.FULL_TIME ? '3 Days' : '1 Day'})`}
              </h4>
              <div className="space-y-2">
                {formData.leadType === LeadType.QURAN ? (
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

          {formData.leadType !== LeadType.TUITION && (
            <div className="bg-brand-orange/10 p-4 rounded-xl border border-brand-orange/30 text-center">
              <p className="text-sm text-brand-burgundy">
                📹 We will send the <strong>Zoom link</strong> to <strong>{formatPhoneForWhatsApp(formData.country || 'Other', formData.whatsapp)}</strong> shortly.
              </p>
            </div>
          )}

          <p className="text-xs text-brand-mediumText text-center">
            {formData.leadType === LeadType.TUITION
              ? 'Our advisor will reach out to you within 24 hours. Reply "HELP" on WhatsApp if urgent.'
              : 'Need to speak to someone right now during the trial? Reply "ADVISOR" on WhatsApp.'}
          </p>

          <div className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Start New Application
            </Button>
          </div>
        </div>
        <AIAssistantMascot />
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="min-h-screen relative">
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
      <div className="xl:pr-[360px] max-w-7xl mx-auto p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto">
          <header className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-2">
              <img src="/images/ivs-logo.png" alt="IVS Logo" className="h-20 w-20 object-contain" />
              <span className="font-display font-bold text-lg tracking-wide hidden sm:block text-brand-burgundy">
                Iqra Virtual School
              </span>
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

          <div className="flex justify-between items-center pt-6 border-t border-brand-burgundy/20 animate-fade-in">
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