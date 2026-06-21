import type { ReactNode } from 'react';
import type { FormData } from '../../types';
import AIGuideRail from './AIGuideRail';
import LiveTrialSummary from './LiveTrialSummary';

type GuidedBookingShellProps = {
  data: FormData;
  currentStep: number;
  children: ReactNode;
  className?: string;
  mainClassName?: string;
};

const GuidedBookingShell = ({
  data,
  currentStep,
  children,
  className = '',
  mainClassName = '',
}: GuidedBookingShellProps) => (
  <div
    className={`min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top_left,rgba(29,111,206,0.10),transparent_34%),linear-gradient(180deg,#edf6ff_0%,#f8fbff_100%)] px-3 pb-32 pt-3 sm:px-5 sm:pt-5 lg:px-6 lg:pb-8 xl:px-6 2xl:px-8 ${className}`}
  >
    <div className="mx-auto grid w-full max-w-[1760px] gap-4 lg:gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px] 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
      <div className="min-w-0 xl:sticky xl:top-5 xl:self-start">
        <AIGuideRail data={data} currentStep={currentStep} />
      </div>

      <main className={`min-w-0 ${mainClassName}`}>{children}</main>

      <div className="min-w-0 xl:sticky xl:top-5 xl:self-start">
        <LiveTrialSummary data={data} />
      </div>
    </div>
  </div>
);

export default GuidedBookingShell;
