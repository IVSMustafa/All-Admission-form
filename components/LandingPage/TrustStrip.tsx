import React from 'react';
import { Globe2, Users, Headphones, Calendar } from 'lucide-react';

const TRUST_ITEMS = [
    { icon: Globe2, text: 'Teachers Globally', color: 'text-sky-500' },
    { icon: Users, text: 'Students in 50+ Countries', color: 'text-emerald-500' },
    { icon: Headphones, text: '24/7 Management Support', color: 'text-brand-orange' },
    { icon: Calendar, text: 'Sunday–Thursday Classes', color: 'text-purple-500' },
];

export const TrustStrip: React.FC = () => {
    return (
        <div className="trust-strip">
            {TRUST_ITEMS.map(({ icon: Icon, text, color }) => (
                <div key={text} className="trust-item">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span>{text}</span>
                </div>
            ))}
        </div>
    );
};

export default TrustStrip;
