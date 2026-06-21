import { CheckCircle2, Circle, Sparkles } from 'lucide-react';

type GuidedProgressProps = {
  currentStep: number;
  className?: string;
};

const STEPS = [
  { label: 'Program', helper: 'Pick a trial' },
  { label: 'Details', helper: 'Parent and child' },
  { label: 'Review', helper: 'Confirm booking' },
];

const GuidedProgress = ({ currentStep, className = '' }: GuidedProgressProps) => {
  const clampedStep = Math.max(0, Math.min(currentStep, STEPS.length - 1));

  return (
    <div className={`rounded-[22px] border border-white/60 bg-white/42 p-3 shadow-[0_14px_28px_rgba(15,45,87,0.05)] sm:rounded-[24px] sm:p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6c87a7]">Progress</p>
          <h3 className="mt-1 text-sm font-black text-[#0f2d57]">Guided booking</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d6fce,#0ea5e9)] text-white shadow-[0_12px_24px_rgba(29,111,206,0.18)]">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 xl:block xl:space-y-3">
        {STEPS.map((step, index) => {
          const isComplete = index < clampedStep;
          const isActive = index === clampedStep;

          return (
            <div key={step.label} className="grid min-w-0 grid-cols-1 gap-2 rounded-2xl bg-white/36 p-2 xl:grid-cols-[28px_1fr] xl:bg-transparent xl:p-0">
              <div className="relative flex justify-start xl:justify-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                    isComplete
                      ? 'border-emerald-200 bg-emerald-500 text-white'
                      : isActive
                      ? 'border-[rgba(29,111,206,0.34)] bg-[#1d6fce] text-white'
                      : 'border-[rgba(108,135,167,0.28)] bg-white/60 text-[#8aa1b8]'
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="absolute top-8 hidden h-6 w-px bg-[rgba(108,135,167,0.18)] xl:block" />
                )}
              </div>

              <div className="min-w-0 xl:pb-2">
                <p className={`truncate text-xs font-black sm:text-sm ${isActive ? 'text-[#1d6fce]' : 'text-[#0f2d57]'}`}>
                  {step.label}
                </p>
                <p className="hidden text-xs font-semibold text-[#6c87a7] sm:block">{step.helper}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuidedProgress;
