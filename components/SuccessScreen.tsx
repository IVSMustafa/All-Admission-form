import type { FormData } from '../types';
import { LeadType } from '../types';
import { formatPhoneForWhatsApp } from '../src/utils/validation';

type SuccessScreenProps = {
  data: FormData;
  onStartNewApplication: () => void;
};

const getGradeValue = (grade: string): number => {
  if (!grade) return 0;
  const lowerGrades = [
    'KG1',
    'KG2',
    'FS1 (Playgroup)',
    'FS2',
    'FS3',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
  ];
  return lowerGrades.includes(grade) ? 1 : 10;
};

const SuccessScreen = ({ data: successData, onStartNewApplication }: SuccessScreenProps) => {
    const enrolledStudentsCount =
      successData.leadType === LeadType.QURAN
        ? (successData.quranStudents || []).length
        : successData.leadType === LeadType.TUITION
        ? 1
        : successData.students.length;

    const hasLowerGrades = successData.students.some(s => getGradeValue(s.grade) < 10);
    const hasUpperGrades = successData.students.some(s => getGradeValue(s.grade) >= 10);
    const submittedUpsellSchoolStudents = successData.upsellSchoolStudents || [];
    const submittedUpsellTuitionStudents = successData.upsellTuitionStudents || [];
    const submittedUpsellQuranStudents = successData.upsellQuranStudents || [];

    const hasSubmittedAdditionalPrograms =
      submittedUpsellSchoolStudents.length > 0 ||
      submittedUpsellTuitionStudents.length > 0 ||
      submittedUpsellQuranStudents.length > 0;
    
    return (
      <div className="success-glass-scope min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-6 md:px-6 md:py-8 bg-[radial-gradient(circle_at_top,rgba(29,111,206,0.08),transparent_38%),linear-gradient(180deg,#edf6ff_0%,#f8fbff_100%)]">
        <style>{`
          @keyframes ivsSuccessEnter {
            0% {
              opacity: 0;
              transform: translateY(26px) scale(0.97);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes ivsGlowSoft {
            0%, 100% {
              box-shadow:
                0 18px 40px rgba(15,45,87,0.08),
                0 6px 18px rgba(29,111,206,0.05);
            }
            50% {
              box-shadow:
                0 24px 56px rgba(15,45,87,0.12),
                0 10px 24px rgba(29,111,206,0.08);
            }
          }

          @keyframes ivsFloatSoft {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }


          @keyframes ivsSparkle {
            0%, 100% {
              opacity: 0.35;
              transform: translateY(0px) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateY(-7px) scale(1.08);
            }
          }

          @keyframes ivsShineSweep {
            0% {
              transform: translateX(-160%) skewX(-20deg);
              opacity: 0;
            }
            20% {
              opacity: 0.16;
            }
            100% {
              transform: translateX(220%) skewX(-20deg);
              opacity: 0;
            }
          }

          @keyframes ivsPulseButton {
            0%, 100% {
              box-shadow:
                0 12px 28px rgba(29,111,206,0.18),
                0 0 0 0 rgba(14,165,233,0.20);
            }
            50% {
              box-shadow:
                0 18px 38px rgba(29,111,206,0.24),
                0 0 0 10px rgba(14,165,233,0.00);
            }
          }

          @keyframes ivsLuxuryFall {
            0% {
              opacity: 0;
              transform: translate3d(0,-120px,0) rotate(0deg) scale(0.82);
            }
            8% {
              opacity: 1;
            }
            85% {
              opacity: 0.95;
            }
            100% {
              opacity: 0;
              transform: translate3d(var(--drift, 0px), 860px, 0) rotate(460deg) scale(1.05);
            }
          }

          @keyframes ivsLuxuryTwinkle {
            0%, 100% {
              opacity: 0.18;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.18);
            }
          }

          @keyframes ivsLuxuryFirework {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.22);
            }
            20% {
              opacity: 1;
            }
            46% {
              opacity: 0.95;
              transform: translateY(-6px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-28px) scale(1.28);
            }
          }

          @keyframes ivsLuxuryHalo {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            28% {
              opacity: 0.22;
            }
            100% {
              opacity: 0;
              transform: scale(1.45);
            }
          }

          @keyframes ivsStreamerDrop {
            0% {
              opacity: 0;
              transform: translateY(-80px) rotate(10deg);
            }
            12% {
              opacity: 0.9;
            }
            100% {
              opacity: 0.15;
              transform: translateY(90px) rotate(-8deg);
            }
          }

          @keyframes ivsOrbFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.18;
            }
            50% {
              transform: translateY(-10px) scale(1.06);
              opacity: 0.28;
            }
          }

          .ivs-success-wrap {
            animation: ivsSuccessEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .ivs-success-main {
            animation: ivsGlowSoft 5s ease-in-out infinite, ivsFloatSoft 6s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }

          .ivs-success-main::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              115deg,
              transparent 0%,
              rgba(255,255,255,0.00) 35%,
              rgba(255,255,255,0.15) 50%,
              rgba(255,255,255,0.00) 65%,
              transparent 100%
            );
            animation: ivsShineSweep 5.6s ease-in-out infinite;
            pointer-events: none;
          }


          .ivs-sparkle-1 {
            animation: ivsSparkle 2.6s ease-in-out infinite;
          }

          .ivs-sparkle-2 {
            animation: ivsSparkle 3.2s ease-in-out infinite;
            animation-delay: 0.5s;
          }

          .ivs-sparkle-3 {
            animation: ivsSparkle 2.9s ease-in-out infinite;
            animation-delay: 0.95s;
          }

          .ivs-cta-button {
            animation: ivsPulseButton 2.8s ease-in-out infinite;
          }

          .ivs-celebration-layer {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
          }

          .ivs-lux-piece {
            position: absolute;
            top: -120px;
            opacity: 0;
            animation: ivsLuxuryFall linear infinite;
            box-shadow: 0 10px 24px rgba(183,134,11,0.10);
            filter: drop-shadow(0 8px 18px rgba(255,215,120,0.16));
          }

          .ivs-lux-piece.round { border-radius: 999px; }
          .ivs-lux-piece.soft { border-radius: 10px; }
          .ivs-lux-piece.diamond { transform: rotate(45deg); border-radius: 6px; }

          .ivs-piece-1  { left: 5%;  width: 8px;  height: 28px; --drift: 18px;  background: linear-gradient(180deg,#fff7d6,#f4d58d); animation-duration: 6.3s; animation-delay: 0.2s; }
          .ivs-piece-2  { left: 11%; width: 10px; height: 22px; --drift: -14px; background: linear-gradient(180deg,#ffffff,#f6e6b8); animation-duration: 5.8s; animation-delay: 1s; }
          .ivs-piece-3  { left: 17%; width: 7px;  height: 24px; --drift: 24px;  background: linear-gradient(180deg,#ffe39a,#e8b95f); animation-duration: 6.8s; animation-delay: 0.8s; }
          .ivs-piece-4  { left: 25%; width: 9px;  height: 20px; --drift: -18px; background: linear-gradient(180deg,#fff4cf,#f0cc7a); animation-duration: 6.1s; animation-delay: 1.5s; }
          .ivs-piece-5  { left: 33%; width: 6px;  height: 22px; --drift: 12px;  background: linear-gradient(180deg,#ffffff,#ead9a3); animation-duration: 5.7s; animation-delay: 0.5s; }
          .ivs-piece-6  { left: 41%; width: 10px; height: 26px; --drift: -20px; background: linear-gradient(180deg,#ffe8ad,#efc86c); animation-duration: 6.5s; animation-delay: 1.4s; }
          .ivs-piece-7  { left: 49%; width: 8px;  height: 24px; --drift: 22px;  background: linear-gradient(180deg,#fff8e1,#f6d78e); animation-duration: 6.2s; animation-delay: 0.7s; }
          .ivs-piece-8  { left: 57%; width: 7px;  height: 22px; --drift: -12px; background: linear-gradient(180deg,#ffffff,#ecd39b); animation-duration: 5.9s; animation-delay: 1.9s; }
          .ivs-piece-9  { left: 65%; width: 10px; height: 20px; --drift: 16px;  background: linear-gradient(180deg,#ffe5a1,#e6b95b); animation-duration: 6.7s; animation-delay: 0.9s; }
          .ivs-piece-10 { left: 73%; width: 8px;  height: 26px; --drift: -22px; background: linear-gradient(180deg,#fff6d2,#f1d083); animation-duration: 6.4s; animation-delay: 1.2s; }
          .ivs-piece-11 { left: 81%; width: 9px;  height: 22px; --drift: 20px;  background: linear-gradient(180deg,#ffffff,#f2dfb1); animation-duration: 6s; animation-delay: 0.4s; }
          .ivs-piece-12 { left: 89%; width: 7px;  height: 24px; --drift: -16px; background: linear-gradient(180deg,#ffe39e,#edc470); animation-duration: 6.9s; animation-delay: 1.7s; }
          .ivs-piece-13 { left: 94%; width: 8px;  height: 20px; --drift: 14px;  background: linear-gradient(180deg,#fff5d8,#eec873); animation-duration: 5.6s; animation-delay: 0.6s; }
          .ivs-piece-14 { left: 2%;  width: 6px;  height: 18px; --drift: 10px;  background: linear-gradient(180deg,#fffaf0,#f0d799); animation-duration: 6.6s; animation-delay: 1.3s; }
          .ivs-piece-15 { left: 29%; width: 12px; height: 12px; --drift: -12px; background: linear-gradient(135deg,#fff3c5,#e4b860); animation-duration: 6.2s; animation-delay: 2.1s; }
          .ivs-piece-16 { left: 61%; width: 12px; height: 12px; --drift: 15px;  background: linear-gradient(135deg,#fff8de,#f0ca71); animation-duration: 5.9s; animation-delay: 2.4s; }
          .ivs-piece-17 { left: 77%; width: 11px; height: 11px; --drift: -10px; background: linear-gradient(135deg,#ffffff,#ebd6a0); animation-duration: 6.4s; animation-delay: 2s; }
          .ivs-piece-18 { left: 46%; width: 11px; height: 11px; --drift: 9px;  background: linear-gradient(135deg,#ffefba,#ddb05f); animation-duration: 5.8s; animation-delay: 2.2s; }

          .ivs-lux-twinkle {
            position: absolute;
            color: #f2cc6b;
            opacity: 0;
            animation: ivsLuxuryTwinkle ease-in-out infinite;
            text-shadow:
              0 0 8px rgba(255,224,138,0.55),
              0 0 18px rgba(255,255,255,0.28);
          }

          .ivs-twinkle-1 { top: 7%;  left: 10%; font-size: 13px; animation-duration: 2.8s; animation-delay: 0.4s; }
          .ivs-twinkle-2 { top: 12%; left: 20%; font-size: 10px; animation-duration: 3.2s; animation-delay: 1.1s; }
          .ivs-twinkle-3 { top: 10%; left: 34%; font-size: 12px; animation-duration: 2.9s; animation-delay: 0.8s; }
          .ivs-twinkle-4 { top: 6%;  left: 51%; font-size: 14px; animation-duration: 3.1s; animation-delay: 1.5s; }
          .ivs-twinkle-5 { top: 9%;  right: 33%; font-size: 11px; animation-duration: 2.7s; animation-delay: 0.6s; }
          .ivs-twinkle-6 { top: 13%; right: 22%; font-size: 10px; animation-duration: 3.3s; animation-delay: 1.8s; }
          .ivs-twinkle-7 { top: 8%;  right: 11%; font-size: 13px; animation-duration: 2.8s; animation-delay: 1.2s; }
          .ivs-twinkle-8 { top: 17%; left: 72%; font-size: 9px;  animation-duration: 3s; animation-delay: 0.9s; }

          .ivs-lux-firework {
            position: absolute;
            width: 170px;
            height: 170px;
            border-radius: 999px;
            opacity: 0;
            animation: ivsLuxuryFirework 4.8s ease-out infinite;
            filter: drop-shadow(0 12px 24px rgba(194,148,32,0.10));
          }

          .ivs-lux-firework::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle, rgba(255,240,184,0.96) 0 3px, transparent 3.8px) 50% 8px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(245,208,110,0.95) 0 3px, transparent 3.8px) 114px 24px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,255,255,0.96) 0 3px, transparent 3.8px) 142px 68px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(229,190,92,0.94) 0 3px, transparent 3.8px) 120px 118px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,232,158,0.95) 0 3px, transparent 3.8px) 76px 142px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,255,255,0.95) 0 3px, transparent 3.8px) 28px 122px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(238,199,96,0.94) 0 3px, transparent 3.8px) 8px 70px / 16px 16px no-repeat,
              radial-gradient(circle, rgba(255,242,196,0.95) 0 3px, transparent 3.8px) 24px 22px / 16px 16px no-repeat;
          }

          .ivs-lux-firework::after {
            content: "";
            position: absolute;
            inset: 28px;
            border-radius: 999px;
            border: 1px solid rgba(241,212,136,0.28);
            animation: ivsLuxuryHalo 4.8s ease-out infinite;
          }

          .ivs-firework-1 { top: 5%; left: 5%; animation-delay: 0.3s; }
          .ivs-firework-2 { top: 8%; right: 6%; animation-delay: 1.8s; transform: scale(0.92); }
          .ivs-firework-3 { top: 16%; left: 50%; margin-left: -85px; animation-delay: 3s; transform: scale(0.82); }
          .ivs-firework-4 { top: 22%; right: 18%; animation-delay: 2.4s; transform: scale(0.72); }

          .ivs-streamer {
            position: absolute;
            top: -90px;
            width: 5px;
            height: 150px;
            border-radius: 999px;
            opacity: 0.45;
            animation: ivsStreamerDrop 4.4s ease-in-out infinite;
          }

          .ivs-streamer-1 { left: 14%; background: linear-gradient(180deg,rgba(255,244,205,0.96),transparent); }
          .ivs-streamer-2 { left: 31%; background: linear-gradient(180deg,rgba(241,205,118,0.95),transparent); animation-delay: 0.8s; }
          .ivs-streamer-3 { left: 52%; background: linear-gradient(180deg,rgba(255,255,255,0.95),transparent); animation-delay: 1.2s; }
          .ivs-streamer-4 { right: 27%; background: linear-gradient(180deg,rgba(234,196,95,0.96),transparent); animation-delay: 1.7s; }
          .ivs-streamer-5 { right: 11%; background: linear-gradient(180deg,rgba(255,241,198,0.96),transparent); animation-delay: 2.1s; }

          .ivs-lux-orb {
            position: absolute;
            border-radius: 999px;
            background: radial-gradient(circle,rgba(255,240,197,0.55),rgba(255,255,255,0));
            animation: ivsOrbFloat 5.2s ease-in-out infinite;
          }

          .ivs-orb-1 { width: 120px; height: 120px; top: 4%; left: 22%; }
          .ivs-orb-2 { width: 90px; height: 90px; top: 12%; right: 24%; animation-delay: 1.1s; }
          .ivs-orb-3 { width: 70px; height: 70px; top: 24%; left: 66%; animation-delay: 2s; }

          @media (max-width: 640px) {
            .ivs-lux-firework {
              width: 110px;
              height: 110px;
            }

            .ivs-streamer {
              height: 92px;
            }

            .ivs-orb-1,
            .ivs-orb-2,
            .ivs-orb-3 {
              display: none;
            }
          }
          @keyframes ivsPhonePeekIn {
            0% {
              opacity: 0;
              transform: translateY(-50%) translateX(-70px) scale(0.92);
            }
            100% {
              opacity: 1;
              transform: translateY(-50%) translateX(0) scale(1);
            }
          }

          @keyframes ivsPhoneSoftFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .ivs-success-wrap {
            overflow: visible;
          }

.ivs-phone-peek {
  position: absolute;
  top: 56%;
  right: -185px;
  width: 255px;
  z-index: 1;
  pointer-events: none;
  animation: ivsPhonePeekIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
}

.ivs-phone-peek-inner {
  animation: ivsPhoneSoftFloat 6s ease-in-out infinite;
}

.ivs-phone-peek img {
  width: 100%;
  height: auto;
  display: block;
  filter:
    drop-shadow(0 24px 36px rgba(15,45,87,0.18))
    drop-shadow(0 8px 18px rgba(29,111,206,0.10));
}

@media (max-width: 1279px) {
  .ivs-phone-peek {
    right: -110px;
    width: 200px;
  }
}

@media (max-width: 1024px) {
  .ivs-phone-peek {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .ivs-phone-peek {
    bottom: 16px;
    width: 112px;
  }
}

          .success-glass-scope .ivs-success-main,
          .success-glass-scope .ivs-applied-voucher,
          .success-glass-scope div[class*="rounded-[24px]"],
          .success-glass-scope div[class*="rounded-[22px]"],
          .success-glass-scope div[class*="rounded-2xl"] {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-color: rgba(201, 225, 255, 0.82) !important;
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.60),
              0 16px 34px rgba(15,45,87,0.07),
              0 6px 14px rgba(15,45,87,0.04) !important;
          }

          @media (max-width: 640px) {
  .ivs-success-wrap {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .ivs-success-main {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .ivs-success-main p,
  .ivs-success-main h2,
  .ivs-success-main h4 {
    word-break: break-word;
  }
}
  .ivs-phone-inline {
  width: 150px;
  max-width: 42vw;
  pointer-events: none;
}

.ivs-phone-inline img {
  width: 100%;
  height: auto;
  display: block;
  filter:
    drop-shadow(0 16px 26px rgba(15,45,87,0.16))
    drop-shadow(0 6px 12px rgba(29,111,206,0.08));
}

@media (max-width: 768px) {
  .ivs-phone-inline {
    width: 128px;
    max-width: 46vw;
  }
}

@media (max-width: 480px) {
  .ivs-phone-inline {
    width: 112px;
    max-width: 48vw;
  }
}
  
@keyframes ivsPremiumTickEnter {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.78) rotate(-7deg);
    filter: blur(10px);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.04) rotate(1.5deg);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
    filter: blur(0);
  }
}

@keyframes ivsPremiumTickFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes ivsPremiumTickGlow {
  0%, 100% {
    filter:
      drop-shadow(0 18px 34px rgba(16,185,129,0.16))
      drop-shadow(0 8px 20px rgba(52,211,153,0.12));
  }
  50% {
    filter:
      drop-shadow(0 26px 46px rgba(16,185,129,0.24))
      drop-shadow(0 10px 24px rgba(110,231,183,0.18));
  }
}

@keyframes ivsPremiumAuraPulse {
  0%, 100% {
    opacity: 0.42;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 0.72;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes ivsPremiumRingPulse {
  0%, 100% {
    opacity: 0.22;
    transform: translate(-50%, -50%) scale(0.96);
  }
  50% {
    opacity: 0.38;
    transform: translate(-50%, -50%) scale(1.04);
  }
}

@keyframes ivsPremiumShineSweep {
  0% {
    transform: translateX(-170%) skewX(-18deg);
    opacity: 0;
  }
  18% {
    opacity: 0.16;
  }
  40% {
    opacity: 0.34;
  }
  100% {
    transform: translateX(230%) skewX(-18deg);
    opacity: 0;
  }
}

.ivs-premium-tick-wrap {
  position: relative;
  width: 176px;
  height: 176px;
  margin: 0 auto;
  animation: ivsPremiumTickEnter 0.95s cubic-bezier(0.22, 1, 0.36, 1) both;
  isolation: isolate;
}

.ivs-premium-tick-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 196px;
  height: 196px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(circle,
      rgba(110,231,183,0.28) 0%,
      rgba(52,211,153,0.16) 32%,
      rgba(16,185,129,0.07) 54%,
      rgba(16,185,129,0) 74%);
  filter: blur(8px);
  animation: ivsPremiumAuraPulse 3.8s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.ivs-premium-tick-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255,255,255,0.34);
  background: radial-gradient(circle, rgba(255,255,255,0.10), rgba(255,255,255,0.00) 68%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.35),
    0 0 0 1px rgba(167,243,208,0.08);
  animation: ivsPremiumRingPulse 3.4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.ivs-premium-tick-img {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
  animation:
    ivsPremiumTickFloat 5.2s ease-in-out infinite,
    ivsPremiumTickGlow 3.8s ease-in-out infinite;
}

.ivs-premium-tick-shine {
  position: absolute;
  inset: 16px;
  z-index: 3;
  overflow: hidden;
  border-radius: 999px;
  pointer-events: none;
}

.ivs-premium-tick-shine::before {
  content: "";
  position: absolute;
  top: -18%;
  left: -30%;
  width: 26%;
  height: 140%;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.08) 18%,
    rgba(255,255,255,0.42) 42%,
    rgba(255,255,255,0.78) 52%,
    rgba(255,255,255,0.14) 70%,
    rgba(255,255,255,0) 100%
  );
  filter: blur(1.4px);
  mix-blend-mode: screen;
  animation: ivsPremiumShineSweep 4.4s ease-in-out infinite;
}

@media (max-width: 640px) {
  .ivs-premium-tick-wrap {
    width: 138px;
    height: 138px;
  }

  .ivs-premium-tick-glow {
    width: 156px;
    height: 156px;
  }

  .ivs-premium-tick-ring {
    width: 118px;
    height: 118px;
  }

  .ivs-premium-tick-shine {
    inset: 12px;
  }
}
        `}</style>

<div className="ivs-success-wrap relative z-10 w-full max-w-[980px] px-0 sm:px-4 xl:pl-[70px]">
  <div
    className="absolute left-[-400px] top-[55%] -translate-y-1/2 z-0 hidden xl:block pointer-events-none"
    aria-hidden="true"
  >
    <img
      src="/images/success-side-education.webp"
      alt=""
      className="w-[500px] select-none"
      width={1280}
      height={747}
      loading="lazy"
      decoding="async"
      style={{ opacity: 0.9 }}
    />
  </div>

  <div className="ivs-phone-peek hidden lg:block" aria-hidden="true">
    <div className="ivs-phone-peek-inner">
      <img
        src="/images/ivs-whatsapp-phone.webp"
        alt="Official IVS WhatsApp QR"
        width={720}
        height={1472}
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>

  <div className="ivs-success-main relative z-10 mx-auto w-full max-w-[760px] rounded-[24px] sm:rounded-[28px] border border-[rgba(29,111,206,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,249,255,0.96))] px-4 py-5 sm:px-7 sm:py-8 md:px-8 md:py-9">
    <div className="relative text-center">
      <div className="absolute left-[10%] top-1 text-sky-300 text-sm ivs-sparkle-1">✦</div>
      <div className="absolute right-[12%] top-6 text-blue-300 text-xs ivs-sparkle-2">✦</div>
      <div className="absolute left-[21%] top-12 text-cyan-300 text-xs ivs-sparkle-3">✦</div>

      <div className="ivs-premium-tick-wrap" aria-hidden="true">
        <div className="ivs-premium-tick-glow" />
        <div className="ivs-premium-tick-ring" />
        <img
          src="/images/success-glass-tick.webp"
          alt=""
          className="ivs-premium-tick-img"
          width={512}
          height={512}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className="ivs-premium-tick-shine" />
      </div>

      <h2 className="mt-3 text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-[linear-gradient(135deg,#8b1d5a_0%,#b12f72_32%,#1d6fce_100%)] bg-clip-text text-transparent">
        All Set!
      </h2>

      <p className="mt-3 text-lg sm:text-[22px] text-brand-darkText leading-relaxed">
        Thanks, <strong>{successData.parentName}</strong>! Your request has been received successfully.
      </p>

      <p className="mt-2 text-sm sm:text-base text-brand-mediumText max-w-2xl mx-auto">
        Our coordinator will review everything and contact you shortly with the next details.
      </p>
    </div>

    {successData.appliedCoupon && (
      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.35fr)_180px] items-stretch">
        <div className="rounded-[20px] sm:rounded-[24px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(135deg,#f3faff_0%,#eaf5ff_50%,#f7fbff_100%)] overflow-hidden shadow-[0_12px_28px_rgba(29,111,206,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
            <div className="w-16 h-16 rounded-[18px] flex items-center justify-center bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] text-white text-[28px] shadow-[0_12px_24px_rgba(29,111,206,0.18)] shrink-0">
              🎁
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#1d6fce] bg-[rgba(29,111,206,0.08)] border-[rgba(29,111,206,0.14)]">
                  Voucher Applied
                </span>

                <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.12em] uppercase border text-[#059669] bg-[rgba(16,185,129,0.10)] border-[rgba(16,185,129,0.18)]">
                  Verified
                </span>
              </div>

              <h4 className="text-[20px] sm:text-[28px] leading-tight font-black tracking-[0.01em] text-[#0f2d57] break-words">
                {successData.couponCode}
              </h4>

              <p className="mt-2 text-[15px] font-semibold text-[#23527c]">
                {successData.appliedCoupon.discountValue}% off on{' '}
                {successData.appliedCoupon.discountType === 'REGISTRATION_FEE'
                  ? 'registration fee'
                  : 'first month fee'}
              </p>

              <p className="mt-2 text-sm text-[#5c7593] leading-relaxed">
                Referred by <strong>{successData.appliedCoupon.referrerName}</strong>. Your reward is attached to this application.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] sm:rounded-[24px] border border-[rgba(29,111,206,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(238,247,255,0.94)_100%)] p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-[0_12px_28px_rgba(29,111,206,0.07)]">
          <p className="text-[11px] uppercase tracking-[0.16em] font-extrabold text-[#6c87a7]">
            Savings
          </p>
          <p className="mt-1 text-[34px] sm:text-[40px] leading-none font-black bg-[linear-gradient(135deg,#1d6fce_0%,#0ea5e9_100%)] bg-clip-text text-transparent">
            {successData.appliedCoupon.discountValue}%
          </p>
          <p className="mt-1 text-xs font-semibold text-[#5c7593]">
            Premium Reward
          </p>
        </div>
      </div>
    )}

    <div className="mt-7 grid gap-5">
      <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
        <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
          {successData.leadType === LeadType.TUITION
            ? 'Student Information'
            : `Enrolled Students (${enrolledStudentsCount})`}
        </h4>

        <div className="mt-4 space-y-3">
          {successData.leadType === LeadType.TUITION ? (
            <div className="flex items-center gap-4 rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#fafcff,#f3f9ff)] px-4 py-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-extrabold text-base">
                1
              </div>

              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                  <p className="text-brand-darkText font-bold text-lg">{successData.studentName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                  <p className="text-brand-darkText font-bold text-lg">{successData.age} yrs</p>
                </div>
              </div>
            </div>
          ) : successData.leadType === LeadType.QURAN ? (
            (successData.quranStudents || []).map((student, idx) => (
              <div
                key={student.id}
                className="grid gap-3 grid-cols-1 md:grid-cols-[56px_1fr] items-start md:items-center rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-extrabold text-base">
                  {idx + 1}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                    <p className="font-bold text-brand-darkText">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                    <p className="font-bold text-brand-darkText">{student.age} yrs</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Days</p>
                    <p className="font-bold text-brand-darkText">{student.classDays.map(d => d.slice(0, 3)).join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Time</p>
                    <p className="font-bold text-brand-darkText">{student.classTime}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            successData.students.map((student, idx) => {
              const studentGradeVal = getGradeValue(student.grade);
              const displayCurriculum = student.curriculum
                ? student.curriculum
                : studentGradeVal < 10
                ? 'British Curriculum'
                : '—';

              return (
                <div
                  key={student.id}
                  className="grid gap-3 grid-cols-1 md:grid-cols-[56px_1fr] items-start md:items-center rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#fafcff,#f3f9ff)] px-4 py-4"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-extrabold text-base">
                    {idx + 1}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                      <p className="font-bold text-brand-darkText">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                      <p className="font-bold text-brand-darkText">{student.age} yrs</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Grade</p>
                      <p className="font-bold text-brand-darkText">{student.grade}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Curriculum</p>
                      <p className="font-bold text-brand-darkText">{displayCurriculum}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {successData.leadType === LeadType.TUITION && (
        <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
          <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
            Your Requirements
          </h4>

          <p className="mt-4 text-[15px] text-brand-darkText rounded-2xl border border-[rgba(29,111,206,0.08)] bg-[linear-gradient(135deg,#ffffff,#f8fbff)] p-4 whitespace-pre-wrap leading-relaxed">
            {successData.tuitionRequirements}
          </p>
        </div>
      )}

      <div className="rounded-[24px] border border-brand-lightGray bg-white/78 p-5 shadow-[0_8px_24px_rgba(15,45,87,0.04)]">
        <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-gray-500 border-b border-brand-lightGray pb-3">
          Trial Schedule ({successData.leadType === LeadType.QURAN || successData.leadType === LeadType.FULL_TIME ? '3 Days' : '1 Day'})
        </h4>

        <div className="mt-4 space-y-3">
          {successData.leadType === LeadType.TUITION ? (
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-[0_8px_20px_rgba(139,92,246,0.05)]">
              <p className="text-sm text-purple-700 font-semibold">📚 1 Day Free Trial</p>
              <p className="text-lg text-purple-800 font-extrabold mt-2">
                Timing based on teacher availability
              </p>
              <p className="text-sm text-purple-600 mt-2">
                Our advisor will contact you on WhatsApp to confirm tutor matching and class timings.
              </p>
            </div>
          ) : successData.leadType === LeadType.QURAN ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_20px_rgba(16,185,129,0.05)]">
              <p className="text-sm text-emerald-700 font-semibold">📖 3 Days Free Trial</p>
              <p className="text-lg text-emerald-800 font-extrabold mt-2">
                Timing based on your local country time
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                Our coordinator will confirm the class schedule on WhatsApp
              </p>
            </div>
          ) : successData.leadType === LeadType.ONE_ON_ONE_SCHOOLING ? (
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-[0_8px_20px_rgba(139,92,246,0.05)]">
              <p className="text-sm text-purple-700 font-semibold">📚 1 Day Free Trial</p>
              <p className="text-lg text-purple-800 font-extrabold mt-2">
                Timing based on teacher availability
              </p>
              <p className="text-sm text-purple-600 mt-2">
                Our agent will guide you on call
              </p>
            </div>
          ) : successData.leadType === LeadType.FULL_TIME ? (
            <div className="space-y-3">
              {hasLowerGrades && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tz: 'KSA', time: '3:30 PM KSA', label: 'KG1 to Grade 7' },
                    { tz: 'UAE', time: '4:30 PM UAE', label: 'KG1 to Grade 7' },
                    { tz: 'PAK', time: '5:30 PM PAK', label: 'KG1 to Grade 7' },
                  ].map((item) => (
                    <div
                      key={item.tz}
                      className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-[0_8px_20px_rgba(59,130,246,0.05)]"
                    >
                      <p className="text-sm text-blue-700 font-semibold">⏰ {item.tz}</p>
                      <p className="text-lg text-blue-800 font-extrabold mt-2">{item.time}</p>
                      <p className="text-xs text-blue-600 mt-2">{item.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {hasUpperGrades && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tz: 'KSA', time: '9:30 AM KSA', label: 'Grade 8 to 12' },
                    { tz: 'UAE', time: '10:30 AM UAE', label: 'Grade 8 to 12' },
                    { tz: 'PAK', time: '11:30 AM PAK', label: 'Grade 8 to 12' },
                  ].map((item) => (
                    <div
                      key={item.tz}
                      className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-[0_8px_20px_rgba(59,130,246,0.05)]"
                    >
                      <p className="text-sm text-blue-700 font-semibold">⏰ {item.tz}</p>
                      <p className="text-lg text-blue-800 font-extrabold mt-2">{item.time}</p>
                      <p className="text-xs text-blue-600 mt-2">{item.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>

    {hasSubmittedAdditionalPrograms && (
      <div className="rounded-[24px] border border-amber-200 bg-[linear-gradient(135deg,#fffaf0,#fff7ed)] p-5 shadow-[0_8px_24px_rgba(245,158,11,0.08)] mt-7">
        <h4 className="text-sm uppercase tracking-[0.16em] font-extrabold text-amber-700 border-b border-amber-200 pb-3">
          Additional Programs From Final Step
        </h4>

        <div className="mt-4 space-y-4">
          {submittedUpsellSchoolStudents.length > 0 && (
            <div>
              <p className="text-sm font-bold text-blue-700 mb-2">
                Full-Time School ({submittedUpsellSchoolStudents.length})
              </p>
              <div className="space-y-2">
                {submittedUpsellSchoolStudents.map((student, idx) => (
                  <div key={student.id} className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3">
                    <p className="font-bold text-blue-900">
                      {idx + 1}. {student.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      Age {student.age} • {student.grade}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submittedUpsellTuitionStudents.length > 0 && (
            <div>
              <p className="text-sm font-bold text-purple-700 mb-2">
                1-on-1 Tuition ({submittedUpsellTuitionStudents.length})
              </p>
              <div className="space-y-2">
                {submittedUpsellTuitionStudents.map((student, idx) => (
                  <div key={student.id} className="rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-3">
                    <p className="font-bold text-purple-900">
                      {idx + 1}. {student.name}
                    </p>
                    <p className="text-sm text-purple-700">
                      Age {student.age}
                      {student.requirements ? ` • ${student.requirements}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submittedUpsellQuranStudents.length > 0 && (
            <div>
              <p className="text-sm font-bold text-emerald-700 mb-2">
                Quran Classes ({submittedUpsellQuranStudents.length})
              </p>
              <div className="space-y-2">
                {submittedUpsellQuranStudents.map((student, idx) => (
                  <div key={student.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                    <p className="font-bold text-emerald-900">
                      {idx + 1}. {student.name}
                    </p>
                    <p className="text-sm text-emerald-700">
                      Age {student.age}
                      {student.subjects?.length ? ` • ${student.subjects.join(', ')}` : ''}
                      {student.classDays?.length ? ` • ${student.classDays.join(', ')}` : ''}
                      {student.classTime ? ` • ${student.classTime}` : ''}
                      {student.country ? ` • ${student.country}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {successData.leadType !== LeadType.TUITION && (
      <div className="mt-6 rounded-[22px] border border-brand-orange/20 bg-[linear-gradient(135deg,rgba(255,248,243,0.95),rgba(255,244,239,0.90))] p-4 text-center shadow-[0_8px_20px_rgba(180,83,9,0.05)]">
        <p className="text-sm sm:text-[15px] text-brand-burgundy">
          📹 We will send the <strong>Zoom link</strong> to{' '}
          <strong>{formatPhoneForWhatsApp(successData.country || 'Other', successData.whatsapp)}</strong> shortly.
        </p>
      </div>
    )}

    <p className="mt-6 text-sm text-brand-mediumText text-center">
      {successData.leadType === LeadType.TUITION
        ? 'Our advisor will reach out to you shortly on WhatsApp.'
        : 'If you need immediate help, just message us on WhatsApp.'}
    </p>

    <div className="mt-6 flex justify-center lg:hidden">
      <div className="ivs-phone-inline">
        <img
          src="/images/ivs-whatsapp-phone.webp"
          alt="Official IVS WhatsApp QR"
          className="w-full h-auto block"
          width={720}
          height={1472}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>

    <div className="mt-5 text-center">
      <button
        onClick={onStartNewApplication}
        className="ivs-cta-button inline-flex items-center justify-center rounded-full px-8 py-3.5 text-white font-bold text-base transition-all hover:scale-[1.04] hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg,#1d6fce 0%,#0ea5e9 100%)' }}
      >
        Start New Application
      </button>
    </div>
  </div>
</div>
</div>
);
};

export default SuccessScreen;
