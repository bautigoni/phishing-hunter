import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MISSIONS } from '@/data/missions';
import { FAKE_PLAYERS } from '@/data/leaderboard';
import { useGame } from '@/store/gameStore';
import { Modal } from '@/components/Modal';
import { Byte } from '@/components/Byte';
import { sfx } from '@/lib/sound';
import { Back, Sword, Trophy, Fire, Star } from '@/components/Icon';

type Phase = 'menu' | 'loading' | 'countdown' | 'play' | 'result';

export function Duel() {
  const { player, recordDuelWin, addCoins } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('menu');
  const [countdown, setCountdown] = useState(3);
  const [mission, setMission] = useState(MISSIONS[0]);
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [myTime, setMyTime] = useState(0);
  const [opponentTime, setOpponentTime] = useState(0);
  const [winner, setWinner] = useState<'you' | 'opponent' | null>(null);
  const [opponent, setOpponent] = useState(FAKE_PLAYERS[0]);
  const startRef = useRef(0);
  const oppTimer = useRef<number | null>(null);

  function startDuel() {
    sfx.unlock();
    const m = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    setMission(m);
    setFoundClues([]);
    setMyTime(0);
    setOpponentTime(0);
    setWinner(null);
    setOpponent(FAKE_PLAYERS[Math.floor(Math.random() * FAKE_PLAYERS.length)]);
    setPhase('countdown');
    setCountdown(3);
  }

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) {
      setPhase('play');
      startRef.current = Date.now();
      // El "oponente" (NPC) encuentra todas las pistas en 4-9s
      const t = 4000 + Math.random() * 5000;
      oppTimer.current = window.setTimeout(() => {
        setOpponentTime(t);
        if (foundClues.length < mission.clues.length) {
          setWinner('opponent');
          sfx.wrong();
          setPhase('result');
        }
      }, t);
      return () => { if (oppTimer.current) clearTimeout(oppTimer.current); };
    }
    sfx.tick();
    const id = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  function clueClick(c: any) {
    if (phase !== 'play') return;
    if (foundClues.includes(c.id)) return;
    sfx.correct();
    const next = [...foundClues, c.id];
    setFoundClues(next);
    if (next.length >= mission.clues.length) {
      const elapsed = Date.now() - startRef.current;
      setMyTime(elapsed);
      if (oppTimer.current) clearTimeout(oppTimer.current);
      setWinner('you');
      sfx.correct();
      recordDuelWin();
      addCoins(150);
      setPhase('result');
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Sword className="h-5 w-5 text-neon-pink" /> Duelo 1v1</h1>
          <p className="text-xs text-white/60">Encuentra todas las pistas antes que tu rival.</p>
        </div>
      </header>

      {phase === 'menu' && (
        <div className="glass p-6 sm:p-10 text-center">
          <div className="text-5xl">⚔️</div>
          <h2 className="font-display text-2xl font-bold mt-2">¿Aceptas el desafío?</h2>
          <p className="text-sm text-white/60 mt-1">Compite contra un rival de la red. Quien detecte primero la estafa gana.</p>
          <button onClick={startDuel} className="btn-pink mt-5">Buscar rival</button>
        </div>
      )}

      {phase === 'countdown' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-8xl font-bold neon-text"
            >
              {countdown > 0 ? countdown : '¡YA!'}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === 'play' && (
        <div className="grid lg:grid-cols-[1fr_280px] gap-4">
          <div className="glass p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="chip text-[10px]">{mission.surface}</span>
              <span className="font-display font-bold">{mission.title}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink-700/60 p-4">
              <div className="text-xs text-white/50 mb-1">De: {mission.from.name}</div>
              <div className="text-sm">{mission.body}</div>
              {mission.link && <a onClick={(e) => e.preventDefault()} href="#" className="text-cyber-300 underline text-sm block mt-2">{mission.link.text}</a>}
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mission.clues.map((c) => {
                const found = foundClues.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => clueClick(c)}
                    disabled={found}
                    className={`p-2 rounded-lg text-xs border transition ${found ? 'border-neon-green bg-neon-green/10 text-neon-green' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <div className="font-display font-bold">{found ? '✓ ' : '🔍 '} {c.hint}</div>
                    {found && <div className="text-[10px] mt-0.5 opacity-80">{c.explanation}</div>}
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="space-y-3">
            <div className="glass p-4">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Tú</div>
              <div className="font-display font-bold">{player.name}</div>
              <div className="text-[10px] text-white/60">{foundClues.length} / {mission.clues.length} pistas</div>
            </div>
            <div className="glass p-4">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Rival</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{opponent.emoji}</span>
                <div>
                  <div className="font-display font-bold">{opponent.name}</div>
                  <div className="text-[10px] text-white/60">{opponent.tier}</div>
                </div>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  animate={{ width: ['0%', '95%'] }}
                  transition={{ duration: 5 + Math.random() * 3, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-neon-pink to-neon-purple"
                />
              </div>
            </div>
            <Byte emotion="alert" size="sm">¡Date prisa, {player.name}! Tu rival está cerca.</Byte>
          </aside>
        </div>
      )}

      <Modal open={phase === 'result'} onClose={() => setPhase('menu')} variant={winner === 'you' ? 'success' : 'danger'} title={winner === 'you' ? '¡VICTORIA!' : 'Derrota'}>
        <div className="space-y-3">
          <p className="text-sm text-white/80">
            {winner === 'you'
              ? `Ganaste el duelo en ${(myTime / 1000).toFixed(2)}s. +150 monedas, +1 victoria.`
              : `Tu rival ganó (${(opponentTime / 1000).toFixed(2)}s). ¡Entrena más y vuelve!`}
          </p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-widest text-white/50">Tú</div>
              <div className="font-display text-2xl font-bold">{foundClues.length}/{mission.clues.length}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-widest text-white/50">Rival</div>
              <div className="font-display text-2xl font-bold">{winner === 'you' ? foundClues.length : mission.clues.length}/{mission.clues.length}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={startDuel} className="btn-primary flex-1">Revancha</button>
            <button onClick={() => { sfx.click(); setPhase('menu'); }} className="btn-ghost flex-1">Salir</button>
          </div>
        </div>
      </Modal>

      <Leaderboard />
    </div>
  );
}

function Leaderboard() {
  const { player } = useGame();
  const board = [
    { name: player.name, xp: player.level * 1000 + player.xp, emoji: player.avatar, tier: 'Tú' },
    ...FAKE_PLAYERS
  ].sort((a, b) => b.xp - a.xp).slice(0, 10);

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-display font-bold flex items-center gap-2"><Trophy className="h-4 w-4 text-neon-yellow" /> Clasificación semanal</div>
          <div className="text-xs text-white/60">Top 10 agentes de Cyber City.</div>
        </div>
        <span className="chip text-[10px]">Temporada 1</span>
      </div>
      <ol className="space-y-1">
        {board.map((p, i) => {
          const isMe = p.name === player.name;
          return (
            <li key={p.name + i} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${isMe ? 'bg-white/10 border border-white/20' : 'bg-white/[0.02]'}`}>
              <span className="w-6 text-right font-display font-bold text-white/60">{i + 1}</span>
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-[10px] text-white/50">{p.tier}</div>
              </div>
              <span className="tabular-nums text-sm font-bold">{p.xp.toLocaleString()}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
