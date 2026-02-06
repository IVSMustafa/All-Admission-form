import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';

// --- WRAPPERS ---
export interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export const GlassCard = ({ children, className = '', highlight = false }: GlassCardProps) => (
  <div className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${highlight ? 'border-brand-orange/50 shadow-[0_0_20px_rgba(255,140,66,0.2)]' : ''} ${className}`}>
    {highlight && <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>}
    {children}
  </div>
);

// --- FORM ELEMENTS ---
export type InputProps = React.ComponentProps<'input'> & {
  label: string;
  error?: string;
  icon?: React.ElementType;
};

export const InputField = ({ label, error, icon: Icon, className = '', ...props }: InputProps) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-sm font-medium text-brand-darkText ml-1">{label} {props.required && <span className="text-brand-orange">*</span>}</label>
    <div className="relative">
      <input
        className={`w-full glass-input rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-orange placeholder-gray-400 ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {Icon && <Icon className="absolute left-3 top-3.5 h-4 w-4 text-brand-mediumText" />}
    </div>
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

export type SelectProps = React.ComponentProps<'select'> & {
  label: string;
  options: readonly string[] | string[];
  error?: string;
};

export const SelectField = ({ label, options, error, className = '', ...props }: SelectProps) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-sm font-medium text-brand-darkText ml-1">{label} {props.required && <span className="text-brand-orange">*</span>}</label>
    <div className="relative">
      <select
        className={`w-full glass-input rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-orange appearance-none ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        <option value="" disabled className="bg-white text-gray-500">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-white text-brand-darkText">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-4 pointer-events-none">
        <svg className="w-4 h-4 text-brand-mediumText" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
    {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
  </div>
);

// --- BUTTONS ---
export type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ElementType;
};

export const Button = ({ children, variant = 'primary', icon: Icon, className = '', ...props }: ButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider";

  const variants = {
    primary: "bg-gradient-to-r from-brand-burgundy to-brand-orange text-white shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50 hover:-translate-y-0.5 border border-transparent",
    secondary: "bg-brand-beige text-brand-darkText hover:bg-brand-lightGray backdrop-blur-md border border-brand-burgundy/20 hover:border-brand-burgundy/40",
    outline: "border border-brand-burgundy/50 text-brand-burgundy hover:bg-brand-burgundy/10",
    danger: "bg-red-500/10 text-red-600 border border-red-500/50 hover:bg-red-500/20"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );
};

// --- OPTION CARD ---
export const OptionCard = ({ title, description, selected, onClick, icon: Icon }: { title: string, description?: string, selected: boolean, onClick: () => void, icon?: React.ElementType }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer group relative p-5 rounded-2xl transition-all duration-300 border ${selected
      ? 'bg-brand-orange/10 border-brand-orange shadow-[0_0_15px_rgba(255,140,66,0.25)]'
      : 'bg-white/60 border-brand-lightGray hover:bg-white/80 hover:border-brand-burgundy/30'
      }`}
  >
    <div className="flex items-start gap-4">
      {Icon && (
        <div className={`p-3 rounded-xl transition-colors ${selected ? 'bg-brand-orange text-white' : 'bg-brand-beige text-brand-mediumText group-hover:text-brand-burgundy'}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1">
        <h3 className={`font-semibold text-lg ${selected ? 'text-brand-burgundy' : 'text-brand-darkText'}`}>{title}</h3>
        {description && <p className="text-sm text-brand-mediumText mt-1 leading-relaxed">{description}</p>}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${selected ? 'border-brand-orange' : 'border-brand-mediumText'}`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
      </div>
    </div>
  </div>
);

// --- TOGGLE ---
export const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-brand-lightGray">
    <span className="text-brand-darkText text-sm font-medium">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${checked ? 'bg-brand-orange' : 'bg-gray-400'}`}
    >
      <span className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

// --- PHONE INPUT WITH COUNTRY CODE (Google Style) ---
import { COUNTRY_PHONE_DATA } from '../constants';

export interface PhoneInputProps {
  label: string;
  country: string;
  phone: string;
  onPhoneChange: (phone: string) => void;
  onCountryChange: (country: string) => void;
  error?: string;
  required?: boolean;
}

export const PhoneInput = ({ label, country, phone, onPhoneChange, onCountryChange, error, required }: PhoneInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if a country has been selected (not empty or "Other")
  const hasSelectedCountry = country && country !== '';
  const countryData = hasSelectedCountry ? (COUNTRY_PHONE_DATA[country] || COUNTRY_PHONE_DATA['Other']) : null;
  const cleanPhone = phone.replace(/\D/g, '');
  const isValidLength = countryData ? cleanPhone.length === countryData.digits : false;
  const showLengthHint = countryData && cleanPhone.length > 0 && !isValidLength;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries
  const filteredCountries = Object.entries(COUNTRY_PHONE_DATA).filter(([name, data]) =>
    name.toLowerCase().includes(search.toLowerCase()) ||
    data.code.includes(search)
  );

  // Handle input - only allow digits, strip leading zero
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasSelectedCountry || !countryData) return;
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) value = value.substring(1);
    if (value.length <= countryData.digits) onPhoneChange(value);
  };

  // Handle country selection
  const handleCountrySelect = (name: string) => {
    onCountryChange(name);
    setIsOpen(false);
    setSearch('');
    // Focus the phone input after selection
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-brand-darkText ml-1">
        {label} {required && <span className="text-brand-orange">*</span>}
      </label>

      {/* Google-style underline input container */}
      <div
        className={`flex items-center gap-0 border-b-2 transition-colors duration-200 ${isFocused ? 'border-blue-500' : error ? 'border-red-500' : 'border-gray-300'
          }`}
      >
        {/* Country Flag Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-brand-darkText hover:bg-gray-50 transition-colors rounded-sm"
          >
            {hasSelectedCountry && countryData ? (
              <>
                <span className="text-xl leading-none">{countryData.flag}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </>
            ) : (
              <>
                <span className="text-xl leading-none">🌍</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* Custom Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 max-h-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
              {/* Search Bar */}
              <div className="sticky top-0 bg-white p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-60 py-1">
                {filteredCountries.map(([name, data]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleCountrySelect(name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${country === name
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <span className="text-xl">{data.flag}</span>
                    <span className="flex-1 text-left line-clamp-1">{name}</span>
                    <span className="text-gray-400 text-xs font-mono">{data.code}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-400">No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="tel"
            value={cleanPhone}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={hasSelectedCountry && countryData ? countryData.example : "Select country first"}
            disabled={!hasSelectedCountry}
            className={`w-full px-3 py-3 text-sm bg-transparent outline-none placeholder-gray-400 ${!hasSelectedCountry ? 'cursor-not-allowed text-gray-400' : 'text-brand-darkText'
              }`}
          />

          {hasSelectedCountry && countryData && cleanPhone.length > 0 && (
            <div className={`absolute right-2 top-3.5 text-xs font-medium ${isValidLength ? 'text-green-500' : 'text-gray-400'}`}>
              {cleanPhone.length}/{countryData.digits}
            </div>
          )}
        </div>
      </div>

      {/* Hint Text */}
      {!hasSelectedCountry && (
        <div className="flex items-center gap-1.5 ml-1 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-500" />
          <span className="text-xs text-red-500 font-medium">
            Please select country first
          </span>
        </div>
      )}
      {showLengthHint && countryData && (
        <span className="text-xs text-amber-600 ml-1">
          {country === 'Other' ? `Enter ${countryData.digits} digits` : `${country} numbers should be ${countryData.digits} digits`}
        </span>
      )}
      {isValidLength && cleanPhone.length > 0 && (
        <span className="text-xs text-green-600 ml-1 flex items-center gap-1">
          ✓ Valid format for WhatsApp
        </span>
      )}
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};