import { useEffect, useState } from 'react';
import { useDecisions, type PendingConsequence } from '@/store/decisionsStore';

interface Toast extends PendingConsequence {
  resolvedAt: number;
}

let toastCounter = 0;
const subscribers = new Set<(t: Toast[]) => void>();
let current: Toast[] = [];

function publish() {
  subscribers.forEach((s) => s(current));
}

export function pushDelayedToast(t: Omit<Toast, 'id' | 'resolvedAt'>) {
  const id = 'toast-' + ++toastCounter;
  const next = [...current, { ...t, id, resolvedAt: Date.now() }];
  current = next;
  publish();
  setTimeout(() => {
    current = current.filter((x) => x.id !== id);
    publish();
  }, 6000);
}

export function useDelayedToastList(): Toast[] {
  const [list, setList] = useState<Toast[]>(current);
  useEffect(() => {
    subscribers.add(setList);
    return () => { subscribers.delete(setList); };
  }, []);
  return list;
}

// Hook que procesa consecuencias al montar y emite toasts.
export function useProcessConsequencesOnMount() {
  const processPending = useDecisions((s) => s.processPending);
  useEffect(() => {
    const { processed } = processPending();
    if (processed && processed.length > 0) {
      for (const p of processed) {
        pushDelayedToast(p);
      }
    }
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
