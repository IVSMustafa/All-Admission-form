import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { COUNTRY_PHONE_DATA } from "../constants";
import { createPortal } from "react-dom";

/* =======================
   WRAPPERS
   ======================= */
export interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export const GlassCard = ({
  children,
  className = "",
  highlight = false,
}: GlassCardProps) => (
  <div
    className={`glass-panel rounded-2xl p-6 relative transition-all duration-300 ${
      highlight
        ? "border-[rgba(29,111,206,0.35)] shadow-[0_0_30px_rgba(29,111,206,0.16)]"
        : ""
    } ${className}`}
  >
    {children}
  </div>
);

/* =======================
   INPUT
   ======================= */
export type InputProps = React.ComponentProps<"input"> & {
  label: string;
  error?: string;
  icon?: React.ElementType;
};

export const InputField = ({
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}: InputProps) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-[12px] font-semibold tracking-wide text-brand-darkText/80 ml-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>

    <div className="relative">
      <input
       className={`w-full min-h-[56px] glass-input rounded-xl px-4 py-3 text-sm bg-white/75 border border-black/10
        focus:outline-none focus:ring-2 focus:ring-[rgba(29,111,206,0.18)] focus:border-[rgba(29,111,206,0.45)]
        transition-all ${Icon ? "pl-10" : ""} ${error ? "border-red-400" : ""}`}
        {...props}
      />
      {Icon && (
        <Icon className="absolute left-3 top-3.5 h-4 w-4 text-brand-mediumText" />
      )}
    </div>

    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

/* =======================
   SELECT
   ======================= */
export type SelectProps = React.ComponentProps<"select"> & {
  label: string;
  options: readonly string[] | string[];
  error?: string;
};

export const SelectField = ({
  label,
  options,
  error,
  className = "",
  ...props
}: SelectProps) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-[12px] font-semibold tracking-wide text-brand-darkText/80 ml-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>

    <div className="relative">
      <select
        className={`w-full min-h-[56px] glass-input rounded-xl px-4 py-3 text-sm bg-white/75 border border-black/10
        focus:outline-none focus:ring-2 focus:ring-[rgba(29,111,206,0.18)] focus:border-[rgba(29,111,206,0.45)]
        appearance-none transition-all ${error ? "border-red-400" : ""}`}
        {...props}
      >
        <option value="" disabled className="bg-white text-gray-500">
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white text-brand-darkText">
            {opt}
          </option>
        ))}
      </select>

      <div className="absolute right-4 top-4 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-brand-mediumText" />
      </div>
    </div>

    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

/* =======================
   BUTTON
   ======================= */
export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "danger";
  icon?: React.ElementType;
};

export const Button = ({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}: ButtonProps) => {
  const base =
   "relative inline-flex min-h-[56px] items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#1d6fce] to-[#0ea5e9] text-white shadow-[0_16px_40px_rgba(29,111,206,0.22)] hover:shadow-[0_22px_60px_rgba(29,111,206,0.30)] hover:-translate-y-0.5",
    secondary:
      "bg-white/70 text-brand-darkText border border-black/10 hover:bg-white/85 hover:-translate-y-0.5 shadow-sm",
    outline:
      "border border-[#1d6fce]/40 text-[#1d6fce] bg-white/40 hover:bg-[#1d6fce]/10",
    danger:
      "bg-red-500/10 text-red-600 border border-red-500/40 hover:bg-red-500/15",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {Icon && <Icon className="w-4 h-4" />}
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
    </button>
  );
};

/* =======================
   OPTION CARD
   ======================= */
export const OptionCard = ({
  title,
  description,
  selected,
  onClick,
  icon: Icon,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer group relative p-5 rounded-2xl transition-all duration-300 border ${
      selected
        ? "bg-[#1d6fce]/8 border-[#1d6fce]/30 shadow-[0_0_26px_rgba(29,111,206,0.14)]"
        : "bg-white/60 border-black/10 hover:bg-white/80 hover:border-[#1d6fce]/20"
    }`}
  >
    <div className="flex items-start gap-4">
      {Icon && (
        <div
          className={`p-3 rounded-xl transition-colors ${
            selected
              ? "bg-[#1d6fce] text-white"
              : "bg-white/70 text-brand-mediumText group-hover:text-[#1d6fce]"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={`font-bold text-lg ${
            selected ? "text-[#0f2d57]" : "text-brand-darkText"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-brand-mediumText mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
);

/* =======================
   TOGGLE
   ======================= */
export const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="min-h-[56px] flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 border border-black/10">
    <span className="text-brand-darkText text-sm font-medium">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-[#1d6fce]" : "bg-gray-400"
      }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

/* =======================
   PHONE INPUT  ✦  Google-style
   ======================= */
export interface PhoneInputProps {
  label: string;
  country: string;
  phone: string;
  onPhoneChange: (phone: string) => void;
  onCountryChange: (country: string) => void;
  error?: string;
  required?: boolean;
}

export const PhoneInput = ({
  label,
  country,
  phone,
  onPhoneChange,
  onCountryChange,
  error,
  required,
}: PhoneInputProps) => {
  const [isOpen, setIsOpen]   = useState(false);
  const [search, setSearch]   = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const btnWrapRef = useRef<HTMLDivElement>(null);
  const portalRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const hasSelectedCountry = !!country;
  const isOther = country === "Other";

  const countryData = hasSelectedCountry
    ? COUNTRY_PHONE_DATA[country] || COUNTRY_PHONE_DATA["Other"]
    : null;

  const flag          = countryData?.flag  || "🌍";
  const code          = countryData?.code  || "+";
  const cleanPhone    = String(phone || "").replace(/\D/g, "");
  const digitsExpected = countryData?.digits || 0;

  const isValidWhatsApp = hasSelectedCountry
    ? isOther
      ? cleanPhone.length >= 7 && cleanPhone.length <= 15
      : digitsExpected > 0 && cleanPhone.length === digitsExpected
    : false;

  /* ── sorted + filtered country list ── */
  const entries = useMemo(() => {
    const all    = Object.entries(COUNTRY_PHONE_DATA);
    const sorted = all.sort(([a], [b]) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    });
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(([name, data]) =>
      name.toLowerCase().includes(q) ||
      String(data.code || "").includes(search) ||
      String(data.flag || "").includes(search)
    );
  }, [search]);

  /* ── portal dropdown position ── */
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

const updatePos = () => {
  const rect = btnWrapRef.current?.getBoundingClientRect();
  if (!rect) return;

  setPos({
    top: rect.bottom + 8,
    left: rect.left,
    width: Math.min(440, Math.max(320, rect.width)),
  });
};

const toggleCountryDropdown = () => {
  if (isOpen) {
    setIsOpen(false);
    return;
  }

  const rect = btnWrapRef.current?.getBoundingClientRect();
  if (!rect) return;

  setPos({
    top: rect.bottom + 8,
    left: rect.left,
    width: Math.min(440, Math.max(320, rect.width)),
  });

  setIsOpen(true);
};

  useEffect(() => {
    if (!isOpen) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [isOpen]);

  /* ── close on outside click / Escape ── */
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnWrapRef.current?.contains(t) && !portalRef.current?.contains(t))
        setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown",   onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown",   onKeyDown);
    };
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.startsWith("0")) v = v.substring(1);
    v = (!isOther && digitsExpected) ? v.slice(0, digitsExpected) : v.slice(0, 15);
    onPhoneChange(v);
  };

  const pickCountry = (name: string) => {
    onCountryChange(name);
    setIsOpen(false);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  /* ── border colour logic ── */
  const borderClass = error
    ? "border-red-400"
    : isFocused
      ? "border-[rgba(29,111,206,0.55)]"
      : hasSelectedCountry && cleanPhone.length > 0
        ? isValidWhatsApp
          ? "border-emerald-400"
          : "border-red-400"
        : "border-black/10 hover:border-black/20";

  const ringClass = isFocused
    ? "ring-2 ring-[rgba(29,111,206,0.18)]"
    : "";

  return (
    
    <div className="flex flex-col gap-2 w-full">
      {/* Label */}
      <label className="text-[12px] font-semibold tracking-wide text-brand-darkText/80 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* ════════════════════════════════════════
          MAIN ROW  —  flex, not grid
          [flag+chevron] [divider] [+code] [divider] [input→flex-1]
          ════════════════════════════════════════ */}
      <div
  className={`
    flex items-stretch min-h-[56px] w-full
    rounded-2xl bg-white/85 border shadow-sm
    transition-all duration-200 overflow-hidden
    ${borderClass} ${ringClass}
  `}
>

        {/* ── Country selector ── */}
        <div ref={btnWrapRef} className="shrink-0">
<button
  type="button"
  onClick={toggleCountryDropdown}
  className="min-h-[56px] pl-3 sm:pl-4 pr-2 sm:pr-3 flex items-center gap-2 hover:bg-black/5 transition-colors focus:outline-none max-w-[140px] sm:max-w-[220px]"
>
            {/* Flag */}
            <span className="text-xl leading-none select-none ivs-emoji">{flag}</span>

            {/* Country name — truncated, max 130 px so it can't swallow the row */}
<span className="font-semibold text-sm text-[#0f2d57] truncate max-w-[64px] sm:max-w-[130px]">
              {hasSelectedCountry ? country : "Country"}
            </span>

            {/* Chevron */}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="w-px bg-black/10 my-3 shrink-0" />

        {/* ── Dial code ── */}
        <div className="shrink-0 flex items-center px-2 sm:px-3">
          <span className="font-extrabold text-[#1d6fce] text-[13px] sm:text-sm tabular-nums select-none whitespace-nowrap">
            {hasSelectedCountry ? code : ""}
          </span>
        </div>

        {/* ── Divider ── */}
        {hasSelectedCountry && (
          <div className="w-px bg-black/10 my-3 shrink-0" />
        )}

        {/* ── Number input  (flex-1 → takes ALL remaining space) ── */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            ref={inputRef}
            type="tel"
            value={cleanPhone}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() =>  setIsFocused(false)}
            disabled={!hasSelectedCountry}
            placeholder={
              hasSelectedCountry
                ? isOther
                  ? "7 – 15 digit number"
                  : (countryData?.example || "Enter number")
                : "Select a country first"
            }
className={`
  w-full h-full bg-transparent outline-none
  pl-2 sm:pl-3 pr-10
  font-bold text-sm text-[#0f2d57]
  placeholder:font-normal placeholder:text-[#0f2d57]/35
  ${!hasSelectedCountry ? "cursor-not-allowed opacity-40" : ""}
`}
          />

          {/* Validation icon */}
          {hasSelectedCountry && cleanPhone.length > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isValidWhatsApp
                ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                : <XCircle      className="w-5 h-5 text-red-400"     />
              }
            </span>
          )}
        </div>
      </div>

      {/* ── Portal dropdown ── */}
      {isOpen && pos && createPortal(
        <div
          ref={portalRef}
          style={{
            position : "fixed",
            top      : pos.top,
            left     : pos.left,
            width    : pos.width,
            maxWidth : "90vw",
            zIndex   : 999999,
          }}
          className="bg-white/96 rounded-2xl shadow-2xl border border-black/10 overflow-hidden backdrop-blur-xl"
        >
          {/* Search */}
          <div className="p-3 border-b border-black/5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search country or code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#1d6fce]/5 rounded-xl text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-[rgba(29,111,206,0.18)]"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto py-1">
            {entries.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No results</p>
            ) : entries.map(([name, data]) => (
              <button
                key={name}
                type="button"
                onClick={() => pickCountry(name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  country === name ? "bg-[#1d6fce]/10" : "hover:bg-black/5"
                }`}
              >
                <span className="text-lg ivs-emoji">{data.flag || "🌍"}</span>
                <span className="flex-1 text-left truncate font-semibold text-[#0f2d57]">
                  {name}
                </span>
                <span className="text-gray-400 text-xs font-mono shrink-0">{data.code}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}

      {/* ── Helper / validation text ── */}
      {hasSelectedCountry && cleanPhone.length > 0 && (
        <p className={`text-xs font-semibold ml-1 ${isValidWhatsApp ? "text-emerald-600" : "text-red-500"}`}>
          {isValidWhatsApp
            ? "✓ Valid WhatsApp number"
            : `❌ Invalid number${!isOther && digitsExpected ? ` — needs ${digitsExpected} digits` : " (7–15 digits)"}`
          }
        </p>
      )}

      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};