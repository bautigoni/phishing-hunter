import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [stage, setStage] = useState(0);
  const stages = [
    'Iniciando Cyber City…',
    'Conectando a la red neuronal…',
    'Calibrando Firewall…',
    'Bienvenido, Agente.'
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => setStage(3), 2100);
    const t4 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-ink-950 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-fade opacity-60" />
      <div className="absolute inset-0 animate-scan pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,198,255,0.15) 50%, transparent 100%)' }} />

      <motion.div
        initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        className="relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-6 rounded-3xl opacity-70 blur-2xl"
          style={{ background: 'conic-gradient(from 0deg, #00c6ff, #9b5cff, #ff3ea5, #00c6ff)' }}
        />
        <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-3xl bg-gradient-to-br from-cyber-300 via-neon-purple to-neon-pink flex items-center justify-center shadow-glow">
          <span className="text-6xl sm:text-7xl">🎯</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 font-display text-3xl sm:text-5xl font-bold tracking-tight neon-text"
      >
        PHISHING HUNTER
      </motion.h1>
      <div className="mt-1 text-xs sm:text-sm uppercase tracking-[0.4em] text-white/60">Cyber City</div>

      <div className="mt-10 h-6 overflow-hidden w-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-white/80 font-mono"
          >
            {stages[stage]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 h-1 w-64 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-300 via-neon-purple to-neon-pink"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.8, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
