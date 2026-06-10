import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useGame, xpToNext } from '@/store/gameStore';
import { Coin, Fire, Star } from './Icon';
import { ProgressBar } from './ProgressBar';

export function Topbar() {
  const { player } = useGame();
  const loc = useLocation();
  const xpNeed = xpToNext(player.level, player.xp);
  const xpTotal = Math.max(1, player.xp + xpNeed);

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 backdrop-blur-xl bg-ink-900/60 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <motion.div
            initial={{ rotate: -8 }}
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyber-300 via-neon-purple to-neon-pink flex items-center justify-center shadow-glow"
          >
            <span className="text-lg">🎯</span>
          </motion.div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-sm tracking-wider neon-text">PHISHING HUNTER</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Cyber City</div>
          </div>
        </Link>

        <div className="flex-1 min-w-0 hidden md:flex items-center gap-3 px-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
              <span className="flex items-center gap-1 font-semibold"><Star className="h-3 w-3 text-neon-yellow" /> Nv. {player.level}</span>
              <span className="tabular-nums">{player.xp} / {player.xp + xpNeed} XP</span>
            </div>
            <ProgressBar value={player.xp / xpTotal} height={6} />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="chip">
            <Fire className="h-3.5 w-3.5 text-neon-orange" />
            <span className="tabular-nums">{player.streak}</span>
          </div>
          <div className="chip">
            <Coin className="h-3.5 w-3.5 text-neon-yellow" />
            <span className="tabular-nums">{player.coins}</span>
          </div>
          <div className="chip bg-white/10 border-white/20">
            <span className="text-base leading-none">{player.avatar || '🛡️'}</span>
            <span className="hidden sm:inline">{player.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
