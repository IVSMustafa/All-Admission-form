import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Calendar,
  ShieldCheck,
  GraduationCap,
  Globe2,
  Headphones,
  BookOpen,
  Users,
  Laptop2,
  BadgeCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import IVSAvatarShowcase from "./IVSAvatarShowcase";

/* ─── Animated counter ─── */
function useCounter(target: number, duration = 1600, start = false) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame: number;
    const s = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - s) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return val;
}

interface HeroCardProps {
  grade: string;
  curriculum: string;
  country: string;
  onStartTrial: () => void;
  onBookConsultation: () => void;
  onQuickSelect: (field: string, value: string) => void;
}

type PremiumIconSpec = {
  icon: React.ReactNode;
  title: string;
  sub: string;
  emoji: string;
  color: string;
  soft: string;
  ring: string;
  glow: string;
};

const PremiumIconBox = ({
  icon,
  color,
  soft,
  ring,
  glow,
  size = "md",
}: {
  icon: React.ReactNode;
  color: string;
  soft: string;
  ring: string;
  glow: string;
  size?: "sm" | "md";
}) => {
  const isSmall = size === "sm";

  return (
    <div
      className={`premium-ico ${isSmall ? "premium-ico-sm" : ""}`}
      style={
        {
          "--pi-color": color,
          "--pi-soft": soft,
          "--pi-ring": ring,
          "--pi-glow": glow,
        } as React.CSSProperties
      }
    >
      <div className="premium-ico-back" />
      <div className="premium-ico-orb" />
      <div className="premium-ico-shine" />
      <div className="premium-ico-shine-secondary" />
      <div className="premium-ico-texture" />
      <div className="premium-ico-ring" />
      <div className="premium-ico-inner">{icon}</div>
      <div className="premium-ico-dot" />
    </div>
  );
};

export const HeroCard: React.FC<HeroCardProps> = ({
  onStartTrial,
  onBookConsultation,
}) => {
  const [mounted, setMounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c15 = useCounter(15, 1400, statsVisible);
  const c26 = useCounter(26, 1600, statsVisible);
  const c98 = useCounter(98, 1800, statsVisible);

  const features: PremiumIconSpec[] = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "British Curriculum",
      sub: "KG1 – G7",
      emoji: "🎓",
      color: "#2563eb",
      soft: "rgba(37,99,235,0.12)",
      ring: "rgba(37,99,235,0.18)",
      glow: "rgba(37,99,235,0.22)",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Federal Board",
      sub: "G8 – G12",
      emoji: "🛡️",
      color: "#059669",
      soft: "rgba(5,150,105,0.12)",
      ring: "rgba(5,150,105,0.18)",
      glow: "rgba(5,150,105,0.22)",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "IGCSE / O / A Level",
      sub: "Exam Prep",
      emoji: "📚",
      color: "#ea580c",
      soft: "rgba(234,88,12,0.12)",
      ring: "rgba(234,88,12,0.18)",
      glow: "rgba(234,88,12,0.20)",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Support + Management",
      sub: "24/7 Available",
      emoji: "🎧",
      color: "#7c3aed",
      soft: "rgba(124,58,237,0.12)",
      ring: "rgba(124,58,237,0.18)",
      glow: "rgba(124,58,237,0.22)",
    },
  ];

  const services = [
    {
      icon: <GraduationCap className="w-4.5 h-4.5" />,
      color: "#2563eb",
      soft: "rgba(37,99,235,0.12)",
      ring: "rgba(37,99,235,0.18)",
      glow: "rgba(37,99,235,0.20)",
      name: "School",
      sub: "Full-time",
    },
    {
      icon: <Users className="w-4.5 h-4.5" />,
      color: "#7c3aed",
      soft: "rgba(124,58,237,0.12)",
      ring: "rgba(124,58,237,0.18)",
      glow: "rgba(124,58,237,0.20)",
      name: "Tuition",
      sub: "1-on-1",
    },
    {
      icon: <Laptop2 className="w-4.5 h-4.5" />,
      color: "#0891b2",
      soft: "rgba(8,145,178,0.12)",
      ring: "rgba(8,145,178,0.18)",
      glow: "rgba(8,145,178,0.18)",
      name: "Online Support",
      sub: "Mentor help",
    },
    {
      icon: <BookOpen className="w-4.5 h-4.5" />,
      color: "#ea580c",
      soft: "rgba(234,88,12,0.12)",
      ring: "rgba(234,88,12,0.18)",
      glow: "rgba(234,88,12,0.18)",
      name: "Exam Prep",
      sub: "IGCSE/O/A",
    },
  ];

  return (
    <section className="relative w-full">
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .hero-root {
    --blue: #1d6fce;
    --sky: #0ea5e9;
    --navy: #0f2d57;
    --ink: #111827;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .hero-wrap {
    position: relative;
    border-radius: 32px;
    overflow: hidden;
    border: 1px solid rgba(15,23,42,0.08);
    box-shadow: 0 24px 64px rgba(15,23,42,0.08), 0 4px 12px rgba(15,23,42,0.04);
  }

  .hero-bg-img {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url('/images/herocardbg.png');
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
  }

  .hero-bg-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      105deg,
      rgba(255,255,255,0.72) 0%,
      rgba(245,251,255,0.58) 50%,
      rgba(230,244,255,0.34) 100%
    );
  }

  .hero-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59,130,246,0.45) 40%,
      rgba(14,165,233,0.45) 60%,
      transparent
    );
    z-index: 3;
  }

  .h-enter {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.58s cubic-bezier(0.22,1,0.36,1),
      transform 0.58s cubic-bezier(0.22,1,0.36,1);
  }

  .h-enter.in {
    opacity: 1;
    transform: translateY(0);
  }

  .h-d1 { transition-delay: 0.05s; }
  .h-d2 { transition-delay: 0.12s; }
  .h-d3 { transition-delay: 0.20s; }
  .h-d4 { transition-delay: 0.28s; }
  .h-d5 { transition-delay: 0.37s; }
  .h-d6 { transition-delay: 0.46s; }
  .h-d7 { transition-delay: 0.55s; }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.08));
    border: 1px solid rgba(255,255,255,0.42);
    color: #1e293b;
    font-size: 12.5px;
    font-weight: 700;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.48),
      0 6px 16px rgba(15,23,42,0.06);
    backdrop-filter: blur(12px) saturate(145%);
    -webkit-backdrop-filter: blur(12px) saturate(145%);
    transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
  }

  .hero-pill:hover {
    box-shadow: 0 7px 20px rgba(15,23,42,0.09);
    transform: translateY(-1px);
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    animation: livePulse 2s ease-in-out infinite;
  }

  @keyframes livePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.50); }
    50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
  }

  .hero-h1 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.025em;
    line-height: 1.06;
    color: var(--ink);
    white-space: nowrap;
    font-size: clamp(19px, 3.2vw, 46px);
    overflow: visible;
  }

  .hero-h1 .accent-word {
    position: relative;
    display: inline-block;
    background: linear-gradient(100deg,#1d4ed8,#0ea5e9);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-h1 .muted-word {
    color: #94a3b8;
    font-style: italic;
  }

  /* ───────────────── Premium icon boxes ───────────────── */
  .premium-ico {
    --pi-color: #2563eb;
    --pi-soft: rgba(37,99,235,0.12);
    --pi-ring: rgba(37,99,235,0.18);
    --pi-glow: rgba(37,99,235,0.22);

    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 16px;
    flex-shrink: 0;
    isolation: isolate;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  .premium-ico:hover {
    transform: translateY(-2px);
  }

  .premium-ico-sm {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .premium-ico-back {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at top right, rgba(255,255,255,0.20), transparent 36%),
      linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03));
    border: 1px solid rgba(255,255,255,0.34);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.62),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 6px 14px rgba(15,23,42,0.05),
      0 1px 4px rgba(15,23,42,0.03);
  }

  .premium-ico-orb {
    position: absolute;
    inset: 6px;
    border-radius: 11px;
    background:
      radial-gradient(circle at 28% 20%, rgba(255,255,255,0.92), transparent 45%),
      radial-gradient(circle at 70% 75%, var(--pi-soft), transparent 55%),
      linear-gradient(
        155deg,
        rgba(255,255,255,0.40) 0%,
        var(--pi-soft) 35%,
        rgba(255,255,255,0.35) 65%,
        var(--pi-soft) 100%
      );
  }

  .premium-ico-sm .premium-ico-orb {
    inset: 5px;
    border-radius: 9px;
  }

  .premium-ico-ring {
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: radial-gradient(circle at 50% 0%, var(--pi-glow), transparent 70%);
    opacity: 0;
    z-index: 0;
    transition: opacity 0.3s ease;
  }

  .premium-ico:hover .premium-ico-ring {
    opacity: 0.85;
  }

  .premium-ico-shine {
    position: absolute;
    top: 5px;
    left: 8px;
    width: 52%;
    height: 28%;
    border-radius: 999px;
    background: linear-gradient(
      125deg,
      rgba(255,255,255,0.85) 0%,
      rgba(255,255,255,0.20) 70%,
      transparent
    );
    transform: rotate(-8deg);
    z-index: 1;
  }

  .premium-ico-shine-secondary {
    position: absolute;
    bottom: 7px;
    right: 9px;
    width: 35%;
    height: 18%;
    border-radius: 999px;
    background: linear-gradient(225deg, rgba(255,255,255,0.45) 0%, transparent 65%);
    transform: rotate(12deg);
    z-index: 1;
  }

  .premium-ico-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pi-color);
    z-index: 2;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  .premium-ico:hover .premium-ico-inner {
    transform: scale(1.08);
  }

  .premium-ico-inner svg {
    filter:
      drop-shadow(0 1px 2px rgba(255,255,255,0.80))
      drop-shadow(0 3px 8px rgba(0,0,0,0.08))
      drop-shadow(0 1px 1px var(--pi-glow));
  }

  .premium-ico-dot {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background:
      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), transparent 60%),
      linear-gradient(135deg, #ffffff 0%, color-mix(in srgb, var(--pi-color) 50%, white) 100%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.50),
      0 1px 3px rgba(0,0,0,0.12),
      0 0 8px var(--pi-glow);
    z-index: 3;
  }

  .premium-ico-sm .premium-ico-dot {
    width: 6px;
    height: 6px;
    right: 4px;
    top: 4px;
  }

  .premium-ico-texture {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 1px,
        rgba(255,255,255,0.03) 1px,
        rgba(255,255,255,0.03) 2px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1px,
        rgba(255,255,255,0.03) 1px,
        rgba(255,255,255,0.03) 2px
      );
    opacity: 0.4;
    z-index: 1;
    pointer-events: none;
  }

  /* ── Top glass feature cards ── */
/* ─────────────────────────────────────────────────────────────
   PATCH: Replace ALL existing .feat-* rules in your <style> block
   with these to get the pill-capsule glass look from Image 1
   ───────────────────────────────────────────────────────────── */

.feat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

/* Taller scene to give the thick capsule feel */
.feat-scene {
  perspective: 1400px;
  height: 82px;          /* was 96px – now matches the squat pill proportions */
  cursor: default;
}

.feat-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.feat-scene:hover .feat-card {
  transform: rotateY(180deg);
}

/* ── Shared face base ── */
.feat-face {
  position: absolute;
  inset: 0;

  /* KEY: very large radius = pill / capsule shape */
  border-radius: 28px;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 22px;
  overflow: hidden;
  isolation: isolate;

  /* ── Blue-tinted frosted glass background ── */
  background:
    radial-gradient(ellipse at 18% 30%, rgba(255,255,255,0.52) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 70%, rgba(180,225,255,0.28) 0%, transparent 50%),
    linear-gradient(
      145deg,
      rgba(255,255,255,0.38) 0%,
      rgba(210,238,255,0.28) 35%,
      rgba(185,225,255,0.22) 65%,
      rgba(200,235,255,0.30) 100%
    );
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);

  /* ── Border: bright top, subtle sides ── */
  border: 1px solid rgba(255,255,255,0.60);
  border-bottom-color: rgba(160,210,245,0.35);

  /* ── Deep 3-D shadow that gives the "thick slab" illusion ── */
  box-shadow:
    /* top inner highlight */
    inset 0 2px 0   rgba(255,255,255,0.90),
    /* bottom inner shadow */
    inset 0 -3px 0  rgba(140,195,235,0.30),
    /* left edge glow */
    inset 3px 0 6px rgba(255,255,255,0.18),
    /* ambient lift */
    0  6px  0   rgba(140,195,235,0.55),
    0 10px  4px rgba(100,170,220,0.28),
    0 18px 14px rgba(90,160,215,0.18),
    0 28px 24px rgba(80,150,210,0.10),
    /* crisp colour drop-shadow for depth */
    0  4px 18px rgba(100,175,230,0.22);

  transition:
    box-shadow 0.22s,
    border-color 0.22s;
}

/* ── Top gloss streak (the bright horizontal sheen across the top) ── */
.feat-face::after {
  content: "";
  position: absolute;
  left: 22px;
  right: 22px;
  top: 8px;
  height: 20px;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.88) 0%,
    rgba(255,255,255,0.10) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* ── Gradient border ring (the animated rim on ::before) ── */
.feat-face::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.96) 0%,
    rgba(200,235,255,0.70) 18%,
    rgba(150,210,245,0.30) 38%,
    rgba(255,255,255,0.08) 52%,
    rgba(140,205,245,0.30) 70%,
    rgba(205,238,255,0.72) 88%,
    rgba(255,255,255,0.96) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.feat-face.front {
  /* nothing extra needed – base styles cover it */
}

.feat-face.back {
  transform: rotateY(180deg);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  text-align: center;
}

.feat-scene:hover .feat-face {
  border-color: rgba(255,255,255,0.68);
  box-shadow:
    inset 0 2px 0   rgba(255,255,255,0.95),
    inset 0 -3px 0  rgba(140,195,235,0.36),
    inset 3px 0 6px rgba(255,255,255,0.22),
    0  6px  0   rgba(130,188,230,0.60),
    0 12px  6px rgba(100,170,220,0.32),
    0 20px 16px rgba(90,160,215,0.20),
    0 32px 28px rgba(80,150,210,0.12),
    0  4px 20px rgba(100,175,230,0.26);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .feat-grid  { grid-template-columns: 1fr; }
  .feat-scene { height: 76px; }
}

  /* ── CTA buttons ── */
  .hero-cta-p {
    position: relative;
    overflow: hidden;
    border-radius: 999px;
    padding: 12px 24px;
    background: linear-gradient(100deg,#1d6fce,#0ea5e9);
    color: white;
    font-weight: 800;
    font-size: 14px;
    box-shadow: 0 10px 28px rgba(29,111,206,0.26);
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .hero-cta-p::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 55%;
    height: 100%;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
    transition: left 0.5s;
  }

  .hero-cta-p:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(29,111,206,0.32);
  }

  .hero-cta-p:hover::after {
    left: 160%;
  }

  .hero-cta-s {
    border-radius: 999px;
    padding: 12px 22px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07));
    border: 1px solid rgba(255,255,255,0.34);
    color: #1e293b;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    backdrop-filter: blur(12px) saturate(145%);
    -webkit-backdrop-filter: blur(12px) saturate(145%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.44),
      0 6px 16px rgba(15,23,42,0.06);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .hero-cta-s:hover {
    transform: translateY(-1px);
    background: white;
    box-shadow: 0 8px 24px rgba(15,23,42,0.09);
  }

  /* ── Services ── */
  .svc-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 9px;
  }

  .svc-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 12px;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.28);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.34),
      inset 0 -1px 0 rgba(255,255,255,0.03),
      0 10px 24px rgba(15,23,42,0.05),
      0 2px 8px rgba(15,23,42,0.025);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    cursor: default;
  }

  .svc-chip::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.58),
      rgba(255,255,255,0.12) 38%,
      rgba(255,255,255,0.05) 65%,
      rgba(255,255,255,0.42) 100%
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .svc-chip::after {
    content: "";
    position: absolute;
    left: 12px;
    right: 12px;
    top: 6px;
    height: 34%;
    border-radius: 999px;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.55),
      rgba(255,255,255,0.02)
    );
    opacity: 0.88;
    pointer-events: none;
  }

  .svc-chip:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.38);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.42),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 14px 30px rgba(15,23,42,0.06),
      0 4px 12px rgba(15,23,42,0.03);
  }

  /* ── Stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 9px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 15px;
    border-radius: 18px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.28);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.34),
      inset 0 -1px 0 rgba(255,255,255,0.03),
      0 10px 24px rgba(15,23,42,0.05),
      0 2px 8px rgba(15,23,42,0.025);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }

  .stat-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.58),
      rgba(255,255,255,0.12) 38%,
      rgba(255,255,255,0.05) 65%,
      rgba(255,255,255,0.42) 100%
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 1;
  }

  .stat-card::after {
    content: "";
    position: absolute;
    left: 12px;
    right: 12px;
    top: 6px;
    height: 34%;
    border-radius: 999px;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.55),
      rgba(255,255,255,0.02)
    );
    opacity: 0.88;
    pointer-events: none;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.42),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      0 14px 28px rgba(15,23,42,0.07),
      0 4px 12px rgba(15,23,42,0.03);
  }

  .stat-ico {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-val {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 24px;
    line-height: 1;
    color: var(--ink);
    letter-spacing: -0.03em;
  }

  .stat-lbl {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    margin-top: 2px;
  }

  .hero-div {
    height: 1px;
    background: linear-gradient(90deg,transparent,rgba(15,23,42,0.09) 30%,rgba(15,23,42,0.09) 70%,transparent);
  }

  .hero-av-col {
    overflow: visible !important;
    align-self: stretch;
    display: flex;
    align-items: flex-end;
  }

  .hero-av-sink {
    overflow: visible;
    margin-bottom: -48px;
    position: relative;
    z-index: 20;
    width: 100%;
  }

  @media (max-width:1024px) {
    .svc-grid { grid-template-columns: repeat(2,1fr); }
    .stats-grid { grid-template-columns: 1fr; }
  }

  @media (max-width:768px) {
    .feat-grid { grid-template-columns: 1fr; }
    .svc-grid { grid-template-columns: repeat(2,1fr); }
    .feat-scene { height: 88px; }
    .hero-h1 { font-size: clamp(16px, 5vw, 34px); white-space: normal; }
  }

  @media (max-width:640px) {
    .svc-grid { grid-template-columns: 1fr 1fr; }
    .hero-cta-p,
    .hero-cta-s { width: 100%; justify-content: center; }
    .stats-grid { grid-template-columns: 1fr; }
  }
`}</style>

      <div className="hero-root hero-wrap">
        <div className="hero-bg-img" aria-hidden="true" />
        <div className="hero-bg-overlay" aria-hidden="true" />
        <div className="hero-shine" />

        <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-7">
              <div className={`h-enter h-d1 ${mounted ? "in" : ""} flex flex-wrap gap-2.5 items-center`}>
                <span className="hero-pill">
                  <span className="live-dot" />
                  Admissions Open 2026
                </span>
                <span className="hero-pill">
                  <span style={{ fontSize: 14 }}>🖥️</span>
                  Live on Zoom
                </span>
                <span className="hero-pill">
                  <span style={{ fontSize: 14 }}>📅</span>
                  Sun – Thu
                </span>
              </div>

              <div className={`h-enter h-d2 ${mounted ? "in" : ""}`}>
                <h1 className="hero-h1">
                  Start 3-Day Free Trial{" "}
                  <span className="accent-word">Classes</span>{" "}
                  <span className="muted-word">(Live on Zoom)</span>
                </h1>
                <p className="mt-4 text-[14.5px] leading-[1.8] text-slate-500 max-w-xl">
                  Full-time online schooling{" "}
                  <strong className="text-slate-700 font-semibold">(KG1 – Grade 12)</strong>{" "}
                  with British Curriculum, Federal Board &amp; IGCSE/O/A Level.
                  Managed in Pakistan with qualified teachers globally.
                </p>
              </div>

              <div className={`h-enter h-d3 ${mounted ? "in" : ""} feat-grid`}>
                {features.map((f) => (
                  <div key={f.title} className="feat-scene">
                    <div className="feat-card">
                      <div className="feat-face front">
                        <PremiumIconBox
                          icon={f.icon}
                          color={f.color}
                          soft={f.soft}
                          ring={f.ring}
                          glow={f.glow}
                        />
                        <div>
                          <div className="text-[13px] font-extrabold text-slate-800 leading-tight">
                            {f.title}
                          </div>
                          <div className="text-[11.5px] font-semibold text-slate-400 mt-0.5">
                            {f.sub}
                          </div>
                        </div>
                      </div>

                      <div className="feat-face back">
                        <div className="text-[22px]">{f.emoji}</div>
                        <div className="text-[12px] font-bold text-sky-700">{f.title}</div>
                        <div className="text-[10.5px] text-slate-500 font-medium">{f.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`h-enter h-d4 ${mounted ? "in" : ""} flex flex-wrap gap-3 items-center`}>
                <button onClick={onStartTrial} className="hero-cta-p">
                  <Play className="w-4 h-4" />
                  Start Free Trial
                </button>
                <button onClick={onBookConsultation} className="hero-cta-s">
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </button>
              </div>

              <div className="hero-div" />

              <div className={`h-enter h-d5 ${mounted ? "in" : ""}`}>
                <p className="text-[10.5px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Our Services
                </p>
                <div className="svc-grid">
                  {services.map((s) => (
                    <div key={s.name} className="svc-chip">
                      <PremiumIconBox
                        icon={s.icon}
                        color={s.color}
                        soft={s.soft}
                        ring={s.ring}
                        glow={s.glow}
                        size="sm"
                      />
                      <div>
                        <div className="text-[12.5px] font-extrabold text-slate-800 leading-tight">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {s.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-div" />

              <div ref={statsRef} className={`h-enter h-d6 ${mounted ? "in" : ""} stats-grid`}>
                {[
                  {
                    ico: <BadgeCheck className="w-5 h-5" />,
                    bg: "rgba(2,132,199,0.09)",
                    bd: "rgba(2,132,199,0.16)",
                    line: "linear-gradient(90deg,#0284c7,#38bdf8)",
                    c: "#0284c7",
                    val: c15,
                    sfx: "+",
                    lbl: "Years experience",
                  },
                  {
                    ico: <Globe2 className="w-5 h-5" />,
                    bg: "rgba(5,150,105,0.09)",
                    bd: "rgba(5,150,105,0.16)",
                    line: "linear-gradient(90deg,#059669,#34d399)",
                    c: "#059669",
                    val: c26,
                    sfx: "K",
                    lbl: "Students reached",
                  },
                  {
                    ico: <ShieldCheck className="w-5 h-5" />,
                    bg: "rgba(99,102,241,0.09)",
                    bd: "rgba(99,102,241,0.16)",
                    line: "linear-gradient(90deg,#6366f1,#a5b4fc)",
                    c: "#6366f1",
                    val: c98,
                    sfx: "%",
                    lbl: "Parent satisfaction",
                  },
                ].map((s) => (
                  <div key={s.lbl} className="stat-card">
                    <style>{`.stat-card:hover::before { background: ${s.line}; }`}</style>
                    <div
                      className="stat-ico"
                      style={{
                        background: s.bg,
                        border: `1px solid ${s.bd}`,
                        color: s.c,
                      }}
                    >
                      {s.ico}
                    </div>
                    <div>
                      <div className="stat-val">
                        {s.val}
                        {s.sfx}
                      </div>
                      <div className="stat-lbl">{s.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`hidden lg:flex lg:col-span-5 hero-av-col h-enter h-d7 ${mounted ? "in" : ""}`}>
              <div className="hero-av-sink">
                <IVSAvatarShowcase />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCard;