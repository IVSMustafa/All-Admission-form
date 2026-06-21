import React, { useRef, useEffect, useCallback } from 'react';
import { FormData } from '../../types';

export const PREMIUM_CSS = `
@keyframes pf-slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pf-pop-in {
  0%   { opacity: 0; transform: scale(0.75); }
  65%  { transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes pf-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes pf-badge-enter {
  0%   { opacity: 0; transform: scale(0.6) rotate(-10deg); }
  60%  { transform: scale(1.1) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes pf-ready-slide {
  from { opacity: 0; transform: scaleX(0.92) translateY(6px); }
  to   { opacity: 1; transform: scaleX(1) translateY(0); }
}

@keyframes pf-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes pf-shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}

@keyframes pf-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.pf-e1 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0s both;
}

.pf-e2 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s both;
}

.pf-e3 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both;
}

.pf-e4 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.24s both;
}

.pf-e5 {
  animation: pf-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.32s both;
}

.pf-card {
  position: relative;
  overflow: hidden;
  background: transparent !important;
  border: 1.5px solid rgba(29,111,206,0.18);
  border-radius: 24px;
  box-shadow: none;
  transition:
    border-color 0.25s ease,
    transform 0.25s cubic-bezier(0.22,1,0.36,1);
}
.pf-card::before {
  display: none;
}

.pf-card:hover {
  box-shadow: none;
  transform: translateY(-1px);
}

.pf-section-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 4px 14px;
  background: rgba(29,111,206,0.07);
  border: 1px solid rgba(29,111,206,0.15);
  border-radius: 99px;
  color: #1d6fce;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.10em;
  text-transform: uppercase;
}

.pf-heading {
  background: linear-gradient(135deg, #0f2d57 0%, #1d6fce 50%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pf-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(29,111,206,0.25);
  animation: pf-float 4s ease-in-out infinite;
}

.pf-icon-gold {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 6px 18px rgba(245,158,11,0.25);
}

.pf-icon-green {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 6px 18px rgba(16,185,129,0.25);
}

.pf-badge {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(29,111,206,0.30);
  color: white;
  font-size: 15px;
  font-weight: 900;
}

.pf-student-row {
  background: rgba(248,251,255,0.9);
  border: 1.5px solid rgba(29,111,206,0.09);
  border-radius: 16px;
  box-shadow: none !important;
  transition: all 0.2s ease;
}

.pf-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pf-label {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 2px;
  color: rgba(15,45,87,0.55);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pf-input-wrap {
  background: rgba(255,255,255,0.78);
  border: 1.5px solid rgba(15,45,87,0.10);
  border-radius: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.pf-input-wrap:focus-within {
  background: #ffffff;
  border-color: rgba(29,111,206,0.45);
  box-shadow: 0 0 0 2px rgba(29,111,206,0.18);
}

.pf-input-wrap input,
.pf-input-wrap select {
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: none;
  border-radius: 14px;
  outline: none;
  color: #0f2d57;
  font-size: 14px;
  font-weight: 600;
}

.pf-input-wrap input:focus,
.pf-input-wrap select:focus {
  outline: none;
  box-shadow: none;
}

.pf-input-wrap select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 42px;
  background-image: none !important;
}

.pf-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(29,111,206,0.08);
  border: 1px solid rgba(29,111,206,0.18);
  border-radius: 20px;
  color: #1d6fce;
  font-size: 11px;
  font-weight: 700;
}

.pf-ready {
  background: linear-gradient(135deg, rgba(16,185,129,0.07), rgba(5,150,105,0.04));
  border: 1.5px solid rgba(16,185,129,0.25);
  border-radius: 16px;
}

.pf-btn-outline {
  background: rgba(29,111,206,0.04);
  border: 2px solid rgba(29,111,206,0.22);
  border-radius: 16px;
  color: #1d6fce;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.18s ease;
}

.pf-btn-outline:hover {
  background: rgba(29,111,206,0.09);
  border-color: rgba(29,111,206,0.40);
}

.pf-curriculum-btn {
  padding: 16px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  );
  border: 1px solid rgba(255,255,255,0.88);
  border-radius: 22px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.96),
    inset 0 -10px 22px rgba(255,255,255,0.06),
    0 16px 30px rgba(15,45,87,0.10),
    0 5px 12px rgba(15,45,87,0.05);
}

.pf-curriculum-btn:hover {
  border-color: rgba(29,111,206,0.34);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 22px rgba(255,255,255,0.07),
    0 18px 34px rgba(29,111,206,0.10),
    0 6px 14px rgba(15,45,87,0.06);
}

.pf-curriculum-btn.active {
  background: linear-gradient(
    180deg,
    rgba(29,111,206,0.10),
    rgba(14,165,233,0.04)
  );
  border-color: rgba(29,111,206,0.42);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 22px rgba(255,255,255,0.07),
    0 18px 34px rgba(29,111,206,0.14),
    0 6px 14px rgba(15,45,87,0.07);
}

.pf-curriculum-btn p {
  color: #163761;
}

.pf-curriculum-btn .text-brand-mediumText {
  color: #6f859f !important;
}

.pf-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  background: rgba(29,111,206,0.07);
  border: 1px solid rgba(29,111,206,0.14);
  border-radius: 99px;
  color: #1d6fce;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.pf-step-dot {
  width: 6px;
  height: 6px;
  background: #1d6fce;
  border-radius: 50%;
}

@media (max-width: 640px) {
  .pf-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }

  .pf-card {
    border-radius: 20px;
  }

  .pf-badge {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }
}

/* ===== GLASS UI FOR ALL FORM SECTIONS ===== */

/* main cards: fully transparent, no blur */
.pf-card,
.qf-card-soft {
  background: transparent !important;
  border: 1px solid rgba(201, 225, 255, 0.82) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.58) !important;
}

.pf-card::before {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent) !important;
}

/* normal inner fields */
.pf-input-wrap,
.pf-student-row,
.qf-multi-trigger,
.qf-multi-menu,
.qf-multi-option,
.qf-day-btn,
.qf-time-wrap select {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)) !important;
  border: 1px solid rgba(255,255,255,0.82) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.94),
    inset 0 -10px 22px rgba(255,255,255,0.08),
    0 16px 30px rgba(15,45,87,0.12),
    0 5px 12px rgba(15,45,87,0.06) !important;
}

/* all inputs, selects, textareas */
.pf-card input,
.pf-card textarea,
.pf-card select,
.qf-card-soft input,
.qf-card-soft textarea,
.qf-card-soft select {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)) !important;
  border: 1px solid rgba(255,255,255,0.84) !important;
  border-radius: 22px !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.96),
    inset 0 -10px 24px rgba(255,255,255,0.08),
    0 16px 30px rgba(15,45,87,0.12),
    0 5px 12px rgba(15,45,87,0.06) !important;
  color: #243b53 !important;
}

.pf-card input::placeholder,
.pf-card textarea::placeholder,
.qf-card-soft input::placeholder,
.qf-card-soft textarea::placeholder {
  color: #7b8faa !important;
}

.pf-card input:focus,
.pf-card textarea:focus,
.pf-card select:focus,
.qf-card-soft input:focus,
.qf-card-soft textarea:focus,
.qf-card-soft select:focus {
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)) !important;
  border-color: rgba(255,255,255,0.96) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 24px rgba(255,255,255,0.09),
    0 18px 34px rgba(59,130,246,0.13),
    0 6px 14px rgba(15,45,87,0.08) !important;
  outline: none !important;
}

/* ===== WhatsApp field fix ===== */
/* outer phone field should stay transparent and 3D */
.pf-card [class*="phone"],
.pf-card [class*="Phone"],
.qf-card-soft [class*="phone"],
.qf-card-soft [class*="Phone"] {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* every wrapper inside phone field should lose white fill */
.pf-card [class*="phone"] > div,
.pf-card [class*="Phone"] > div,
.pf-card [class*="phone"] div,
.pf-card [class*="Phone"] div,
.qf-card-soft [class*="phone"] > div,
.qf-card-soft [class*="Phone"] > div,
.qf-card-soft [class*="phone"] div,
.qf-card-soft [class*="Phone"] div {
  background-color: transparent !important;
}

/* phone field inner select and number input */
.pf-card [class*="phone"] input,
.pf-card [class*="Phone"] input,
.pf-card [class*="phone"] select,
.pf-card [class*="Phone"] select,
.qf-card-soft [class*="phone"] input,
.qf-card-soft [class*="Phone"] input,
.qf-card-soft [class*="phone"] select,
.qf-card-soft [class*="Phone"] select {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  color: #243b53 !important;
}

/* placeholder inside phone number box */
.pf-card [class*="phone"] input::placeholder,
.pf-card [class*="Phone"] input::placeholder,
.qf-card-soft [class*="phone"] input::placeholder,
.qf-card-soft [class*="Phone"] input::placeholder {
  color: #7b8faa !important;
}

/* keep quran/final active buttons nice */
.qf-day-btn.active,
.qf-multi-option.active {
  border-color: transparent !important;
  box-shadow:
    0 14px 28px rgba(29,111,206,0.18),
    inset 0 1px 0 rgba(255,255,255,0.24) !important;
}
    /* final hard override for selected lesson items only */
.qf-page .qf-multi-menu .qf-multi-option.active,
.qf-page .qf-multi-menu .qf-multi-option.active:hover,
.qf-page .qf-multi-menu .qf-multi-option[aria-pressed="true"] {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9) !important;
  color: #ffffff !important;
  border: 1px solid transparent !important;
  box-shadow:
    0 12px 24px rgba(29,111,206,0.22),
    0 6px 12px rgba(15,45,87,0.06) !important;
}

.qf-page .qf-multi-menu .qf-multi-option.active span,
.qf-page .qf-multi-menu .qf-multi-option.active .qf-multi-check,
.qf-page .qf-multi-menu .qf-multi-option[aria-pressed="true"] span,
.qf-page .qf-multi-menu .qf-multi-option[aria-pressed="true"] .qf-multi-check {
  color: #ffffff !important;
  border-color: rgba(255,255,255,0.9) !important;
}

.qf-page .qf-multi-menu .qf-multi-option:not(.active) {
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  ) !important;
  color: #163761 !important;
}
`;

export function usePremiumStyles() {
  useEffect(() => {
    const id = 'pf-premium-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = PREMIUM_CSS;
      document.head.appendChild(el);
    }
  }, []);
}

export function useTilt(intensity = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * intensity;
    const y = -((e.clientY - r.top) / r.height - 0.5) * intensity;
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
    el.style.transition = 'transform 0.1s ease';
  }, [intensity]);
  const onMouseLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    el.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

export const DRAFT_ID = '__draft__';


export const cleanAgeInput = (value: string) => value.replace(/[^\d]/g, "");
export interface StepProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  errors: Record<string, string>;
}

export function PField({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="pf-field">
      <label className="pf-label">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      {children}
    </div>
  );
}
export const FINAL_STEP_QURAN_UI = `
.final-quran-note {
  font-size: 12px;
  color: #8a6a16;
  background: linear-gradient(
    180deg,
    rgba(255,248,232,0.96),
    rgba(255,244,220,0.92)
  );
  border: 1px solid rgba(245,208,120,0.95);
  border-radius: 16px;
  padding: 12px 14px;
  line-height: 1.6;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.86),
    0 14px 28px rgba(15,45,87,0.05),
    0 4px 10px rgba(15,45,87,0.03);
}

.final-quran-multi {
  position: relative;
}

.final-quran-multi-trigger {
  width: 100%;
  min-height: 64px;
  padding: 14px 16px;
  border-radius: 22px;
  border: 1px solid rgba(201,225,255,0.92);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.10),
    rgba(255,255,255,0.04)
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
  color: #243b53;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.97),
    inset 0 -10px 24px rgba(255,255,255,0.07),
    0 16px 32px rgba(15,45,87,0.10),
    0 5px 12px rgba(15,45,87,0.05);
}

.final-quran-multi-trigger:hover {
  border-color: rgba(29,111,206,0.38);
}

.final-quran-multi-trigger.active {
  border-color: rgba(29,111,206,0.46);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 24px rgba(255,255,255,0.08),
    0 0 0 3px rgba(29,111,206,0.08),
    0 18px 34px rgba(29,111,206,0.12),
    0 6px 14px rgba(15,45,87,0.07);
}

.final-quran-multi-value {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.final-quran-multi-placeholder {
  color: #8aa0bb;
  font-size: 14px;
  font-weight: 600;
}

.final-quran-multi-chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(29,111,206,0.12),
    rgba(14,165,233,0.08)
  );
  border: 1px solid rgba(147,197,253,0.95);
  color: #1d6fce;
  font-size: 12px;
  font-weight: 700;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.76),
    0 8px 18px rgba(15,45,87,0.05);
}

.final-quran-multi-menu {
  margin-top: 12px;
  padding: 12px;
  border-radius: 24px;
  border: 1px solid rgba(201,225,255,0.86);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.10),
    rgba(255,255,255,0.04)
  );
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.94),
    0 16px 36px rgba(15,45,87,0.08),
    0 4px 12px rgba(15,45,87,0.04);
  display: grid;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.final-quran-multi-option {
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.84);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.03)
  );
  color: #163761;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  transition: all 0.18s ease;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.96),
    inset 0 -10px 20px rgba(255,255,255,0.06),
    0 12px 26px rgba(15,45,87,0.08),
    0 4px 10px rgba(15,45,87,0.04);
}

.final-quran-multi-option:hover {
  border-color: rgba(29,111,206,0.34);
  transform: translateY(-1px);
}

.final-quran-multi-option.active {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  color: white;
  border-color: transparent;
  box-shadow:
    0 16px 30px rgba(29,111,206,0.22),
    0 6px 12px rgba(15,45,87,0.06);
}

.final-quran-multi-check {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  flex-shrink: 0;
}

.final-quran-day-btn {
  padding: 11px 12px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.84);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.03)
  );
  color: rgba(15,45,87,0.72);
  font-size: 12px;
  font-weight: 800;
  transition: all 0.18s ease;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.96),
    inset 0 -10px 20px rgba(255,255,255,0.06),
    0 12px 24px rgba(15,45,87,0.08),
    0 4px 10px rgba(15,45,87,0.04);
}

.final-quran-day-btn:hover {
  border-color: rgba(29,111,206,0.34);
  transform: translateY(-1px);
}

.final-quran-day-btn.active {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9);
  color: white;
  border-color: transparent;
  box-shadow:
    0 16px 30px rgba(29,111,206,0.22),
    0 6px 12px rgba(15,45,87,0.06);
}

.final-quran-time-wrap {
  position: relative;
}

.final-quran-time-wrap select {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.90);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.10),
    rgba(255,255,255,0.03)
  );
  color: #243b53;
  font-weight: 600;
  outline: none;
  appearance: none;
  transition: all 0.18s ease;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.97),
    inset 0 -10px 24px rgba(255,255,255,0.06),
    0 16px 32px rgba(15,45,87,0.10),
    0 5px 12px rgba(15,45,87,0.05);
}

.final-quran-time-wrap select:focus {
  border-color: rgba(29,111,206,0.46);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.98),
    inset 0 -10px 24px rgba(255,255,255,0.08),
    0 0 0 3px rgba(29,111,206,0.08),
    0 18px 34px rgba(29,111,206,0.12),
    0 6px 14px rgba(15,45,87,0.07);
}

.final-quran-time-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(15,45,87,0.55);
  pointer-events: none;
}

.final-quran-multi-menu::-webkit-scrollbar {
  width: 10px;
}

.final-quran-multi-menu::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
}

.final-quran-multi-menu::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #7dd3fc, #60a5fa);
  border-radius: 999px;
}
`;
export const FINAL_STEP_GLASS_CSS = `
  .final-step-glass .pf-card,
  .final-step-glass .ivs-applied-voucher,
  .final-step-glass div[class*="rounded-[24px]"],
  .final-step-glass div[class*="rounded-[22px]"],
  .final-step-glass div[class*="rounded-2xl"],
  .final-step-glass div[class*="rounded-3xl"] {
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-color: rgba(201, 225, 255, 0.82) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.60),
      0 16px 34px rgba(15,45,87,0.07),
      0 6px 14px rgba(15,45,87,0.04) !important;
  }

  .final-step-glass input,
  .final-step-glass textarea,
  .final-step-glass select,
  .final-step-glass .qf-multi-trigger,
  .final-step-glass .qf-multi-menu,
  .final-step-glass .qf-multi-option,
  .final-step-glass .qf-time-wrap,
  .final-step-glass .qf-time-wrap select,
  .final-step-glass .qf-day-btn {
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.08),
      rgba(255,255,255,0.02)
    ) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: 1px solid rgba(255,255,255,0.90) !important;
    color: #243b53 !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.97),
      inset 0 -10px 24px rgba(255,255,255,0.06),
      0 16px 32px rgba(15,45,87,0.12),
      0 5px 12px rgba(15,45,87,0.06) !important;
  }

  .final-step-glass input::placeholder,
  .final-step-glass textarea::placeholder {
    color: #7b8faa !important;
  }

  .final-step-glass input:focus,
  .final-step-glass textarea:focus,
  .final-step-glass select:focus,
  .final-step-glass .qf-multi-trigger:focus {
    outline: none !important;
    border-color: rgba(255,255,255,0.98) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.98),
      inset 0 -10px 24px rgba(255,255,255,0.08),
      0 18px 34px rgba(59,130,246,0.13),
      0 6px 14px rgba(15,45,87,0.08) !important;
  }

.final-step-glass .qf-note {
  background: linear-gradient(
    180deg,
    rgba(255,248,232,0.96),
    rgba(255,244,220,0.92)
  ) !important;
  border: 1px solid rgba(245,208,120,0.95) !important;
  color: #8a6a16 !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.84),
    0 14px 28px rgba(15,45,87,0.05),
    0 4px 10px rgba(15,45,87,0.03) !important;
}

.final-step-glass .qf-multi-chip {
  background: linear-gradient(
    135deg,
    rgba(29,111,206,0.12),
    rgba(14,165,233,0.08)
  ) !important;
  border: 1px solid rgba(147,197,253,0.95) !important;
  color: #1d6fce !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.72),
    0 8px 18px rgba(15,45,87,0.05) !important;
}

.final-step-glass .qf-multi-option.active,
.final-step-glass .qf-day-btn.active {
  background: linear-gradient(135deg, #1d6fce, #0ea5e9) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow:
    0 16px 30px rgba(29,111,206,0.22),
    0 6px 12px rgba(15,45,87,0.06) !important;
}

  .final-step-glass .qf-multi-check {
    border-color: currentColor !important;
  }

  .final-step-glass .qf-multi-menu::-webkit-scrollbar {
    width: 10px;
  }

  .final-step-glass .qf-multi-menu::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.08);
    border-radius: 999px;
  }

  .final-step-glass .qf-multi-menu::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #7dd3fc, #60a5fa);
    border-radius: 999px;
  }

`;
