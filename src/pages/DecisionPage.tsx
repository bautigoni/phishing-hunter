import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCENARIOS, SCENARIOS_BY_ID } from '@/data/scenarios';
import { generateScenario } from '@/data/decisionGenerator';
import { useDecisions } from '@/store/decisionsStore';
import { Byte } from '@/components/Byte';
import { CharacterPortrait } from '@/components/CharacterPortrait';
import { StatBar } from '@/components/StatBar';
import { Modal } from '@/components/Modal';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { sfx } from '@/lib/sound';
import { useProcessConsequencesOnMount } from '@/lib/useDelayedConsequences';
import { STAT_COLOR, STAT_EMOJI, STAT_LABELS, type StatKey, type Scenario, type StatDelta } from '@/data/decisions';
import { Back, Check, Bolt, Coin, X, Sparkles } from '@/components/Icon';

const CHANNEL_ICON: Record<Scenario['channel'], string> = {
  chat: '💬', social: '📱', call: '📞', sms: '📩',
  email: '📧', web: '🌐', irl: '🏙️', app: '📲', inperson: '👥'
};

const CHANNEL_LABEL: Record<Scenario['channel'], string> = {
  chat: 'Mensajería', social: 'Redes sociales', call: 'Llamada', sms: 'SMS',
  email: 'Email', web: 'Web', irl: 'En la calle', app: 'App', inperson: 'En persona'
};

export function DecisionPage() {
  useProcessConsequencesOnMount();
  const params = useParams();
  const navigate = useNavigate();
  const { resolveScenario, startScenario, stats } = useDecisions();

  const scenario: Scenario | undefined = useMemo(() => {
    if (!params.id) return undefined;
    if (SCENARIOS_BY_ID[params.id]) return SCENARIOS_BY_ID[params.id];
    if (params.id.startsWith('gen-')) return generateScenario();
    return undefined;
  }, [params.id]);

  const [picked, setPicked] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<null | 'win' | 'meh' | 'bad'>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (scenario) startScenario(scenario.id);
    setPicked(null);
    setShowResult(null);
  }, [scenario?.id]);

  if (!scenario) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl">🤔</div>
        <p className="mt-2">Escenario no encontrado.</p>
        <Link to="/decisions" className="btn-primary mt-4">Volver al hub</Link>
      </div>
    );
  }

  const choice = picked !== null ? scenario.choices[picked] : null;
  const xp = 30 + scenario.difficulty * 15;
  const coins = 10 + scenario.difficulty * 5;

  function evaluateOutcome(c: { vibe?: 'safe' | 'risky' | 'neutral' | 'kind' | 'curious' | 'bold' }): 'win' | 'meh' | 'bad' {
    if (c.vibe === 'safe' || c.vibe === 'kind') return 'win';
    if (c.vibe === 'risky' || c.vibe === 'bold') return 'bad';
    return 'meh';
  }

  function commit() {
    if (!choice || !scenario) return;
    sfx.click();
    const outcome = evaluateOutcome(choice);
    if (outcome === 'win') {
      sfx.correct();
      setConfetti(true);
    } else if (outcome === 'bad') {
      sfx.wrong();
    }
    resolveScenario({
      scenarioId: scenario.id,
      choiceId: choice.id,
      immediate: {
        ...choice.immediate,
        xpDelta: outcome === 'win' ? xp : outcome === 'meh' ? Math.round(xp / 2) : Math.round(xp / 4),
        coinDelta: outcome === 'win' ? coins : outcome === 'meh' ? Math.round(coins / 2) : Math.round(coins / 4)
      },
      delayed: choice.delayed,
      choiceVibe: choice.vibe
    });
    setShowResult(outcome);
  }

  return (
    <div className="space-y-4">
      <ConfettiBurst active={confetti} />

      <header className="flex items-center gap-3 flex-wrap">
        <Link to="/decisions" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-xl sm:text-2xl font-bold">{scenario.title}</span>
            <span className="chip text-[10px]">{CHANNEL_ICON[scenario.channel]} {CHANNEL_LABEL[scenario.channel]}</span>
            <span className="chip text-[10px]">Dif. {scenario.difficulty}</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">{scenario.setup}</p>
        </div>
      </header>

      {/* Stats actuales (resumen) */}
      <section className="glass p-3 sm:p-4">
        <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Tu estado actual</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(Object.keys(stats) as StatKey[]).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <span className="text-base">{STAT_EMOJI[k]}</span>
              <div className="flex-1 min-w-0">
                <StatBar stat={k} value={stats[k]} size="sm" showLabel={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personajes */}
      <section className="glass p-4 flex flex-wrap gap-3 items-center">
        {scenario.characters.map((cid) => (
          <CharacterPortrait key={cid} id={cid} size="md" />
        ))}
        <Byte size="sm" emotion={picked === null ? 'thinking' : 'alert'}>
          {picked === null
            ? 'Lee con calma. No hay tiempo límite. Tu decisión cambia tu historia.'
            : 'Antes de confirmar, mira bien las consecuencias. ¿Es lo que quieres?'}
        </Byte>
      </section>

      {/* Mensaje del personaje */}
      <section className="glass p-5 sm:p-6">
        {scenario.sender && (
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
            Mensaje de: <span className="text-white font-bold">{scenario.sender.name}</span>
            {scenario.sender.handle && <span className="font-mono"> · {scenario.sender.handle}</span>}
          </div>
        )}
        <p className="text-base sm:text-lg leading-relaxed">{scenario.message}</p>
      </section>

      {/* Decisiones */}
      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold">¿Qué decides hacer?</h2>
        {scenario.choices.map((c, i) => {
          const isPicked = picked === i;
          return (
            <motion.button
              key={c.id}
              whileHover={{ x: 2 }}
              onClick={() => { sfx.click(); setPicked(i); }}
              className={`w-full text-left rounded-2xl border p-4 transition relative overflow-hidden ${
                isPicked
                  ? 'border-cyber-300 bg-white/10 shadow-glow'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-display font-bold ${
                  isPicked ? 'bg-cyber-300 text-ink-900' : 'bg-white/10 text-white/60'
                }`}>
                  {c.id.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{c.label}</div>
                  {isPicked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-sm text-white/80"
                    >
                      <div className="font-semibold text-neon-green">Consecuencia inmediata:</div>
                      <div>{c.immediate.headline}</div>
                      {c.immediate.detail && <div className="text-white/60 text-xs mt-0.5">{c.immediate.detail}</div>}
                      {c.immediate.delta && (
                        <DeltaChips delta={c.immediate.delta} className="mt-2" />
                      )}
                      {c.delayed && c.delayed.length > 0 && (
                        <div className="mt-2 text-xs text-neon-purple">
                          ⏳ {c.delayed.length} consecuencia{c.delayed.length > 1 ? 's' : ''} retardada{c.delayed.length > 1 ? 's' : ''} (aparecerá en {c.delayed.map(d => d.delayScenarios).join(' y ')} escenario{c.delayed.length > 1 ? 's' : ''})
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </section>

      {/* Confirmar */}
      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="sticky bottom-20 z-30 glass-strong p-3 flex items-center gap-2"
          >
            <span className="text-xs text-white/60 flex-1">
              ¿Confirmas la decisión <b className="text-white">{choice?.id.toUpperCase()}</b>?
            </span>
            <button onClick={() => { sfx.click(); setPicked(null); }} className="btn-ghost text-xs">
              <X className="h-3.5 w-3.5" /> Cambiar
            </button>
            <button onClick={commit} className="btn-primary text-xs">
              <Check className="h-3.5 w-3.5" /> Confirmar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de resultado */}
      <Modal
        open={showResult !== null}
        onClose={() => { sfx.click(); navigate('/decisions'); }}
        variant={showResult === 'win' ? 'success' : showResult === 'bad' ? 'danger' : 'default'}
        title={
          showResult === 'win' ? 'Buena decisión 👏' :
          showResult === 'bad' ? 'Cuidado ⚠️' :
          'Decisión neutral'
        }
        size="lg"
      >
        {choice && scenario && (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-white/60">Elegiste:</div>
              <div className="font-semibold">{choice.label}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="font-semibold">{choice.immediate.headline}</div>
              {choice.immediate.detail && <div className="text-xs text-white/70 mt-1">{choice.immediate.detail}</div>}
              {choice.immediate.delta && <DeltaChips delta={choice.immediate.delta} className="mt-2" />}
            </div>
            {choice.delayed && choice.delayed.length > 0 && (
              <div className="rounded-xl bg-neon-purple/10 border border-neon-purple/30 p-3">
                <div className="text-xs font-display font-bold text-neon-purple mb-1">⏳ Consecuencias en camino</div>
                <ul className="space-y-1.5 text-xs">
                  {choice.delayed.map((d, i) => (
                    <li key={i}>
                      <b>En {d.delayScenarios} escenario{d.delayScenarios > 1 ? 's' : ''}:</b> {d.headline}
                      {d.detail && <span className="text-white/60"> — {d.detail}</span>}
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-white/50 mt-2">Volverán a ti automáticamente. Estate atento.</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/50">XP ganado</div>
                <div className="font-display text-xl font-bold flex items-center justify-center gap-1">
                  <Bolt className="h-4 w-4 text-cyber-300" />+
                  {showResult === 'win' ? xp : showResult === 'meh' ? Math.round(xp/2) : Math.round(xp/4)}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/50">Monedas</div>
                <div className="font-display text-xl font-bold flex items-center justify-center gap-1">
                  <Coin className="h-4 w-4 text-neon-yellow" />+
                  {showResult === 'win' ? coins : showResult === 'meh' ? Math.round(coins/2) : Math.round(coins/4)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { sfx.click(); navigate('/decisions'); }} className="btn-ghost flex-1">Volver al hub</button>
              <button onClick={() => { sfx.click(); navigate(`/decisions/${randomUncompleted()}`); }} className="btn-primary flex-1">
                <Sparkles className="h-4 w-4" /> Otro escenario
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function DeltaChips({ delta, className }: { delta: StatDelta; className?: string }) {
  const entries = Object.entries(delta) as [StatKey, number][];
  if (entries.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className || ''}`}>
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="chip text-[10px]"
          style={{ color: v > 0 ? STAT_COLOR[k] : '#ff7a3e', borderColor: v > 0 ? STAT_COLOR[k] : '#ff7a3e' }}
        >
          {STAT_EMOJI[k]} {v > 0 ? '+' : ''}{v} {STAT_LABELS[k]}
        </span>
      ))}
    </div>
  );
}

function randomUncompleted(): string {
  const completed = useDecisions.getState().completedScenarioIds;
  const remaining = SCENARIOS.filter((s) => !completed.includes(s.id));
  const pool = remaining.length > 0 ? remaining : SCENARIOS;
  return pool[Math.floor(Math.random() * pool.length)].id;
}
