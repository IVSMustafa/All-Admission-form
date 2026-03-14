import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LeadType } from "../../types";

type Accent = "blue" | "violet" | "emerald" | "amber";

interface ProgramCardProps {
  id: LeadType;
  title: string;
  description: string;
  badge: string;
  ctaLabel: string;
  accent: Accent;
  icon: LucideIcon;
  features: string[];
  onSelect: (id: LeadType) => void;
  index?: number;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

const accentMap: Record<
  Accent,
  {
    color: string;
    soft: string;
    border: string;
    glow: string;
    pillBg: string;
    pillText: string;
    button: string;
    buttonGlow: string;
  }
> = {
  blue: {
    color: "#1d6fce",
    soft: "rgba(29,111,206,0.10)",
    border: "rgba(29,111,206,0.16)",
    glow: "rgba(29,111,206,0.18)",
    pillBg: "rgba(29,111,206,0.10)",
    pillText: "#1d6fce",
    button: "linear-gradient(135deg,#1d6fce,#2da8f3)",
    buttonGlow: "rgba(29,111,206,0.24)",
  },
  violet: {
    color: "#7c3aed",
    soft: "rgba(124,58,237,0.10)",
    border: "rgba(124,58,237,0.16)",
    glow: "rgba(124,58,237,0.18)",
    pillBg: "rgba(124,58,237,0.10)",
    pillText: "#7c3aed",
    button: "linear-gradient(135deg,#7c3aed,#9f67ff)",
    buttonGlow: "rgba(124,58,237,0.24)",
  },
  emerald: {
    color: "#059669",
    soft: "rgba(5,150,105,0.10)",
    border: "rgba(5,150,105,0.16)",
    glow: "rgba(5,150,105,0.18)",
    pillBg: "rgba(5,150,105,0.10)",
    pillText: "#059669",
    button: "linear-gradient(135deg,#059669,#15b981)",
    buttonGlow: "rgba(5,150,105,0.24)",
  },
  amber: {
    color: "#d97706",
    soft: "rgba(217,119,6,0.10)",
    border: "rgba(217,119,6,0.16)",
    glow: "rgba(217,119,6,0.18)",
    pillBg: "rgba(217,119,6,0.10)",
    pillText: "#d97706",
    button: "linear-gradient(135deg,#d97706,#f59e0b)",
    buttonGlow: "rgba(217,119,6,0.24)",
  },
};

const PremiumIcon = ({
  Icon,
  accent,
}: {
  Icon: LucideIcon;
  accent: Accent;
}) => {
  const a = accentMap[accent];

  return (
    <div
      className="pc-premium-icon"
      style={
        {
          ["--pc-color" as any]: a.color,
          ["--pc-border" as any]: a.border,
          ["--pc-glow" as any]: a.glow,
        } as React.CSSProperties
      }
    >
      <div className="pc-premium-icon-bg" />
      <div className="pc-premium-icon-shine" />
      <div className="pc-premium-icon-ring" />
      <div className="pc-premium-icon-inner">
        <Icon className="w-6 h-6" />
      </div>
      <div className="pc-premium-icon-dot" />
    </div>
  );
};

export const ProgramCard: React.FC<ProgramCardProps> = ({
  id,
  title,
  description,
  badge,
  ctaLabel,
  accent,
  icon: Icon,
  features,
  onSelect,
  index = 0,
}) => {
  const { ref, visible } = useReveal();
  const a = accentMap[accent];
  const isQuranCard = id === LeadType.QURAN;
  const [showQuranArt, setShowQuranArt] = useState(true);

  const handleSelect = () => onSelect(id);

  return (
    <>
      <style>{`
        .pc-reveal {
          opacity: 0;
          transform: translateY(34px) scale(0.985);
          transition:
            opacity 0.75s cubic-bezier(0.22,1,0.36,1),
            transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }

        .pc-reveal.in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .pc-card {
          position: relative;
          border-radius: 30px;
          overflow: hidden;
          min-height: 430px;
          padding: 34px;
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,255,0.98));
          border: 1px solid rgba(15,23,42,0.06);
          box-shadow:
            0 10px 24px rgba(15,23,42,0.045),
            0 24px 60px rgba(15,23,42,0.07);
          transition:
            transform 0.35s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.35s cubic-bezier(0.22,1,0.36,1),
            border-color 0.25s ease,
            background 0.25s ease;
          isolation: isolate;
          cursor: pointer;
          outline: none;
        }

        .pc-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 18px 42px rgba(15,23,42,0.07),
            0 30px 85px rgba(15,23,42,0.10);
          border-color: var(--pc-feature-border);
        }

        .pc-card:focus-visible {
          box-shadow:
            0 0 0 3px rgba(255,255,255,0.95),
            0 0 0 6px rgba(29,111,206,0.18),
            0 18px 42px rgba(15,23,42,0.07);
        }

        .pc-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(420px 180px at 0% 0%, rgba(255,255,255,0.76), transparent 60%),
            radial-gradient(300px 180px at 100% 100%, var(--pc-glow-soft), transparent 75%);
          pointer-events: none;
          z-index: 0;
        }

        .pc-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 35%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.85s ease;
          pointer-events: none;
          z-index: 0;
        }

        .pc-card:hover::after {
          transform: translateX(120%);
        }

        .pc-glow {
          position: absolute;
          right: -40px;
          bottom: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--pc-glow-soft) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          opacity: 0.7;
          filter: blur(6px);
        }

        .pc-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 20px;
          position: relative;
          z-index: 3;
        }

        .pc-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          background: var(--pc-pill-bg);
          color: var(--pc-pill-text);
          border: 1px solid rgba(255,255,255,0.75);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.02em;
          box-shadow: 0 6px 16px rgba(15,23,42,0.04);
          white-space: nowrap;
        }

        .pc-title {
          position: relative;
          z-index: 3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(22px, 2vw, 28px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .pc-desc {
          position: relative;
          z-index: 3;
          max-width: 72%;
          min-height: 78px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.8;
        }

        .pc-feature-list {
          position: relative;
          z-index: 3;
          display: grid;
          gap: 12px;
          margin-top: 18px;
          margin-bottom: 26px;
          max-width: 70%;
        }

        .pc-feature {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          transition: transform 0.18s ease;
        }

        .pc-card:hover .pc-feature {
          transform: translateX(2px);
        }

        .pc-feature-ico {
          width: 22px;
          height: 22px;
          min-width: 22px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--pc-feature-soft);
          border: 1px solid var(--pc-feature-border);
          color: var(--pc-feature-color);
          box-shadow: 0 4px 12px rgba(15,23,42,0.04);
        }

        .pc-button {
          position: relative;
          z-index: 3;
          border: none;
          border-radius: 999px;
          padding: 14px 24px;
          min-width: 168px;
          background: var(--pc-button-bg);
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 12px 28px var(--pc-button-glow);
          transition:
            transform 0.25s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.25s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
          pointer-events: none;
        }

        .pc-card:hover .pc-button {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px var(--pc-button-glow);
        }

        .pc-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 52%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent);
          transition: left 0.55s ease;
        }

        .pc-card:hover .pc-button::after {
          left: 150%;
        }

        .pc-premium-icon {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 18px;
          isolation: isolate;
          flex-shrink: 0;
        }

        .pc-premium-icon-bg {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,247,255,0.94));
          border: 1px solid var(--pc-border);
          box-shadow: 0 8px 18px rgba(15,23,42,0.05);
        }

        .pc-premium-icon-shine {
          position: absolute;
          top: 5px;
          left: 8px;
          width: 58%;
          height: 28%;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.06));
          transform: rotate(-10deg);
          z-index: 1;
        }

        .pc-premium-icon-ring {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          box-shadow: 0 0 24px var(--pc-glow);
          opacity: 0.7;
        }

        .pc-premium-icon-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pc-color);
          z-index: 2;
        }

        .pc-premium-icon-dot {
          position: absolute;
          right: 6px;
          top: 6px;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: white;
          box-shadow: 0 0 10px var(--pc-glow);
          z-index: 3;
        }

        .pc-quran-left-art {
          position: absolute;
          left: -10px;
          top: 0;
          bottom: 0;
          width: 54%;
          background-image:
            linear-gradient(90deg, rgba(9,55,119,0.14), rgba(9,55,119,0.02)),
            url('/images/quran-cover-blue.png');
          background-size: cover;
          background-position: left center;
          background-repeat: no-repeat;
          opacity: 0.18;
          pointer-events: none;
          z-index: 1;
          mask-image: linear-gradient(90deg, rgba(0,0,0,1), rgba(0,0,0,0));
          -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,1), rgba(0,0,0,0));
        }

        .pc-quran-right-art {
          position: absolute;
          right: 12px;
          bottom: 18px;
          width: 34%;
          max-width: 220px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.96;
          filter:
            drop-shadow(0 16px 32px rgba(29,111,206,0.16))
            drop-shadow(0 8px 18px rgba(15,23,42,0.07));
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }

        .pc-card:hover .pc-quran-right-art {
          transform: translateY(-5px) scale(1.02);
        }

        .pc-quran-soft-orb {
          position: absolute;
          right: 92px;
          top: 52px;
          width: 130px;
          height: 130px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(125,211,252,0.16), rgba(125,211,252,0.03) 60%, transparent 70%);
          filter: blur(8px);
          pointer-events: none;
          z-index: 1;
        }

        @media (max-width: 1100px) {
          .pc-desc,
          .pc-feature-list {
            max-width: 100%;
          }

          .pc-quran-left-art,
          .pc-quran-right-art,
          .pc-quran-soft-orb {
            opacity: 0.12;
          }
        }

        @media (max-width: 768px) {
          .pc-card {
            min-height: auto;
            padding: 26px 22px;
          }

          .pc-desc,
          .pc-feature-list {
            max-width: 100%;
          }

          .pc-desc {
            min-height: auto;
          }

          .pc-button {
            width: 100%;
          }

          .pc-quran-right-art {
            width: 30%;
            min-width: 110px;
            right: 8px;
            bottom: 10px;
            opacity: 0.18;
          }

          .pc-quran-left-art {
            width: 62%;
            opacity: 0.10;
          }
        }
      `}</style>

      <div
        ref={ref}
        className={`pc-reveal ${visible ? "in" : ""}`}
        style={{ transitionDelay: `${index * 90}ms` }}
      >
        <div
          className="pc-card"
          role="button"
          tabIndex={0}
          onClick={handleSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect();
            }
          }}
          style={
            {
              ["--pc-color" as any]: a.color,
              ["--pc-border" as any]: a.border,
              ["--pc-glow" as any]: a.glow,
              ["--pc-button-bg" as any]: a.button,
              ["--pc-button-glow" as any]: a.buttonGlow,
              ["--pc-pill-bg" as any]: a.pillBg,
              ["--pc-pill-text" as any]: a.pillText,
              ["--pc-feature-color" as any]: a.color,
              ["--pc-feature-soft" as any]: a.soft,
              ["--pc-feature-border" as any]: a.border,
              ["--pc-glow-soft" as any]: a.glow,
            } as React.CSSProperties
          }
        >

          <div className="pc-glow" />

          <div className="pc-top">
            <PremiumIcon Icon={Icon} accent={accent} />
            <div className="pc-pill">
              <Sparkles className="w-3.5 h-3.5" />
              {badge}
            </div>
          </div>

          <h3 className="pc-title">{title}</h3>
          <p className="pc-desc">{description}</p>

          <div className="pc-feature-list">
            {features.map((item) => (
              <div key={item} className="pc-feature">
                <span className="pc-feature-ico">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pc-button">
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramCard;