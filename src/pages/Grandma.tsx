import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/store/gameStore';
import { Modal } from '@/components/Modal';
import { Byte } from '@/components/Byte';
import { sfx } from '@/lib/sound';
import { Back, Help, Fire, Share } from '@/components/Icon';
import { MISSIONS } from '@/data/missions';

export function Grandma() {
  const { player, recordGrandma } = useGame();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<'child' | 'teen' | 'adult' | 'grandma' | null>(null);
  const mission = MISSIONS[Math.floor(Date.now() / 86400000) % MISSIONS.length];

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Help className="h-5 w-5 text-neon-green" /> ¿Caería tu abuelo?</h1>
          <p className="text-xs text-white/60">La mecánica viral. Predice y compara con tus amigos.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="glass p-5 sm:p-6">
          <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Estafa del día</div>
          <div className="rounded-2xl border border-white/10 bg-ink-700/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyber-300 to-neon-purple" />
              <div>
                <div className="font-display font-bold text-sm">{mission.from.name}</div>
                <div className="text-[10px] font-mono text-white/60">{mission.from.handle}</div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-semibold">{mission.subject}</div>
              <div className="text-sm">{mission.body}</div>
              {mission.link && <a onClick={(e) => e.preventDefault()} href="#" className="text-cyber-300 underline text-sm">{mission.link.text}</a>}
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="text-sm text-white/60">¿Quién crees que caería en esta estafa?</div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['child', 'teen', 'adult', 'grandma'] as const).map((k) => (
                <motion.button
                  key={k}
                  whileHover={{ y: -3 }}
                  onClick={() => { sfx.click(); setPicked(k); recordGrandma(); setOpen(true); }}
                  className={`p-4 rounded-2xl border-2 transition ${picked === k ? 'border-neon-pink bg-neon-pink/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="text-5xl">{k === 'child' ? '🧒' : k === 'teen' ? '🧑' : k === 'adult' ? '🧔' : '👴'}</div>
                  <div className="font-display font-bold mt-2">{k === 'child' ? 'Niño' : k === 'teen' ? 'Adolescente' : k === 'adult' ? 'Adulto' : 'Abuelo/a'}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-3">
          <div className="glass p-4">
            <div className="font-display font-bold">¿Por qué es viral?</div>
            <p className="text-xs text-white/70 mt-1">Porque genera conversación. La gente habla de sus abuelos, se ríe, debate… y aprende sin darse cuenta.</p>
          </div>
          <div className="glass p-4">
            <div className="font-display font-bold">Tus predicciones</div>
            <div className="text-3xl font-display font-bold mt-1">{player.grandmaGuesses}</div>
            <div className="text-[10px] text-white/50">predicciones acumuladas</div>
          </div>
          <div className="glass p-4">
            <div className="font-display font-bold">Comparte</div>
            <p className="text-xs text-white/70 mt-1">Reto a tus amigos: ¿ellos también cayeron?</p>
            <button onClick={() => { sfx.click(); shareResult(picked); }} className="btn-pink w-full mt-2 text-sm py-2">
              <Share className="h-4 w-4" /> Compartir resultado
            </button>
          </div>
          <Byte emotion="celebrate">
            Mi abuela usa Firewall como antivirus. ¡Cazadores natos!
          </Byte>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} variant="pink" title="Predicción enviada" size="lg">
        <p className="text-sm text-white/80">¡Buena predicción! Aquí tienes los datos (simulados) de cómo diferentes grupos reaccionan ante este tipo de estafa.</p>
        <div className="mt-3 space-y-2">
          {[
            { k: 'child', l: 'Niño', e: '🧒', v: 58 },
            { k: 'teen', l: 'Adolescente', e: '🧑', v: 44 },
            { k: 'adult', l: 'Adulto', e: '🧔', v: 25 },
            { k: 'grandma', l: 'Abuelo/a', e: '👴', v: 68 }
          ].map((g) => (
            <div key={g.k} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{g.e} {g.l}</span>
                <span className="tabular-nums">{g.v}% caería</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-green via-neon-yellow to-neon-pink" style={{ width: `${g.v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/80">
          💡 Consejo: habla con tu familia. Enseña estas señales. Una conversación de 5 minutos puede evitar una estafa de 500€.
        </div>
      </Modal>
    </div>
  );
}

function shareResult(picked: 'child' | 'teen' | 'adult' | 'grandma' | null) {
  const text = `Acabo de jugar ¿Caería tu abuelo? en Phishing Hunter. Yo predije: ${picked}. ¿Tú qué crees? ${window.location.origin}`;
  if ((navigator as any).share) {
    (navigator as any).share({ title: 'Phishing Hunter', text, url: window.location.origin }).catch(() => {});
  } else {
    try { navigator.clipboard?.writeText(text); } catch {}
    alert('Resultado copiado al portapapeles. ¡Compártelo!');
  }
}
