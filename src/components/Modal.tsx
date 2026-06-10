import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_RING: Record<NonNullable<ModalProps['variant']>, string> = {
  default: 'shadow-glow',
  success: 'shadow-glow-green',
  danger: 'shadow-[0_0_24px_rgba(255,62,106,0.45)]',
  pink: 'shadow-glow-pink'
};

export function Modal({ open, onClose, title, children, variant = 'default', size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ y: 20, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={`relative w-full ${size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-3xl' : 'max-w-md'} glass-strong p-6 ${VARIANT_RING[variant]}`}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
            {title && <h3 className="font-display text-2xl font-bold mb-4 pr-6">{title}</h3>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
