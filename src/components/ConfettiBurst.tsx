import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiBurstProps {
  active: boolean;
}

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<{ x: number; delay: number; rot: number; color: string; size: number }[]>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ['#00c6ff', '#9b5cff', '#ff3ea5', '#3eff9b', '#ffe14a', '#ff7a3e'];
    const arr = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 0.2,
      rot: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 2200);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
          {pieces.map((p, i) => (
            <motion.span
              key={i}
              initial={{ y: -20, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
              animate={{ y: '110vh', rotate: p.rot + 720, opacity: 0.9 }}
              transition={{ duration: 1.6 + Math.random() * 0.8, delay: p.delay, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size * 0.4,
                background: p.color,
                borderRadius: 2
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
