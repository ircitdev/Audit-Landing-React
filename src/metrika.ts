import { METRIKA } from './config';

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (window.ym) {
    window.ym(METRIKA.counterId, 'reachGoal', goal, params);
  }
}
