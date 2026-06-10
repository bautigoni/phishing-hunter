import { Link } from 'react-router-dom';
import { useGame } from '@/store/gameStore';
import { VILLAINS } from '@/data/villains';
import { DISTRICTS } from '@/data/districts';
import { ProgressBar } from '@/components/ProgressBar';
import { Back, Bolt, Fire, Coin, Star, Heart } from '@/components/Icon';
import { sfx } from '@/lib/sound';

export function Stats() {
  const { player } = useGame();
  const avgReaction = player.reactionsCount > 0 ? Math.round(player.totalReactionsMs / player.reactionsCount) : 0;
  const accuracy = player.solved > 0 ? Math.round((player.perfect / player.solved) * 100) : 0;

  const hardestVillain = Object.entries(player.byVillain).sort((a, b) => b[1] - a[1])[0];
  const hardestDistrict = Object.entries(player.byDistrict).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/profile" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Tus estadísticas</h1>
          <p className="text-xs text-white/60">Tu evolución en Cyber City.</p>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <BigStat label="Misiones" value={player.solved} sub="resueltas" />
        <BigStat label="Precisión" value={`${accuracy}%`} sub="perfectas" />
        <BigStat label="Reacción" value={avgReaction ? `${(avgReaction / 1000).toFixed(1)}s` : '—'} sub="promedio" />
        <BigStat label="Récord" value={`${player.fastestMs ? (player.fastestMs / 1000).toFixed(2) : '—'}s`} sub="más rápida" />
      </div>

      <section className="glass p-5">
        <h2 className="font-display font-bold">Progreso por villano</h2>
        <p className="text-xs text-white/60 mb-3">Cuántas veces has vencido a cada uno.</p>
        <div className="space-y-2">
          {Object.values(VILLAINS).map((v) => {
            const n = player.byVillain[v.id] || 0;
            return (
              <div key={v.id} className="flex items-center gap-3">
                <div className="w-8 text-xl">{v.emoji}</div>
                <div className="w-32 text-sm font-semibold">{v.name}</div>
                <div className="flex-1"><ProgressBar value={Math.min(1, n / 10)} color={v.color} /></div>
                <div className="w-10 text-right tabular-nums text-sm">{n}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="glass p-5">
        <h2 className="font-display font-bold">Progreso por distrito</h2>
        <p className="text-xs text-white/60 mb-3">Maestría por zona de Cyber City.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {DISTRICTS.map((d) => {
            const n = player.byDistrict[d.id] || 0;
            return (
              <div key={d.id} className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3">
                <div className="text-2xl">{d.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{d.name}</div>
                  <ProgressBar value={Math.min(1, n / 5)} height={6} />
                </div>
                <div className="tabular-nums text-sm font-bold">{n}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="glass p-5">
        <h2 className="font-display font-bold">Insights</h2>
        <ul className="mt-2 space-y-1 text-sm text-white/80">
          {hardestVillain && <li>👹 Villano más cazado: <b>{VILLAINS[hardestVillain[0] as keyof typeof VILLAINS]?.name}</b> ({hardestVillain[1]} veces).</li>}
          {hardestDistrict && <li>🗺️ Distrito más explorado: <b>{DISTRICTS.find((d) => d.id === hardestDistrict[0])?.name}</b>.</li>}
          {avgReaction > 0 && <li>⏱️ Tu reacción promedio es de <b>{(avgReaction / 1000).toFixed(2)}s</b>.</li>}
          {player.streak > 0 && <li>🔥 Llevas una racha de <b>{player.streak}</b>. ¡No la pierdas!</li>}
          {player.fastestMs && <li>⚡ Tu mejor tiempo: <b>{(player.fastestMs / 1000).toFixed(2)}s</b>.</li>}
        </ul>
      </section>
    </div>
  );
}

function BigStat({ label, value, sub }: { label: string; value: React.ReactNode; sub: string }) {
  return (
    <div className="glass p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="font-display text-3xl font-bold mt-1">{value}</div>
      <div className="text-[10px] text-white/50">{sub}</div>
    </div>
  );
}
