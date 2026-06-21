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
import { Step3_Academics } from './Step3_Academics';
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export const Step2_Program = ({ data, updateData }: StepProps) => {
  const ageNum = parseInt(data.age) || 0;
  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="text-center mb-8"><h2 className="text-2xl font-display font-bold">Choose Program</h2><p className="text-brand-mediumText">Select the program that fits your goals.</p></div>
      <div className="grid gap-4">
        <OptionCard title="Full-time School" description="Regular schooling (KG1-12) with daily classes." icon={School} selected={data.programType===ProgramType.FULL_TIME} onClick={()=>updateData({programType:ProgramType.FULL_TIME})}/>
        {!(data.leadType===LeadType.FULL_TIME && ageNum<=20) && <>
          <OptionCard title="Tuition (1-on-1)" description="Personalized coaching for subjects or exam prep." icon={BookOpen} selected={data.programType===ProgramType.TUITION} onClick={()=>updateData({programType:ProgramType.TUITION})}/>
          <OptionCard title="One-to-One Schooling" description="Full curriculum with personal teacher (up to Grade 7)." icon={GraduationCap} selected={data.programType===ProgramType.ONE_ON_ONE_SCHOOLING} onClick={()=>updateData({programType:ProgramType.ONE_ON_ONE_SCHOOLING})}/>
        </>}
      </div>
      {ageNum>20 && data.programType===ProgramType.FULL_TIME && <div className="flex items-center gap-3 text-yellow-300 text-sm bg-yellow-900/30 p-4 rounded-xl border border-yellow-500/30"><AlertTriangle className="w-5 h-5 shrink-0"/><p>We usually recommend Tuition for learners over 20.</p></div>}
    </div>
  );
};