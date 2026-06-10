// Cache en memoria (no persistido) para misiones diarias generadas.
import type { Mission } from '@/data/missions';

let cache: Record<string, Mission> = {};

export const dailyCache = {
  set(id: string, m: Mission) { cache[id] = m; },
  get(id: string): Mission | undefined { return cache[id]; },
  all(): Mission[] { return Object.values(cache); }
};
