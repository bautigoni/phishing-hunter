import { Link } from 'react-router-dom';
import { useGame, xpThreshold } from '@/store/gameStore';
import { ProgressBar } from '@/components/ProgressBar';
import { Byte } from '@/components/Byte';
import { Modal } from '@/components/Modal';
import { ACHIEVEMENTS } from '@/data/achievements';
import { useState } from 'react';
import { sfx } from '@/lib/sound';
import { Back, Trophy, Star, Fire, Bolt, Coin, Sparkles, Help } from '@/components/Icon';

const AVATARS = ['🛡️', '🦊', '🐼', '🐯', '🐲', '🦄', '🐺', '🦅', '🐱', '🐶', '🦝', '🐨', '🧑‍🚀', '🧙', '🥷', '🤖'];

export function Profile() {
  const { player, setName, setAvatar, avatar, unlockedAchievements, resetAll } = useGame();
  const [open, setOpen] = useState<'name' | 'avatar' | 'reset' | null>(null);
  const [name, setNameInput] = useState(player.name);

  const xpTotal = xpThreshold(player.level);
  const achCount = unlockedAchievements.length;
  const achTotal = ACHIEVEMENTS.length;

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Trophy className="h-5 w-5 text-neon-yellow" /> Perfil del Agente</h1>
          <p className="text-xs text-white/60">Tu identidad en Cyber City.</p>
        </div>
      </header>

      <section className="glass p-5 sm:p-6 flex flex-wrap items-center gap-5">
        <button onClick={() => { sfx.click(); setOpen('avatar'); }} className="h-24 w-24 rounded-3xl bg-gradient-to-br from-cyber-300 via-neon-purple to-neon-pink flex items-center justify-center text-5xl shadow-glow animate-floaty">
          {avatar}
        </button>
        <div className="flex-1 min-w-[200px]">
          <button onClick={() => { sfx.click(); setOpen('name'); }} className="font-display text-2xl font-bold hover:underline">{player.name}</button>
          <div className="text-xs text-white/60 mt-0.5">Nivel {player.level} · {player.xp} XP</div>
          <div className="mt-2 max-w-md"><ProgressBar value={player.xp / xpTotal} /></div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Stat label="XP" value={player.xp} icon={<Bolt className="h-3.5 w-3.5 text-cyber-300" />} />
            <Stat label="Monedas" value={player.coins} icon={<Coin className="h-3.5 w-3.5 text-neon-yellow" />} />
            <Stat label="Racha" value={player.streak} icon={<Fire className="h-3.5 w-3.5 text-neon-orange" />} />
            <Stat label="Mejor" value={player.bestStreak} icon={<Star className="h-3.5 w-3.5 text-neon-yellow" />} />
            <Stat label="Logros" value={`${achCount}/${achTotal}`} icon={<Trophy className="h-3.5 w-3.5 text-neon-purple" />} />
          </div>
        </div>
        <Byte size="md" emotion="happy">
          ¡Sigue así, {player.name}! Cada misión te hace más fuerte.
        </Byte>
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link to="/achievements" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-2xl">🏅</div>
            <div>
              <div className="font-display font-bold">Logros</div>
              <div className="text-xs text-white/60">Más de 100. ¿Cuántos tienes?</div>
            </div>
          </div>
        </Link>
        <Link to="/stats" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-cyber-400/20 border border-cyber-400/30 flex items-center justify-center text-2xl">📊</div>
            <div>
              <div className="font-display font-bold">Estadísticas</div>
              <div className="text-xs text-white/60">Tu evolución y áreas a mejorar.</div>
            </div>
          </div>
        </Link>
        <Link to="/estafador" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center text-2xl">🎭</div>
            <div>
              <div className="font-display font-bold">Modo Estafador</div>
              <div className="text-xs text-white/60">Aprende cómo piensa un villano.</div>
            </div>
          </div>
        </Link>
        <Link to="/decisions" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-2xl">🎲</div>
            <div>
              <div className="font-display font-bold">Cyber Decisions</div>
              <div className="text-xs text-white/60">Decisiones con consecuencias retardadas.</div>
            </div>
          </div>
        </Link>
        <Link to="/grandma" onClick={() => sfx.click()} className="glass p-4 hover:border-white/20 transition">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-neon-green/20 border border-neon-green/30 flex items-center justify-center text-2xl">👴</div>
            <div>
              <div className="font-display font-bold">¿Caería tu abuelo?</div>
              <div className="text-xs text-white/60">Mecánica viral. Compártela.</div>
            </div>
          </div>
        </Link>
      </div>

      <section className="glass p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-bold">Zona peligrosa</div>
            <div className="text-xs text-white/60">Borrar todo tu progreso.</div>
          </div>
          <button onClick={() => { sfx.click(); setOpen('reset'); }} className="btn-ghost text-xs text-neon-red">Reiniciar</button>
        </div>
      </section>

      <Modal open={open === 'name'} onClose={() => setOpen(null)} title="Cambiar nombre">
        <input
          value={name}
          onChange={(e) => setNameInput(e.target.value)}
          maxLength={20}
          className="w-full bg-ink-900 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-cyber-300"
        />
        <button onClick={() => { sfx.unlock(); setName(name); setOpen(null); }} className="btn-primary w-full mt-3">Guardar</button>
      </Modal>

      <Modal open={open === 'avatar'} onClose={() => setOpen(null)} title="Elige tu avatar" size="lg">
        <div className="grid grid-cols-8 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => { sfx.click(); setAvatar(a); setOpen(null); }}
              className={`aspect-square text-2xl rounded-xl border ${avatar === a ? 'border-cyber-300 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={open === 'reset'} onClose={() => setOpen(null)} variant="danger" title="¿Borrar todo?">
        <p className="text-sm text-white/80">Esto eliminará tu progreso, monedas, inventario y logros. No se puede deshacer.</p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setOpen(null)} className="btn-ghost flex-1">Cancelar</button>
          <button onClick={() => { resetAll(); setOpen(null); }} className="btn-pink flex-1">Sí, borrar</button>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="chip">
      {icon}<span className="text-[10px] uppercase tracking-widest text-white/50">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}
