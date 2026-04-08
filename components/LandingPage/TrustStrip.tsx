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

              {i !== items.length - 1 ? (
                <span className="ivs-trustDot" aria-hidden="true" />
              ) : null}
            </div>
          );
        })}
      </div>

      <style>{`
        .ivs-container {
          width: 100%;
        }

        .ivs-trustBar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          padding: 16px 16px;
          border-radius: 24px;

          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.88);
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.92),
            inset 0 -10px 24px rgba(255,255,255,0.04),
            0 16px 34px rgba(15,45,87,0.10),
            0 6px 14px rgba(15,45,87,0.05);
        }

        .ivs-trustItem {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(15,30,58,0.88);
          font-weight: 800;
          font-size: 14px;
          line-height: 1.1;
          transition: transform 0.18s ease;
        }

        .ivs-trustItem:hover {
          transform: translateY(-1px);
        }

        .ivs-trustIco {
          width: 36px;
          height: 36px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;

          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.02)
          ) !important;
          border: 1px solid rgba(255,255,255,0.92);
          color: rgba(29,111,206,0.96);

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.98),
            inset 0 -8px 18px rgba(255,255,255,0.05),
            0 14px 26px rgba(15,45,87,0.12),
            0 4px 10px rgba(15,45,87,0.06);
        }

        .ivs-trustText {
          white-space: nowrap;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 0 rgba(255,255,255,0.42);
        }

        .ivs-trustDot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          margin-left: 6px;

          background: rgba(15,30,58,0.18);
          box-shadow:
            0 0 0 2px rgba(255,255,255,0.40),
            0 4px 10px rgba(15,45,87,0.08);
        }

        @media (max-width: 640px) {
          .ivs-trustBar {
            justify-content: flex-start;
            gap: 10px 14px;
            padding: 14px;
            border-radius: 20px;
          }

          .ivs-trustText {
            font-size: 13px;
          }

          .ivs-trustIco {
            width: 34px;
            height: 34px;
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default TrustStrip;