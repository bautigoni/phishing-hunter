import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SCENARIOS } from '@/data/scenarios';
import { generateScenarioBatch } from '@/data/decisionGenerator';
import { useDecisions } from '@/store/decisionsStore';
import { useProcessConsequencesOnMount } from '@/lib/useDelayedConsequences';
import { Byte } from '@/components/Byte';
import { StatBar, StatRadar } from '@/components/StatBar';
import { CharacterPortrait } from '@/components/CharacterPortrait';
import { sfx } from '@/lib/sound';
import { Sparkles, Back, Bolt, Coin, Fire, Help, Star, Trophy } from '@/components/Icon';
import type { Scenario } from '@/data/decisions';

export function DecisionsHub() {
  useProcessConsequencesOnMount();
  const { stats, money, history, pending, scenariosPlayed, decisionsCount, totalXp, totalCoins, reputationTags, completedScenarioIds } = useDecisions();
  const [filter, setFilter] = useState<'all' | 'social' | 'finanzas' | 'identidad' | 'gaming' | 'familia' | 'trabajo' | 'datos' | 'ia'>('all');
  const [aiBatch, setAiBatch] = useState<Scenario[]>([]);

  // Generar lote IA al cargar.
  useEffect(() => {
    setAiBatch(generateScenarioBatch(3));
  }, []);

  const filtered = useMemo(() => {
    return SCENARIOS.filter((s) => filter === 'all' || s.theme === filter);
  }, [filter]);

  // Top 3 escenarios pendientes (no completados).
  const available = filtered.filter((s) => !completedScenarioIds.includes(s.id)).slice(0, 6);

  const filters: { id: typeof filter; label: string; emoji: string }[] = [
    { id: 'all', label: 'Todos', emoji: '🌐' },
    { id: 'social', label: 'Social', emoji: '📱' },
    { id: 'finanzas', label: 'Finanzas', emoji: '💰' },
    { id: 'identidad', label: 'Identidad', emoji: '🎭' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'familia', label: 'Familia', emoji: '👨‍👩‍👧' },
    { id: 'trabajo', label: 'Trabajo', emoji: '💼' },
    { id: 'datos', label: 'Datos', emoji: '🔒' },
    { id: 'ia', label: 'IA', emoji: '🤖' }
  ];

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3 flex-wrap">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-neon-purple" /> Cyber Decisions
          </h1>
          <p className="text-xs text-white/60">Decisiones con consecuencias. Nada de cuestionarios.</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <div className="chip"><Bolt className="h-3.5 w-3.5 text-cyber-300" /> {totalXp} XP</div>
          <div className="chip"><Coin className="h-3.5 w-3.5 text-neon-yellow" /> {totalCoins}</div>
          <div className="chip"><Trophy className="h-3.5 w-3.5 text-neon-purple" /> {decisionsCount} decisiones</div>
        </div>
      </header>

      {/* Resumen de stats y narrativa */}
      <section className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-lg font-bold">Tu huella digital</h2>
              <p className="text-xs text-white/60">Cómo te recuerda Cyber City.</p>
            </div>
            {pending.length > 0 && (
              <span className="chip text-[10px] border-neon-purple/40 text-neon-purple">
                {pending.length} consecuencia{pending.length > 1 ? 's' : ''} en camino
              </span>
            )}
          </div>
          <StatRadar stats={stats} />
        </div>

        <aside className="space-y-3">
          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Tu identidad narrativa</div>
            <div className="flex flex-wrap gap-1.5">
              {reputationTags.length === 0 ? (
                <span className="text-xs text-white/50">Aún sin etiquetas. Juega tu primer escenario.</span>
              ) : (
                reputationTags.slice(0, 10).map((t) => (
                  <span key={t} className="chip text-[10px]">🏷️ {t}</span>
                ))
              )}
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Saldo Cyber City</div>
            <div className="font-display text-2xl font-bold">€{money.toFixed(0)}</div>
            <div className="text-[10px] text-white/50 mt-1">Escenarios jugados: {scenariosPlayed}</div>
          </div>
          <Byte emotion="thinking">
            Cada decisión cambia tu historia. Algunas consecuencias tardan varios escenarios en llegar. Eso es lo que lo hace real.
          </Byte>
        </aside>
      </section>

      {/* Filtros */}
      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); sfx.click(); }}
              className={`shrink-0 chip text-xs ${filter === f.id ? 'border-cyber-300 bg-cyber-300/10 text-white' : 'hover:border-white/20'}`}
            >
              <span className="text-base leading-none">{f.emoji}</span> {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Lote IA destacado */}
      {aiBatch.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-neon-pink" /> Generados por IA para ti
              </h2>
              <p className="text-xs text-white/60">Escenarios nuevos en cada visita. Infinito.</p>
            </div>
            <button
              onClick={() => { sfx.click(); setAiBatch(generateScenarioBatch(3)); }}
              className="btn-ghost text-xs"
            >
              Regenerar
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {aiBatch.map((s) => (
              <ScenarioCard key={s.id} s={s} ai />
            ))}
          </div>
        </section>
      )}

      {/* Escenarios curados */}
      <section>
        <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-neon-yellow" /> 50 escenarios curados
        </h2>
        {available.length === 0 ? (
          <div className="glass p-6 text-center text-white/60">
            <div className="text-3xl">🏆</div>
            <p className="mt-1">Has completado todos los escenarios de este filtro. ¡Increíble!</p>
            <Link to="/" onClick={() => sfx.click()} className="btn-primary mt-3">Volver al inicio</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {available.map((s) => (
              <ScenarioCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </section>

      {/* Atajos */}
      <section className="grid sm:grid-cols-3 gap-3">
        <Link to="/decisions/history" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="text-2xl">📜</div>
          <div className="font-display font-bold mt-1">Tu historia</div>
          <div className="text-xs text-white/60">Decisiones pasadas y consecuencias que ya llegaron.</div>
        </Link>
        <Link to="/decisions/pending" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="text-2xl">⏳</div>
          <div className="font-display font-bold mt-1">Consecuencias pendientes</div>
          <div className="text-xs text-white/60">{pending.length} en cola. Algunas se disparan pronto.</div>
        </Link>
        <Link to="/decisions/stats" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="text-2xl">📊</div>
          <div className="font-display font-bold mt-1">Análisis profundo</div>
          <div className="text-xs text-white/60">Tus patrones de decisión.</div>
        </Link>
      </section>
    </div>
  );
}

function ScenarioCard({ s, ai }: { s: Scenario; ai?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative glass p-4 border border-white/10 hover:border-white/20 transition overflow-hidden"
    >
      <div className="absolute -z-10 inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(155,92,255,0.25), transparent 60%)' }} />
      <div className="flex items-center gap-2 mb-2">
        <span className="chip text-[10px]">{s.theme}</span>
        {ai && <span className="chip text-[10px] border-neon-pink/40 text-neon-pink">IA</span>}
        <span className="chip text-[10px]">Dif. {s.difficulty}</span>
      </div>
      <div className="font-display font-bold leading-tight">{s.title}</div>
      <div className="text-xs text-white/60 mt-1 line-clamp-2">{s.message}</div>
      <div className="mt-3 flex items-center gap-2">
        {s.characters.slice(0, 2).map((cid) => (
          <CharacterPortrait key={cid} id={cid} size="sm" />
        ))}
      </div>
      <Link to={`/decisions/${s.id}`} onClick={() => sfx.click()} className="btn-primary text-xs w-full mt-3 py-2">
        Tomar decisión
      </Link>
    </motion.div>
  );
}
