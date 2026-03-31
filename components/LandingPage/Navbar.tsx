import React, { useEffect, useRef, useState } from "react";
import { Menu, X, School, UserRound, BookOpen } from "lucide-react";

interface NavbarProps {
  onSchoolTrial?: () => void;
  onTuitionTrial?: () => void;
  onQuranTrial?: () => void;
  onNavigate?: (section: "school-trial" | "tuition-trial" | "quran-trial") => void;
}

const NAV_ITEMS = [
  { label: "School Free Trial", key: "school", Icon: School },
  { label: "Tuition Trial Class", key: "tuition", Icon: UserRound },
  { label: "Quran Trial Classes", key: "quran", Icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({
  onSchoolTrial,
  onTuitionTrial,
  onQuranTrial,
  onNavigate,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updatePill = () => {
      const key = hoverKey ?? activeKey;
      if (!key) {
        setPillStyle({ left: 0, width: 0 });
        return;
      }

      const btn = itemRefs.current[key];
      const nav = navRef.current;
      if (!btn || !nav) return;

      const bRect = btn.getBoundingClientRect();
      const nRect = nav.getBoundingClientRect();

      setPillStyle({
        left: bRect.left - nRect.left,
        width: bRect.width,
      });
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [hoverKey, activeKey]);

  const triggerAction = (key: string) => {
    setActiveKey(key);
    setMobileOpen(false);

    if (key === "school") {
      if (onNavigate) onNavigate("school-trial");
      else onSchoolTrial?.();
      return;
    }

    if (key === "tuition") {
      if (onNavigate) onNavigate("tuition-trial");
      else onTuitionTrial?.();
      return;
    }

    if (key === "quran") {
      if (onNavigate) onNavigate("quran-trial");
      else onQuranTrial?.();
      return;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes ivsNavFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-16px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ivsNavGlow {
          0%, 100% {
            box-shadow:
              0 18px 48px rgba(15,23,42,0.06),
              0 6px 20px rgba(15,23,42,0.04),
              inset 0 1px 0 rgba(255,255,255,0.92);
          }
          50% {
            box-shadow:
              0 24px 62px rgba(15,23,42,0.08),
              0 10px 24px rgba(15,23,42,0.05),
              inset 0 1px 0 rgba(255,255,255,0.94);
          }
        }

        @keyframes ivsShineSweep {
          0% {
            transform: translateX(-140%) skewX(-20deg);
            opacity: 0;
          }
          18% {
            opacity: 0.18;
          }
          100% {
            transform: translateX(220%) skewX(-20deg);
            opacity: 0;
          }
        }

        @keyframes ivsFloatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .ivs-nav-outer {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 12px 14px 0;
          font-family: 'DM Sans', system-ui, sans-serif;
          opacity: 0;
          transform: translateY(-16px);
        }

        .ivs-nav-outer.in {
          animation: ivsNavFadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ivs-nav-shell {
          max-width: 1480px;
          margin: 0 auto;
        }

        .ivs-nav-bar {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 16px 18px;
          border-radius: 30px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.84));
          backdrop-filter: blur(22px) saturate(1.35);
          -webkit-backdrop-filter: blur(22px) saturate(1.35);
          box-shadow:
            0 18px 48px rgba(15,23,42,0.06),
            0 6px 20px rgba(15,23,42,0.04),
            inset 0 1px 0 rgba(255,255,255,0.92);
          transition: transform 0.25s ease, background 0.25s ease;
          animation: ivsNavGlow 6s ease-in-out infinite;
        }

        .ivs-nav-bar.scrolled {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,255,255,0.90));
        }

        .ivs-nav-bar::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(29,111,206,0.18) 18%,
            rgba(14,165,233,0.30) 52%,
            rgba(29,111,206,0.18) 82%,
            transparent 100%
          );
        }

        .ivs-nav-bar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.00) 35%,
            rgba(255,255,255,0.16) 50%,
            rgba(255,255,255,0.00) 65%,
            transparent 100%
          );
          animation: ivsShineSweep 6.5s ease-in-out infinite;
          pointer-events: none;
        }

        .ivs-nav-orb {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(14,165,233,0.08), transparent 68%);
          pointer-events: none;
        }

        .ivs-nav-orb.left {
          top: -110px;
          left: -70px;
        }

        .ivs-nav-orb.right {
          top: -90px;
          right: -40px;
        }

        .ivs-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex-shrink: 0;
          padding: 4px 6px;
          border-radius: 18px;
          position: relative;
          z-index: 2;
        }

        .ivs-logo-ring {
          width: 78px;
          height: 78px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0.99), rgba(247,250,255,0.90));
          border: 1px solid rgba(15,23,42,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 12px 28px rgba(15,23,42,0.08),
            inset 0 1px 0 rgba(255,255,255,0.96);
          overflow: hidden;
          flex-shrink: 0;
          animation: ivsFloatIcon 4s ease-in-out infinite;
        }

        .ivs-logo-ring img {
          width: 56px;
          height: 56px;
          object-fit: contain;
        }

        .ivs-logo-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          line-height: 1.05;
        }

        .ivs-logo-text {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          background: linear-gradient(110deg, #7b1736 0%, #b91c4d 58%, #9b1d40 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          white-space: nowrap;
        }

        .ivs-logo-sub {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #7a879a;
          white-space: nowrap;
        }

        .ivs-nav-gap {
          flex: 1;
        }

        .ivs-nav-items {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px;
          border-radius: 22px;
          background: rgba(248,250,252,0.88);
          border: 1px solid rgba(15,23,42,0.05);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.82);
          z-index: 2;
        }

        .ivs-slide-pill {
          position: absolute;
          top: 6px;
          bottom: 6px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(29,111,206,0.14), rgba(14,165,233,0.10));
          box-shadow:
            0 10px 22px rgba(29,111,206,0.10),
            inset 0 1px 0 rgba(255,255,255,0.78);
          transition:
            left 0.30s cubic-bezier(0.22,1,0.36,1),
            width 0.30s cubic-bezier(0.22,1,0.36,1),
            opacity 0.2s ease;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
        }

        .ivs-slide-pill.show {
          opacity: 1;
        }

        .ivs-nav-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 54px;
          padding: 0 18px;
          border: none;
          border-radius: 16px;
          background: transparent;
          color: #334155;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.22s ease, transform 0.22s ease;
        }

        .ivs-nav-btn:hover {
          color: #0f5fbd;
          transform: translateY(-1px);
        }

        .ivs-nav-btn.active {
          color: #0f5fbd;
        }

        .ivs-nav-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(29,111,206,0.08);
          color: #1d6fce;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), background 0.2s ease;
          flex-shrink: 0;
        }

        .ivs-nav-btn:hover .ivs-nav-icon-wrap,
        .ivs-nav-btn.active .ivs-nav-icon-wrap {
          transform: scale(1.08);
          background: rgba(29,111,206,0.14);
        }

        .ivs-mobile-toggle {
          display: none;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(15,23,42,0.08);
          background: linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,250,252,0.90));
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(15,23,42,0.06);
          flex-shrink: 0;
          z-index: 2;
        }

        .ivs-mobile-menu {
          display: none;
        }

        @media (max-width: 1180px) {
          .ivs-logo-text {
            font-size: 22px;
          }

          .ivs-nav-btn {
            padding: 0 14px;
            font-size: 13px;
          }
        }

        @media (max-width: 960px) {
          .ivs-nav-bar {
            padding: 14px;
            border-radius: 24px;
            gap: 12px;
          }

          .ivs-logo-ring {
            width: 68px;
            height: 68px;
            border-radius: 18px;
          }

          .ivs-logo-ring img {
            width: 46px;
            height: 46px;
          }

          .ivs-logo-text {
            font-size: 20px;
          }

          .ivs-logo-sub {
            font-size: 11px;
          }

          .ivs-nav-items {
            display: none;
          }

          .ivs-mobile-toggle {
            display: inline-flex;
            margin-left: auto;
          }

          .ivs-mobile-menu {
            display: block;
            margin-top: 12px;
            border-radius: 22px;
            border: 1px solid rgba(15,23,42,0.08);
            background:
              linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,255,255,0.90));
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow:
              0 18px 38px rgba(15,23,42,0.08),
              0 4px 12px rgba(15,23,42,0.04);
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transform: translateY(-8px);
            pointer-events: none;
            transition:
              max-height 0.32s ease,
              opacity 0.25s ease,
              transform 0.25s ease;
          }

          .ivs-mobile-menu.open {
            max-height: 420px;
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }

          .ivs-mobile-inner {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .ivs-mobile-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 14px 14px;
            border-radius: 16px;
            border: 1px solid rgba(15,23,42,0.06);
            background: rgba(255,255,255,0.78);
            color: #334155;
            font-family: inherit;
            font-size: 14px;
            font-weight: 800;
            text-align: left;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
          }

          .ivs-mobile-btn:hover {
            background: rgba(29,111,206,0.08);
            color: #1d6fce;
            transform: translateY(-1px);
          }

          .ivs-mobile-btn.active {
            background: linear-gradient(135deg, rgba(29,111,206,0.10), rgba(14,165,233,0.08));
            color: #1d6fce;
          }

          .ivs-mobile-icon-wrap {
            width: 34px;
            height: 34px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(29,111,206,0.08);
            color: #1d6fce;
            flex-shrink: 0;
          }
        }

        @media (max-width: 560px) {
          .ivs-nav-outer {
            padding: 8px 10px 0;
          }

          .ivs-nav-bar {
            border-radius: 20px;
            padding: 12px;
          }

          .ivs-logo {
            gap: 10px;
            padding: 2px;
          }

          .ivs-logo-ring {
            width: 58px;
            height: 58px;
            border-radius: 14px;
          }

          .ivs-logo-ring img {
            width: 38px;
            height: 38px;
          }

          .ivs-logo-text {
            font-size: 17px;
            max-width: 170px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .ivs-logo-sub {
            font-size: 10px;
            max-width: 170px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .ivs-mobile-toggle {
            width: 44px;
            height: 44px;
            border-radius: 14px;
          }
        }

        @media (max-width: 420px) {
          .ivs-logo-text {
            font-size: 15px;
            max-width: 135px;
          }

          .ivs-logo-sub {
            font-size: 9px;
            max-width: 135px;
          }
        }
      `}</style>

      <div className={`ivs-nav-outer ${mounted ? "in" : ""}`}>
        <div className="ivs-nav-shell">
          <nav className={`ivs-nav-bar ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
            <span className="ivs-nav-orb left" />
            <span className="ivs-nav-orb right" />

            <div className="ivs-logo">
              <div className="ivs-logo-ring">
                <img src="/images/ivs-logo.png" alt="IVS Logo" />
              </div>

              <div className="ivs-logo-copy">
                <span className="ivs-logo-text">Iqra Virtual School</span>
                <span className="ivs-logo-sub">Pakistan First Online School</span>
              </div>
            </div>

            <div className="ivs-nav-gap" />

            <div ref={navRef} className="ivs-nav-items">
              <div
                className={`ivs-slide-pill ${hoverKey || activeKey ? "show" : ""}`}
                style={{ left: pillStyle.left, width: pillStyle.width }}
              />

              {NAV_ITEMS.map((item) => {
                const Icon = item.Icon;
                return (
                  <button
                    key={item.key}
                    ref={(el) => {
                      itemRefs.current[item.key] = el;
                    }}
                    className={`ivs-nav-btn ${activeKey === item.key ? "active" : ""}`}
                    onMouseEnter={() => setHoverKey(item.key)}
                    onMouseLeave={() => setHoverKey(null)}
                    onClick={() => triggerAction(item.key)}
                    type="button"
                  >
                    <span className="ivs-nav-icon-wrap">
                      <Icon className="w-4 h-4" />
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="ivs-mobile-toggle"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          <div className={`ivs-mobile-menu ${mobileOpen ? "open" : ""}`}>
            <div className="ivs-mobile-inner">
              {NAV_ITEMS.map((item) => {
                const Icon = item.Icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`ivs-mobile-btn ${activeKey === item.key ? "active" : ""}`}
                    onClick={() => triggerAction(item.key)}
                  >
                    <span className="ivs-mobile-icon-wrap">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;