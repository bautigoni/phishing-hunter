import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SCENARIOS_BY_ID } from '@/data/scenarios';
import { useDecisions } from '@/store/decisionsStore';
import { useProcessConsequencesOnMount } from '@/lib/useDelayedConsequences';
import { Byte } from '@/components/Byte';
import { sfx } from '@/lib/sound';
import { Back, Sparkles } from '@/components/Icon';
import { STAT_EMOJI, STAT_LABELS, type StatKey } from '@/data/decisions';

const TAG_COLOR: Record<string, string> = {
  cuidadoso: '#3eff9b',
  imprudente: '#ff3e6a',
  educador: '#9b5cff',
  protector: '#00c6ff',
  neutral: '#a4d7ff'
};

export function DecisionsHistory() {
  useProcessConsequencesOnMount();
  const { history } = useDecisions();
  const reversed = [...history].reverse();

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/decisions" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neon-purple" /> Tu historia
          </h1>
          <p className="text-xs text-white/60">Cada decisión dejó huella. Aquí ves el camino.</p>
        </div>
      </header>

      {reversed.length === 0 ? (
        <div className="glass p-10 text-center">
          <div className="text-5xl">📜</div>
          <p className="mt-2 text-white/70">Aún no has tomado decisiones. Empieza por un escenario en el hub.</p>
          <Link to="/decisions" className="btn-primary mt-3">Ir al hub</Link>
        </div>
      ) : (
        <ol className="space-y-2">
          {reversed.map((h, i) => {
            const scen = SCENARIOS_BY_ID[h.scenarioId];
            const choice = scen?.choices.find((c) => c.id === h.choiceId);
            return (
              <motion.li
                key={h.at + '-' + i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass p-3 sm:p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{i === 0 ? '🆕' : '🕓'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold leading-tight">{scen?.title || h.scenarioId}</div>
                    <div className="text-[10px] text-white/50 mt-0.5">{new Date(h.at).toLocaleString()}</div>
                    {choice && (
                      <div className="mt-2 text-sm">
                        <span className="text-white/60">Elegiste:</span> <b>{choice.label}</b>
                      </div>
                    )}
                    {choice?.immediate && (
                      <div className="text-xs text-white/70 mt-1">{choice.immediate.headline}</div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {h.rememberedAs && (
                        <span
                          className="chip text-[10px]"
                          style={{ color: TAG_COLOR[h.rememberedAs] || '#fff', borderColor: TAG_COLOR[h.rememberedAs] || '#fff' }}
                        >
                          🏷️ {h.rememberedAs}
                        </span>
                      )}
                      {h.flagsGained.slice(0, 4).map((f) => (
                        <span key={f} className="chip text-[10px]">⚑ {f}</span>
                      ))}
                    </div>
                    {choice?.immediate.delta && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {Object.entries(choice.immediate.delta).map(([k, v]) => (
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
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}

      <Byte emotion="celebrate">
        Cada decisión que tomaste te hizo más fuerte (o no). Lo importante: aprendiste algo.
      </Byte>
    </div>
  );
}
