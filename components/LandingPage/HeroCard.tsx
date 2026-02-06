import React, { useState } from 'react';
import { Play, Calendar, ChevronDown, Clock, Globe2, Shield, Users, Headphones, GraduationCap, BookOpen } from 'lucide-react';

// Trust signal chips data (max 5 displayed)
const CHIPS = [
    'British Curriculum (KG1–G7)',
    'Federal Board (G8–G12)',
    'IGCSE/O/A Level Prep',
    'Sunday–Thursday Classes',
    '24/7 Support'
];

// Trial timings data
const TRIAL_TIMINGS = [
    {
        grades: 'KG1–G7 (Evening)',
        times: '3:30 KSA • 4:30 UAE • 5:30 PKT'
    },
    {
        grades: 'G8–G12 (Morning)',
        times: '9:00 KSA • 10:00 UAE • 11:00 PKT'
    }
];

// Trust overlay items
const TRUST_ITEMS = [
    { icon: Shield, text: 'PSRA Registered' },
    { icon: GraduationCap, text: 'Federal Board Affiliated' },
    { icon: Globe2, text: 'Students in 50+ Countries' },
    { icon: Headphones, text: '24/7 Support' }
];

// Trial Timings Mini Card Component
const TrialTimingsMiniCard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute left-0 bottom-full mb-2 z-[100]">
            <div className="bg-white rounded-xl shadow-xl border border-brand-burgundy/15 p-4 min-w-[300px] animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-brand-burgundy text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Trial Timings
                    </h4>
                    <button onClick={onClose} className="text-brand-mediumText hover:text-brand-burgundy text-lg leading-none">&times;</button>
                </div>

                <div className="space-y-2">
                    {TRIAL_TIMINGS.map((timing, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-brand-cream/50 border border-brand-burgundy/5">
                            <p className="font-medium text-brand-burgundy text-xs">{timing.grades}</p>
                            <p className="text-brand-darkText text-sm">{timing.times}</p>
                        </div>
                    ))}
                </div>

                <p className="text-[10px] text-brand-mediumText mt-3 leading-relaxed">
                    KG1–G7 trial is evening only. After trial, you may switch to morning.
                </p>
            </div>
        </div>
    );
};

interface HeroCardProps {
    grade: string;
    curriculum: string;
    country: string;
    onStartTrial: () => void;
    onBookConsultation: () => void;
    onQuickSelect: (field: string, value: string) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
    onStartTrial,
    onBookConsultation
}) => {
    const [showTimings, setShowTimings] = useState(false);

    return (
        <div className="hero-card-premium animate-fade-in-up">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 relative z-10">

                {/* LEFT COLUMN - Content (3/5 width on desktop) */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Admission Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-semibold text-emerald-700">Admissions Open 2026</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-darkText leading-tight">
                        Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-burgundy to-brand-orange">3-Day Free Trial</span>
                        <br />Classes <span className="text-brand-burgundy">(Live on Zoom)</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-brand-darkText leading-relaxed max-w-2xl">
                        Full-time online schooling <strong>(KG1–Grade 12)</strong> with British Curriculum (KG1–G7),
                        Federal Board (G8–G12), and IGCSE/O/A Level preparation.
                        <span className="text-brand-mediumText"> Management in Pakistan, teachers globally.</span>
                    </p>

                    {/* Session & Trial Pills - Compact */}
                    <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-burgundy/5 border border-brand-burgundy/10 text-sm">
                            <Clock className="w-3.5 h-3.5 text-brand-burgundy" />
                            <span className="text-brand-darkText">
                                <strong className="text-brand-burgundy">Sessions:</strong> KG1–G7 Morning + Evening (separate teachers)
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/5 border border-brand-orange/10 text-sm">
                            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                            <span className="text-brand-darkText">
                                <strong className="text-brand-orange">Trial:</strong> KG1–G7 Evening • G8–G12 Morning
                            </span>
                        </span>
                    </div>

                    {/* Chips/Badges - Max 5 */}
                    <div className="flex flex-wrap gap-2">
                        {CHIPS.slice(0, 5).map((chip, idx) => (
                            <span
                                key={chip}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${idx < 3
                                    ? 'bg-brand-burgundy/10 text-brand-burgundy border border-brand-burgundy/20'
                                    : 'bg-white/80 text-brand-darkText border border-brand-lightGray'
                                    }`}
                            >
                                {chip}
                            </span>
                        ))}
                        {CHIPS.length > 5 && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/60 text-brand-mediumText border border-brand-lightGray">
                                + more
                            </span>
                        )}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                        <button
                            onClick={onStartTrial}
                            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-burgundy to-brand-burgundy/90 text-white font-bold text-base shadow-lg shadow-brand-burgundy/25 hover:shadow-xl hover:shadow-brand-burgundy/30 transition-all duration-300 hover:scale-105"
                        >
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Start Free Trial
                        </button>

                        <button
                            onClick={onBookConsultation}
                            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white border-2 border-brand-burgundy/30 text-brand-burgundy font-semibold text-base hover:bg-brand-burgundy/5 hover:border-brand-burgundy transition-all duration-200"
                        >
                            <Calendar className="w-4 h-4" />
                            Book 1-to-1 Consultation
                        </button>
                    </div>

                    {/* Microcopy + View Trial Timings */}
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-sm text-brand-mediumText">
                            Share your child's name, age, and grade. We'll confirm your trial within minutes.
                        </p>

                        {/* View Trial Timings Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTimings(!showTimings)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-burgundy/5 hover:bg-brand-burgundy/10 border border-brand-burgundy/15 text-xs font-medium text-brand-burgundy transition-all"
                            >
                                <Clock className="w-3.5 h-3.5" />
                                View trial timings
                            </button>
                            <TrialTimingsMiniCard isOpen={showTimings} onClose={() => setShowTimings(false)} />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Visual Block (2/5 width on desktop) */}
                <div className="lg:col-span-2 relative hidden lg:block">
                    {/* Main Visual Container */}
                    <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-cream via-white to-brand-beige border border-brand-burgundy/10 shadow-xl">

                        {/* Illustration Elements */}
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                {/* Laptop/Screen Illustration */}
                                <div className="relative">
                                    <div className="w-64 h-44 bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-xl shadow-2xl flex items-center justify-center overflow-hidden">
                                        {/* Screen Content */}
                                        <div className="w-[95%] h-[90%] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center gap-4 p-4">
                                            {/* Teacher Avatar */}
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-burgundy to-brand-orange flex items-center justify-center text-white shrink-0">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            {/* Class Content */}
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 bg-brand-burgundy/30 rounded-full w-3/4" />
                                                <div className="h-2 bg-brand-orange/30 rounded-full w-1/2" />
                                                <div className="h-2 bg-emerald-400/30 rounded-full w-2/3" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Laptop Base */}
                                    <div className="w-72 h-3 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-b-xl mx-auto" />
                                    <div className="w-20 h-1 bg-slate-400 rounded-full mx-auto" />
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center animate-float">
                                    <Globe2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="absolute bottom-20 left-4 w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center animate-float-delayed">
                                    <BookOpen className="w-5 h-5 text-brand-orange" />
                                </div>
                                <div className="absolute top-20 left-8 w-8 h-8 rounded-full bg-brand-burgundy/20 flex items-center justify-center animate-bounce-slow">
                                    <GraduationCap className="w-4 h-4 text-brand-burgundy" />
                                </div>
                            </div>
                        </div>

                        {/* Gradient Overlays */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-orange/20 to-transparent rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-brand-burgundy/10 to-transparent rounded-tr-full" />
                    </div>

                    {/* Trust Overlay Card */}
                    <div className="absolute -bottom-4 -left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-brand-burgundy/10 p-4 z-10">
                        <h4 className="text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-3">
                            Trusted by families worldwide
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {TRUST_ITEMS.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-brand-darkText">
                                    <item.icon className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Trust Strip */}
            <div className="lg:hidden mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-burgundy/10">
                <h4 className="text-xs font-bold text-brand-burgundy uppercase tracking-wider mb-3 text-center">
                    Trusted by families worldwide
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {TRUST_ITEMS.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-brand-darkText">
                            <item.icon className="w-4 h-4 text-brand-burgundy shrink-0" />
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none animate-float" />
            <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-brand-burgundy/5 blur-2xl pointer-events-none animate-float-delayed" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-emerald-400/5 blur-2xl pointer-events-none" />
        </div>
    );
};

export default HeroCard;
