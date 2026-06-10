import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mission, Clue, Surface } from '@/data/missions';
import { MISSIONS } from '@/data/missions';
import { useGame } from '@/store/gameStore';
import { dailyCache } from '@/store/dailyCache';
import { Byte } from '@/components/Byte';
import { Modal } from '@/components/Modal';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { pushFloat } from '@/components/XpFloater';
import { sfx } from '@/lib/sound';
import { VILLAINS } from '@/data/villains';
import { DISTRICTS } from '@/data/districts';
import { Back, Check, X, Sparkles, Help, Fire, Coin, Star, Bolt } from '@/components/Icon';

interface MissionPageProps {
  daily?: boolean;
}

export function MissionPage({ daily }: MissionPageProps) {
  const params = useParams();
  const navigate = useNavigate();
  const { player, registerSolve, markDailyDone, daily: dailyState } = useGame();
  const [confetti, setConfetti] = useState(false);
  const [showResult, setShowResult] = useState<null | 'win' | 'fail'>(null);
  const [showGrandma, setShowGrandma] = useState(false);
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [wrongClicks, setWrongClicks] = useState(0);
  const startRef = useRef(Date.now());
  const [timeLeft, setTimeLeft] = useState(60);

  const mission: Mission | undefined = useMemo(() => {
    if (daily) {
      const idx = Number(params.idx || 0);
      if (dailyState && dailyState.missionIds[idx]) {
        const id = dailyState.missionIds[idx];
        return dailyCache.get(id) || MISSIONS.find((m) => m.id === id);
      }
    }
    if (params.missionId) return MISSIONS.find((m) => m.id === params.missionId);
    return undefined;
  }, [params, daily, dailyState]);

  useEffect(() => {
    if (!mission) return;
    startRef.current = Date.now();
    setFoundClues([]);
    setWrongClicks(0);
    setShowResult(null);
    setShowGrandma(false);
    setTimeLeft(60);
  }, [mission?.id]);

  useEffect(() => {
    if (!mission || showResult) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          finish(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mission?.id, showResult]);

  if (!mission) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl">🤔</div>
        <p className="mt-2">Misión no encontrada.</p>
        <Link to="/play" className="btn-primary mt-4">Volver</Link>
      </div>
    );
  }

  const totalClues = mission.clues.length;
  const required = Math.max(1, Math.ceil(totalClues * 0.6)); // 60% requerido
  const isWin = foundClues.length >= required;
  const perfect = wrongClicks === 0 && foundClues.length === totalClues;
  const v = VILLAINS[mission.villain];
  const d = DISTRICTS.find((x) => x.id === mission.district);

  function onClueClick(c: Clue) {
    if (showResult) return;
    if (foundClues.includes(c.id)) return;
    sfx.correct();
    setFoundClues((arr) => [...arr, c.id]);
    pushFloat('+1 pista', v.color);
  }

  function onWrongClick() {
    if (showResult) return;
    sfx.wrong();
    setWrongClicks((n) => n + 1);
  }

  function finish(forced?: boolean) {
    const ms = Date.now() - startRef.current;
    if (isWin || forced === true) {
      sfx.correct();
      setConfetti(true);
      setShowResult('win');
      registerSolve({
        missionId: mission!.id,
        district: mission!.district,
        villain: mission!.villain,
        xp: mission!.xp + (perfect ? 50 : 0),
        coins: mission!.coins + (perfect ? 20 : 0),
        perfect,
        ms
      });
      if (daily && dailyState) markDailyDone(mission!.id);
    } else {
      sfx.wrong();
      setShowResult('fail');
    }
  }

  return (
    <div className="space-y-4">
      <ConfettiBurst active={confetti} />

      {/* Header */}
      <header className="flex items-center gap-3 flex-wrap">
        <Link to="/play" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-xl sm:text-2xl font-bold leading-tight">{mission.title}</span>
            <span className="chip text-[10px]" style={{ color: v.color, borderColor: v.color }}>{v.emoji} {v.name}</span>
            <span className="chip text-[10px]">{d?.emoji} {d?.name}</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">Encuentra al menos {required} de {totalClues} pistas. Cuidado con los clicks falsos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="chip"><Fire className="h-3.5 w-3.5 text-neon-orange" /> {player.streak}</div>
          <div className={`chip tabular-nums ${timeLeft < 10 ? 'text-neon-red' : ''}`}>⏱️ {timeLeft}s</div>
        </div>
      </header>

      {/* Byte speech */}
      <div className="glass p-3 sm:p-4 flex items-start gap-3">
        <Byte size="sm" emotion="thinking">
          Inspecciona el mensaje. Toca cada parte sospechosa. ¡Las pistas correctas brillarán!
        </Byte>
      </div>

      {/* The case */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <CaseSurface mission={mission} foundClues={foundClues} onClue={onClueClick} onWrong={onWrongClick} />

        <aside className="space-y-3">
          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Pistas encontradas</div>
            <div className="text-3xl font-display font-bold">
              {foundClues.length}<span className="text-white/40 text-lg"> / {totalClues}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyber-300 to-neon-pink transition-all" style={{ width: `${(foundClues.length / totalClues) * 100}%` }} />
            </div>
            <button
              onClick={() => finish()}
              disabled={showResult !== null}
              className="w-full btn-primary mt-4"
            >
              <Check className="h-4 w-4" /> Denunciar estafa
            </button>
            <button onClick={() => { sfx.click(); finish(false); }} className="w-full btn-ghost text-xs mt-2">
              <X className="h-3.5 w-3.5" /> Marcar como legítimo (incorrecto)
            </button>
          </div>

          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Acciones</div>
            <button onClick={() => { sfx.click(); setShowGrandma(true); }} className="w-full btn-pink text-sm py-2">
              <Help className="h-4 w-4" /> ¿Caería tu abuelo?
            </button>
            <p className="text-[10px] text-white/50 mt-2">Predice quién caería. Comparte con tus amigos.</p>
          </div>

          <div className="glass p-4 text-xs text-white/60">
            <div className="font-display font-bold text-white text-sm mb-1">Recompensas</div>
            <div className="flex items-center gap-2"><Bolt className="h-3.5 w-3.5 text-cyber-300" /> {mission.xp} XP{perfect && <span className="text-neon-green"> +50 (perfecta)</span>}</div>
            <div className="flex items-center gap-2"><Coin className="h-3.5 w-3.5 text-neon-yellow" /> {mission.coins} monedas{perfect && <span className="text-neon-green"> +20</span>}</div>
          </div>
        </aside>
      </div>

      {/* Result Modal */}
      <Modal open={showResult === 'win'} onClose={() => navigate('/play')} variant="success" title={perfect ? '¡PERFECTA! 🏆' : '¡Misión cumplida!'}>
        <div className="space-y-3">
          <p className="text-sm text-white/80">Has encontrado <b className="text-white">{foundClues.length}/{totalClues}</b> pistas. La ciudad está más segura gracias a ti.</p>
          <div className="grid grid-cols-3 gap-2">
            <RewardChip icon={<Bolt className="h-4 w-4 text-cyber-300" />} label="XP" value={mission.xp + (perfect ? 50 : 0)} />
            <RewardChip icon={<Coin className="h-4 w-4 text-neon-yellow" />} label="Monedas" value={mission.coins + (perfect ? 20 : 0)} />
            <RewardChip icon={<Star className="h-4 w-4 text-neon-yellow" />} label="Racha" value={player.streak} />
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs">
            <div className="font-display font-bold text-white text-sm mb-1">Lo que el villano usó:</div>
            <ul className="list-disc list-inside text-white/70 space-y-0.5">
              {mission.redFlags.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { sfx.click(); navigate('/play'); }} className="btn-ghost flex-1">Más misiones</button>
            <button onClick={() => { sfx.click(); navigate('/grandma'); }} className="btn-pink flex-1"><Help className="h-4 w-4" /> ¿Caería tu abuelo?</button>
          </div>
        </div>
      </Modal>

      <Modal open={showResult === 'fail'} onClose={() => navigate('/play')} variant="danger" title="¡Cuidado!">
        <div className="space-y-3">
          <p className="text-sm text-white/80">No encontraste suficientes pistas. El villano se salió con la suya. ¡Aprende y vuelve!</p>
          <ul className="text-xs text-white/70 list-disc list-inside space-y-1">
            {mission.clues.map((c) => <li key={c.id}><b>{c.hint}:</b> {c.explanation}</li>)}
          </ul>
          <button onClick={() => { sfx.click(); navigate('/play'); }} className="btn-primary w-full">Volver al mapa</button>
        </div>
      </Modal>

      {/* Grandma modal */}
      <GrandmaModal open={showGrandma} onClose={() => setShowGrandma(false)} mission={mission} />
    </div>
  );
}

function RewardChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-white/50">{icon}{label}</div>
      <div className="text-lg font-display font-bold">+{value}</div>
    </div>
  );
}

/* ============================================
   THE SURFACES
   ============================================ */

function CaseSurface({ mission, foundClues, onClue, onWrong }: { mission: Mission; foundClues: string[]; onClue: (c: Clue) => void; onWrong: () => void }) {
  return (
    <div className="glass overflow-hidden">
      {mission.surface === 'email' && <EmailSurface mission={mission} foundClues={foundClues} onClue={onClue} onWrong={onWrong} />}
      {mission.surface === 'sms' && <SmsSurface mission={mission} foundClues={foundClues} onClue={onClue} onWrong={onWrong} />}
      {mission.surface === 'web' && <WebSurface mission={mission} foundClues={foundClues} onClue={onClue} onWrong={onWrong} />}
      {mission.surface === 'social' && <SocialSurface mission={mission} foundClues={foundClues} onClue={onClue} onWrong={onWrong} />}
      {mission.surface === 'chat' && <ChatSurface mission={mission} foundClues={foundClues} onClue={onClue} onWrong={onWrong} />}
    </div>
  );
}

function ClueSpot({ active, found, children, onClick }: { active: boolean; found: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={found}
      className={`relative inline-block transition ${found ? 'animate-pop' : ''}`}
    >
      <span className={`relative ${active ? 'cursor-pointer' : 'cursor-default'}`}>
        {children}
        {found && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-neon-green text-ink-900 flex items-center justify-center text-[10px] font-bold shadow-glow-green"
          >
            ✓
          </motion.span>
        )}
      </span>
      {active && !found && (
        <span className="absolute inset-0 rounded ring-1 ring-neon-yellow/40 animate-pulse pointer-events-none" />
      )}
    </button>
  );
}

function CluePanel({ clue, found }: { clue: Clue; found: boolean }) {
  return (
    <AnimatePresence>
      {found && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs text-neon-green"
        >
          <b>{clue.hint}.</b> {clue.explanation}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AvatarSeed({ seed, name }: { seed: string; name: string }) {
  const list = ['👤', '👩', '👨', '🧑', '👧', '🧒', '🦸', '🧙', '🤖', '👻', '🎭', '👑'];
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const e = list[h % list.length];
  return (
    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyber-300 to-neon-purple flex items-center justify-center text-lg shadow-glow">{e}</div>
  );
}

function EmailSurface({ mission, foundClues, onClue, onWrong }: any) {
  const m: Mission = mission;
  return (
    <div className="p-4 sm:p-6">
      <div className="rounded-2xl border border-white/10 bg-ink-700/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <AvatarSeed seed={m.from.avatarSeed} name={m.from.name} />
          <div className="min-w-0 flex-1">
            <div className="font-display font-bold text-sm truncate">{m.from.name}</div>
            <ClueSpot
              active={!!m.clues.find((c: Clue) => c.selector.includes('from'))}
              found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('from'))?.id)}
              onClick={() => {
                const c = m.clues.find((c: Clue) => c.selector.includes('from'));
                c ? onClue(c) : onWrong();
              }}
            >
              <div data-clue="from" className="text-xs text-white/60 truncate font-mono">{m.from.handle}</div>
            </ClueSpot>
          </div>
          <span className="text-[10px] text-white/50">ahora</span>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          <ClueSpot
            active={!!m.clues.find((c: Clue) => c.selector.includes('subject'))}
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('subject'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('subject'));
              c ? onClue(c) : onWrong();
            }}
          >
            <div data-clue="subject" className="font-display font-bold text-lg">{m.subject}</div>
          </ClueSpot>
          <ClueSpot
            active={!!m.clues.find((c: Clue) => c.selector.includes('urgency'))}
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('urgency'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('urgency'));
              c ? onClue(c) : onWrong();
            }}
          >
            <div data-clue="urgency" className="text-sm leading-relaxed text-white/85">{m.body}</div>
          </ClueSpot>
          {m.link && (
            <ClueSpot
              active
              found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('link'))?.id)}
              onClick={() => {
                const c = m.clues.find((c: Clue) => c.selector.includes('link'));
                c ? onClue(c) : onWrong();
              }}
            >
              <a data-clue="link" href={m.link.realHref} onClick={(e) => e.preventDefault()} className="inline-block mt-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-400 to-cyber-600 text-white font-display font-semibold shadow-glow">
                {m.link.text}
              </a>
            </ClueSpot>
          )}
        </div>
      </div>
      <ClueList mission={m} foundClues={foundClues} />
    </div>
  );
}

function SmsSurface({ mission, foundClues, onClue, onWrong }: any) {
  const m: Mission = mission;
  return (
    <div className="p-4 sm:p-6 space-y-3">
      <div className="rounded-3xl border border-white/10 bg-ink-700/60 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AvatarSeed seed={m.from.avatarSeed} name={m.from.name} />
          <div className="text-sm font-semibold">{m.from.name}</div>
          <div className="ml-auto text-[10px] text-white/50">SMS · ahora</div>
        </div>
        <ClueSpot
          active={!!m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'))}
          found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'))?.id)}
          onClick={() => {
            const c = m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'));
            c ? onClue(c) : onWrong();
          }}
        >
          <div data-clue="urgency" className="text-sm">{m.body}</div>
        </ClueSpot>
        {m.link && (
          <ClueSpot
            active
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('link'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('link'));
              c ? onClue(c) : onWrong();
            }}
          >
            <a data-clue="link" onClick={(e) => e.preventDefault()} href={m.link.realHref} className="block mt-2 text-cyber-300 underline break-all font-mono text-xs">{m.link.text}</a>
          </ClueSpot>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['😊', '👍', '👎'].map((e) => <button key={e} onClick={onWrong} className="rounded-2xl bg-white/5 py-3 text-2xl">{e}</button>)}
      </div>
      <ClueList mission={m} foundClues={foundClues} />
    </div>
  );
}

function WebSurface({ mission, foundClues, onClue, onWrong }: any) {
  const m: Mission = mission;
  return (
    <div className="p-4 sm:p-6">
      <div className="rounded-2xl border border-white/10 bg-ink-700/60 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2 text-xs font-mono">
          <span className="h-2.5 w-2.5 rounded-full bg-neon-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon-yellow" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon-green" />
          <ClueSpot
            active
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('domain') || c.selector.includes('from') || c.selector.includes('link'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('domain') || c.selector.includes('from') || c.selector.includes('link'));
              c ? onClue(c) : onWrong();
            }}
          >
            <span data-clue="domain" className="ml-2 px-2 py-1 rounded bg-ink-900/80 text-white/80">{(m.link?.realHref || m.from.handle).replace(/^https?:\/\//, '').split('/')[0]}</span>
          </ClueSpot>
        </div>
        <div className="p-5 sm:p-8 text-center bg-gradient-to-br from-cyber-500/15 to-neon-purple/15">
          <div className="text-3xl">🔐</div>
          <h3 data-clue="title" className="font-display text-2xl font-bold mt-2">{m.from.name}</h3>
          <ClueSpot
            active
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'));
              c ? onClue(c) : onWrong();
            }}
          >
            <p data-clue="urgency" className="text-sm text-white/80 mt-2 max-w-md mx-auto">{m.body}</p>
          </ClueSpot>
          <button data-clue="body" onClick={onWrong} className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-display font-semibold">{m.link?.text || 'Continuar'}</button>
        </div>
      </div>
      <ClueList mission={m} foundClues={foundClues} />
    </div>
  );
}

function SocialSurface({ mission, foundClues, onClue, onWrong }: any) {
  const m: Mission = mission;
  return (
    <div className="p-4 sm:p-6">
      <div className="rounded-2xl border border-white/10 bg-ink-700/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <AvatarSeed seed={m.from.avatarSeed} name={m.from.name} />
          <div>
            <ClueSpot
              active
              found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('handle'))?.id)}
              onClick={() => {
                const c = m.clues.find((c: Clue) => c.selector.includes('handle'));
                c ? onClue(c) : onWrong();
              }}
            >
              <div data-clue="handle" className="font-display font-bold text-sm">{m.from.name} <span className="text-white/50 font-normal">{m.from.handle}</span></div>
            </ClueSpot>
            <div className="text-[10px] text-white/50">Hace 2 horas</div>
          </div>
        </div>
        <div className="p-4">
          <ClueSpot
            active
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body'));
              c ? onClue(c) : onWrong();
            }}
          >
            <p data-clue="urgency" className="text-sm">{m.mediaCaption || m.body}</p>
          </ClueSpot>
          <div className="mt-3 h-44 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 border border-white/10 flex items-center justify-center text-5xl">🎁</div>
        </div>
      </div>
      <ClueList mission={m} foundClues={foundClues} />
    </div>
  );
}

function ChatSurface({ mission, foundClues, onClue, onWrong }: any) {
  const m: Mission = mission;
  return (
    <div className="p-4 sm:p-6">
      <div className="rounded-2xl border border-white/10 bg-ink-700/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <AvatarSeed seed={m.from.avatarSeed} name={m.from.name} />
          <div>
            <div className="font-display font-bold text-sm">{m.from.name}</div>
            <div className="text-[10px] text-white/50">en línea</div>
          </div>
        </div>
        <div className="p-4 space-y-2 min-h-[140px]">
          <ClueSpot
            active
            found={foundClues.includes(m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body') || c.selector.includes('style'))?.id)}
            onClick={() => {
              const c = m.clues.find((c: Clue) => c.selector.includes('urgency') || c.selector.includes('body') || c.selector.includes('style'));
              c ? onClue(c) : onWrong();
            }}
          >
            <div data-clue="urgency" className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-sm">{m.body}</div>
          </ClueSpot>
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-cyber-500/30 px-3 py-2 text-sm">¿Seguro?</div>
          </div>
        </div>
      </div>
      <ClueList mission={m} foundClues={foundClues} />
    </div>
  );
}

function ClueList({ mission, foundClues }: { mission: Mission; foundClues: string[] }) {
  return (
    <div className="mt-4 space-y-1">
      {mission.clues.map((c) => <CluePanel key={c.id} clue={c} found={foundClues.includes(c.id)} />)}
    </div>
  );
}

/* ============================================
   GRANDMA MODAL
   ============================================ */

function GrandmaModal({ open, onClose, mission }: { open: boolean; onClose: () => void; mission: Mission }) {
  const { recordGrandma } = useGame();
  const [picked, setPicked] = useState<null | 'child' | 'teen' | 'adult' | 'grandma'>(null);

  // Stats simuladas plausibles (en producción vendrían de base de datos real)
  type GKey = 'child' | 'teen' | 'adult' | 'grandma';
  const STATS: Record<typeof mission.villain, Record<GKey, number>> = {
    urgencia: { child: 48, teen: 42, adult: 28, grandma: 71 },
    premio:  { child: 62, teen: 55, adult: 33, grandma: 78 },
    link:    { child: 53, teen: 39, adult: 24, grandma: 64 },
    clon:    { child: 41, teen: 36, adult: 19, grandma: 58 },
    ia:      { child: 38, teen: 30, adult: 22, grandma: 69 }
  };
  const vStats: Record<GKey, number> = STATS[mission.villain];

  return (
    <Modal open={open} onClose={onClose} variant="pink" title="¿Caería tu abuelo?">
      <p className="text-sm text-white/80 mb-3">Adivina qué porcentaje de cada grupo caería en esta estafa. Luego podrás comparar.</p>
      <div className="grid grid-cols-2 gap-2">
        {(['child', 'teen', 'adult', 'grandma'] as const).map((k) => (
          <button
            key={k}
            onClick={() => { sfx.click(); setPicked(k); recordGrandma(); }}
            className={`p-3 rounded-xl border transition text-left ${picked === k ? 'border-neon-pink bg-neon-pink/10' : 'border-white/10 hover:border-white/20'}`}
          >
            <div className="text-2xl">{k === 'child' ? '🧒' : k === 'teen' ? '🧑' : k === 'adult' ? '🧔' : '👴'}</div>
            <div className="font-display font-bold text-sm mt-1">
              {k === 'child' ? 'Niño' : k === 'teen' ? 'Adolescente' : k === 'adult' ? 'Adulto' : 'Abuelo/a'}
            </div>
            <div className="text-[10px] text-white/50">Toca para predecir</div>
          </button>
        ))}
      </div>
      {picked && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-white/60">Predicciones (simuladas para esta versión):</div>
          {(['child', 'teen', 'adult', 'grandma'] as const).map((k) => {
            const value = vStats[k] || 0;
            return (
              <div key={k} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{k === 'child' ? '🧒 Niño' : k === 'teen' ? '🧑 Adolescente' : k === 'adult' ? '🧔 Adulto' : '👴 Abuelo/a'}</span>
                  <span className="tabular-nums text-white/80">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-green via-neon-yellow to-neon-pink" style={{ width: `${value}%` }} />
                </div>
              </div>
            );
          })}
          <p className="text-[10px] text-white/50 mt-2">Discute estos números con tus amigos o familiares. ¡La mejor defensa es hablar de ello!</p>
        </div>
      )}
    </Modal>
  );
}

function generateFromId(_id: string): Mission | undefined {
  // Mantenido por compatibilidad. Las misiones diarias viven en `dailyCache`.
  return undefined;
}
