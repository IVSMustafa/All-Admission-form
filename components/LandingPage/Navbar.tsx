import React from 'react';

interface NavbarProps {
    onNavigate?: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
    const navItems = [
        { label: 'School Free Trial', id: 'school-trial' },
        { label: 'Tuition Trial Class', id: 'tuition-trial' },
        { label: 'Quran Trial Classes', id: 'quran-trial' },
    ];

    return (
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-brand-burgundy/10 sticky top-0 z-50 shadow-sm">
            <div className="w-full px-6 md:px-12">
                <div className="flex items-center justify-between h-24">
                    {/* Logo + School Name */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/Public/IVS Logo.png"
                            alt="IVS Logo"
                            className="w-20 h-20 object-contain"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-display font-bold text-brand-burgundy tracking-tight">
                                Iqra Virtual School
                            </h1>
                            <p className="text-xs text-brand-mediumText flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Admissions Open 2026
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate?.(item.id)}
                                className="text-brand-darkText hover:text-brand-burgundy font-semibold text-sm transition-colors duration-200 relative group py-2"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-burgundy transition-all duration-300 group-hover:w-full" />
                            </button>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button className="bg-brand-burgundy hover:bg-brand-burgundy/90 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105">
                        Get IVS Brochure
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-brand-burgundy">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
