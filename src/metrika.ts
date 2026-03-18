declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const COUNTER_ID = 107728471;

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (window.ym) {
    window.ym(COUNTER_ID, 'reachGoal', goal, params);
  }
}
