import React, { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onSchoolTrial?: () => void;
  onTuitionTrial?: () => void;
  onQuranTrial?: () => void;
  onNavigate?: (section: "school-trial" | "tuition-trial" | "quran-trial") => void;
}

const NAV_ITEMS = [
  { label: "School Free Trial", key: "school", emoji: "🏫" },
  { label: "Tuition Trial Class", key: "tuition", emoji: "👤" },
  { label: "Quran Trial Classes", key: "quran", emoji: "📖" },
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

        .ivs-nav-outer {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 10px 12px 0;
          font-family: 'DM Sans', system-ui, sans-serif;
          opacity: 0;
          transform: translateY(-14px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }

        .ivs-nav-outer.in {
          opacity: 1;
          transform: translateY(0);
        }

        .ivs-nav-shell {
          max-width: 1440px;
          margin: 0 auto;
        }

        .ivs-nav-bar {
          border-radius: 24px;
          border: 1px solid rgba(15,23,42,0.08);
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          box-shadow:
            0 4px 24px rgba(15,23,42,0.07),
            0 1px 4px rgba(15,23,42,0.04),
            inset 0 1px 0 rgba(255,255,255,0.90);
          transition: box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
          display: flex;
          align-items: center;
          padding: 14px 18px;
          gap: 14px;
          position: relative;
          overflow: hidden;
        }

        .ivs-nav-bar.scrolled {
          box-shadow:
            0 8px 32px rgba(15,23,42,0.10),
            0 2px 8px rgba(15,23,42,0.05),
            inset 0 1px 0 rgba(255,255,255,0.90);
          background: rgba(255,255,255,0.92);
        }

        .ivs-nav-bar::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(29,111,206,0.35) 35%,
            rgba(14,165,233,0.35) 65%,
            transparent 100%
          );
        }

        .ivs-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          text-decoration: none;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 14px;
          transition: background 0.2s ease;
          min-width: 0;
        }

        .ivs-logo:hover {
          background: rgba(29,111,206,0.06);
        }

        .ivs-logo-ring {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(15,23,42,0.08);
          flex-shrink: 0;
          overflow: hidden;
        }

        .ivs-logo-ring img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .ivs-logo-text {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(110deg, #7b1736 0%, #b91c4d 60%, #9b1d40 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          white-space: nowrap;
        }

        .ivs-nav-gap {
          flex: 1;
        }

        .ivs-nav-items {
          position: relative;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .ivs-slide-pill {
          position: absolute;
          top: 0;
          height: 100%;
          border-radius: 12px;
          background: rgba(29,111,206,0.08);
          transition:
            left 0.28s cubic-bezier(0.22,1,0.36,1),
            width 0.28s cubic-bezier(0.22,1,0.36,1),
            opacity 0.2s;
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
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          color: #334155;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .ivs-nav-btn:hover {
          color: #1d6fce;
        }

        .ivs-nav-btn.active {
          color: #1d6fce;
        }

        .ivs-nav-emoji {
          font-size: 18px;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
          line-height: 1;
        }

        .ivs-nav-btn:hover .ivs-nav-emoji {
          transform: scale(1.18) rotate(-5deg);
        }

        .ivs-nav-cta {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-left: 8px;
          padding: 14px 24px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(100deg, #1d6fce 0%, #0ea5e9 100%);
          color: white;
          font-family: inherit;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(29,111,206,0.26);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ivs-nav-cta::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0.5s ease;
        }

        .ivs-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 26px rgba(29,111,206,0.30);
        }

        .ivs-nav-cta:hover::after {
          left: 160%;
        }

        .ivs-nav-cta:active {
          transform: translateY(0);
        }

        .ivs-cta-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.90);
          animation: ctaPulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes ctaPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.72); }
        }

        .ivs-mobile-toggle {
          display: none;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          border: 1px solid rgba(15,23,42,0.08);
          background: rgba(255,255,255,0.78);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #334155;
          flex-shrink: 0;
        }

        .ivs-mobile-menu {
          display: none;
        }

        @media (max-width: 1100px) {
          .ivs-logo-text {
            font-size: 20px;
          }

          .ivs-nav-btn {
            padding: 11px 13px;
            font-size: 13px;
          }

          .ivs-nav-cta {
            padding: 12px 18px;
            font-size: 14px;
          }
        }

        @media (max-width: 900px) {
          .ivs-nav-bar {
            padding: 12px 14px;
            border-radius: 20px;
            gap: 10px;
          }

          .ivs-logo-ring {
            width: 50px;
            height: 50px;
          }

          .ivs-logo-ring img {
            width: 34px;
            height: 34px;
          }

          .ivs-logo-text {
            font-size: 18px;
          }

          .ivs-nav-items,
          .ivs-nav-cta {
            display: none;
          }

          .ivs-mobile-toggle {
            display: inline-flex;
            margin-left: auto;
          }

          .ivs-mobile-menu {
            display: block;
            margin-top: 10px;
            border-radius: 20px;
            border: 1px solid rgba(15,23,42,0.08);
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow:
              0 10px 28px rgba(15,23,42,0.08),
              0 2px 8px rgba(15,23,42,0.04);
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transform: translateY(-8px);
            pointer-events: none;
            transition:
              max-height 0.3s ease,
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
            border-radius: 14px;
            border: 1px solid rgba(15,23,42,0.06);
            background: rgba(255,255,255,0.76);
            color: #334155;
            font-family: inherit;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            text-align: left;
            transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
          }

          .ivs-mobile-btn:hover {
            background: rgba(29,111,206,0.08);
            color: #1d6fce;
            transform: translateY(-1px);
          }

          .ivs-mobile-btn.active {
            background: rgba(29,111,206,0.10);
            color: #1d6fce;
          }

          .ivs-mobile-emoji {
            font-size: 18px;
            line-height: 1;
          }

          .ivs-mobile-cta {
            margin-top: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 18px;
            border-radius: 999px;
            border: none;
            background: linear-gradient(100deg, #1d6fce 0%, #0ea5e9 100%);
            color: white;
            font-family: inherit;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(29,111,206,0.20);
          }
        }

        @media (max-width: 560px) {
          .ivs-nav-outer {
            padding: 8px 10px 0;
          }

          .ivs-nav-bar {
            border-radius: 18px;
            padding: 10px 12px;
          }

          .ivs-logo {
            gap: 10px;
            padding: 4px 4px;
          }

          .ivs-logo-ring {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }

          .ivs-logo-ring img {
            width: 28px;
            height: 28px;
          }

          .ivs-logo-text {
            font-size: 16px;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .ivs-mobile-toggle {
            width: 42px;
            height: 42px;
            border-radius: 12px;
          }
        }

        @media (max-width: 420px) {
          .ivs-logo-text {
            display: none;
          }
        }
      `}</style>

      <div className={`ivs-nav-outer ${mounted ? "in" : ""}`}>
        <div className="ivs-nav-shell">
          <nav className={`ivs-nav-bar ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
            <div
              className="ivs-logo"
              role="button"
              tabIndex={0}
              onClick={() => triggerAction("school")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") triggerAction("school");
              }}
            >
              <div className="ivs-logo-ring">
                <img src="/images/ivs-logo.png" alt="IVS Logo" />
              </div>
              <span className="ivs-logo-text">Iqra Virtual School</span>
            </div>

            <div className="ivs-nav-gap" />

            <div ref={navRef} className="ivs-nav-items">
              <div
                className={`ivs-slide-pill ${hoverKey || activeKey ? "show" : ""}`}
                style={{ left: pillStyle.left, width: pillStyle.width }}
              />

              {NAV_ITEMS.map((item) => (
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
                  <span className="ivs-nav-emoji">{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <button
              className="ivs-nav-cta"
              type="button"
              onClick={() => triggerAction("school")}
            >
              <span className="ivs-cta-dot" />
              Enroll Now
            </button>

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
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`ivs-mobile-btn ${activeKey === item.key ? "active" : ""}`}
                  onClick={() => triggerAction(item.key)}
                >
                  <span className="ivs-mobile-emoji">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                type="button"
                className="ivs-mobile-cta"
                onClick={() => triggerAction("school")}
              >
                <span className="ivs-cta-dot" />
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;