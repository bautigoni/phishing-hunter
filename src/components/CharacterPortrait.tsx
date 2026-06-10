import { motion } from 'framer-motion';
import { CHARACTERS, type CharacterId } from '@/data/decisions';

interface CharacterPortraitProps {
  id: CharacterId;
  size?: 'sm' | 'md' | 'lg';
  speaking?: boolean;
  emotion?: 'neutral' | 'happy' | 'worried' | 'evil' | 'sad' | 'angry';
}

const SIZE = { sm: 40, md: 64, lg: 96 } as const;

const EMOTION_GLOW: Record<NonNullable<CharacterPortraitProps['emotion']>, string> = {
  neutral: '#3effe1',
  happy: '#3eff9b',
  worried: '#ffe14a',
  evil: '#ff3e6a',
  sad: '#9b5cff',
  angry: '#ff3ea5'
};

export function CharacterPortrait({ id, size = 'md', speaking = false, emotion = 'neutral' }: CharacterPortraitProps) {
  const c = CHARACTERS[id];
  const px = SIZE[size];
  const glow = EMOTION_GLOW[emotion];
  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={speaking ? { scale: [1, 1.04, 1] } : { y: [0, -2, 0] }}
        transition={{ duration: speaking ? 0.4 : 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative shrink-0"
        style={{ width: px, height: px }}
      >
        <div className="absolute inset-0 rounded-2xl blur-xl opacity-50" style={{ background: glow }} />
        <div
          className="relative w-full h-full rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl"
          style={{ borderColor: 'rgba(255,255,255,0.15)', background: `linear-gradient(180deg, ${c.color}30, #0b0f1a)` }}
        >
          {c.emoji}
        </div>
        {speaking && (
          <div className="absolute -bottom-1 -right-1 flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: glow, animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: glow, animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: glow, animationDelay: '300ms' }} />
          </div>
        )}
      </motion.div>
      {(size === 'md' || size === 'lg') && (
        <div className="min-w-0">
          <div className="font-display font-bold text-sm leading-tight">{c.name}</div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">{c.relation}</div>
        </div>
      )}
    </div>
  );
}
