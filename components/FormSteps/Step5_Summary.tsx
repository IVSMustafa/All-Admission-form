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
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export const Step5_Summary = ({ data, updateData }: StepProps) => (
  <div className="space-y-8 transition-all duration-300">
    <div className="text-center"><h2 className="text-2xl font-display font-bold">Final Steps</h2><p className="text-brand-mediumText">Review and add extras.</p></div>
    <textarea className="w-full glass-input rounded-xl p-4 text-sm h-24" placeholder="Final notes?" value={data.notes} onChange={e=>updateData({notes:e.target.value})}/>
  </div>
);

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