import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/store/gameStore';
import { generateDailyMissions } from '@/data/generator';
import { dailyCache } from '@/store/dailyCache';
import { Byte } from '@/components/Byte';
import { sfx } from '@/lib/sound';
import { Back, Sparkles, Bolt, Coin, Check } from '@/components/Icon';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function Daily() {
  const { daily, setDaily } = useGame();
  const navigate = useNavigate();
  const today = todayKey();
  const [missions, setMissions] = useState(dailyCache.all());
  const completed = daily?.completed || [];

  useEffect(() => {
    if (!daily || daily.date !== today) {
      const ms = generateDailyMissions();
      ms.forEach((m) => dailyCache.set(m.id, m));
      setDaily(today, ms.map((m) => m.id));
      setMissions(ms);
    } else {
      // sincronizar con cache
      const cached = daily.missionIds.map((id) => dailyCache.get(id)).filter(Boolean) as any[];
      if (cached.length === 0) {
        const ms = generateDailyMissions();
        ms.forEach((m) => dailyCache.set(m.id, m));
        setMissions(ms);
      } else {
        setMissions(cached);
      }
    }
  }, [today]);

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-neon-yellow" /> Desafíos Diarios</h1>
          <p className="text-xs text-white/60">3 casos nuevos cada día. Dificultad progresiva.</p>
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        {missions.length > 0 ? missions.map((m: any, i: number) => {
          const isDone = completed.includes(m.id);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-2xl border p-4 ${isDone ? 'border-neon-green/30' : 'border-white/10'}`}
            >
              <div className="absolute inset-0 -z-10 opacity-40" style={{ background: `linear-gradient(180deg, ${['#3eff9b', '#00c6ff', '#ff3ea5'][i]}30, transparent 60%)` }} />
              <div className="flex items-center justify-between">
                <span className="chip text-[10px]">Nivel {i + 1}</span>
                {isDone && <span className="chip text-[10px] border-neon-green/40 bg-neon-green/10 text-neon-green"><Check className="h-3 w-3" /> Hecho</span>}
              </div>
              <div className="font-display font-bold mt-2 leading-tight">{m.title}</div>
              <div className="text-xs text-white/60 mt-1 line-clamp-2">{m.body}</div>
              <div className="mt-3 flex items-center gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1"><Bolt className="h-3.5 w-3.5 text-cyber-300" />{m.xp} XP</span>
                <span className="flex items-center gap-1"><Coin className="h-3.5 w-3.5 text-neon-yellow" />{m.coins}</span>
              </div>
              <button
                disabled={isDone}
                onClick={() => { sfx.click(); navigate(`/play/daily/${i}`); }}
                className={`mt-3 w-full ${isDone ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              >
                {isDone ? 'Completado' : 'Jugar'}
              </button>
            </motion.div>
          );
        }) : (
          <div className="col-span-3 text-center text-white/60 py-10">Generando desafíos del día…</div>
        )}
      </div>

      <Byte emotion="celebrate">
        ¡Vuelve mañana para 3 nuevos casos! Las estafas evolucionan y tú también.
      </Byte>
    </div>
  );
}
