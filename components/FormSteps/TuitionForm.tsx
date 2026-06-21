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
import { Step2_Program } from './Step2_Program';
import { Step3_Academics } from './Step3_Academics';
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export const TuitionForm = ({ data, updateData, errors }: Pick<StepProps,'data'|'updateData'|'errors'>) => {
  usePremiumStyles();
  return (
    <div className="tuition-glass-ui space-y-5 pt-8 xl:pt-12 transition-all duration-300">
      <style>{`
.tuition-glass-ui input,
.tuition-glass-ui textarea,
.tuition-glass-ui select {
  background: rgba(255,255,255,0.08) !important;
  border: 1px solid rgba(255,255,255,0.82) !important;
  border-radius: 22px !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    inset 0 2px 1px rgba(255,255,255,0.96),
    inset 0 -14px 28px rgba(255,255,255,0.18),
    inset 10px 0 18px rgba(255,255,255,0.06),
    0 18px 34px rgba(15,45,87,0.10),
    0 8px 18px rgba(15,45,87,0.07),
    0 1px 0 rgba(255,255,255,0.95) !important;
  color: #243b53 !important;
}

        .tuition-glass-ui input::placeholder,
        .tuition-glass-ui textarea::placeholder {
          color: rgba(15,45,87,0.52) !important;
        }

.tuition-glass-ui input:focus,
.tuition-glass-ui textarea:focus,
.tuition-glass-ui select:focus {
  background: rgba(255,255,255,0.11) !important;
  border-color: rgba(255,255,255,0.96) !important;
  box-shadow:
    inset 0 2px 2px rgba(255,255,255,0.98),
    inset 0 -16px 30px rgba(255,255,255,0.20),
    0 20px 36px rgba(59,130,246,0.12),
    0 8px 20px rgba(15,45,87,0.08),
    0 1px 0 rgba(255,255,255,0.98) !important;
  outline: none !important;
}
        .tuition-glass-ui textarea {
          min-height: 190px;
        }

        .tuition-glass-ui label {
          text-shadow: 0 1px 0 rgba(255,255,255,0.45);
        }

        .tuition-glass-ui .pf-card h3,
        .tuition-glass-ui .pf-card h4,
        .tuition-glass-ui .pf-card p {
          text-shadow: 0 1px 0 rgba(255,255,255,0.35);
        }
      `}</style>
      <div className="text-center pf-e1">
        <h2 className="pf-heading text-3xl font-display font-extrabold">One-to-One Tuition</h2>
        <p className="text-brand-mediumText text-sm mt-1">Our advisor will contact you shortly</p>
      </div>

      <div className="pf-card p-5 pf-e2">
        <h3 className="pf-section-label"><UserRound className="w-3 h-3"/>Parent Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <InputField label="Parent Name" value={data.parentName} onChange={e => updateData({ parentName: e.target.value })} placeholder="e.g. Mr. Khan" required error={errors.parentName} />
          <InputField label="Email Address" type="email" value={data.email} onChange={e => updateData({ email: e.target.value })} placeholder="e.g. parent@email.com" required error={errors.email} />
          <div className="sm:col-span-2">
            <PhoneInput label="WhatsApp Number" country={data.country || 'Other'} phone={data.whatsapp} onPhoneChange={p => updateData({ whatsapp: p })} onCountryChange={c => updateData({ country: c })} required error={errors.whatsapp} />
          </div>
        </div>
      </div>

      <div className="pf-card p-5 pf-e3">
        <h3 className="pf-section-label"><User className="w-3 h-3"/>Student Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <InputField label="Student Name" value={data.studentName} onChange={e => updateData({ studentName: e.target.value })} placeholder="e.g. Ahmed Khan" required error={errors.studentName} />
          <InputField label="Age" type="text" value={data.age} onChange={e => updateData({ age: cleanAgeInput(e.target.value) })} placeholder="e.g. 12" required error={errors.age} />
        </div>
      </div>

      <div className="pf-card p-5 pf-e4">
        <h3 className="pf-section-label"><BookOpen className="w-3 h-3"/>Requirements</h3>
        <div className="mt-3 space-y-2">
          <label className="text-sm font-semibold text-brand-darkText block">Describe what you need <span className="text-red-500">*</span></label>
          <textarea
            value={data.tuitionRequirements}
            onChange={e => updateData({ tuitionRequirements: e.target.value })}
            placeholder="e.g. Maths and Science for Grade 8 (Federal Board)..."
            className={`w-full min-h-[120px] p-4 rounded-xl border ${errors.tuitionRequirements ? 'border-red-400' : 'border-brand-lightGray'} bg-white text-brand-darkText focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all resize-none text-sm`}
          />
          {errors.tuitionRequirements && <p className="text-sm text-red-500 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/>{errors.tuitionRequirements}</p>}
        </div>
      </div>

      <div className="pf-card p-5 pf-e5">
        <div className="flex items-center gap-3">
          <div className="pf-icon"><Phone className="w-5 h-5 text-white"/></div>
          <div>
            <h4 className="font-extrabold text-[#0f2d57] text-sm">Our Advisor Will Contact You</h4>
            <p className="text-xs text-brand-mediumText mt-0.5">We'll match you with the best tutor and confirm via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};