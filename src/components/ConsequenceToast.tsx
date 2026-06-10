import { AnimatePresence, motion } from 'framer-motion';
import { useDelayedToastList } from '@/lib/useDelayedConsequences';

export function ConsequenceToast() {
  const toasts = useDelayedToastList();
  return (
    <div className="pointer-events-none fixed top-20 right-3 z-[180] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 60, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="pointer-events-auto glass-strong p-3 shadow-glow-pink border-neon-purple/40"
          >
            <div className="text-[10px] uppercase tracking-widest text-neon-purple font-semibold">Consecuencia retardada</div>
            <div className="font-display font-bold text-sm mt-1">{t.headline}</div>
            {t.detail && <div className="text-xs text-white/70 mt-0.5">{t.detail}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
