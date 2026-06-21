import { Bot, GraduationCap, MessageCircle, Sparkles } from 'lucide-react';
import type { FormData } from '../../types';
import { LeadType } from '../../types';
import GuidedProgress from './GuidedProgress';

type AIGuideRailProps = {
  data: FormData;
  currentStep: number;
  className?: string;
};

const getProgramLabel = (leadType: FormData['leadType']) => {
  if (leadType === LeadType.FULL_TIME) return 'School Trial';
  if (leadType === LeadType.ONE_ON_ONE_SCHOOLING) return 'One-to-One Schooling';
  if (leadType === LeadType.TUITION) return 'Tuition Trial';
  if (leadType === LeadType.QURAN) return 'Quran Trial';
  return 'Trial Booking';
};

const getGuideMessage = (data: FormData, currentStep: number) => {
  if (currentStep === 0) {
    return 'Choose the trial path that best matches your child. I will keep the booking focused from there.';
  }

  if (currentStep === 1) {
    if (data.leadType === LeadType.QURAN) {
      return 'Add each Quran learner with subjects, days, and a preferred class time. Multiple children are supported.';
    }
    if (data.leadType === LeadType.TUITION) {
      return 'Share the student details and what kind of tutor support you need. The advisor will match the right teacher.';
    }
    return 'Add each child one at a time. Younger grades use the fixed evening school trial schedule.';
  }

  return 'Review the plan, confirm any referral reward, and submit when everything looks right.';
};

const AIGuideRail = ({ data, currentStep, className = '' }: AIGuideRailProps) => (
  <aside className={`space-y-3 lg:space-y-4 ${className}`}>
    <div className="relative overflow-hidden rounded-[22px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(239,247,255,0.48))] p-3 shadow-[0_16px_34px_rgba(15,45,87,0.08)] sm:rounded-[26px] sm:p-4 xl:rounded-[28px] xl:p-5 xl:shadow-[0_24px_54px_rgba(15,45,87,0.10)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="flex items-center gap-3 xl:mb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d6fce,#0ea5e9)] text-white shadow-[0_14px_28px_rgba(29,111,206,0.18)] xl:h-12 xl:w-12">
          <Bot className="h-5 w-5 xl:h-6 xl:w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6c87a7]">IVS AI Guide</p>
          <h2 className="truncate text-base font-black text-[#0f2d57] xl:text-lg">{getProgramLabel(data.leadType)}</h2>
        </div>
      </div>

      <div className="relative my-4 hidden min-h-[132px] items-center justify-center rounded-[24px] border border-[rgba(201,225,255,0.72)] bg-[radial-gradient(circle_at_top,rgba(29,111,206,0.16),rgba(255,255,255,0.34)_58%)] sm:flex xl:mb-5 xl:mt-0 xl:min-h-[156px]">
        <div className="absolute left-5 top-5 text-[#1d6fce]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/70 bg-white/62 shadow-[0_18px_40px_rgba(29,111,206,0.12)] xl:h-24 xl:w-24 xl:rounded-[32px]">
          <img
            src="/images/assistant-sofa.webp"
            alt=""
            className="h-16 w-16 object-contain xl:h-20 xl:w-20"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="mt-3 rounded-[18px] border border-[rgba(29,111,206,0.12)] bg-white/60 p-3 xl:mt-0 xl:rounded-[22px] xl:p-4">
        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#1d6fce] xl:mb-2 xl:text-xs">
          <MessageCircle className="h-3.5 w-3.5" />
          Guide note
        </div>
        <p className="text-[13px] font-semibold leading-relaxed text-[#23527c] sm:text-sm">
          {getGuideMessage(data, currentStep)}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-full bg-[rgba(29,111,206,0.07)] px-3 py-2 text-xs font-bold text-[#5c7593] xl:mt-4">
        <GraduationCap className="h-3.5 w-3.5 text-[#1d6fce]" />
        Premium trial booking, guided step by step.
      </div>
    </div>

    <GuidedProgress currentStep={currentStep} />
  </aside>
);

export default AIGuideRail;
