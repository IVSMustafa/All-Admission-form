import React from 'react';
import { ArrowRight, GraduationCap, UserRound, Sparkles, BookOpen } from 'lucide-react';
import { LeadType } from '../../types';

interface ProgramCardProps {
    id: LeadType;
    title: string;
    description: string;
    badge?: string;
    badgeColor?: string;
    bgClass: string;
    accentColor: string;
    iconColor: string;
    icon: React.ReactNode;
    ctaText: string;
    onSelect: (id: LeadType) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
    id,
    title,
    description,
    badge,
    badgeColor = 'text-brand-orange',
    bgClass,
    accentColor,
    iconColor,
    icon,
    ctaText,
    onSelect,
}) => {
    return (
        <button
            onClick={() => onSelect(id)}
            className={`relative group overflow-hidden rounded-[2rem] p-8 text-left card-premium ${bgClass} min-h-[260px] transition-all duration-300 w-full`}
        >
            {/* Background decoration */}
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-current opacity-5 blur-2xl animate-float pointer-events-none" style={{ color: accentColor }} />

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-4">
                    {/* Badge */}
                    {badge && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-current/20 text-[10px] font-semibold tracking-wide uppercase ${badgeColor}`}>
                            <Sparkles className="w-3 h-3" />
                            {badge}
                        </div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-white/80 border flex items-center justify-center ${iconColor} icon-glow shadow-sm`} style={{ borderColor: `${accentColor}30` }}>
                        {icon}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-display font-bold text-brand-darkText text-glow">
                        {title}
                    </h3>
                    <p className="text-sm text-brand-mediumText leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* CTA */}
                <div className={`pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors`} style={{ color: accentColor }}>
                    {ctaText}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </button>
    );
};

// Pre-configured program cards data
export const PROGRAM_CARDS_DATA = [
    {
        id: LeadType.FULL_TIME,
        title: 'Full-Time Schooling',
        description: 'Complete KG-12 British & Federal education with live classes.',
        badge: 'Most Popular',
        badgeColor: 'text-brand-burgundy',
        bgClass: 'aurora-light-bg card-glow',
        accentColor: '#FF8C42',
        iconColor: 'text-brand-burgundy',
        icon: <GraduationCap className="w-6 h-6" />,
        ctaText: 'Start Free Trial',
    },
    {
        id: LeadType.TUITION,
        title: 'One-to-One Tuition',
        description: 'Personalized coaching for any subject at your pace.',
        badge: 'Flexible',
        badgeColor: 'text-brand-orange',
        bgClass: 'card-soft-peach card-glow',
        accentColor: '#FF8C42',
        iconColor: 'text-brand-orange',
        icon: <UserRound className="w-6 h-6" />,
        ctaText: 'Explore',
    },
    {
        id: LeadType.ONE_ON_ONE_SCHOOLING,
        title: 'One-to-One Schooling',
        description: 'Full school curriculum with personal teacher, report cards, and certificates.',
        badge: 'Personal Teacher',
        badgeColor: 'text-purple-600',
        bgClass: 'card-soft-lavender card-glow',
        accentColor: '#8B5CF6',
        iconColor: 'text-purple-500',
        icon: <Sparkles className="w-6 h-6" />,
        ctaText: 'Start Now',
    },
    {
        id: LeadType.QURAN,
        title: 'Quran Classes',
        description: 'Tajweed, Hifz & Tafseer with qualified instructors.',
        badge: 'Certified Scholars',
        badgeColor: 'text-emerald-600',
        bgClass: 'card-soft-mint card-glow',
        accentColor: '#10B981',
        iconColor: 'text-emerald-600',
        icon: <BookOpen className="w-6 h-6" />,
        ctaText: 'View Classes',
    },
];

export default ProgramCard;
