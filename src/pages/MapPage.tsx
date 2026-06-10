import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DISTRICTS } from '@/data/districts';
import { VILLAINS } from '@/data/villains';
import { useGame } from '@/store/gameStore';
import { ProgressBar } from '@/components/ProgressBar';
import { Back, Map as MapIcon } from '@/components/Icon';
import { sfx } from '@/lib/sound';

export function MapPage() {
  const { player } = useGame();
  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><MapIcon className="h-5 w-5 text-cyber-300" /> Mapa de Cyber City</h1>
          <p className="text-xs text-white/60">8 distritos. 5 villanos. Tu única defensa: tu ingenio.</p>
        </div>
      </header>

      <div className="relative rounded-3xl border border-white/10 overflow-hidden p-4 sm:p-6">
        <div className="absolute inset-0 -z-10 opacity-70" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(0,198,255,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(155,92,255,0.18), transparent 50%)' }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {DISTRICTS.map((d, i) => {
            const v = VILLAINS[d.villain];
            const solved = player.byDistrict[d.id] || 0;
            const total = 1;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/play?district=${d.id}`}
                  onClick={() => sfx.click()}
                  className="group block relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition p-3 sm:p-4 h-full"
                >
                  <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${d.gradient}`} />
                  <div className="text-3xl sm:text-4xl">{d.emoji}</div>
                  <div className="font-display font-bold mt-1 text-sm sm:text-base leading-tight">{d.name}</div>
                  <div className="text-[11px] text-white/60 mt-0.5 line-clamp-2">{d.tagline}</div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                    <span className="text-lg">{v.emoji}</span>
                    <span className="text-white/60">Villano:</span>
                    <span className="font-bold" style={{ color: v.color }}>{v.name}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={Math.min(1, solved / total)} height={4} color={v.color} />
                    <div className="text-[10px] text-white/50 mt-1">{solved} misiones</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
