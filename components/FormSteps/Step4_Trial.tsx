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
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export const Step4_Trial = ({ data, updateData }: StepProps) => {
  const trialText = getGV(data.grade)>=10
    ? 'Morning: 9:00 AM KSA / 10:00 AM UAE / 11:00 AM PKT'
    : 'Evening: 3:30 PM KSA / 4:30 PM UAE / 5:30 PM PKT';
  const studentName = data.students.filter(s=>s.id!==DRAFT_ID)[0]?.name||data.studentName||'your child';

  return (
    <div className="space-y-8 transition-all duration-300">
      <div className="text-center"><h2 className="text-2xl font-display font-bold">Confirm Trial Class</h2><p className="text-brand-mediumText">Almost there!</p></div>
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-brand-burgundy to-brand-orange">
        <div className="bg-brand-cream rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-brand-mediumText uppercase tracking-widest text-xs font-bold">Assigned Slot</h3>
          <p className="text-xl sm:text-2xl font-bold text-brand-darkText">{trialText}</p>
          <div className="flex items-center justify-center gap-2 text-brand-burgundy text-sm"><Calendar className="w-4 h-4"/><span>Duration: {data.leadType===LeadType.FULL_TIME?'3 Days':'1 Day'}</span></div>
        </div>
      </div>
      <div className="space-y-4">
        <OptionCard title="Yes, I can attend" selected={data.trialConfirmed} onClick={()=>updateData({trialConfirmed:true,trialReason:''})} icon={CheckCircle}/>
        <OptionCard title="Need a different time" selected={!data.trialConfirmed} onClick={()=>updateData({trialConfirmed:false})} icon={Calendar}/>
      </div>
      {!data.trialConfirmed && <GlassCard className="space-y-4"><SelectField label="Reason" value={data.trialReason} onChange={e=>updateData({trialReason:e.target.value})} options={['Schedule Conflict','Timezone Issue','Request Advisor Call Instead']}/>{data.trialReason!=='Request Advisor Call Instead'&&<SelectField label="Preferred Day" value={data.trialPreferredDay} onChange={e=>updateData({trialPreferredDay:e.target.value})} options={DAYS}/>}</GlassCard>}
      <div className="space-y-4 pt-6 border-t border-brand-lightGray">
        <h3 className="text-lg font-semibold text-brand-burgundy flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-orange"/>Add more for {studentName}?</h3>
      </div>
      <div className="pt-6 border-t border-brand-lightGray"><GlassCard><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg"><ShieldCheck className="w-5 h-5"/></div><div><h4 className="font-bold text-brand-darkText">Coupon Code?</h4><p className="text-xs text-brand-mediumText">Optional</p></div></div><InputField label="" value={data.couponCode} onChange={e=>updateData({couponCode:e.target.value.toUpperCase()})} placeholder="e.g. WELCOME2024"/></GlassCard></div>
      <div className="pt-4"><label className="text-sm font-medium text-brand-darkText mb-2 block">Any questions? (Optional)</label><textarea className="w-full glass-input rounded-xl p-4 text-sm h-24" placeholder="Let us know..." value={data.notes} onChange={e=>updateData({notes:e.target.value})}/></div>
    </div>
  );
};