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

import { Step1_Details } from './Step1_Details';
import { QuranForm } from './QuranForm';
import { TuitionForm } from './TuitionForm';
import { Step2_Program } from './Step2_Program';
import { Step3_Academics } from './Step3_Academics';
import { Step4_Trial } from './Step4_Trial';
import { Step5_Summary } from './Step5_Summary';
import { CouponCodeSection } from './CouponCodeSection';
import { Step2_FinalSteps } from './Step2_FinalSteps';

export function Step0_Welcome({ data, updateData, nextStep }: StepProps) {
  usePremiumStyles();

  const [quickGrade, setQuickGrade] = useState(data.grade || '');
  const [quickCurriculum, setQuickCurriculum] = useState('');
  const [quickCountry, setQuickCountry] = useState(data.country || '');
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const el = cardsRef.current;
  if (!el) return;

  const obs = new IntersectionObserver(
    ([entry]) => {
      setCardsVisible(entry.isIntersecting);
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  obs.observe(el);
  return () => obs.disconnect();
}, []);

  const goByLead = (lead: LeadType) => {
    if (lead === LeadType.FULL_TIME) {
      updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME });
    } else if (lead === LeadType.TUITION) {
      updateData({ leadType: LeadType.TUITION, programType: ProgramType.TUITION });
    } else if (lead === LeadType.ONE_ON_ONE_SCHOOLING) {
      updateData({ leadType: LeadType.ONE_ON_ONE_SCHOOLING, programType: ProgramType.ONE_ON_ONE_SCHOOLING });
    } else if (lead === LeadType.QURAN) {
      updateData({ leadType: LeadType.QURAN });
    } else {
      updateData({ leadType: LeadType.FULL_TIME, programType: ProgramType.FULL_TIME });
    }
    nextStep();
  };

  return (
    <div className="transition-all duration-300 overflow-x-clip">
      <style>{`
        .ivs-program-section {
          position: relative;
          overflow: visible;
        }

 .ivs-program-card-wrap {
  opacity: 0;
  transform: translateY(80px) scale(0.985);
  transition:
    opacity 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.82s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.ivs-program-card-wrap.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

        @media (prefers-reduced-motion: reduce) {
          .ivs-program-card-wrap,
          .ivs-program-card-wrap.is-visible {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Navbar
        onNavigate={(s) => {
          if (s === 'school-trial') goByLead(LeadType.FULL_TIME);
          if (s === 'tuition-trial') goByLead(LeadType.TUITION);
          if (s === 'quran-trial') goByLead(LeadType.QURAN);
        }}
      />

      <div className="px-6 md:px-12 py-8 space-y-10">
        <HeroCard
          grade={quickGrade}
          curriculum={quickCurriculum}
          country={quickCountry}
          onStartTrial={() => {
            updateData({
              leadType: LeadType.FULL_TIME,
              programType: ProgramType.FULL_TIME,
              grade: quickGrade,
              country: quickCountry,
            });
            nextStep();
          }}
          onBookConsultation={() => {
            updateData({
              leadType: LeadType.TUITION,
              programType: ProgramType.TUITION,
            });
            nextStep();
          }}
          onQuickSelect={(field, value) => {
            if (field === 'grade') {
              setQuickGrade(value);
              updateData({ grade: value });
            }
            if (field === 'curriculum') {
              setQuickCurriculum(value);
            }
            if (field === 'country') {
              setQuickCountry(value);
              updateData({ country: value });
            }
          }}
        />

        <div ref={cardsRef} className="ivs-program-section">
          <section id="program-cards" className="program-grid">
            {PROGRAM_CARDS_DATA.map((cd: any, index: number) => (
              <div
                key={String(cd.id)}
                className={`ivs-program-card-wrap ${cardsVisible ? 'is-visible' : ''}`}
                style={{
                  transitionDelay: cardsVisible ? `${index * 120}ms` : '0ms',
                }}
              >
                <ProgramCard
                  {...cd}
                  onSelect={(id: LeadType) => goByLead(id)}
                />
              </div>
            ))}
          </section>
        </div>

        <TrustStrip />
      </div>
    </div>
  );
}