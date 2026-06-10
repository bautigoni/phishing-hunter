import { Link } from 'react-router-dom';
import { useDecisions } from '@/store/decisionsStore';
import { StatRadar } from '@/components/StatBar';
import { useProcessConsequencesOnMount } from '@/lib/useDelayedConsequences';
import { sfx } from '@/lib/sound';
import { Back } from '@/components/Icon';

export function DecisionsStats() {
  useProcessConsequencesOnMount();
  const { stats, history, reputationTags, decisionsCount, totalXp, totalCoins, money } = useDecisions();

  const safe = history.filter((h) => h.rememberedAs === 'cuidadoso' || h.rememberedAs === 'educador' || h.rememberedAs === 'protector').length;
  const risky = history.filter((h) => h.rememberedAs === 'imprudente').length;
  const safeRate = decisionsCount > 0 ? Math.round((safe / decisionsCount) * 100) : 0;

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/decisions" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Análisis profundo</h1>
          <p className="text-xs text-white/60">Tus patrones como ciudadano digital.</p>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Big label="Decisiones" value={decisionsCount} />
        <Big label="Buenas" value={`${safe}`} sub={`${safeRate}%`} color="#3eff9b" />
        <Big label="Arriesgadas" value={`${risky}`} color="#ff3e6a" />
        <Big label="Saldo" value={`€${money.toFixed(0)}`} color="#ff7a3e" />
      </section>

      <section className="glass p-5">
        <h2 className="font-display font-bold mb-3">Tu huella digital</h2>
        <StatRadar stats={stats} />
      </section>

      <section className="glass p-5">
        <h2 className="font-display font-bold mb-3">Reputación acumulada</h2>
        <div className="flex flex-wrap gap-1.5">
          {reputationTags.length === 0 ? (
            <span className="text-xs text-white/50">Juega escenarios para ganar etiquetas narrativas.</span>
          ) : (
            reputationTags.map((t) => (
              <span key={t} className="chip text-[10px]">🏷️ {t}</span>
            ))
          )}
        </div>
      </section>

      <section className="glass p-5">
        <h2 className="font-display font-bold mb-3">Totales de progresión</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>XP total ganada: <b className="font-display">{totalXp}</b></div>
          <div>Monedas ganadas: <b className="font-display">{totalCoins}</b></div>
        </div>
        <p className="text-[10px] text-white/50 mt-2">Estos puntos se sincronizan con tu progreso principal de Phishing Hunter.</p>
      </section>
    </div>
  );
}

function Big({ label, value, sub, color }: { label: string; value: React.ReactNode; sub?: string; color?: string }) {
  return (
    <div className="glass p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="font-display text-2xl font-bold mt-1" style={{ color: color || '#fff' }}>{value}</div>
      {sub && <div className="text-[10px] text-white/50">{sub}</div>}
    </div>
  );
}
