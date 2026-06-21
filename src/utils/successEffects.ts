import confetti from 'canvas-confetti';

export const playSuccessConfetti = (onComplete: () => void): (() => void) => {
  const duration = 1600;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 22,
    spread: 70,
    ticks: 140,
    gravity: 1.05,
    scalar: 0.95,
    zIndex: 999,
    disableForReducedMotion: true,
    colors: [
      '#1d6fce',
      '#0ea5e9',
      '#10b981',
      '#8b5cf6',
      '#f59e0b',
      '#ffffff',
    ],
  };

  confetti({
    ...defaults,
    particleCount: 70,
    origin: { x: 0.5, y: 0 },
    spread: 90,
  });

  confetti({
    ...defaults,
    particleCount: 40,
    origin: { x: 0.2, y: 0 },
    angle: 65,
    spread: 60,
  });

  confetti({
    ...defaults,
    particleCount: 40,
    origin: { x: 0.8, y: 0 },
    angle: 115,
    spread: 60,
  });

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      window.clearInterval(interval);
      onComplete();
      return;
    }

    const particleCount = Math.max(8, Math.round(16 * (timeLeft / duration)));

    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.15 + Math.random() * 0.7, y: 0 },
      angle: 90,
      spread: 55,
    });
  }, 240);

  return () => {
    window.clearInterval(interval);
  };
};
