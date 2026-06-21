type AppHistoryState = {
  step?: unknown;
  submitted?: unknown;
};

const getAppHistoryState = (state: unknown): AppHistoryState | null =>
  state && typeof state === 'object' ? (state as AppHistoryState) : null;

export const ensureInitialStepHistory = (): void => {
  const currentState = window.history.state;

  if (!currentState || typeof currentState.step !== 'number') {
    window.history.replaceState({ step: 0 }, '');
  }
};

export const isSubmittedHistoryState = (state: unknown): boolean =>
  Boolean(getAppHistoryState(state)?.submitted);

export const getStepFromHistoryState = (state: unknown): number => {
  const historyState = getAppHistoryState(state);

  if (typeof historyState?.step === 'number') {
    return historyState.step;
  }

  return 0;
};

export const pushStepHistory = (step: number): void => {
  window.history.pushState({ step }, '');
};

export const replaceStepHistory = (step: number): void => {
  window.history.replaceState({ step }, '');
};

export const pushSubmittedHistory = (): void => {
  window.history.pushState({ step: 999, submitted: true }, '');
};

export const scrollToTopSmooth = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
