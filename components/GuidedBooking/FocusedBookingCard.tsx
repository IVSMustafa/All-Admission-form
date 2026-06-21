import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

type FocusedBookingCardProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

const FocusedBookingCard = ({
  title,
  subtitle,
  eyebrow = 'Booking assistant',
  children,
  footer,
  className = '',
}: FocusedBookingCardProps) => (
  <section
    className={`relative overflow-hidden rounded-[24px] border border-[rgba(201,225,255,0.88)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(244,249,255,0.58))] p-4 shadow-[0_18px_42px_rgba(15,45,87,0.08)] sm:rounded-[28px] sm:p-6 lg:p-7 lg:shadow-[0_24px_60px_rgba(15,45,87,0.10)] ${className}`}
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
    <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.13),rgba(255,255,255,0))]" />

    <div className="relative mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="mb-3 inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[rgba(29,111,206,0.14)] bg-white/62 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#1d6fce]">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="text-[22px] font-black leading-tight tracking-[0.01em] text-[#0f2d57] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-relaxed text-[#5c7593] sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    <div className="relative">{children}</div>

    {footer && (
      <div className="relative mt-6 border-t border-[rgba(201,225,255,0.72)] pt-5">
        {footer}
      </div>
    )}
  </section>
);

export default FocusedBookingCard;
