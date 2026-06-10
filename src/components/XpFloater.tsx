import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';

interface FloatItem { id: number; text: string; color?: string }

interface FloatState {
  items: FloatItem[];
  push: (text: string, color?: string) => void;
}

let idCounter = 0;
const useFloat = create<FloatState>((set) => ({
  items: [],
  push: (text, color) => {
    const id = ++idCounter;
    set((s) => ({ items: [...s.items, { id, text, color }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((i) => i.id !== id) })), 1400);
  }
}));

export function FloatLayer() {
  const items = useFloat((s) => s.items);
  return (
    <div className="pointer-events-none fixed inset-0 z-[150] flex items-start justify-center pt-32">
      <AnimatePresence>
        {items.map((it) => (
          <motion.div
            key={it.id}
            initial={{ y: 0, opacity: 0, scale: 0.8 }}
            animate={{ y: -60, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -120 }}
            transition={{ duration: 1.1 }}
            className="absolute font-display font-bold text-2xl text-stroke"
            style={{ color: it.color || '#ffe14a', textShadow: '0 2px 0 rgba(0,0,0,0.3)' }}
          >
            {it.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const pushFloat = (text: string, color?: string) => useFloat.getState().push(text, color);
