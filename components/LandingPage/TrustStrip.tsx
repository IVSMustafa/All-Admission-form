import React from "react";
import { Globe2, Users, Headphones, CalendarDays } from "lucide-react";

export function TrustStrip() {
  const items = [
    { icon: Globe2, text: "Teachers Globally" },
    { icon: Users, text: "Students in 50+ Countries" },
    { icon: Headphones, text: "24/7 Management Support" },
    { icon: CalendarDays, text: "Sunday–Thursday Classes" },
  ];

  return (
    <div className="ivs-container">
      <div className="ivs-trustBar">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={i} className="ivs-trustItem">
              <span className="ivs-trustIco" aria-hidden="true">
                <Icon className="w-4 h-4" />
              </span>
              <span className="ivs-trustText">{it.text}</span>

              {i !== items.length - 1 ? <span className="ivs-trustDot" aria-hidden="true" /> : null}
            </div>
          );
        })}
      </div>

      <style>{`
        .ivs-trustBar{
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 14px;
          flex-wrap: wrap;
          padding: 14px 14px;
          border-radius: 22px;
          border: 1px solid rgba(15,30,58,0.10);
          background: rgba(255,255,255,0.70);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 60px rgba(15,30,58,0.08);
        }

        .ivs-trustItem{
          display:flex;
          align-items:center;
          gap: 10px;
          color: rgba(15,30,58,0.86);
          font-weight: 800;
          font-size: 14px;
          line-height: 1.1;
        }

        .ivs-trustIco{
          width: 34px;
          height: 34px;
          border-radius: 14px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(15,30,58,0.10);
          box-shadow: 0 10px 22px rgba(15,30,58,0.10);
          color: rgba(37,99,235,0.95);
          flex: 0 0 auto;
        }

        .ivs-trustText{
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .ivs-trustDot{
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(15,30,58,0.22);
          margin-left: 6px;
        }

        @media (max-width: 520px){
          .ivs-trustBar{
            justify-content:flex-start;
            gap: 10px 14px;
          }
          .ivs-trustText{ font-size: 13px; }
        }
      `}</style>
    </div>
  );
}

export default TrustStrip;