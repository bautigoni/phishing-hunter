import { Link } from 'react-router-dom';
import { useGame } from '@/store/gameStore';
import { ACHIEVEMENTS, type AchievementStats } from '@/data/achievements';
import { Back, Trophy } from '@/components/Icon';
import { sfx } from '@/lib/sound';

const RARITY_COLORS: Record<string, string> = {
  común: '#a4d7ff',
  rara: '#9b5cff',
  épica: '#ff3ea5',
  legendaria: '#ffe14a'
};

export function Achievements() {
  const { player, unlockedAchievements } = useGame();

  const stats: AchievementStats = {
    solved: player.solved,
    perfect: player.perfect,
    byVillain: player.byVillain,
    byDistrict: player.byDistrict,
    streak: player.streak,
    fastestMs: player.fastestMs,
    grandmaGuesses: player.grandmaGuesses,
    duelsWon: player.duelsWon,
    level: player.level,
    estafasBuilt: player.estafasBuilt
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/profile" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Trophy className="h-5 w-5 text-neon-yellow" /> Logros</h1>
          <p className="text-xs text-white/60">{unlockedAchievements.length} / {ACHIEVEMENTS.length} desbloqueados.</p>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedAchievements.includes(a.id) || a.test(stats);
          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 transition ${unlocked ? 'border-white/20' : 'border-white/5 opacity-60 grayscale'}`}
              style={{ background: `linear-gradient(180deg, ${RARITY_COLORS[a.rarity]}15, transparent 70%)` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl border"
                  style={{ borderColor: RARITY_COLORS[a.rarity], background: `${RARITY_COLORS[a.rarity]}22` }}
                >
                  {a.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold leading-tight">{a.name}</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: RARITY_COLORS[a.rarity] }}>{a.rarity}</div>
                </div>
              </div>
              <p className="text-xs text-white/70 mt-2">{a.description}</p>
              <div className="mt-3 flex items-center gap-2 text-[10px]">
                <span className="chip text-[10px]">+{a.xpReward} XP</span>
                <span className="chip text-[10px]">+{a.coinReward} 💰</span>
                {unlocked && <span className="ml-auto text-neon-green font-semibold">Desbloqueado</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
