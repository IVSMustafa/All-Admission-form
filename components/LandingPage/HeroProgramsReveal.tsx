import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface HeroProgramsRevealProps {
  navbar: React.ReactNode;
  hero: React.ReactNode;
  cards: React.ReactNode;
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const HeroProgramsReveal: React.FC<HeroProgramsRevealProps> = ({
  navbar,
  hero,
  cards,
}) => {
  const shellRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const [useSimpleLayout, setUseSimpleLayout] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (!heroInnerRef.current) return;
      setHeroHeight(heroInnerRef.current.offsetHeight);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (heroInnerRef.current) ro.observe(heroInnerRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const decideLayoutMode = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ratio = vw / Math.max(vh, 1);
      const dpr = window.devicePixelRatio || 1;

      const isSmallWidth = vw < 1180;
      const isShortHeight = vh < 760;
      const isVeryWide = ratio > 2.05;
      const looksZoomedOut = dpr < 0.9;

      setUseSimpleLayout(
        isSmallWidth || isShortHeight || isVeryWide || looksZoomedOut
      );
    };

    decideLayoutMode();
    window.addEventListener("resize", decideLayoutMode);

    return () => {
      window.removeEventListener("resize", decideLayoutMode);
    };
  }, []);

  useEffect(() => {
    if (useSimpleLayout) {
      setProgress(1);
      return;
    }

    let frame = 0;

    const update = () => {
      if (!shellRef.current || !heroHeight) return;

      const rect = shellRef.current.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const distance = Math.max(heroHeight * 0.72, 260);
      const next = clamp(scrolled / distance, 0, 1);

      setProgress(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [heroHeight, useSimpleLayout]);

  if (useSimpleLayout) {
    return (
      <div className="hpr-simple-shell">
        <div className="hpr-navbar">{navbar}</div>
        <div className="hpr-simple-hero">{hero}</div>
        <div className="hpr-simple-cards">{cards}</div>

        <style>{`
          .hpr-simple-shell {
            position: relative;
            width: 100%;
          }

          .hpr-navbar {
            position: sticky;
            top: 0;
            z-index: 60;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          .hpr-simple-hero {
            position: relative;
            z-index: 10;
          }

          .hpr-simple-cards {
            position: relative;
            z-index: 10;
          }
        `}</style>
      </div>
    );
  }

  const heroWrapHeight = Math.max(heroHeight * (1 - progress), 0);
  const heroOpacity = 1 - progress * 1.15;
  const heroTranslateY = -progress * 34;
  const heroScale = 1 - progress * 0.03;

  const cardsReveal = clamp((progress - 0.12) / 0.45, 0, 1);
  const cardsOpacity = cardsReveal;
  const cardsTranslateY = 42 - cardsReveal * 42;
  const cardsScale = 0.985 + cardsReveal * 0.015;

  const wipeOpacity = clamp((progress - 0.04) / 0.34, 0, 1);
  const wipeTranslateY = 18 - wipeOpacity * 18;

  return (
    <div ref={shellRef} className="hpr-shell">
      <style>{`
        .hpr-shell {
          position: relative;
          width: 100%;
        }

        .hpr-navbar {
          position: sticky;
          top: 0;
          z-index: 60;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .hpr-hero-wrap {
          position: relative;
          overflow: hidden;
          transition: height 0.18s linear;
          will-change: height;
        }

        .hpr-hero-inner {
          position: relative;
          transform-origin: center top;
          transition:
            transform 0.18s linear,
            opacity 0.18s linear;
          will-change: transform, opacity;
        }

        .hpr-hero-wipe {
          position: absolute;
          inset: 0;
          border-radius: 36px;
          pointer-events: none;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              rgba(245,249,255,0.00) 0%,
              rgba(245,249,255,0.10) 14%,
              rgba(245,249,255,0.42) 42%,
              rgba(245,249,255,0.92) 100%
            );
          transition:
            opacity 0.18s linear,
            transform 0.18s linear;
          will-change: opacity, transform;
        }

        .hpr-hero-wipe::after {
          content: "";
          position: absolute;
          top: -10%;
          left: -16%;
          width: 46%;
          height: 130%;
          transform: rotate(10deg);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0),
            rgba(255,255,255,0.14),
            rgba(255,255,255,0.48),
            rgba(255,255,255,0.14),
            rgba(255,255,255,0)
          );
          filter: blur(10px);
          opacity: 0.92;
        }

        .hpr-cards-wrap {
          position: relative;
          z-index: 20;
          transition:
            transform 0.18s linear,
            opacity 0.18s linear;
          will-change: transform, opacity;
        }

        @media (max-width: 768px) {
          .hpr-hero-wipe {
            border-radius: 28px;
          }
        }
      `}</style>

      <div className="hpr-navbar">{navbar}</div>

      <div
        className="hpr-hero-wrap"
        style={{ height: heroHeight ? `${heroWrapHeight}px` : "auto" }}
      >
        <div
          ref={heroInnerRef}
          className="hpr-hero-inner"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px) scale(${heroScale})`,
          }}
        >
          {hero}

          <div
            className="hpr-hero-wipe"
            aria-hidden="true"
            style={{
              opacity: wipeOpacity,
              transform: `translateY(${wipeTranslateY}px)`,
            }}
          />
        </div>
      </div>

      <div
        className="hpr-cards-wrap"
        style={{
          opacity: cardsOpacity,
          transform: `translateY(${cardsTranslateY}px) scale(${cardsScale})`,
        }}
      >
        {cards}
      </div>
    </div>
  );
};

export default HeroProgramsReveal;