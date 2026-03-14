import React, { useState, useEffect } from "react";

const CARDS = [
  {
    ribbon: "sc-blue",
    icon: "🏫",
    label: "Premium Program",
    title: "School",
    sub: "Full-time learning",
    items: ["Live daily classes", "Academic routine", "Parent reports", "Progress tracking"],
  },
  {
    ribbon: "sc-purple",
    icon: "👤",
    label: "Personal Support",
    title: "Tuition",
    sub: "1-on-1 guidance",
    items: ["Subject coaching", "Exam preparation", "Private attention", "Custom pacing"],
  },
  {
    ribbon: "sc-gold",
    icon: "📖",
    label: "Qualified Teachers",
    title: "Qur'an",
    sub: "Tajweed + Hifz",
    items: ["Certified instructors", "Flexible timings", "Supportive learning", "Regular practice"],
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

const IVSAvatarShowcase: React.FC = () => {
  const [step, setStep] = useState(0);
  const phases = PHASES[step];

  useEffect(() => {
    const t = setTimeout(() => setStep(s => (s + 1) % PHASES.length), DELAYS[step]);
    return () => clearTimeout(t);
  }, [step]);

  const handleExplore = () => {
    const el =
      document.getElementById("programs-section") ||
      document.getElementById("programs") ||
      document.querySelector<HTMLElement>("[data-section='programs']") ||
      document.querySelector("section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <style>{`
        .sc-scene {
          position: relative;
          width: 100%;
          height: 580px;
          overflow: visible;
        }

        /* ── Avatar: right side, big, always on top ── */
        .sc-av {
          position: absolute;
          right: -14px;
          bottom: 0;
          width: 55%;
          height: 97%;
          z-index: 10;
          pointer-events: none;
        }
        .sc-av img {
          width: 100%; height: 100%;
          object-fit: contain;
          object-position: bottom right;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* ── Card row: left side — pushed to top so all 3 cards
           are fully visible above the kid avatar ── */
        .sc-row {
          position: absolute;
          top: 18px;
          left: 0;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 8px;
          z-index: 8;
        }

        /* ── Cards: fixed width, never shrink ── */
        .sc-card {
          width: 148px;
          flex-shrink: 0;
          border-radius: 22px;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(15,23,42,0.07);
          box-shadow:
            0 12px 30px rgba(15,23,42,0.10),
            0 3px 8px rgba(15,23,42,0.04);
          padding: 17px 13px 13px;
          position: relative;
          backdrop-filter: blur(14px);
          overflow: hidden;
          will-change: transform, opacity;
          transition: box-shadow 0.25s ease;
        }
        .sc-card:hover {
          box-shadow: 0 18px 40px rgba(15,23,42,0.13), 0 4px 10px rgba(15,23,42,0.06);
        }
        .sc-card::after {
          content: "";
          position: absolute; inset: 1px;
          border-radius: 21px;
          border: 1px solid rgba(255,255,255,0.65);
          pointer-events: none;
        }

        /* ── Ribbon ── */
        .sc-ribbon {
          position: absolute;
          top: -8px; right: 14px;
          width: 32px; height: 46px;
          clip-path: polygon(0 0,100% 0,100% 80%,50% 100%,0 80%);
        }
        .sc-blue   { background: linear-gradient(160deg,#2f80ed,#56b4f5); }
        .sc-purple { background: linear-gradient(160deg,#7c3aed,#a855f7); }
        .sc-gold   { background: linear-gradient(160deg,#f59e0b,#fbbf24); }

        /* ── Icon ── */
        .sc-icon-wrap {
          width: 38px; height: 38px; border-radius: 12px;
          background: rgba(248,250,252,0.98);
          border: 1px solid rgba(15,23,42,0.06);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 8px rgba(15,23,42,0.06);
          margin-bottom: 10px; font-size: 17px; flex-shrink: 0;
        }

        /* ── Text ── */
        .sc-label {
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #9ca3af; margin-bottom: 3px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .sc-title {
          font-size: 18px; line-height: 1.08; font-weight: 800;
          color: #111827; letter-spacing: -0.03em; margin-bottom: 2px;
        }
        .sc-sub {
          font-size: 10.5px; font-weight: 500;
          color: #6b7280; margin-bottom: 10px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* ── List ── */
        .sc-list { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .sc-li {
          display: flex; align-items: flex-start;
          gap: 5px; font-size: 10px; line-height: 1.38;
          color: #374151; font-weight: 500;
        }
        .sc-check { color: #22c55e; font-weight: 900; font-size: 11px; line-height: 1.2; flex-shrink: 0; }

        /* ── Button ── */
        .sc-btn {
          width: 100%; height: 31px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(90deg,#3b82f6,#38bdf8);
          color: white; font-size: 11px; font-weight: 700;
          border: none; cursor: pointer;
          box-shadow: 0 5px 12px rgba(59,130,246,0.22);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          white-space: nowrap;
        }
        .sc-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(59,130,246,0.28); }
        .sc-btn:active { transform: translateY(0); }

        /* ── Phase animations ── */
        .ph-e { animation: scEnter 560ms cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes scEnter {
          from { opacity:0; transform: translateY(28px) scale(0.91); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        .ph-v { opacity:1; transform:none; }
        .ph-x { animation: scExit 560ms cubic-bezier(0.55,0,1,0.45) both; }
        @keyframes scExit {
          from { opacity:1; transform: translateY(0) scale(1); }
          to   { opacity:0; transform: translateY(-24px) scale(0.91); }
        }
        .ph-h { opacity:0; pointer-events:none; visibility:hidden; }

        /* ── Responsive ── */
        @media (max-width:1280px){
          .sc-scene { height:540px; }
          .sc-card  { width:136px; padding:15px 11px 12px; border-radius:20px; }
          .sc-card::after { border-radius:19px; }
          .sc-title { font-size:16px; }
          .sc-row   { gap:7px; }
        }
        @media (max-width:1100px){
          .sc-scene { height:500px; }
          .sc-av    { width:54%; }
          .sc-card  { width:122px; padding:13px 10px 11px; border-radius:18px; }
          .sc-title { font-size:15px; }
          .sc-sub   { font-size:9.5px; }
          .sc-li    { font-size:9px; }
          .sc-btn   { height:28px; font-size:10px; border-radius:9px; }
          .sc-row   { gap:6px; }
        }
        @media (max-width:900px){
          .sc-scene { height:460px; }
          .sc-av    { width:56%; }
          .sc-card  { width:108px; padding:11px 9px 10px; border-radius:16px; }
          .sc-icon-wrap { width:32px; height:32px; font-size:14px; margin-bottom:8px; border-radius:10px; }
          .sc-label { font-size:7px; }
          .sc-title { font-size:13px; }
          .sc-sub   { font-size:9px; margin-bottom:7px; }
          .sc-li    { font-size:8.5px; gap:4px; }
          .sc-check { font-size:10px; }
          .sc-list  { gap:4px; margin-bottom:9px; }
          .sc-btn   { height:25px; font-size:9px; border-radius:8px; }
          .sc-row   { gap:5px; }
        }
        @media (max-width:768px){
          .sc-scene { height:420px; }
          .sc-av    { width:58%; height:88%; right:-6px; }
          .sc-card  { width:96px; padding:10px 8px 9px; }
          .sc-ribbon{ width:24px; height:34px; right:10px; top:-5px; }
          .sc-title { font-size:12px; }
          .sc-list  { gap:3px; margin-bottom:8px; }
          .sc-btn   { height:23px; font-size:8.5px; border-radius:7px; }
        }
        @media (max-width:480px){
          .sc-scene { height:360px; }
          .sc-av    { width:60%; height:84%; }
          .sc-card  { width:84px; padding:9px 7px 8px; }
          .sc-sub   { display:none; }
          .sc-li    { font-size:7.5px; }
        }
        @media (prefers-reduced-motion:reduce){
          .ph-e,.ph-v,.ph-x,.ph-h { animation:none!important; }
          .ph-e { opacity:1; transform:none; }
          .ph-x { opacity:0; }
          .ph-h { opacity:0; }
        }
      `}</style>

      <div className="sc-scene">
        {/* Cards row — left side, fixed widths, never collapses */}
        <div className="sc-row">
          {CARDS.map((card, i) => (
            <div key={`c${i}-s${step}`} className={`sc-card ph-${phases[i]}`}>
              <div className={`sc-ribbon ${card.ribbon}`} />
              <div className="sc-icon-wrap">{card.icon}</div>
              <div className="sc-label">{card.label}</div>
              <div className="sc-title">{card.title}</div>
              <div className="sc-sub">{card.sub}</div>
              <div className="sc-list">
                {card.items.map((item, j) => (
                  <div className="sc-li" key={j}>
                    <span className="sc-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="sc-btn" onClick={handleExplore}>Explore →</button>
            </div>
          ))}
        </div>

        {/* Avatar — always right, always on top of any card that extends under it */}
        <div className="sc-av" aria-label="IVS Kid Avatar">
          <img src="/images/kid-avatar.png" alt="IVS Kid Avatar" draggable={false} />
        </div>
      </div>
    </div>
  );
};

export default IVSAvatarShowcase;