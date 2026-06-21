import React, { useState, useEffect, useRef } from "react";

const CARDS = [
  {
    ribbon: "sc-blue",
    accentGrad: "linear-gradient(180deg,#2f80ed,#56b4f5)",
    icon: "🏫",
    label: "Premium Program",
    title: "School",
    sub: "Full-time learning",
    items: ["Live daily classes", "Academic routine", "Parent reports", "Progress tracking"],
    btnGrad: "linear-gradient(90deg,#3b82f6,#38bdf8)",
    btnShadow: "rgba(59,130,246,0.28)",
  },
  {
    ribbon: "sc-purple",
    accentGrad: "linear-gradient(180deg,#7c3aed,#a855f7)",
    icon: "👤",
    label: "Personal Support",
    title: "Tuition",
    sub: "1-on-1 guidance",
    items: ["Subject coaching", "Exam preparation", "Private attention", "Custom pacing"],
    btnGrad: "linear-gradient(90deg,#7c3aed,#a855f7)",
    btnShadow: "rgba(124,58,237,0.28)",
  },
  {
    ribbon: "sc-gold",
    accentGrad: "linear-gradient(180deg,#f59e0b,#fbbf24)",
    icon: "📖",
    label: "Qualified Teachers",
    title: "Qur'an",
    sub: "Tajweed + Hifz",
    items: ["Certified instructors", "Flexible timings", "Supportive learning", "Regular practice"],
    btnGrad: "linear-gradient(90deg,#f59e0b,#fbbf24)",
    btnShadow: "rgba(245,158,11,0.28)",
  },
];

const PHASES: Array<["h"|"e"|"v"|"x","h"|"e"|"v"|"x","h"|"e"|"v"|"x"]> = [
  ["e","h","h"],
  ["v","e","h"],
  ["v","v","e"],
  ["v","v","v"],
  ["x","v","v"],
  ["h","x","v"],
  ["h","h","x"],
  ["h","h","h"],
];
const DELAYS = [560, 560, 560, 2600, 560, 560, 560, 320];

const DESIGN_WIDTH = 390; // cards are designed at this px width

const IVSAvatarShowcase: React.FC = () => {
  const [step,  setStep]  = useState(0);
  const [scale, setScale] = useState(1);
  const slotRef           = useRef<HTMLDivElement>(null);
  const phases            = PHASES[step];

  useEffect(() => {
    const t = setTimeout(
      () => setStep(s => (s + 1) % PHASES.length),
      DELAYS[step]
    );
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / DESIGN_WIDTH));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleExplore = () => {
    const el =
      document.getElementById("programs-section") ||
      document.getElementById("programs") ||
      document.querySelector<HTMLElement>("[data-section='programs']") ||
      document.querySelector("section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  const FRAME_NATURAL_H = 320;
  const slotH = Math.round(FRAME_NATURAL_H * scale);

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════════════════
           ROOT
           • position:relative  →  avatar uses absolute inside
           • fills HeroCard col-span-5 fully (width + height)
           • cards sit at BOTTOM-LEFT via flex-end
           • avatar is absolute BOTTOM-RIGHT, full column height
        ════════════════════════════════════════════════════════ */
        .ivs-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;          /* cards sit at the bottom */
          padding-bottom: clamp(6px, 1vw, 14px);
        }

        /* ── CARDS SLOT
           right margin = avatar column width
           so cards never slide under the avatar
        ── */
        .ivs-slot {
          /* 
            This right margin must match .ivs-av width.
            Using the same clamp values keeps them in sync.
          */
          margin-right: clamp(170px, 36%, 280px);
          min-width: 0;
          position: relative;
          flex-shrink: 0;
        }

        /* ── SCALE FRAME ── */
        .ivs-frame {
          width: ${DESIGN_WIDTH}px;
          transform-origin: top left;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          align-items: start;
          gap: 10px;
        }

        /* ═══════════════════════════════════════════════════════
           CARD
        ════════════════════════════════════════════════════════ */
        .ivs-card {
          position: relative;
          width: 100%;
          border-radius: 20px;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(15,23,42,0.07);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.92),
            0 10px 28px rgba(15,23,42,0.10),
            0 3px 8px rgba(15,23,42,0.04);
          padding: 16px 13px 14px;
          box-sizing: border-box;
          overflow: hidden;
          will-change: transform, opacity;
          transition: box-shadow 0.25s ease, transform 0.22s ease;
        }

        .ivs-card:hover {
          transform: translateY(-3px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.96),
            0 20px 44px rgba(15,23,42,0.13),
            0 5px 12px rgba(15,23,42,0.05);
        }

        .ivs-card::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 19px;
          border: 1px solid rgba(255,255,255,0.65);
          pointer-events: none;
          z-index: 0;
        }

        .ivs-card::before {
          content: "";
          position: absolute;
          left: 12%; right: 12%; top: 0;
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent);
          pointer-events: none;
          z-index: 5;
        }

        .ivs-stripe {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 5px;
          border-radius: 20px 0 0 20px;
        }

        .ivs-ribbon {
          position: absolute;
          top: -6px;
          right: 12px;
          width: 26px;
          height: 38px;
          clip-path: polygon(0 0,100% 0,100% 80%,50% 100%,0 80%);
          z-index: 3;
        }
        .sc-blue   { background: linear-gradient(160deg,#2f80ed,#56b4f5); }
        .sc-purple { background: linear-gradient(160deg,#7c3aed,#a855f7); }
        .sc-gold   { background: linear-gradient(160deg,#f59e0b,#fbbf24); }

        .ivs-icon {
          position: relative; z-index: 1;
          width: 38px; height: 38px;
          border-radius: 12px;
          background: rgba(248,250,252,0.98);
          border: 1px solid rgba(15,23,42,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          box-shadow: inset 0 1px 0 #fff, 0 2px 6px rgba(15,23,42,0.06);
          margin-bottom: 10px;
        }

        .ivs-label {
          position: relative; z-index: 1;
          font-size: 7.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 3px;
          white-space: nowrap;
        }

        .ivs-title {
          position: relative; z-index: 1;
          font-size: 18px;
          line-height: 1.1;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
          margin-bottom: 3px;
          white-space: nowrap;
        }

        .ivs-sub {
          position: relative; z-index: 1;
          font-size: 10px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 10px;
          white-space: nowrap;
        }

        .ivs-list {
          position: relative; z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }

        .ivs-li {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          font-size: 9.5px;
          line-height: 1.38;
          color: #374151;
          font-weight: 500;
          white-space: nowrap;
        }

        .ivs-check {
          color: #22c55e;
          font-weight: 900;
          font-size: 10px;
          flex-shrink: 0;
          line-height: 1.2;
        }

        .ivs-btn {
          position: relative; z-index: 1;
          width: 100%;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 10.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .ivs-btn::before {
          content: "";
          position: absolute;
          left: 10px; right: 10px; top: 4px;
          height: 36%;
          border-radius: 999px;
          background: linear-gradient(180deg,rgba(255,255,255,0.32),transparent);
          pointer-events: none;
        }
        .ivs-btn:hover  { transform: translateY(-1px); filter: brightness(1.06); }
        .ivs-btn:active { transform: translateY(0); }

        /* ═══════════════════════════════════════════════════════
           AVATAR
           • position: absolute — pinned to BOTTOM-RIGHT of root
           • right: 0, bottom: 0  →  feet touch the bottom edge
           • width clamp → same value as ivs-slot margin-right
           • height: 100%  →  fills full column height top-to-bottom
             so the avatar stands tall like in the screenshot
        ════════════════════════════════════════════════════════ */
        .ivs-av {
          position: absolute;
          right: 0;
          bottom: 0;
          width: clamp(210px, 42%, 340px);  /* ← MUST match ivs-slot margin-right */
          height: 100%;                      /* full column height */
          pointer-events: none;
          display: flex;
          align-items: flex-end;            /* feet at the bottom */
          justify-content: center;
          z-index: 2;
        }

        .ivs-av img {
          width: 100%;
          height: auto;
          /* tall enough to fill most of the column height          */
          max-height: 125%;                  /* slightly taller than column = peeks above */
          object-fit: contain;
          object-position: bottom center;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          filter: drop-shadow(0 22px 40px rgba(15,23,42,0.16));
        }

        /* ═══════════════════════════════════════════════════════
           ANIMATIONS — enter FROM TOP
        ════════════════════════════════════════════════════════ */
        .ph-e {
          animation: ivsEnter 540ms cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes ivsEnter {
          from { opacity: 0; transform: translateY(-24px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }

        .ph-v { opacity: 1; transform: translateY(0) scale(1); }

        .ph-x {
          animation: ivsExit 520ms cubic-bezier(0.55,0,1,0.45) both;
        }
        @keyframes ivsExit {
          from { opacity: 1; transform: translateY(0)    scale(1);    }
          to   { opacity: 0; transform: translateY(20px) scale(0.94); }
        }

        .ph-h {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* ═══════════════════════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════════════════════════ */

        /* Tablet: tighten avatar width + slot margin together */
        @media (max-width: 900px) {
          .ivs-slot {
            margin-right: clamp(130px, 30%, 220px);
          }
          .ivs-av {
            width: clamp(130px, 30%, 220px);
          }
          .ivs-av img {
            max-height: 100%;
          }
        }

        /* Mobile: back to stacked column layout */
        @media (max-width: 540px) {
          .ivs-root {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            padding-bottom: 0;
          }
          .ivs-slot {
            margin-right: 0;
            width: 100%;
          }
          .ivs-av {
            position: relative;
            right: auto;
            bottom: auto;
            width: clamp(130px, 48vw, 200px);
            height: auto;
            align-self: center;
          }
          .ivs-av img {
            max-height: clamp(150px, 40vw, 240px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ph-e, .ph-x { animation: none !important; }
          .ph-e { opacity: 1; transform: none; }
          .ph-x { opacity: 0; }
        }
      `}</style>

      {/* ROOT — fills HeroCard's col-span-5 */}
      <div className="ivs-root">

        {/* CARDS — bottom-left, margin-right reserves avatar space */}
        <div
          className="ivs-slot"
          ref={slotRef}
          style={{ height: `${slotH}px` }}
        >
          <div
            className="ivs-frame"
            style={{ transform: `scale(${scale})` }}
          >
            {CARDS.map((card, i) => (
              <div
                key={`c${i}-s${step}`}
                className={`ivs-card ph-${phases[i]}`}
              >
                <div className="ivs-stripe" style={{ background: card.accentGrad }} />
                <div className={`ivs-ribbon ${card.ribbon}`} />
                <div className="ivs-icon">{card.icon}</div>
                <div className="ivs-label">{card.label}</div>
                <div className="ivs-title">{card.title}</div>
                <div className="ivs-sub">{card.sub}</div>
                <div className="ivs-list">
                  {card.items.map((item, j) => (
                    <div className="ivs-li" key={j}>
                      <span className="ivs-check">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="ivs-btn"
                  style={{
                    background: card.btnGrad,
                    boxShadow: `0 5px 14px ${card.btnShadow}`,
                  }}
                  onClick={handleExplore}
                >
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AVATAR — absolute bottom-right, tall, fills full column height */}
        <div className="ivs-av" aria-label="IVS Kid Avatar">
          <img
            src="/images/kid-avatar.webp"
            alt="IVS Kid Avatar"
            width={640}
            height={960}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

      </div>
    </>
  );
};

export default IVSAvatarShowcase;
