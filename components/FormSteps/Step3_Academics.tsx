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
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export const Step3_Academics = ({ data, updateData }: StepProps) => {
  useEffect(() => {
    if (data.programType===ProgramType.FULL_TIME && !data.curriculum) {
      const g = getGV(data.grade);
      if (g>=1 && g<=9) updateData({curriculum:Curriculum.BRITISH});
      else if (g>=10) updateData({curriculum:Curriculum.FEDERAL});
    }
  }, [data.programType, data.grade]);

  const toggle = (sub:string) => {
    const c = data.subjects || [];
    updateData({subjects:c.includes(sub)?c.filter(s=>s!==sub):[...c,sub]});
  };

  return (
    <div className="space-y-8 transition-all duration-300">
      <div className="text-center"><h2 className="text-2xl font-display font-bold">Academic Preferences</h2><p className="text-brand-mediumText">Customize the learning path.</p></div>
      {data.programType===ProgramType.FULL_TIME && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <OptionCard title="British Curriculum" description="Cambridge/Edexcel (KG1-Grade 7)" selected={data.curriculum===Curriculum.BRITISH} onClick={()=>updateData({curriculum:Curriculum.BRITISH})}/>
            <OptionCard title="Federal Board (FBISE)" description="Pakistan Federal Board (Grade 8-12)" selected={data.curriculum===Curriculum.FEDERAL} onClick={()=>updateData({curriculum:Curriculum.FEDERAL})}/>
            <OptionCard title="IGCSE / O-Level" description="Preparatory classes" selected={data.curriculum===Curriculum.IGCSE_O_LEVEL} onClick={()=>updateData({curriculum:Curriculum.IGCSE_O_LEVEL})}/>
            <OptionCard title="A-Level Prep" description="Advanced Level" selected={data.curriculum===Curriculum.A_LEVEL} onClick={()=>updateData({curriculum:Curriculum.A_LEVEL})}/>
          </div>
        </div>
      )}
      {(data.programType===ProgramType.TUITION || data.curriculum===Curriculum.IGCSE_O_LEVEL || data.curriculum===Curriculum.A_LEVEL) && (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="font-medium text-brand-burgundy mb-4">Select Subjects</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {IGCSE_SUBJECTS.map(sub => (
                <button key={sub} type="button" onClick={()=>toggle(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${data.subjects.includes(sub)?'bg-brand-orange text-brand-dark border-brand-orange':'bg-white/60 text-brand-mediumText border-brand-lightGray'}`}>
                  {sub}
                </button>
              ))}
            </div>
            <InputField label="Other Subject" value={data.customSubject} onChange={e=>updateData({customSubject:e.target.value})}/>
          </GlassCard>
        </div>
      )}
    </div>
  );
};