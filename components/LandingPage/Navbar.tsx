import React, { useEffect, useRef, useState } from "react";
import { Menu, X, School, UserRound, BookOpen } from "lucide-react";

interface NavbarProps {
  onSchoolTrial?: () => void;
  onTuitionTrial?: () => void;
  onQuranTrial?: () => void;
  onNavigate?: (
    section: "school-trial" | "tuition-trial" | "quran-trial"
  ) => void;
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

        @keyframes ivsShineSweep {
          0% {
            transform: translateX(-140%) skewX(-18deg);
            opacity: 0;
          }
          20% {
            opacity: 0.15;
          }
          100% {
            transform: translateX(220%) skewX(-18deg);
            opacity: 0;
          }
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
  width: min(100%, 1380px);
  margin: 0 auto;
}
.ivs-nav-bar {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.6vw, 18px);
  padding: clamp(12px, 1.8vw, 20px) clamp(14px, 2vw, 24px);
  border-radius: clamp(20px, 2.2vw, 34px);
  border: 1px solid rgba(255,255,255,0.45);
  background: transparent;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.45),
    inset 0 -1px 0 rgba(255,255,255,0.06),
    0 18px 38px rgba(15,23,42,0.04),
    0 4px 14px rgba(15,23,42,0.03);
  transition: all 0.25s ease;
  min-width: 0;
}

.ivs-nav-bar.scrolled {
  background: transparent;
  border-color: rgba(255,255,255,0.55);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.5),
    inset 0 -1px 0 rgba(255,255,255,0.08),
    0 20px 40px rgba(15,23,42,0.05),
    0 4px 14px rgba(15,23,42,0.03);
}

        .ivs-nav-bar::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(
              115deg,
              rgba(150, 205, 255, 0.20) 0%,
              rgba(255,255,255,0.12) 25%,
              rgba(186, 230, 253, 0.20) 50%,
              rgba(253, 186, 233, 0.18) 75%,
              rgba(196, 181, 253, 0.20) 100%
            );
          opacity: 0.9;
          mix-blend-mode: screen;
        }

        .ivs-nav-bar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.00) 36%,
            rgba(255,255,255,0.16) 50%,
            rgba(255,255,255,0.00) 64%,
            transparent 100%
          );
          animation: ivsShineSweep 6.5s ease-in-out infinite;
          pointer-events: none;
        }

.ivs-logo {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.2vw, 16px);
  min-width: 0;
  flex: 1 1 auto;
  position: relative;
  z-index: 2;
}

.ivs-logo-ring {
  position: relative;
  width: clamp(52px, 6vw, 88px);
  height: clamp(52px, 6vw, 88px);
  border-radius: clamp(16px, 2vw, 24px);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.88), rgba(245,249,255,0.68));
          border: 1px solid rgba(255,255,255,0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.92),
            inset 0 -1px 0 rgba(255,255,255,0.12),
            0 12px 24px rgba(15,23,42,0.06),
            0 4px 10px rgba(15,23,42,0.04);
        }

        .ivs-logo-ring::before {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          top: 8px;
          height: 15px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.94),
            rgba(255,255,255,0.16)
          );
          pointer-events: none;
        }

.ivs-logo-ring img {
  width: clamp(34px, 4vw, 58px);
  height: clamp(34px, 4vw, 58px);
          object-fit: contain;
          position: relative;
          z-index: 1;
        }

.ivs-logo-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  line-height: 1.08;
  flex: 1 1 auto;
}

.ivs-logo-text {
  font-size: clamp(15px, 2vw, 26px);
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(110deg, #8d183d 0%, #b21f51 58%, #9b1d40 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.05;
}
.ivs-logo-sub {
  margin-top: 4px;
  font-size: clamp(9px, 1vw, 13px);
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #7a879a;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.2;
}
.ivs-nav-gap {
  flex: 0 1 16px;
}

.ivs-nav-items {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  flex-shrink: 0;
  max-width: 100%;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.60), rgba(244,248,255,0.46));
          border: 1px solid rgba(255,255,255,0.78);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.88),
            inset 0 -1px 0 rgba(255,255,255,0.10),
            0 8px 18px rgba(15,23,42,0.04);
          z-index: 2;
          overflow: hidden;
        }

        .ivs-slide-pill {
          position: absolute;
          top: 8px;
          bottom: 8px;
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.64), rgba(232,242,255,0.42));
          border: 1px solid rgba(255,255,255,0.84);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.90),
            inset 0 -1px 0 rgba(255,255,255,0.10),
            0 10px 18px rgba(29,111,206,0.08);
          transition:
            left 0.30s cubic-bezier(0.22,1,0.36,1),
            width 0.30s cubic-bezier(0.22,1,0.36,1),
            opacity 0.2s ease;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
        }

        .ivs-slide-pill::before {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          top: 6px;
          height: 14px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.88),
            rgba(255,255,255,0.12)
          );
          opacity: 0.9;
          pointer-events: none;
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
  height: clamp(48px, 4.6vw, 62px);
  padding: 0 clamp(12px, 1.2vw, 22px);
  border: none;
  border-radius: 18px;
  background: transparent;
  color: #3b4a62;
  font-family: inherit;
  font-size: clamp(13px, 1vw, 15px);
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.22s ease,
    transform 0.22s ease;
}

        .ivs-nav-btn:hover {
          color: #245da8;
          transform: translateY(-1px);
        }

        .ivs-nav-btn.active {
          color: #245da8;
        }

        .ivs-nav-icon-wrap {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #1d6fce;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.60), rgba(237,245,255,0.32));
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.88),
            inset 0 -1px 0 rgba(255,255,255,0.10),
            0 6px 12px rgba(29,111,206,0.05);
          transition:
            transform 0.22s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.22s ease,
            background 0.22s ease;
          flex-shrink: 0;
        }

        .ivs-nav-icon-wrap::before {
          content: "";
          position: absolute;
          left: 8px;
          right: 8px;
          top: 5px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.90),
            rgba(255,255,255,0.12)
          );
          pointer-events: none;
        }

        .ivs-nav-btn:hover .ivs-nav-icon-wrap,
        .ivs-nav-btn.active .ivs-nav-icon-wrap {
          transform: scale(1.06);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.68), rgba(231,242,255,0.38));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.92),
            inset 0 -1px 0 rgba(255,255,255,0.10),
            0 8px 15px rgba(29,111,206,0.08);
        }

        .ivs-mobile-toggle {
          display: none;
          width: 50px;
          height: 50px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.82);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.76), rgba(245,249,255,0.56));
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.90),
            0 10px 20px rgba(15,23,42,0.05);
          flex-shrink: 0;
          z-index: 2;
        }

        .ivs-mobile-menu {
          display: none;
        }

@media (max-width: 1180px) {
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
    border: 1px solid rgba(255,255,255,0.82);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.80), rgba(245,249,255,0.62));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.90),
      0 16px 30px rgba(15,23,42,0.06),
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
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.78);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.60), rgba(245,249,255,0.40));
    color: #334155;
    font-family: inherit;
    font-size: 14px;
    font-weight: 800;
    text-align: left;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.84),
      0 6px 12px rgba(15,23,42,0.03);
  }

  .ivs-mobile-btn.active {
    color: #1d6fce;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.70), rgba(233,242,255,0.46));
  }

  .ivs-mobile-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #1d6fce;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.58), rgba(240,247,255,0.30));
    border: 1px solid rgba(255,255,255,0.80);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.86),
      0 6px 12px rgba(29,111,206,0.04);
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .ivs-nav-outer {
    padding: 8px 10px 0;
  }

  .ivs-nav-bar {
    align-items: center;
  }

  .ivs-logo {
    min-width: 0;
  }

  .ivs-mobile-toggle {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }
}

@media (max-width: 480px) {
  .ivs-nav-outer {
    padding: 6px 8px 0;
  }

  .ivs-nav-bar {
    padding: 12px;
    border-radius: 18px;
  }

  .ivs-logo {
    gap: 8px;
  }
}

          .ivs-logo-ring {
            width: 58px;
            height: 58px;
            border-radius: 16px;
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
          <nav
            className={`ivs-nav-bar ${scrolled ? "scrolled" : ""}`}
            aria-label="Main navigation"
          >
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