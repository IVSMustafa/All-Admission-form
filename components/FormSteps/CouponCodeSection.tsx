import '@fontsource/great-vibes/400.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FormData, LeadType, ProgramType, Curriculum, Track, ClassMode, Student, QuranStudent } from '../../types';
import { GRADES, COUNTRIES, IGCSE_SUBJECTS, TIME_SLOTS, DAYS, QURAN_LEVELS, QURAN_CLASS_TIMES, getGradeValue as getGV } from '../../constants';
import { GlassCard, InputField, SelectField, OptionCard, Toggle, PhoneInput, Button } from '../UI';
import { HeroCard, ProgramCard, TrustStrip, PROGRAM_CARDS_DATA, Navbar } from '../LandingPage';
import {
  School, BookOpen, GraduationCap, CheckCircle, Calendar, AlertTriangle,
  Phone, User, Sparkles, Loader2, UserRound, Clock, ShieldCheck, Globe2, Zap, Star, ChevronDown,
  ArrowLeft, ArrowRight,
} from 'lucide-react';
import { 
  usePremiumStyles, useTilt, DRAFT_ID,  cleanAgeInput, StepProps, PField 
} from './formStepStyles';

import { Step0_Welcome } from './Step0_Welcome';
import { Step1_Details } from './Step1_Details';
import { QuranForm } from './QuranForm';
import { TuitionForm } from './TuitionForm';
import { Step2_Program } from './Step2_Program';
import { Step3_Academics } from './Step3_Academics';
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { Step2_FinalSteps } from './Step2_FinalSteps';
import { COUPON_CSS } from './couponStyles';

const validateCoupon = (code: string) => {
  try {
    const env = import.meta.env as Record<string, string | undefined>;
    const raw = env[`VITE_COUPON_${code.toUpperCase()}`];

    if (!raw) return null;

    const [referrerName, discountType, discountValue, message] = raw.split('|');

    return {
      valid: true,
      referrerName,
      discountType,
      discountValue: parseInt(discountValue, 10),
      message,
    };
  } catch {
    return null;
  }
};

interface CouponProps {
  data: FormData;
  updateData: (f: Partial<FormData>) => void;
}


export const CouponCodeSection = ({ data, updateData }: CouponProps) => {
  const [input, setInput] = useState(data.couponCode || "");
  const [showPopup, setPopup] = useState(false);
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(false);
  const [voucherAnimKey, setVoucherAnimKey] = useState(0);
  const [pendingCoupon, setPendingCoupon] = useState<any>(null);
  const [showAppliedVoucher, setShowAppliedVoucher] = useState(!!data.appliedCoupon);
  const [isVoucherFlying, setIsVoucherFlying] = useState(false);

  useEffect(() => {
    setShowAppliedVoucher(!!data.appliedCoupon);
  }, [data.appliedCoupon]);

  const apply = () => {
    if (!input.trim()) {
      setErr("Please enter a code");
      return;
    }

    setChecking(true);
    setErr("");

    setTimeout(() => {
      const r = validateCoupon(input);

      if (r) {
        setPendingCoupon({
          code: input.toUpperCase(),
          data: r,
        });
        setPopup(true);
      } else {
        setErr("Invalid code.");
        setPendingCoupon(null);
        setShowAppliedVoucher(false);
        updateData({
          couponCode: "",
          appliedCoupon: null,
        });
      }

      setChecking(false);
    }, 500);
  };

  const handleRemoveVoucher = () => {
    setInput("");
    setErr("");
    setPendingCoupon(null);
    setShowAppliedVoucher(false);
    updateData({
      couponCode: "",
      appliedCoupon: null,
    });
  };

  return (
    <>
      <style>{COUPON_CSS}</style>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-darkText">Coupon / Referral Code</h4>
            <p className="text-xs text-brand-mediumText">Optional</p>
          </div>
        </div>

        {data.appliedCoupon && showAppliedVoucher ? (
          <div
            key={voucherAnimKey}
            className="ivs-applied-voucher rounded-[28px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(135deg,rgba(241,250,255,0.98)_0%,rgba(232,246,255,0.98)_48%,rgba(245,251,255,0.98)_100%)] shadow-[0_16px_34px_rgba(29,111,206,0.10),0_6px_16px_rgba(15,45,87,0.05)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_auto] items-stretch">
              <div className="relative px-6 py-6 md:px-7 md:py-7">
                <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-[#1d6fce] via-[#38bdf8] to-[#10b981]" />

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-[20px] flex items-center justify-center bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] shadow-[0_12px_24px_rgba(29,111,206,0.22)]">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#1d6fce] bg-[rgba(29,111,206,0.08)] border-[rgba(29,111,206,0.14)]">
                        Voucher Applied
                      </span>

                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#059669] bg-[rgba(16,185,129,0.10)] border-[rgba(16,185,129,0.18)]">
                        Verified
                      </span>
                    </div>

                   <h4 className="mt-3 text-[20px] sm:text-[30px] leading-tight font-black tracking-[0.01em] text-[#0f2d57] break-all">
  {data.couponCode}
</h4>

                    <p className="mt-3 text-[16px] font-semibold text-[#23527c]">
                      {data.appliedCoupon.discountValue}% off on{" "}
                      {data.appliedCoupon.discountType === "REGISTRATION_FEE"
                        ? "registration fee"
                        : "first month fee"}
                    </p>

                    <p className="mt-2 text-sm text-[#5c7593] leading-relaxed max-w-[520px]">
                      Your referral reward has been securely attached and is now reserved for this application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative px-4 py-5 md:px-6 md:py-6 flex flex-col items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-[rgba(29,111,206,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(235,246,255,0.90)_100%)] text-center">
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-extrabold text-[#6c87a7]">
                    Savings
                  </p>
                  <p className="mt-1 text-[34px] leading-none font-black bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] bg-clip-text text-transparent">
                    {data.appliedCoupon.discountValue}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#5c7593]">
                    Premium Reward
                  </p>
                </div>

<button
  onClick={handleRemoveVoucher}
  className="mt-2 inline-flex w-full sm:w-auto items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all hover:scale-[1.04] text-[#b45309] bg-[linear-gradient(135deg,rgba(255,248,236,0.95),rgba(255,242,220,0.95))] border border-[rgba(245,158,11,0.20)] shadow-[0_8px_18px_rgba(245,158,11,0.10)]"
>
  Remove voucher
</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.toUpperCase());
                  setErr("");
                }}
                placeholder="e.g. WELCOME2024"
                className="flex-1 px-4 py-3 rounded-xl border border-brand-lightGray bg-white text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
              />
              <button
                onClick={apply}
                disabled={checking || !input.trim()}
                className="px-5 py-3 bg-brand-burgundy text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {checking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking…
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            {err && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {err}
              </p>
            )}
          </div>
        )}
      </GlassCard>

      {showPopup && pendingCoupon && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(15,23,42,0.28)] backdrop-blur-[6px] p-4 sm:p-6"
          onClick={() => setPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`ivs-popup-card w-full max-w-[980px] ${isVoucherFlying ? "ivs-popup-fly-away" : ""}`}
          >
            <div className="ivs-popup-card-inner rounded-[34px] overflow-hidden border border-[rgba(180,205,230,0.95)] bg-[#f7fbff]">
              <div className="grid lg:grid-cols-[1.2fr_0.75fr]">
                <div className="relative p-6 sm:p-8 md:p-10 bg-[linear-gradient(135deg,#eef6ff_0%,#dbeeff_46%,#f5fbff_100%)]">
                  <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_40%)]" />

                  <p className="relative z-10 text-[11px] sm:text-[12px] uppercase tracking-[0.28em] font-bold text-[#1d6fce]/80 mb-3">
                    Luxury Discount Voucher
                  </p>

                  <h2 className="relative z-10 font-display text-[34px] sm:text-[44px] leading-none font-extrabold text-[#0f2d57]">
                    Congratulations
                  </h2>

                  <p className="relative z-10 mt-4 text-[15px] sm:text-[18px] leading-relaxed text-[#4d647f] max-w-[500px]">
                    Your referral benefit has been successfully unlocked for this registration.
                  </p>

                  <div className="relative z-10 mt-7 rounded-[24px] border border-[rgba(29,111,206,0.12)] bg-white/75 backdrop-blur-sm px-4 py-4 shadow-[0_8px_20px_rgba(15,45,87,0.06)] flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[18px] flex items-center justify-center text-[28px] bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] text-white shadow-[0_10px_24px_rgba(29,111,206,0.22)]">
                      🎁
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#6e85a0] mb-1">
                        Referred by
                      </p>
                      <p className="text-[24px] sm:text-[28px] font-extrabold text-[#0f2d57] leading-none">
                        {pendingCoupon.data.referrerName}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                    <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 text-sm font-bold shadow-sm">
                      ✓ Verified Referral
                    </div>

                    <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sky-700 text-sm font-bold shadow-sm">
                      ✓ Premium Reward
                    </div>
                  </div>
                </div>

                <div className="relative px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-center justify-center bg-[linear-gradient(160deg,#ffffff_0%,#f6fbff_100%)] border-t lg:border-t-0 lg:border-l border-[rgba(29,111,206,0.12)]">
                  <div className="relative text-center w-full max-w-[240px]">
                    <div className="relative mx-auto w-[190px] h-[190px] rounded-[28px] flex flex-col items-center justify-center bg-[linear-gradient(145deg,#ffffff_0%,#f4faff_52%,#e8f3ff_100%)] border border-[rgba(29,111,206,0.16)] shadow-[0_24px_40px_rgba(15,45,87,0.14),inset_0_2px_0_rgba(255,255,255,0.95)]">
                      <div className="absolute inset-3 rounded-[22px] border-2 border-dashed border-[rgba(29,111,206,0.25)]" />
                      <div className="absolute -top-3 -right-3 rounded-full bg-[linear-gradient(135deg,#0ea5e9,#1d6fce)] text-white text-[11px] font-black px-3 py-2 shadow-[0_10px_22px_rgba(29,111,206,0.26)]">
                        ACTIVE
                      </div>

                      <p className="text-[13px] uppercase tracking-[0.24em] font-black text-[#6a84a0]">
                        Save
                      </p>
                      <p className="text-[64px] leading-none font-black text-[#0f2d57] mt-1">
                        {pendingCoupon.data.discountValue}%
                      </p>
                      <p className="text-[16px] font-bold text-[#1d6fce] tracking-[0.2em] uppercase mt-1">
                        OFF
                      </p>
                    </div>

                    <div className="mt-6 rounded-[22px] border border-[rgba(29,111,206,0.12)] bg-[#f8fbff] px-4 py-4 shadow-[0_8px_20px_rgba(15,45,87,0.05)]">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a8ea5] font-bold">
                        Applied On
                      </p>
                      <p className="mt-2 text-[18px] font-bold text-[#0f2d57] leading-snug">
                        {pendingCoupon.data.discountType === "REGISTRATION_FEE"
                          ? "Registration Fee"
                          : "First Month Fee"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 md:px-10 py-6 sm:py-7 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] border-t border-[rgba(29,111,206,0.10)] text-center">
                <p className="text-[20px] sm:text-[26px] font-semibold text-[#23374f] leading-relaxed">
                  You'll get {pendingCoupon.data.discountValue}% off on{" "}
                  {pendingCoupon.data.discountType === "REGISTRATION_FEE"
                    ? "registration fee"
                    : "first month fee"}
                </p>

                <p className="mt-2 text-sm text-[#6b7f97]">
                  This offer will be attached to your registration details.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVoucherFlying(true);

                      setTimeout(() => {
                        updateData({
                          couponCode: pendingCoupon.code,
                          appliedCoupon: pendingCoupon.data,
                        });
                        setPopup(false);
                        setIsVoucherFlying(false);
                        setPendingCoupon(null);
                        setVoucherAnimKey((prev) => prev + 1);
                        setShowAppliedVoucher(true);
                      }, 800);
                    }}
                    className="w-full py-4 rounded-[18px] text-white font-bold shadow-[0_16px_34px_rgba(29,111,206,0.24)] hover:translate-y-[-1px] transition-all bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};