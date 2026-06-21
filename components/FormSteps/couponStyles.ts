export const COUPON_CSS = `
        @keyframes ivsPopupFlipIn {
          0% {
            opacity: 0;
            transform: perspective(1400px) rotateX(-16deg) scale(0.95) translateY(20px);
          }
          60% {
            opacity: 1;
            transform: perspective(1400px) rotateX(4deg) scale(1.01) translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) rotateX(0deg) scale(1) translateY(0);
          }
        }

        @keyframes ivsPopupFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes ivsPopupGlow {
          0%, 100% {
            box-shadow:
              0 20px 55px rgba(15,45,87,0.18),
              0 8px 24px rgba(29,111,206,0.12);
          }
          50% {
            box-shadow:
              0 26px 70px rgba(15,45,87,0.22),
              0 12px 30px rgba(29,111,206,0.16);
          }
        }

        @keyframes ivsVoucherFlyToCard {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-220px, 240px) scale(0.28);
          }
        }

        @keyframes ivsAppliedCardIn {
          0% {
            opacity: 0;
            transform: translateY(26px) scale(0.94);
            filter: blur(8px);
          }
          60% {
            opacity: 1;
            transform: translateY(-6px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes ivsShine {
          0% {
            transform: translateX(-140%) skewX(-18deg);
            opacity: 0;
          }
          20% {
            opacity: 0.18;
          }
          100% {
            transform: translateX(220%) skewX(-18deg);
            opacity: 0;
          }
        }

        .ivs-popup-card {
          animation: ivsPopupFlipIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        .ivs-popup-card-inner {
          animation: ivsPopupFloat 5s ease-in-out infinite, ivsPopupGlow 4.5s ease-in-out infinite;
        }

        .ivs-popup-fly-away {
          animation: ivsVoucherFlyToCard 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ivs-applied-voucher {
          animation: ivsAppliedCardIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
          position: relative;
          overflow: hidden;
        }

        .ivs-applied-voucher::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.00) 35%,
            rgba(255,255,255,0.22) 50%,
            rgba(255,255,255,0.00) 65%,
            transparent 100%
          );
          animation: ivsShine 4.8s ease-in-out infinite;
          pointer-events: none;
        }
          @media (max-width: 640px) {
  .ivs-applied-voucher h4 {
    font-size: 20px !important;
    line-height: 1.15 !important;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}
      `;