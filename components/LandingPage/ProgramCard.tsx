import React, { useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LeadType } from "../../types";

type Accent = "blue" | "violet" | "emerald" | "amber";

interface ProgramCardProps {
  id: LeadType;
  title: string;
  description: string;
  badge: string;
  ctaLabel: string;
  accent: Accent;
  imageSrc: string;
  features: string[];
  onSelect: (id: LeadType) => void;
  index?: number;
}



const accentMap: Record<
  Accent,
  {
    color: string;
    soft: string;
    border: string;
    glow: string;
    pillText: string;
    buttonGlow: string;
    buttonTop: string;
    buttonBottom: string;
  }
> = {
  blue: {
    color: "#1d6fce",
    soft: "rgba(29,111,206,0.14)",
    border: "rgba(29,111,206,0.18)",
    glow: "rgba(29,111,206,0.20)",
    pillText: "#1d6fce",
    buttonGlow: "rgba(29,111,206,0.30)",
    buttonTop: "#51a8fb",
    buttonBottom: "#1b63bc",
  },
  violet: {
    color: "#7c3aed",
    soft: "rgba(124,58,237,0.14)",
    border: "rgba(124,58,237,0.18)",
    glow: "rgba(124,58,237,0.20)",
    pillText: "#7c3aed",
    buttonGlow: "rgba(124,58,237,0.30)",
    buttonTop: "#ab76ff",
    buttonBottom: "#7330dd",
  },
  emerald: {
    color: "#059669",
    soft: "rgba(5,150,105,0.14)",
    border: "rgba(5,150,105,0.18)",
    glow: "rgba(5,150,105,0.20)",
    pillText: "#059669",
    buttonGlow: "rgba(5,150,105,0.30)",
    buttonTop: "#27d29b",
    buttonBottom: "#059669",
  },
  amber: {
    color: "#d97706",
    soft: "rgba(217,119,6,0.14)",
    border: "rgba(217,119,6,0.18)",
    glow: "rgba(217,119,6,0.20)",
    pillText: "#d97706",
    buttonGlow: "rgba(217,119,6,0.30)",
    buttonTop: "#ffbd4c",
    buttonBottom: "#dc7a07",
  },
};

const PremiumImageBadge = ({
  imageSrc,
  title,
  accent,
}: {
  imageSrc: string;
  title: string;
  accent: Accent;
}) => {
  const a = accentMap[accent];

  return (
    <div
      className="pc-premium-media"
      style={
        {
          ["--pc-color" as any]: a.color,
          ["--pc-border" as any]: a.border,
          ["--pc-glow" as any]: a.glow,
          ["--pc-soft" as any]: a.soft,
        } as React.CSSProperties
      }
    >
      <div className="pc-premium-media-back-glow" />
      <div className="pc-premium-media-glass" />
      <div className="pc-premium-media-outline" />
      <div className="pc-premium-media-highlight-top" />
      <div className="pc-premium-media-highlight-side" />
      <div className="pc-premium-media-inner-reflection" />
      <div className="pc-premium-media-shadow" />
      <img src={imageSrc} alt={title} className="pc-premium-media-img" />
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
  imageSrc,
  features,
  onSelect,
  index = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
const visible = true;
  const a = accentMap[accent];

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
          border-radius: 34px;
          overflow: hidden;
          min-height: 485px;
          padding: 38px 32px 32px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.88), rgba(246,249,255,0.84));
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.96),
            0 14px 30px rgba(15,23,42,0.045),
            0 28px 65px rgba(15,23,42,0.08);
          transition:
            transform 0.35s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.35s cubic-bezier(0.22,1,0.36,1),
            border-color 0.25s ease;
          isolation: isolate;
          cursor: pointer;
          outline: none;
        }

        .pc-card:hover {
          transform: translateY(-10px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.98),
            0 22px 52px rgba(15,23,42,0.075),
            0 34px 94px rgba(15,23,42,0.11);
          border-color: var(--pc-feature-border);
        }

        .pc-card:focus-visible {
          box-shadow:
            0 0 0 3px rgba(255,255,255,0.95),
            0 0 0 6px rgba(29,111,206,0.18),
            0 22px 52px rgba(15,23,42,0.075);
        }

        .pc-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(460px 220px at 0% 0%, rgba(255,255,255,0.96), transparent 62%),
            radial-gradient(320px 220px at 100% 100%, var(--pc-glow-soft), transparent 76%);
          pointer-events: none;
          z-index: 0;
        }

        .pc-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.14) 30%,
            transparent 58%
          );
          transform: translateX(-125%);
          transition: transform 0.95s ease;
          pointer-events: none;
          z-index: 0;
        }

        .pc-card:hover::after {
          transform: translateX(125%);
        }

        .pc-glow {
          position: absolute;
          right: -42px;
          bottom: -42px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--pc-glow-soft) 0%, transparent 72%);
          pointer-events: none;
          z-index: 0;
          opacity: 0.72;
          filter: blur(10px);
        }

        .pc-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 26px;
          position: relative;
          z-index: 3;
        }

        .pc-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 10px 20px;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          color: var(--pc-pill-text);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.02em;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.38);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.03)
          );
          backdrop-filter: blur(10px) saturate(145%);
          -webkit-backdrop-filter: blur(10px) saturate(145%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.40),
            inset 0 -1px 0 rgba(255,255,255,0.05),
            0 10px 20px rgba(15,23,42,0.08),
            0 2px 8px rgba(15,23,42,0.04);
        }

        .pc-pill::before {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          top: 4px;
          height: 38%;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.85),
            rgba(255,255,255,0.08)
          );
          opacity: 0.9;
          pointer-events: none;
        }

        .pc-pill::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.06),
            inset 0 8px 16px rgba(255,255,255,0.03);
          pointer-events: none;
        }

        .pc-title {
          position: relative;
          z-index: 3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(24px, 2vw, 30px);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 14px;
          font-weight: 700;
          max-width: 78%;
        }

        .pc-desc {
          position: relative;
          z-index: 3;
          max-width: 74%;
          min-height: 84px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 2px;
        }

        .pc-feature-list {
          position: relative;
          z-index: 3;
          display: grid;
          gap: 13px;
          margin-top: 20px;
          margin-bottom: 30px;
          max-width: 72%;
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
          background: rgba(255,255,255,0.58);
          border: 1px solid var(--pc-feature-border);
          color: var(--pc-feature-color);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.85),
            0 4px 12px rgba(15,23,42,0.04);
        }

        .pc-button {
          position: relative;
          z-index: 3;
          min-width: 180px;
          min-height: 58px;
          padding: 14px 30px;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 999px;
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          overflow: hidden;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            var(--pc-button-top) 0%,
            color-mix(in srgb, var(--pc-button-top) 82%, white 18%) 18%,
            color-mix(in srgb, var(--pc-button-top) 42%, var(--pc-button-bottom) 58%) 46%,
            var(--pc-button-bottom) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.28),
            inset 0 -2px 0 rgba(0,0,0,0.12),
            0 12px 26px var(--pc-button-glow),
            0 8px 18px rgba(15,23,42,0.12);
          transition:
            transform 0.25s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.25s cubic-bezier(0.22,1,0.36,1),
            filter 0.25s ease;
        }

        .pc-button span,
        .pc-button svg {
          position: relative;
          z-index: 3;
        }

        .pc-button::before {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          top: 7px;
          height: 15px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.42),
            rgba(255,255,255,0.10)
          );
          opacity: 0.72;
          pointer-events: none;
          z-index: 1;
        }

        .pc-button::after {
          content: "";
          position: absolute;
          top: -18%;
          left: -42%;
          width: 34%;
          height: 140%;
          transform: rotate(20deg);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0),
            rgba(255,255,255,0.16),
            rgba(255,255,255,0.56),
            rgba(255,255,255,0.16),
            rgba(255,255,255,0)
          );
          opacity: 0;
          transition:
            left 0.65s ease,
            opacity 0.28s ease;
          z-index: 2;
          pointer-events: none;
        }

        .pc-card:hover .pc-button {
          transform: translateY(-3px) scale(1.02);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.34),
            inset 0 -2px 0 rgba(0,0,0,0.14),
            0 16px 30px var(--pc-button-glow),
            0 12px 22px rgba(15,23,42,0.16);
          filter: saturate(1.05);
        }

        .pc-card:hover .pc-button::after {
          left: 118%;
          opacity: 1;
        }

        .pc-premium-media {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 30px;
          isolation: isolate;
          flex-shrink: 0;
          overflow: visible;
        }

        .pc-premium-media-back-glow {
          position: absolute;
          inset: 8px;
          border-radius: 24px;
          background: radial-gradient(
            circle at 30% 20%,
            rgba(255,255,255,0.24),
            var(--pc-soft) 42%,
            transparent 78%
          );
          filter: blur(12px);
          opacity: 0.9;
          z-index: 0;
        }

        .pc-premium-media-glass {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.10),
            rgba(255,255,255,0.03)
          );
          backdrop-filter: blur(12px) saturate(145%);
          -webkit-backdrop-filter: blur(12px) saturate(145%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.42),
            inset 0 -1px 0 rgba(255,255,255,0.04);
          z-index: 1;
        }

        .pc-premium-media-outline {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1.5px solid rgba(255,255,255,0.42);
          box-shadow:
            0 16px 28px rgba(15,23,42,0.10),
            0 4px 10px rgba(15,23,42,0.04);
          z-index: 2;
        }

        .pc-premium-media-highlight-top {
          position: absolute;
          left: 14px;
          right: 14px;
          top: 6px;
          height: 18px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.88),
            rgba(255,255,255,0.10)
          );
          opacity: 0.96;
          z-index: 3;
        }

        .pc-premium-media-highlight-side {
          position: absolute;
          top: 10px;
          right: 9px;
          width: 12px;
          height: 40px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.30),
            rgba(255,255,255,0.02)
          );
          filter: blur(0.6px);
          opacity: 0.85;
          z-index: 3;
        }

        .pc-premium-media-inner-reflection {
          position: absolute;
          top: 0;
          right: 0;
          width: 72%;
          height: 72%;
          border-top-right-radius: 30px;
          border-bottom-left-radius: 90px;
          background: radial-gradient(
            circle at top right,
            rgba(255,255,255,0.16),
            rgba(255,255,255,0.05) 45%,
            transparent 72%
          );
          z-index: 2;
        }

        .pc-premium-media-shadow {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: -12px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(15,23,42,0.18),
            rgba(15,23,42,0.05) 60%,
            transparent 80%
          );
          filter: blur(7px);
          z-index: 0;
        }

        .pc-premium-media-img {
          position: absolute;
          inset: 8px;
          width: calc(100% - 16px);
          height: calc(100% - 16px);
          object-fit: contain;
          z-index: 4;
          filter:
            drop-shadow(0 2px 4px rgba(15,23,42,0.05))
            saturate(1.05);
        }

        @media (max-width: 1100px) {
          .pc-title,
          .pc-desc,
          .pc-feature-list {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .pc-card {
            min-height: auto;
            padding: 26px 22px;
            border-radius: 28px;
          }

          .pc-top {
            margin-bottom: 20px;
          }

          .pc-title,
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

          .pc-premium-media {
            width: 94px;
            height: 94px;
            border-radius: 26px;
          }

          .pc-premium-media-img {
            inset: 8px;
            width: calc(100% - 16px);
            height: calc(100% - 16px);
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
              ["--pc-pill-text" as any]: a.pillText,
              ["--pc-feature-color" as any]: a.color,
              ["--pc-feature-soft" as any]: a.soft,
              ["--pc-feature-border" as any]: a.border,
              ["--pc-soft" as any]: a.soft,
              ["--pc-button-glow" as any]: a.buttonGlow,
              ["--pc-button-top" as any]: a.buttonTop,
              ["--pc-button-bottom" as any]: a.buttonBottom,
              ["--pc-glow-soft" as any]: a.glow,
            } as React.CSSProperties
          }
        >
          <div className="pc-glow" />

          <div className="pc-top">
            <PremiumImageBadge
              imageSrc={imageSrc}
              title={title}
              accent={accent}
            />
            <div className="pc-pill">{badge}</div>
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
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramCard;