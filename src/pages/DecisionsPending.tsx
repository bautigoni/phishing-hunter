import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SCENARIOS_BY_ID } from '@/data/scenarios';
import { useDecisions } from '@/store/decisionsStore';
import { useProcessConsequencesOnMount } from '@/lib/useDelayedConsequences';
import { sfx } from '@/lib/sound';
import { Back } from '@/components/Icon';
import { STAT_EMOJI, STAT_LABELS, type StatKey } from '@/data/decisions';

export function DecisionsPending() {
  useProcessConsequencesOnMount();
  const { pending } = useDecisions();

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/decisions" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold">⏳ Consecuencias pendientes</h1>
          <p className="text-xs text-white/60">Se disparan automáticamente al jugar otro escenario. Algunas en 1, otras en 3.</p>
        </div>
      </header>

      {pending.length === 0 ? (
        <div className="glass p-10 text-center">
          <div className="text-5xl">✅</div>
          <p className="mt-2 text-white/70">Sin consecuencias pendientes. Tómate un respiro.</p>
          <Link to="/decisions" className="btn-primary mt-3">Volver al hub</Link>
        </div>
      ) : (
        <ol className="space-y-2">
          {pending
            .slice()
            .sort((a, b) => a.remaining - b.remaining)
            .map((p, i) => {
              const scen = SCENARIOS_BY_ID[p.scenarioId];
              return (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center font-display font-bold">
                      {p.remaining}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold leading-tight">{p.headline}</div>
                      {p.detail && <div className="text-xs text-white/60 mt-0.5">{p.detail}</div>}
                      <div className="text-[10px] text-white/50 mt-1">
                        Origen: {scen?.title || p.scenarioId} · en {p.remaining} escenario{p.remaining > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  {p.delta && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(p.delta).map(([k, v]) => (
                        <span
                          key={k}
                          className="chip text-[10px]"
                          style={{ color: (v as number) > 0 ? '#3eff9b' : '#ff3e6a', borderColor: (v as number) > 0 ? '#3eff9b' : '#ff3e6a' }}
                        >
                          {STAT_EMOJI[k as StatKey]} {STAT_LABELS[k as StatKey]} {(v as number) > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.li>
              );
            })}
        </ol>
      )}
    </div>
  );
}
