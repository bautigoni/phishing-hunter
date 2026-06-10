import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DISTRICTS } from '@/data/districts';
import { MISSIONS, type Difficulty, type Mission } from '@/data/missions';
import { useGame } from '@/store/gameStore';
import { Byte } from '@/components/Byte';
import { sfx } from '@/lib/sound';
import { Sparkles, Bolt, Star, Map, Back } from '@/components/Icon';

const DIFF: { id: Difficulty; label: string; color: string; desc: string }[] = [
  { id: 'principiante', label: 'Principiante', color: '#3eff9b', desc: 'Estafas obvias' },
  { id: 'intermedio', label: 'Intermedio', color: '#00c6ff', desc: 'Estafas realistas' },
  { id: 'avanzado', label: 'Avanzado', color: '#ff7a3e', desc: 'Estafas casi perfectas' },
  { id: 'experto', label: 'Experto', color: '#ff3ea5', desc: 'Ataques modernos' }
];

export function Play() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const districtId = params.get('district') || '';
  const [difficulty, setDifficulty] = useState<Difficulty>('intermedio');
  const { player } = useGame();

  const missions: Mission[] = useMemo(() => {
    if (districtId) {
      return MISSIONS.filter((m) => m.district === districtId);
    }
    return MISSIONS.filter((m) => m.difficulty === difficulty);
  }, [districtId, difficulty]);

  const district = DISTRICTS.find((d) => d.id === districtId);

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neon-yellow" /> {district ? district.name : 'Elige tu misión'}
          </h1>
          <p className="text-xs text-white/60">{district ? district.tagline : 'Combina distrito y dificultad para empezar.'}</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        <aside className="space-y-4">
          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Dificultad</div>
            <div className="grid grid-cols-2 gap-2">
              {DIFF.map((d) => {
                const active = difficulty === d.id && !districtId;
                return (
                  <button
                    key={d.id}
                    onClick={() => { setDifficulty(d.id); setParams({}); sfx.click(); }}
                    className={`text-left rounded-xl p-3 border transition ${active ? 'border-white/40 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                    style={{ boxShadow: active ? `0 0 0 1px ${d.color}` : 'none' }}
                  >
                    <div className="font-display font-bold text-sm" style={{ color: d.color }}>{d.label}</div>
                    <div className="text-[10px] text-white/60">{d.desc}</div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { setParams({}); sfx.click(); }}
              className="w-full btn-ghost text-xs mt-3"
            >
              <Map className="h-3.5 w-3.5" /> Quitar filtro de distrito
            </button>
          </div>

          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Distritos</div>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
              {DISTRICTS.map((d) => {
                const active = districtId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => { setParams({ district: d.id }); sfx.click(); }}
                    className={`text-left rounded-xl p-2 border transition ${active ? 'border-white/40 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{d.emoji}</span>
                      <div className="text-xs font-bold leading-tight">{d.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Byte emotion="thinking">
            {district
              ? `Cuidado con ${district.name}. Aquí manda un villano.`
              : 'Selecciona un distrito o dificultad para empezar.'}
          </Byte>
        </aside>

        <section className="space-y-3">
          {missions.length === 0 ? (
            <EmptyState />
          ) : (
            missions.map((m) => (
              <MissionCard key={m.id} mission={m} solved={player.byDistrict[m.district] || 0} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function MissionCard({ mission, solved }: { mission: Mission; solved: number }) {
  const navigate = useNavigate();
  const diff = DIFF.find((d) => d.id === mission.difficulty)!;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={() => { sfx.click(); navigate(`/play/${mission.id}`); }}
      className="w-full text-left glass p-4 sm:p-5 border border-white/10 hover:border-white/20 transition relative overflow-hidden"
    >
      <div className="absolute -z-10 inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 100% 0%, ${diff.color}40, transparent 50%)` }} />
      <div className="flex items-start gap-3">
        <div className="text-3xl">{surfaceEmoji(mission.surface)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold leading-tight">{mission.title}</span>
            <span className="chip text-[10px]" style={{ color: diff.color, borderColor: diff.color }}>{diff.label}</span>
            <span className="chip text-[10px]">{mission.surface}</span>
          </div>
          <div className="text-xs text-white/60 mt-1 line-clamp-2">{mission.body}</div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-white/70">
            <span className="flex items-center gap-1"><Bolt className="h-3.5 w-3.5 text-cyber-300" />{mission.xp} XP</span>
            <span className="flex items-center gap-1">⭐ {mission.coins}</span>
            <span className="ml-auto text-white/40">Distrito: {mission.district}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function surfaceEmoji(s: Mission['surface']) {
  return s === 'email' ? '📧' : s === 'sms' ? '💬' : s === 'web' ? '🌐' : s === 'social' ? '📱' : s === 'chat' ? '🗨️' : '👤';
}

function EmptyState() {
  return (
    <div className="glass p-10 text-center">
      <div className="text-5xl mb-3">🛰️</div>
      <div className="font-display text-lg font-bold">No hay misiones con ese filtro</div>
      <p className="text-xs text-white/60 mt-1">Prueba otra dificultad o distrito.</p>
    </div>
  );
}
