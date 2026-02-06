import React, { useState, useEffect } from 'react';
import {
  Sparkles, Clock, BookOpen, GraduationCap, AlertCircle, Check,
  Users, MapPin, Lightbulb, ChevronRight, X, MessageCircle,
  BookHeart, DollarSign, Zap
} from 'lucide-react';
import { FormData, LeadType, ProgramType, Curriculum, ClassMode } from '../types';
import { GRADES, getGradeValue, COUNTRIES } from '../constants';

interface SmartPanelProps {
  data: FormData;
  step: number;
  onApplySuggestion?: (field: string, value: any) => void;
}

// Onboarding step configuration
const ONBOARDING_STEPS = [
  { id: 1, label: 'Choose Program', requiredStep: 0 },
  { id: 2, label: 'Student Details', requiredStep: 1 },
  { id: 3, label: 'Final Steps', requiredStep: 2 },
];

// Recommendation card component with animation
const RecommendationCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'purple' | 'orange';
  onClick?: () => void;
  actionLabel?: string;
  delay?: number;
}> = ({ icon, title, children, variant = 'info', onClick, actionLabel, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const variantStyles: Record<string, string> = {
    info: 'bg-blue-50 border-blue-100 text-blue-700',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  };

  return (
    <div
      className={`rec-animate space-y-2 ${visible ? 'rec-visible' : 'rec-hidden'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 text-brand-darkText font-medium text-sm">
        {icon}
        <span>{title}</span>
      </div>
      <div
        className={`p-3 rounded-lg border text-xs ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={onClick}
      >
        {children}
        {onClick && actionLabel && (
          <div className="flex items-center gap-1 mt-2 font-semibold text-xs opacity-80">
            <span>{actionLabel}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile drawer component
const MobileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="advisor-backdrop"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="advisor-drawer">
        <div className="flex items-center justify-between p-4 border-b border-brand-lightGray/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange/20 to-brand-burgundy/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-orange" />
            </div>
            <h3 className="font-display font-bold text-sm text-brand-burgundy uppercase tracking-wider">
              Smart Advisor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </>
  );
};

const SmartPanel: React.FC<SmartPanelProps> = ({ data, step, onApplySuggestion }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Logic to determine recommendations
  const gradeVal = getGradeValue(data.grade);
  const ageVal = parseInt(data.age) || 0;

  const isMorningTrial = gradeVal >= 10; // Grade 8 (index 10) or higher
  const isEveningTrial = gradeVal > 0 && gradeVal < 10; // KG1 to Grade 7

  const recommendFederal = gradeVal >= 10 && gradeVal <= 14; // Grade 8-12
  const recommendBritish = gradeVal > 0 && gradeVal <= 9; // KG1-7

  const isIGCSE = data.curriculum === Curriculum.IGCSE_O_LEVEL || data.curriculum === Curriculum.A_LEVEL;

  // Check for multiple students (sibling discount)
  const hasSiblings = data.students.length > 1;

  // Get student names for personalized messages
  const studentNames = data.students.map(s => s.name).filter(Boolean);
  const firstStudentName = studentNames[0] || data.studentName || '';
  const allStudentNames = studentNames.length > 0
    ? studentNames.length === 1
      ? studentNames[0]
      : studentNames.slice(0, -1).join(', ') + ' & ' + studentNames[studentNames.length - 1]
    : '';

  // Quran-specific student tracking
  const quranStudents = data.quranStudents || [];
  const quranStudentNames = quranStudents.map(s => s.name).filter(Boolean);
  const firstQuranStudentName = quranStudentNames[0] || data.studentName || '';
  const hasQuranSiblings = quranStudents.length > 1;
  const allQuranNames = quranStudentNames.length > 0
    ? quranStudentNames.length === 1
      ? quranStudentNames[0]
      : quranStudentNames.slice(0, -1).join(', ') + ' & ' + quranStudentNames[quranStudentNames.length - 1]
    : '';

  // Get Grade 8+ students for board recommendation
  const grade8PlusStudents = data.students.filter(s => getGradeValue(s.grade) >= 10);
  const grade8PlusNames = grade8PlusStudents.map(s => s.name).filter(Boolean);

  // Check for science subjects
  const hasScienceSubjects = data.subjects.some(s =>
    ['Biology', 'Physics', 'Chemistry'].includes(s)
  );
  const hasMath = data.subjects.includes('Mathematics');

  // Country-based recommendations
  const isGulfCountry = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain'].includes(data.country);
  const isQuranGulfCountry = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain'].includes(data.quranStudentCountry);

  // Determine which onboarding steps are complete
  const getStepStatus = (onboardingStep: number): 'completed' | 'active' | 'pending' => {
    if (onboardingStep === 1) {
      if (data.leadType) return 'completed';
      return step === 0 ? 'active' : 'pending';
    }
    if (onboardingStep === 2) {
      // Check for students based on lead type
      if (data.leadType === LeadType.QURAN) {
        if (quranStudents.length > 0 || data.studentName) return 'completed';
      } else {
        if (data.students.length > 0 || data.studentName) return 'completed';
      }
      if (step === 1) return 'active';
      return 'pending';
    }
    if (onboardingStep === 3) {
      if (step > 2) return 'completed';
      if (step === 2) return 'active';
      return 'pending';
    }
    return 'pending';
  };

  const progress = Math.round((step / 2) * 100);

  // Main content that will be shown in both desktop and mobile
  const AdvisorContent = () => (
    <div className="space-y-4">
      {/* Welcome State */}
      {step === 0 && (
        <div className="text-brand-mediumText text-sm leading-relaxed bg-brand-beige/30 p-3 rounded-xl rec-animate">
          <p>Welcome to IVS! Select a program or use the quick selectors above to see personalized recommendations.</p>
        </div>
      )}

      {/* Personalized Welcome when student name is available (not for Quran - has its own) */}
      {firstStudentName && step >= 1 && data.leadType !== LeadType.QURAN && (
        <RecommendationCard
          icon={<Sparkles className="w-4 h-4 text-brand-burgundy" />}
          title="Welcome!"
          variant="orange"
          delay={50}
        >
          <strong>Great choice{allStudentNames ? `, ${allStudentNames}` : ''}!</strong> You're on your way to an amazing learning journey. Let's set up your perfect program! 🚀
        </RecommendationCard>
      )}

      {/* Sibling Discount Alert */}
      {hasSiblings && (
        <RecommendationCard
          icon={<Users className="w-4 h-4 text-brand-burgundy" />}
          title="Family Discount"
          variant="success"
          delay={100}
        >
          <strong>Great news for the {studentNames[0]} family!</strong> You're enrolling {data.students.length} students ({allStudentNames}). You may qualify for our <strong>sibling discount</strong> – our team will share details during the trial call.
        </RecommendationCard>
      )}

      {/* Age Warning */}
      {ageVal > 20 && data.leadType === LeadType.FULL_TIME && (
        <RecommendationCard
          icon={<AlertCircle className="w-4 h-4 text-yellow-600" />}
          title="Age Check"
          variant="warning"
        >
          Full-time school is typically for students under 20. We recommend our <strong>Tuition program</strong> for advanced learners.
        </RecommendationCard>
      )}

      {/* Context-aware recommendations for Full-Time */}
      {step >= 1 && data.leadType === LeadType.FULL_TIME && (
        <>
          {/* Board Recommendation for Grade 8+ */}
          {grade8PlusStudents.length > 0 && (
            <RecommendationCard
              icon={<BookOpen className="w-4 h-4 text-brand-burgundy" />}
              title="Board Recommendation"
              variant="info"
              delay={150}
            >
              <div className="space-y-2">
                <p className="text-brand-darkText font-medium mb-2">
                  {grade8PlusNames.length > 0
                    ? `For ${grade8PlusNames.join(' & ')}'s grade level, choosing the right board is important:`
                    : 'For Grade 8+, choosing the right board is important:'}
                </p>
                <p className="p-2 rounded bg-emerald-50/80 border border-emerald-100">
                  <strong>Federal Board</strong> – Ideal for students planning to study in Pakistan (Matric/FSc).
                </p>
                <div className="p-2 rounded bg-sky-50/80 border border-sky-100 space-y-2">
                  <p><strong>IGCSE/O-Level & A-Level</strong> – For international education pathways:</p>
                  <ul className="ml-4 space-y-1 text-sky-700">
                    <li>📚 <strong>Cambridge Board</strong> – Available in Group Classes & 1-on-1</li>
                    <li>📖 <strong>Edexcel Board</strong> – Available in 1-on-1 sessions only</li>
                  </ul>
                </div>
                <p className="p-2 rounded bg-purple-50/80 border border-purple-100 text-purple-700 mt-2">
                  💡 <strong>Don't worry!</strong> Our Subject Advisor is available to guide you on the best board choice. Just book your trial class and she'll help you decide!
                </p>
              </div>
            </RecommendationCard>
          )}

          {/* 1-on-1 recommendation for older students */}
          {data.students.some(s => parseInt(s.age) > 17) && (
            <RecommendationCard
              icon={<GraduationCap className="w-4 h-4 text-brand-burgundy" />}
              title="Learning Mode"
              variant="purple"
              delay={200}
            >
              For students above 17, we recommend our <strong>One-to-One Tuition</strong> program for personalized attention and flexible scheduling.
            </RecommendationCard>
          )}

          {/* Class Timing */}
          {data.students.length > 0 && (
            <RecommendationCard
              icon={<Clock className="w-4 h-4 text-brand-burgundy" />}
              title="Class Timings"
              variant="info"
              delay={250}
            >
              <div className="space-y-2">
                {data.students.some(s => {
                  const gv = getGradeValue(s.grade);
                  return gv >= 1 && gv <= 9;
                }) && (
                    <p><strong>Evening:</strong> FS1 to Grade 7 – 3:30 PM KSA</p>
                  )}
                {data.students.some(s => {
                  const gv = getGradeValue(s.grade);
                  return gv >= 10 && gv <= 14;
                }) && (
                    <p><strong>Morning:</strong> Grade 8 to 12 – 9:00 AM KSA</p>
                  )}
              </div>
            </RecommendationCard>
          )}

          {/* Default message */}
          {data.students.length === 0 && (
            <div className="text-xs text-brand-mediumText rec-animate">
              Add a student to see personalized recommendations for curriculum, class timings, and more.
            </div>
          )}
        </>
      )}

      {/* Context-aware recommendations for Quran */}
      {step >= 1 && data.leadType === LeadType.QURAN && (
        <>
          {/* Personalized Welcome for Quran */}
          {(firstQuranStudentName || quranStudents.length > 0) && (
            <RecommendationCard
              icon={<Sparkles className="w-4 h-4 text-brand-burgundy" />}
              title="Welcome!"
              variant="success"
              delay={50}
            >
              <strong>Masha'Allah{allQuranNames ? `, ${allQuranNames}` : ''}!</strong> You're taking a beautiful step towards Quran education. We're here to support your journey! 📖
            </RecommendationCard>
          )}

          {/* Sibling Discount for Quran */}
          {hasQuranSiblings && (
            <RecommendationCard
              icon={<Users className="w-4 h-4 text-brand-burgundy" />}
              title="Family Discount"
              variant="success"
              delay={100}
            >
              <strong>Great news!</strong> You're enrolling {quranStudents.length} students ({allQuranNames}). Our team will share <strong>sibling discount</strong> details during confirmation.
            </RecommendationCard>
          )}

          {/* Class Schedule Summary */}
          {quranStudents.length > 0 && (
            <RecommendationCard
              icon={<Clock className="w-4 h-4 text-brand-burgundy" />}
              title="Class Schedule"
              variant="info"
              delay={150}
            >
              <div className="space-y-2">
                {quranStudents.map((student, idx) => (
                  <div key={student.id} className="p-2 bg-white/50 rounded-lg">
                    <p className="font-medium">{student.name}'s Classes:</p>
                    <p className="text-xs mt-1">
                      📅 {student.classDays.map(d => d.slice(0, 3)).join(', ')} at <strong>{student.classTime}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </RecommendationCard>
          )}

          {/* Location Timing for Quran */}
          {data.quranStudentCountry && (
            <RecommendationCard
              icon={<MapPin className="w-4 h-4 text-brand-burgundy" />}
              title="Time Confirmation"
              variant="orange"
              delay={200}
            >
              Your classes will be scheduled according to <strong>{data.quranStudentCountry}</strong> local time. Our coordinator will confirm exact timings via WhatsApp.
            </RecommendationCard>
          )}

          {/* 24/7 Availability */}
          <RecommendationCard
            icon={<Clock className="w-4 h-4 text-brand-burgundy" />}
            title="Flexible Scheduling"
            variant="purple"
            delay={250}
          >
            <strong>Available 24/7!</strong> Our Quran teachers are available around the clock. Choose any time that works for your family's schedule.
          </RecommendationCard>

          {/* No students yet */}
          {quranStudents.length === 0 && !data.studentName && (
            <div className="text-xs text-brand-mediumText rec-animate">
              Add a student to see your personalized class schedule and recommendations.
            </div>
          )}
        </>
      )}

      {/* Subject-Specific Advice for IGCSE - NEW */}
      {isIGCSE && data.subjects.length > 0 && (
        <>
          {hasScienceSubjects && (
            <RecommendationCard
              icon={<Zap className="w-4 h-4 text-brand-burgundy" />}
              title="Science Subjects"
              variant="purple"
              delay={300}
            >
              <strong>Practicals are key!</strong> Our teachers guide you through virtual lab demonstrations and exam-style practical questions for Biology, Physics & Chemistry.
            </RecommendationCard>
          )}
          {hasMath && (
            <RecommendationCard
              icon={<Lightbulb className="w-4 h-4 text-brand-burgundy" />}
              title="Mathematics"
              variant="info"
              delay={350}
            >
              We cover both <strong>Core</strong> and <strong>Extended</strong> syllabi. Our teachers focus on past paper practice and exam techniques.
            </RecommendationCard>
          )}
        </>
      )}

      {/* Country-Based Recommendations - NEW */}
      {isGulfCountry && data.country && step >= 1 && (
        <RecommendationCard
          icon={<MapPin className="w-4 h-4 text-brand-burgundy" />}
          title="Location Optimized"
          variant="orange"
          delay={400}
        >
          Classes are aligned with <strong>{data.country}</strong> school timings. Live sessions are scheduled for convenient after-school hours.
        </RecommendationCard>
      )}

      {/* Standard curriculum recommendation for other types */}
      {step >= 1 && data.grade && data.leadType !== LeadType.FULL_TIME && (
        <RecommendationCard
          icon={<BookOpen className="w-4 h-4 text-brand-burgundy" />}
          title="Recommended Curriculum"
          variant="info"
          delay={150}
          onClick={onApplySuggestion ? () => onApplySuggestion('curriculum', recommendFederal ? Curriculum.FEDERAL : Curriculum.BRITISH) : undefined}
          actionLabel={onApplySuggestion ? "Apply suggestion" : undefined}
        >
          {recommendBritish && (
            <p>For {data.grade}, we specialize in the <strong>British Curriculum</strong> to build strong foundations.</p>
          )}
          {recommendFederal && (
            <p>Starting from Grade 8, we align with the <strong>Federal Board (FBISE)</strong> for matriculation/HSSC success.</p>
          )}
        </RecommendationCard>
      )}

      {/* Trial Timing */}
      {step >= 1 && (data.grade || ageVal > 0) && data.leadType !== LeadType.FULL_TIME && (
        <RecommendationCard
          icon={<Clock className="w-4 h-4 text-brand-burgundy" />}
          title="Trial Timing"
          variant="info"
          delay={200}
        >
          {data.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
            <p>Timing will be shared based on <strong>teacher availability</strong>. Our agent will guide you on call.</p>
          ) : (
            <>
              {isEveningTrial && (
                <p>Based on {data.grade}, trial classes will be in the <strong>Evening (3:30 PM KSA)</strong>.</p>
              )}
              {isMorningTrial && (
                <p>High school classes (Grade 8+) have <strong>Morning (9:00 AM KSA)</strong> trials.</p>
              )}
              {ageVal > 20 && !data.grade && (
                <p>Adult learners typically schedule flexible 1-on-1 demos.</p>
              )}
            </>
          )}
        </RecommendationCard>
      )}

      {/* Class Mode Recommendation */}
      {(isIGCSE || data.programType === ProgramType.TUITION) && (
        <RecommendationCard
          icon={<GraduationCap className="w-4 h-4 text-brand-burgundy" />}
          title="Class Mode"
          variant="purple"
          delay={250}
        >
          {(gradeVal >= 13) ? (
            <p>For {data.grade} (A-Levels/HSSC-II), we highly recommend <strong>One-on-One</strong> for focused prep.</p>
          ) : (
            <p><strong>Small Groups</strong> are great for peer learning in lower grades, but 1-on-1 is available for personalized attention.</p>
          )}
        </RecommendationCard>
      )}

      {/* Quran Interest Suggestion - NEW */}
      {step >= 3 && !data.quranInterest && (
        <RecommendationCard
          icon={<BookHeart className="w-4 h-4 text-brand-burgundy" />}
          title="Holistic Education"
          variant="success"
          delay={450}
          onClick={onApplySuggestion ? () => onApplySuggestion('quranInterest', true) : undefined}
          actionLabel={onApplySuggestion ? "Add Quran classes" : undefined}
        >
          Complete your child's education with <strong>Quran classes</strong> – Qaida, Nazra, or Tajweed with certified teachers.
        </RecommendationCard>
      )}

      {/* Session Frequency Info - NEW */}
      {data.leadType && step >= 1 && (
        <RecommendationCard
          icon={<DollarSign className="w-4 h-4 text-brand-burgundy" />}
          title="What to Expect"
          variant="orange"
          delay={500}
        >
          {data.leadType === LeadType.FULL_TIME && (
            <p><strong>Full-Time:</strong> 5 days/week • Complete curriculum • Certified teachers</p>
          )}
          {data.leadType === LeadType.TUITION && (
            <p><strong>Tuition:</strong> 2-5 sessions/week • Flexible timing • Subject-focused</p>
          )}
          {data.leadType === LeadType.ONE_ON_ONE_SCHOOLING && (
            <div className="space-y-1">
              <p><strong>One-to-One Schooling:</strong></p>
              <p>• Personal 1-on-1 classes like regular school</p>
              <p>• Report cards & certificates included</p>
              <p>• Min. 6 months • Fee per subject</p>
            </div>
          )}
          {data.leadType === LeadType.QURAN && (
            <p><strong>Quran:</strong> 3-5 sessions/week • One-on-one • Progress tracking</p>
          )}
        </RecommendationCard>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Panel */}
      <div className="hidden lg:block advisor-panel animate-fade-in-up sticky top-8">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-brand-lightGray/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange/20 to-brand-burgundy/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-orange" />
          </div>
          <h3 className="font-display font-bold text-sm text-brand-burgundy uppercase tracking-wider">Smart Advisor</h3>
        </div>

        {/* Onboarding Steps */}
        <div className="p-4 border-b border-brand-lightGray/20">
          {ONBOARDING_STEPS.map((onboardStep) => {
            const status = getStepStatus(onboardStep.id);
            return (
              <div
                key={onboardStep.id}
                className={`advisor-step ${status === 'active' ? 'active' : ''} ${status === 'completed' ? 'completed' : ''}`}
              >
                <div className={`step-indicator ${status}`}>
                  {status === 'completed' ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{onboardStep.id}</span>
                  )}
                </div>
                <span className={`text-sm ${status === 'active' ? 'font-medium text-brand-darkText' : 'text-brand-mediumText'}`}>
                  {onboardStep.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-b border-brand-lightGray/20">
          <div className="flex justify-between text-xs text-brand-mediumText mb-2">
            <span>Progress</span>
            <span className="font-medium text-brand-burgundy">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-brand-beige rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-burgundy to-brand-orange transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Contextual Content */}
        <div className="p-4">
          <AdvisorContent />
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 right-4 z-50">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-burgundy to-brand-orange text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-shadow animate-float"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Smart Advisor</span>
          {progress > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {progress}%
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
        {/* Progress in drawer */}
        <div className="mb-4 pb-4 border-b border-brand-lightGray/20">
          <div className="flex justify-between text-xs text-brand-mediumText mb-2">
            <span>Progress</span>
            <span className="font-medium text-brand-burgundy">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-brand-beige rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-burgundy to-brand-orange transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <AdvisorContent />
      </MobileDrawer>
    </>
  );
};

export default SmartPanel;