import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame, xpToNext, xpThreshold } from '@/store/gameStore';
import { Byte } from '@/components/Byte';
import { ProgressBar } from '@/components/ProgressBar';
import { DISTRICTS } from '@/data/districts';
import { sfx } from '@/lib/sound';
import {
  Bolt, Coin, Fire, Map, Sparkles, Star, Sword, Trophy, Help
} from '@/components/Icon';

export function Home() {
  const { player, completedMissions } = useGame();
  const xpNeed = xpToNext(player.level, player.xp);
  const xpTotal = xpThreshold(player.level);
  const dailyDone = 0;

  return (
    <div className="space-y-6">
      {/* Hero Cyber City */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-500/30 via-neon-purple/20 to-neon-pink/20" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-neon-purple/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyber-400/30 blur-3xl" />
        </div>

        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Cyber City</div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
              Hola, <span className="neon-text">{player.name}</span>
            </h1>
            <p className="text-white/70 mt-1 text-sm sm:text-base">The Phishers atacan la ciudad. <span className="text-white">¿Listo para defenderla?</span></p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl">
              <StatChip icon={<Star className="h-4 w-4 text-neon-yellow" />} label="Nivel" value={player.level} />
              <StatChip icon={<Bolt className="h-4 w-4 text-cyber-300" />} label="XP" value={player.xp} />
              <StatChip icon={<Coin className="h-4 w-4 text-neon-yellow" />} label="Monedas" value={player.coins} />
              <StatChip icon={<Fire className="h-4 w-4 text-neon-orange" />} label="Racha" value={player.streak} />
            </div>

            <div className="mt-5 max-w-md">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Progreso al nivel {player.level + 1}</span>
                <span className="tabular-nums">{player.xp} / {xpTotal}</span>
              </div>
              <ProgressBar value={player.xp / xpTotal} height={8} />
              <div className="text-[11px] text-white/50 mt-1">Faltan {xpNeed} XP</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/play" onClick={() => sfx.click()} className="btn-primary">
                <Sparkles className="h-4 w-4" /> Jugar ahora
              </Link>
              <Link to="/map" onClick={() => sfx.click()} className="btn-ghost">
                <Map className="h-4 w-4" /> Ver mapa
              </Link>
              <Link to="/grandma" onClick={() => sfx.click()} className="btn-pink">
                <Help className="h-4 w-4" /> ¿Caería tu abuelo?
              </Link>
            </div>
          </div>

          <div className="shrink-0">
            <Byte size="lg" emotion="happy">
              ¡Vamos, Agente! Byte te acompaña. <br />
              <span className="text-white/60 text-xs">Hay {8 - Object.keys(player.byDistrict).length} distritos sin explorar.</span>
            </Byte>
          </div>
        </div>
      </section>

      {/* Daily */}
      <DailyStrip />

      {/* Modos de juego */}
      <section>
        <SectionTitle title="Modos de juego" subtitle="Cada uno entrena una habilidad diferente." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <ModeCard to="/play" title="Misiones" emoji="🎯" desc="Resuelve estafas reales" color="from-cyber-400 to-cyber-600" />
          <ModeCard to="/decisions" title="Decisiones" emoji="🎲" desc="Causa y efecto" color="from-neon-purple to-neon-pink" />
          <ModeCard to="/duel" title="Duelo" emoji="⚔️" desc="Compite con amigos" color="from-neon-pink to-neon-orange" />
          <ModeCard to="/estafador" title="Estafador" emoji="🎭" desc="Aprende a defenderte" color="from-neon-orange to-neon-yellow" />
          <ModeCard to="/grandma" title="¿Abuelo?" emoji="👴" desc="Mecánica viral" color="from-neon-green to-cyber-300" textDark />
        </div>
      </section>

      {/* Districts */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <SectionTitle title="Distritos de Cyber City" subtitle="8 zonas. Cada villano controla una." inline />
          <Link to="/map" className="text-xs text-white/60 hover:text-white">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DISTRICTS.slice(0, 8).map((d) => {
            const solved = player.byDistrict[d.id] || 0;
            return (
              <Link
                key={d.id}
                to={`/play?district=${d.id}`}
                onClick={() => sfx.click()}
                className="group relative overflow-hidden rounded-2xl border border-white/10 p-4 hover:border-white/20 transition"
              >
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${d.gradient} opacity-40 group-hover:opacity-60 transition`} />
                <div className="text-3xl">{d.emoji}</div>
                <div className="font-display font-bold mt-1 leading-tight">{d.name}</div>
                <div className="text-[11px] text-white/60 mt-0.5 line-clamp-2">{d.tagline}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="chip text-[10px]">{solved} resueltas</span>
                  <span className="text-[10px] text-white/50">{d.villain}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Quick */}
      <section>
        <SectionTitle title="Tu nivel de seguridad" subtitle="Byte mide tu progreso." inline />
        <SecurityMeter solved={player.solved} perfect={player.perfect} streak={player.streak} />
      </section>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="glass px-3 py-2 flex items-center gap-2">
      {icon}
      <div>
        <div className="text-[9px] uppercase tracking-widest text-white/50 leading-none">{label}</div>
        <div className="text-sm font-bold tabular-nums">{value}</div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle, inline }: { title: string; subtitle?: string; inline?: boolean }) {
  return (
    <div className={inline ? '' : 'mb-3'}>
      <h2 className="font-display text-lg sm:text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
    </div>
  );
}

function ModeCard({ to, title, emoji, desc, color, textDark }: { to: string; title: string; emoji: string; desc: string; color: string; textDark?: boolean }) {
  return (
    <Link to={to} onClick={() => sfx.click()} className={`group relative overflow-hidden rounded-2xl p-4 border border-white/10 hover:border-white/20 transition`}>
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${color} opacity-40 group-hover:opacity-60 transition`} />
      <div className="text-3xl">{emoji}</div>
      <div className={`font-display font-bold mt-1 ${textDark ? 'text-ink-900' : ''}`}>{title}</div>
      <div className={`text-[11px] mt-0.5 ${textDark ? 'text-ink-900/70' : 'text-white/60'}`}>{desc}</div>
    </Link>
  );
}

function DailyStrip() {
  const { player } = useGame();
  const target = 3;
  const done = 0; // lo calculamos en Daily screen
  return (
    <div className="glass p-4 sm:p-5 flex items-center gap-4">
      <div className="text-3xl">⚡</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold">Desafíos diarios</span>
          <span className="chip text-[10px]">+150 XP</span>
        </div>
        <div className="text-xs text-white/60">{done}/{target} completados hoy</div>
        <div className="mt-2"><ProgressBar value={done / target} height={6} /></div>
      </div>
      <Link to="/daily" onClick={() => sfx.click()} className="btn-primary text-sm py-2 px-4">Empezar</Link>
    </div>
  );
}

function SecurityMeter({ solved, perfect, streak }: { solved: number; perfect: number; streak: number }) {
  const value = Math.min(1, (solved * 0.05 + perfect * 0.08 + streak * 0.02));
  const label = value < 0.2 ? 'Novato' : value < 0.45 ? 'Aprendiz' : value < 0.7 ? 'Defensor' : value < 0.9 ? 'Experto' : 'Leyenda';
  const color = value < 0.45 ? '#ff7a3e' : value < 0.7 ? '#ffe14a' : '#3eff9b';
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-display font-bold">Nivel de seguridad digital</div>
          <div className="text-xs text-white/50">{label} · {solved} misiones · {perfect} perfectas</div>
        </div>
        <Trophy className="h-7 w-7" />
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="h-full"
          style={{ background: `linear-gradient(90deg, ${color}, #00c6ff)` }}
        />
      </div>
    </div>
  );
}
