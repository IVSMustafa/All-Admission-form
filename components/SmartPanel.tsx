// SmartPanel.tsx - Premium Visual Edition with Natural Language
import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Clock,
  BookOpen,
  GraduationCap,
  AlertCircle,
  Check,
  Users,
  ChevronRight,
  X,
  MessageCircle,
  DollarSign,
  Zap,
  TrendingUp,
  Award,
  Star,
  Target,
  Rocket,
} from "lucide-react";
import { FormData, LeadType, ProgramType, Curriculum } from "../types";
import { getGradeValue } from "../constants";

interface SmartPanelProps {
  data: FormData;
  step: number; // 0,1,2
  onApplySuggestion?: (field: string, value: any) => void;
}

const ONBOARDING_STEPS = [
  { id: 1, label: "Choose Program", sub: "School, Tuition, Qur'an", requiredStep: 0 },
  { id: 2, label: "Student Details", sub: "Name, grade, subjects", requiredStep: 1 },
  { id: 3, label: "Review & Submit", sub: "Final confirmation", requiredStep: 2 },
];

type Variant = "info" | "success" | "warning" | "purple" | "orange" | "gold";

/* ── Circular Progress Ring with Glow ── */
const CircularProgress: React.FC<{ percent: number }> = ({ percent }) => {
  const size = 80;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="sp-circleWrap" aria-label={`${percent}% complete`}>
      <div className="sp-circleGlow" />
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
        />
        {/* Fill with glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ 
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)",
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))"
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center label with glow */}
      <div className="sp-circleLabel">
        <span className="sp-circlePercent">{percent}%</span>
      </div>
    </div>
  );
};

const InsightCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
}> = ({ icon, title, children, variant = "info", delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return (
    <div className={`sp-insightWrap ${visible ? "sp-in" : "sp-out"}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className={`sp-insight sp-${variant}`}>
        <div className="sp-insightHead">
          <div className="sp-insightIco">{icon}</div>
          <div className="sp-insightTitle">{title}</div>
        </div>
        <div className="sp-insightBody">{children}</div>
      </div>
    </div>
  );
};

const MobileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="sp-backdrop" onClick={onClose} />
      <div className="sp-drawer" role="dialog" aria-modal="true" aria-label="Smart Advisor">
        <div className="sp-drag" />
        <div className="sp-drawerHead">
          <div className="sp-drawerBrand">
            <div className="sp-drawerIco">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="sp-drawerTitle">Smart Advisor</div>
              <div className="sp-drawerSub">Your enrollment assistant</div>
            </div>
          </div>
          <button onClick={onClose} className="sp-close" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="sp-drawerBody">{children}</div>
      </div>
    </>
  );
};

const SmartPanel: React.FC<SmartPanelProps> = ({ data, step, onApplySuggestion }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const students = data.students || [];
  const quranStudents = data.quranStudents || [];

  const gradeVal = getGradeValue(data.grade);
  const ageVal = parseInt(String(data.age || "0"), 10) || 0;

  const hasSiblings = students.length > 1;
  const studentNames = students.map((s) => s.name).filter(Boolean);
  const firstStudentName = studentNames[0] || (data.studentName as any) || "";
  const allStudentNames =
    studentNames.length > 0
      ? studentNames.length === 1
        ? studentNames[0]
        : studentNames.slice(0, -1).join(", ") + " & " + studentNames[studentNames.length - 1]
      : "";

  const grade8PlusStudents = students.filter((s) => getGradeValue(s.grade) >= 10);

  const getStepStatus = (onboardingStep: number): "completed" | "active" | "pending" => {
    if (onboardingStep === 1) {
      if (data.leadType) return "completed";
      return step === 0 ? "active" : "pending";
    }
    if (onboardingStep === 2) {
      if (data.leadType === LeadType.QURAN) {
        if (quranStudents.length > 0 || (data.studentName as any)) return "completed";
      } else {
        if (students.length > 0 || (data.studentName as any)) return "completed";
      }
      if (step === 1) return "active";
      return "pending";
    }
    if (onboardingStep === 3) {
      if (step > 2) return "completed";
      if (step === 2) return "active";
      return "pending";
    }
    return "pending";
  };

  const progress = Math.max(0, Math.min(100, Math.round((step / 2) * 100)));

  const smartHint = useMemo(() => {
    if (step === 0) return "Choose a program to get personalized guidance";
    if (step === 1) return "Add student details to customize your experience";
    if (step === 2) return "Review everything and complete your enrollment";
    return "Almost there!";
  }, [step]);

  const headerSub = useMemo(() => {
    if (step === 0) return "Start your adventure";
    if (step === 1) return "Student information";
    if (step === 2) return "Final review";
    return "Application progress";
  }, [step]);

  const TimelineSteps = () => (
    <div className="sp-timeline" aria-label="Registration timeline">
      {ONBOARDING_STEPS.map((s, index) => {
        const status = getStepStatus(s.id);
        return (
          <div key={s.id} className={`sp-timelineStep ${status}`}>
            <div className="sp-timelineIcon">
              {status === "completed" ? <Check className="w-5 h-5" /> : s.id}
            </div>
            <div className="sp-timelineContent">
              <div className="sp-timelineTitle">{s.label}</div>
              <div className="sp-timelineSub">{s.sub}</div>
            </div>
            {index < ONBOARDING_STEPS.length - 1 && <div className="sp-timelineLine" />}
          </div>
        );
      })}
    </div>
  );

  const AdvisorContent = () => (
    <div className="sp-advisorContent">
      {/* Premium Tip Card with Glow */}
      <div className="sp-tipCard">
        <div className="sp-tipGlow" />
        <div className="sp-tipIcon">
          <Target className="w-5 h-5" />
        </div>
        <div className="sp-tipText">
          <div className="sp-tipHeader">Current Step</div>
          <div className="sp-tipDescription">{smartHint}</div>
        </div>
      </div>

      {/* Contextual Insights with Premium Look */}
      {step === 0 && (
        <InsightCard icon={<Rocket className="w-5 h-5" />} title="Welcome!" variant="info" delay={100}>
          Choose the program that best fits your needs. You can add multiple programs later.
        </InsightCard>
      )}

      {firstStudentName && step >= 1 && data.leadType !== LeadType.QURAN && (
        <InsightCard icon={<Check className="w-5 h-5" />} title="Student Added" variant="success" delay={150}>
          <strong>{allStudentNames}</strong> {students.length > 1 ? 'have' : 'has'} been added to your application.
        </InsightCard>
      )}

      {hasSiblings && (
        <InsightCard icon={<Users className="w-5 h-5" />} title="Family Enrollment" variant="success" delay={200}>
          Enrolling <strong>{students.length} students</strong> together. Family discounts may be available!
        </InsightCard>
      )}

      {ageVal > 20 && data.leadType === LeadType.FULL_TIME && (
        <InsightCard icon={<AlertCircle className="w-5 h-5" />} title="Age Notice" variant="warning" delay={250}>
          For students over 20, we recommend personalized tuition. Our advisor will help you choose the best option.
        </InsightCard>
      )}

      {step >= 1 && data.leadType === LeadType.FULL_TIME && grade8PlusStudents.length > 0 && (
        <InsightCard icon={<GraduationCap className="w-5 h-5" />} title="Curriculum Options" variant="purple" delay={300}>
          <div className="sp-miniStack">
            <div className="sp-miniText">
              For Grade 8+ students, we offer:
            </div>
            <div className="sp-chip sp-chipGreen">
              <Award className="w-3 h-3" />
              Federal Board (Pakistan-focused)
            </div>
            <div className="sp-chip sp-chipBlue">
              <Star className="w-3 h-3" />
              IGCSE / A-Level (International)
            </div>
            <div className="sp-miniText">Our team will help determine the best fit during your trial.</div>
          </div>
        </InsightCard>
      )}

      {data.leadType && step >= 1 && (
        <InsightCard icon={<DollarSign className="w-5 h-5" />} title="Special Offers" variant="gold" delay={400}>
          Enrollment promotions and referral discounts may be available for your selected program.
        </InsightCard>
      )}
    </div>
  );

  const PanelInner = () => (
    <>
      {/* ── Premium Header with Gradient ── */}
      <div className="sp-header">
        <div className="sp-headerGlow" />
        <div className="sp-brand">
          <div className="sp-brandIcon">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="sp-brandText">
            <div className="sp-brandTitle">SMART ADVISOR</div>
            <div className="sp-brandSubtitle">{headerSub}</div>
          </div>
        </div>

        {/* ── Circular Progress with Glow ── */}
        <CircularProgress percent={progress} />
      </div>

      <TimelineSteps />

      {/* Premium Progress bar with glow */}
      <div className="sp-progressBar">
        <div className="sp-progressLabel">
          <Clock className="w-3 h-3" />
          Progress
        </div>
        <div className="sp-progressTrack">
          <div className="sp-progressFill" style={{ width: `${progress}%` }} />
          <div className="sp-progressGlow" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AdvisorContent />
    </>
  );

  return (
    <>
      <style>{`
        /* ── Premium Theme with Glows ── */
     .sp-panel {
  --primary:  #1d6fce;
  --secondary:#0ea5e9;
  --accent:   #38bdf8;
  --success:  #22c55e;
  --warning:  #f59e0b;
  --info:     #0284c7;
  --purple:   #a855f7;
  --gold:     #f59e0b;
  --bg:       rgba(255,255,255,0.08);
  --text:     #10315f;
  --muted:    #64748b;

  border-radius: 28px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06)),
    radial-gradient(circle at top left, rgba(125,211,252,0.20), transparent 34%),
    radial-gradient(circle at bottom right, rgba(186,230,253,0.16), transparent 30%),
    rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.34);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.46),
    inset 0 -1px 0 rgba(255,255,255,0.06),
    0 18px 40px rgba(15,23,42,0.08),
    0 4px 16px rgba(15,23,42,0.05);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  animation: panel-enter 0.6s cubic-bezier(0.4,0,0.2,1);
}

.sp-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      120deg,
      transparent 0%,
      rgba(255,255,255,0.07) 22%,
      rgba(255,255,255,0.14) 32%,
      rgba(255,255,255,0.04) 44%,
      transparent 58%
    );
  opacity: 0.9;
}

.sp-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.08),
    inset 0 18px 30px rgba(255,255,255,0.04);
}

        /* Premium animations */
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(180deg); }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ── Premium Header with Glow ── */
.sp-header {
  padding: 24px 24px;
  background:
    linear-gradient(135deg, rgba(29,111,206,0.74) 0%, rgba(14,165,233,0.68) 100%),
    linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px) saturate(135%);
  -webkit-backdrop-filter: blur(16px) saturate(135%);
  border-bottom: 1px solid rgba(255,255,255,0.18);
}

.sp-headerGlow {
  position: absolute;
  top: -40%;
  left: -30%;
  width: 160%;
  height: 180%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.16) 0%, transparent 30%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10) 0%, transparent 24%),
    radial-gradient(circle at 50% 100%, rgba(186,230,253,0.18) 0%, transparent 34%);
  animation: glow-pulse 5s ease-in-out infinite;
  pointer-events: none;
}

        .sp-brand { display: flex; align-items: center; gap: 14px; z-index: 1; }
.sp-brandIcon {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10));
  border: 1px solid rgba(255,255,255,0.26);
  border-radius: 50%;
  padding: 10px;
  color: white;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.42),
    inset 0 -1px 0 rgba(255,255,255,0.08),
    0 8px 18px rgba(15,23,42,0.18);
  animation: float 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
        .sp-brandTitle  { 
          font-size: 15px; 
          font-weight: 900; 
          letter-spacing: 1.3px; 
          text-transform: uppercase;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .sp-brandSubtitle { 
          font-size: 12px; 
          opacity: 0.95; 
          margin-top: 2px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        /* ── Circular Progress with Glow ── */
        .sp-circleWrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 1;
        }

.sp-circleGlow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);
  animation: glow-pulse 3s ease-in-out infinite;
  border-radius: 50%;
}

        .sp-circleLabel {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .sp-circlePercent {
          font-size: 17px;
          font-weight: 900;
          color: white;
          line-height: 1;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        /* ── Timeline with Glows ── */
        .sp-timeline {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .sp-timelineStep {
          display: flex;
          align-items: flex-start;
          position: relative;
          padding-bottom: 22px;
        }
        .sp-timelineStep:last-child { padding-bottom: 0; }
        .sp-timelineIcon {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
          border: 2.5px solid rgba(29,111,206,0.2);
          color: var(--muted);
          font-weight: 800;
          font-size: 15px;
          flex-shrink: 0;
          z-index: 1;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }

        .sp-timelineIcon::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .sp-timelineStep.completed .sp-timelineIcon {
          background: linear-gradient(135deg, #22c55e, #10b981);
          color: white;
          border-color: transparent;
          box-shadow: 
            0 0 20px rgba(34,197,94,0.4),
            0 4px 12px rgba(34,197,94,0.25);
        }

        .sp-timelineStep.active .sp-timelineIcon {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-color: transparent;
          box-shadow: 
            0 0 25px rgba(29,111,206,0.5),
            0 4px 16px rgba(29,111,206,0.3);
          animation: pulse 2s infinite;
        }

        .sp-timelineStep.active .sp-timelineIcon::before {
          background: radial-gradient(circle, rgba(29,111,206,0.3), transparent);
          opacity: 1;
          animation: glow-pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .sp-timelineContent { margin-left: 16px; padding-top: 8px; }
        .sp-timelineTitle { font-weight: 800; font-size: 13px; color: var(--text); }
        .sp-timelineSub   { color: var(--muted); font-size: 11px; margin-top: 3px; }
        .sp-timelineLine  {
          position: absolute;
          left: 20px;
          top: 42px;
          width: 2.5px;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(29,111,206,0.3), rgba(29,111,206,0.08));
          border-radius: 2px;
        }

        /* ── Premium Progress bar with glow ── */
        .sp-progressBar   { padding: 0 24px 20px; position: relative; }
        .sp-progressLabel { 
          font-size: 10px; 
          color: var(--muted); 
          margin-bottom: 8px; 
          font-weight: 700; 
          letter-spacing: 0.8px; 
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
.sp-progressTrack {
  height: 8px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  box-shadow:
    inset 0 1px 2px rgba(255,255,255,0.14),
    inset 0 -1px 2px rgba(0,0,0,0.04);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
        .sp-progressFill  {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 0 12px rgba(29,111,206,0.4);
        }

        .sp-progressGlow {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          border-radius: 4px;
          animation: shimmer 2s infinite;
        }

        /* ── Advisor Content ── */
        .sp-advisorContent { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 14px; }

.sp-tipCard {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08));
  border: 1px solid rgba(255,255,255,0.28);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.38),
    inset 0 -1px 0 rgba(255,255,255,0.05),
    0 8px 24px rgba(29,111,206,0.08);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(14px) saturate(130%);
  -webkit-backdrop-filter: blur(14px) saturate(130%);
}

.sp-tipGlow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(125,211,252,0.12) 0%, transparent 70%);
  animation: glow-pulse 5s ease-in-out infinite;
}

.sp-tipIcon {
  background: linear-gradient(135deg, rgba(29,111,206,0.88), rgba(14,165,233,0.82));
  color: white;
  padding: 9px;
  border-radius: 50%;
  box-shadow:
    0 0 16px rgba(29,111,206,0.22),
    0 4px 12px rgba(29,111,206,0.16);
  flex-shrink: 0;
  z-index: 1;
  animation: float 3.5s ease-in-out infinite;
}
        .sp-tipHeader      { 
          font-weight: 800; 
          font-size: 12px; 
          color: var(--primary); 
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sp-tipDescription { 
          color: var(--muted); 
          font-size: 12px; 
          margin-top: 3px; 
          line-height: 1.6;
          font-weight: 500;
        }

        /* ── Premium Insight Cards ── */
        .sp-insightWrap { 
          opacity: 0; 
          transform: translateY(16px); 
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1); 
        }
        .sp-in { opacity: 1; transform: translateY(0); }
        
.sp-insight {
  padding: 16px 18px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06));
  border: 1px solid rgba(255,255,255,0.26);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.34),
    inset 0 -1px 0 rgba(255,255,255,0.04),
    0 8px 24px rgba(29,111,206,0.06);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(14px) saturate(130%);
  -webkit-backdrop-filter: blur(14px) saturate(130%);
}

.sp-insight::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      120deg,
      transparent 0%,
      rgba(255,255,255,0.05) 30%,
      rgba(255,255,255,0.10) 42%,
      transparent 60%
    );
  opacity: 0.8;
  transition: opacity 0.3s;
}
 .sp-insight:hover {
  transform: translateY(-4px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.38),
    inset 0 -1px 0 rgba(255,255,255,0.05),
    0 12px 30px rgba(29,111,206,0.10);
}

        .sp-insight:hover::before { opacity: 1; }

        .sp-insightHead   { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; z-index: 1; position: relative; }
        .sp-insightIco    {
          width: 36px; height: 36px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
          color: var(--primary);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(29,111,206,0.15);
          transition: all 0.3s;
        }

.sp-insightIco {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.08));
  color: var(--primary);
  flex-shrink: 0;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.30),
    0 2px 8px rgba(29,111,206,0.08);
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
        .sp-insightTitle  { font-weight: 800; font-size: 13px; color: var(--text); letter-spacing: 0.2px; }
        .sp-insightBody   { color: var(--muted); font-size: 12px; line-height: 1.7; font-weight: 500; z-index: 1; position: relative; }

        /* Variant colors with gradients */
        .sp-success .sp-insightIco { 
          background: linear-gradient(135deg, #dcfce7, #bbf7d0); 
          color: #16a34a;
          box-shadow: 0 0 16px rgba(34,197,94,0.25);
        }
        .sp-warning .sp-insightIco { 
          background: linear-gradient(135deg, #fef3c7, #fde68a); 
          color: #d97706;
          box-shadow: 0 0 16px rgba(245,158,11,0.25);
        }
        .sp-info .sp-insightIco { 
          background: linear-gradient(135deg, #dbeafe, #bfdbfe); 
          color: #2563eb;
          box-shadow: 0 0 16px rgba(37,99,235,0.25);
        }
        .sp-purple .sp-insightIco { 
          background: linear-gradient(135deg, #ede9fe, #ddd6fe); 
          color: #7c3aed;
          box-shadow: 0 0 16px rgba(124,58,237,0.25);
        }
        .sp-gold .sp-insightIco { 
          background: linear-gradient(135deg, #fef3c7, #fde68a); 
          color: #f59e0b;
          box-shadow: 0 0 16px rgba(245,158,11,0.3);
        }

        /* chips with icons */
        .sp-miniStack { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
        .sp-miniText  { font-size: 11px; color: var(--muted); line-height: 1.6; }
        .sp-chip { 
          font-size: 11px; 
          font-weight: 700; 
          padding: 6px 12px; 
          border-radius: 999px; 
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s;
        }
        .sp-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .sp-chipGreen  { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; }
        .sp-chipBlue   { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; }

        /* ── Mobile Drawer ── */
        .sp-backdrop { 
          position: fixed; 
          inset: 0; 
          background: rgba(15,45,87,0.45); 
          backdrop-filter: blur(8px); 
          animation: fadeIn 0.3s ease; 
          z-index: 49; 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
.sp-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.74), rgba(244,248,255,0.58));
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  box-shadow: 0 -8px 50px rgba(29,111,206,0.16);
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.4s cubic-bezier(0.32,0.72,0,1);
  z-index: 50;
  backdrop-filter: blur(18px) saturate(135%);
  -webkit-backdrop-filter: blur(18px) saturate(135%);
  border-top: 1px solid rgba(255,255,255,0.26);
}
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        
        .sp-drag { 
          width: 48px; 
          height: 5px; 
          background: linear-gradient(135deg, #cbd5e1, #94a3b8); 
          border-radius: 3px; 
          margin: 14px auto 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .sp-drawerHead { 
          padding: 14px 22px; 
          border-bottom: 1px solid rgba(29,111,206,0.1); 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .sp-drawerBrand{ display: flex; align-items: center; gap: 12px; }
        .sp-drawerIco  { 
          background: linear-gradient(135deg, #dbeafe, #eff6ff); 
          padding: 9px; 
          border-radius: 50%; 
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(29,111,206,0.15);
        }
        .sp-drawerTitle{ font-weight: 800; color: var(--text); font-size: 15px; }
        .sp-drawerSub  { color: var(--muted); font-size: 12px; margin-top: 2px; }
        .sp-close      { 
          background: #f1f5f9; 
          padding: 8px; 
          border-radius: 50%; 
          color: var(--muted); 
          border: none; 
          cursor: pointer; 
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .sp-close:hover { 
          background: rgba(29,111,206,0.1); 
          color: var(--primary);
          transform: scale(1.05);
        }

        /* ── Premium FAB with Glow ── */
 .sp-fab {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 12px 18px;
  border-radius: 999px;
  box-shadow: 
    0 0 16px rgba(29,111,206,0.28),
    0 6px 18px rgba(29,111,206,0.22);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  max-width: calc(100vw - 24px);
}

        .sp-fab::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .sp-fab:hover { 
          transform: scale(1.08); 
          box-shadow: 
            0 0 30px rgba(29,111,206,0.5),
            0 8px 32px rgba(29,111,206,0.4);
        }

        .sp-fab:hover::before { opacity: 1; }

@media (max-width: 768px) {
  .sp-timeline { padding: 18px 20px; }
  .sp-advisorContent { padding: 0 20px 20px; }

  .sp-fab {
    padding: 11px 16px;
    font-size: 12px;
    gap: 7px;
  }

  .sp-fab svg {
    width: 16px;
    height: 16px;
  }

  .sp-drawer {
    max-height: 82vh;
    border-top-left-radius: 22px;
    border-top-right-radius: 22px;
  }

  .sp-drawerHead {
    padding: 12px 16px;
  }
}
        /* ===== PREMIUM HANGING EFFECT ===== */
        .sp-hangWrap {
          position: relative;
          padding-top: 0;
        }

        .sp-hangDecor {
          pointer-events: none;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -100px; /* Rope extends upward from panel */
          width: 20px;
          height: 100px;
          z-index: 3;
        }

        /* Single centered rope attached to panel top */
        .sp-rope {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 95px; /* Extends to panel top */
          border-radius: 2px;
          background: linear-gradient(180deg, 
            rgba(71,85,105,0.3) 0%,
            rgba(100,116,139,0.9) 30%,
            rgba(100,116,139,0.95) 60%,
            rgba(100,116,139,1) 100%
          );
          box-shadow: 
            0 4px 12px rgba(15,30,58,0.25),
            inset 2px 0 2px rgba(255,255,255,0.3),
            inset -2px 0 2px rgba(0,0,0,0.3);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        /* Premium metal ring at panel connection point */
        .sp-ring {
          position: absolute;
          top: 88px; /* Just above panel */
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f1f5f9, #cbd5e1, #94a3b8);
          border: 3px solid rgba(71,85,105,0.9);
          box-shadow: 
            0 0 15px rgba(29,111,206,0.3),
            0 4px 12px rgba(15,30,58,0.25),
            inset 0 2px 4px rgba(255,255,255,0.6),
            inset 0 -2px 4px rgba(0,0,0,0.2);
          animation: ring-glow 3s ease-in-out infinite;
        }

        @keyframes ring-glow {
          0%, 100% { box-shadow: 
            0 0 15px rgba(29,111,206,0.3),
            0 4px 12px rgba(15,30,58,0.25),
            inset 0 2px 4px rgba(255,255,255,0.6),
            inset 0 -2px 4px rgba(0,0,0,0.2);
          }
          50% { box-shadow: 
            0 0 25px rgba(29,111,206,0.5),
            0 6px 16px rgba(15,30,58,0.3),
            inset 0 2px 4px rgba(255,255,255,0.8),
            inset 0 -2px 4px rgba(0,0,0,0.2);
          }
        }

        /* Decorative hook at ring */
        .sp-hook {
          position: absolute;
          top: 92px;
          left: 50%;
          transform: translateX(-50%) rotate(42deg);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2.5px solid rgba(71,85,105,0.7);
          border-left-color: transparent;
          border-top-color: transparent;
          opacity: 0.9;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));
        }

        /* Very subtle sway animation for visual appeal */
        @keyframes spSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(0.5deg); }
        }

        .sp-hangSway {
          transform-origin: 50% 0%;
          animation: spSway 6s ease-in-out infinite;
        }

        /* Panel entrance animation */
        @keyframes panel-enter {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sp-panel {
          animation: panel-enter 0.6s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>

      {/* Desktop Panel - Sticky (Frozen in Place While Scrolling) */}
      <div className="hidden 2xl:block">
        {/* Sticky positioning keeps panel frozen while content scrolls */}
        <div className="sp-hangWrap">
          {/* Rope extends upward from panel top */}
          <div className="sp-hangDecor" aria-hidden="true">
            <span className="sp-rope" />
            <span className="sp-ring" />
            <span className="sp-hook" />
          </div>

          {/* Panel with subtle sway */}
          <div className="sp-panel sp-hangSway">
            <PanelInner />
          </div>
        </div>
      </div>

      {/* Mobile FAB with Premium Glow */}
      
        <div className="2xl:hidden fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
  <button onClick={() => setMobileDrawerOpen(true)} className="sp-fab">
          <MessageCircle className="w-5 h-5" />
          <span>Guide</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
        <PanelInner />
      </MobileDrawer>
    </>
  );
};

export default SmartPanel;