import { ShieldCheck, TicketPercent } from 'lucide-react';
import type { FormData } from '../../types';

type GuidedCouponBadgeProps = {
  couponCode?: FormData['couponCode'];
  appliedCoupon?: FormData['appliedCoupon'];
  compact?: boolean;
};

const GuidedCouponBadge = ({
  couponCode,
  appliedCoupon,
  compact = false,
}: GuidedCouponBadgeProps) => {
  if (!appliedCoupon || !couponCode) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-[rgba(29,111,206,0.22)] bg-white/45 px-3 py-2 text-xs font-bold text-[#5c7593]">
        <TicketPercent className="h-3.5 w-3.5" />
        Referral optional
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[rgba(16,185,129,0.22)] bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(239,246,255,0.92))] text-[#047857] shadow-[0_10px_24px_rgba(16,185,129,0.10)] ${
        compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'
      }`}
    >
      <ShieldCheck className="h-4 w-4" />
      <span className="font-black tracking-[0.02em]">{couponCode}</span>
      <span className="font-bold text-[#23527c]">{appliedCoupon.discountValue}% off</span>
    </div>
  );
};

export default GuidedCouponBadge;
