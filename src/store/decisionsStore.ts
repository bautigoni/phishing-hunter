import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StatKey, StatDelta, ChoiceId } from '@/data/decisions';
import { STAT_KEYS, STAT_LABELS } from '@/data/decisions';
import { useGame } from '@/store/gameStore';
import { sfx } from '@/lib/sound';
import { pushFloat } from '@/components/XpFloater';

// ============================================================
// Tipos
// ============================================================

export interface DecisionLog {
  scenarioId: string;
  choiceId: ChoiceId;
  at: number; // timestamp
  // Para narrativa emergente: cómo te recuerda el "mundo".
  rememberedAs?: 'cuidadoso' | 'imprudente' | 'educador' | 'protector' | 'neutral';
  // Flags acumulados del jugador en esta decisión.
  flagsGained: string[];
}

export interface PendingConsequence {
  id: string;
  scenarioId: string;
  // En cuántos escenarios más debe dispararse.
  remaining: number;
  headline: string;
  detail?: string;
  delta?: StatDelta;
  moneyDelta?: number;
  xpDelta?: number;
  coinDelta?: number;
  flag?: string;
  // Cuándo se creó (para mostrar en orden cronológico).
  createdAt: number;
}

export interface DecisionsState {
  // Las 6 stats de Cyber Decisions. Empiezan en 50.
  stats: Record<StatKey, number>;
  // Dinero propio del módulo (separado de las coins del juego principal).
  money: number;
  // Historial completo.
  history: DecisionLog[];
  // Consecuencias retardadas pendientes.
  pending: PendingConsequence[];
  // Escenario actual (id) en curso.
  activeScenarioId: string | null;
  // Escenarios ya completados (para que el motor no repita).
  completedScenarioIds: string[];
  // Cuántos escenarios lleva jugados el jugador (para delayed).
  scenariosPlayed: number;
  // Total de decisiones tomadas.
  decisionsCount: number;
  // Recompensas: XP total y coins ganadas.
  totalXp: number;
  totalCoins: number;
  // Mensajes narrativos que el sistema recuerda del jugador.
  reputationTags: string[];

  // Acciones
  startScenario: (id: string) => void;
  resolveScenario: (params: {
    scenarioId: string;
    choiceId: ChoiceId;
    immediate: { delta?: StatDelta; moneyDelta?: number; xpDelta?: number; coinDelta?: number; headline: string; detail?: string; flags?: string[] };
    delayed?: { delayScenarios: number; delta?: StatDelta; moneyDelta?: number; xpDelta?: number; coinDelta?: number; headline: string; detail?: string; flag?: string }[];
    choiceVibe?: 'safe' | 'risky' | 'neutral' | 'kind' | 'curious' | 'bold';
  }) => void;
  // Llamado al iniciar la app o después de cada decisión, dispara
  // las consecuencias que ya vencieron.
  processPending: () => { processed: PendingConsequence[] };
  // Reset.
  resetAll: () => void;
}

const INITIAL_STATS: Record<StatKey, number> = {
  seguridad: 50,
  reputacion: 50,
  confianza: 50,
  dinero: 50,
  conocimiento: 50,
  privacidad: 50
};

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

function pickRemembered(vibe?: string): DecisionLog['rememberedAs'] {
  switch (vibe) {
    case 'safe':   return 'cuidadoso';
    case 'risky':  return 'imprudente';
    case 'kind':   return 'educador';
    case 'bold':   return 'protector';
    default:       return 'neutral';
  }
}

export const useDecisions = create<DecisionsState>()(
  persist(
    (set, get) => ({
      stats: { ...INITIAL_STATS },
      money: 50,
      history: [],
      pending: [],
      activeScenarioId: null,
      completedScenarioIds: [],
      scenariosPlayed: 0,
      decisionsCount: 0,
      totalXp: 0,
      totalCoins: 0,
      reputationTags: [],

      startScenario: (id) => set({ activeScenarioId: id }),

      resolveScenario: (params) => {
        const s = get();
        // Aplicar delta inmediato.
        const newStats = { ...s.stats };
        if (params.immediate.delta) {
          for (const k of STAT_KEYS) {
            const d = params.immediate.delta[k];
            if (typeof d === 'number') newStats[k] = clamp(newStats[k] + d);
          }
        }
        const newMoney = Math.max(0, s.money + (params.immediate.moneyDelta || 0));
        const newXp = s.totalXp + (params.immediate.xpDelta || 0);
        const newCoins = s.totalCoins + (params.immediate.coinDelta || 0);

        // Sincronizar con el store principal (XP + coins).
        const game = useGame.getState();
        if ((params.immediate.xpDelta || 0) > 0) game.addXp(params.immediate.xpDelta || 0);
        if ((params.immediate.coinDelta || 0) > 0) game.addCoins(params.immediate.coinDelta || 0);

        // Encolar consecuencias retardadas.
        const newPending: PendingConsequence[] = [...s.pending];
        if (params.delayed && params.delayed.length > 0) {
          for (const d of params.delayed) {
            newPending.push({
              id: 'pc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
              scenarioId: params.scenarioId,
              remaining: d.delayScenarios,
              headline: d.headline,
              detail: d.detail,
              delta: d.delta,
              moneyDelta: d.moneyDelta,
              xpDelta: d.xpDelta,
              coinDelta: d.coinDelta,
              flag: d.flag,
              createdAt: Date.now()
            });
          }
        }

        // Log.
        const log: DecisionLog = {
          scenarioId: params.scenarioId,
          choiceId: params.choiceId,
          at: Date.now(),
          rememberedAs: pickRemembered(params.choiceVibe),
          flagsGained: params.immediate.flags || []
        };

        // Acumular tags narrativos.
        const tags = [...s.reputationTags];
        const rem = log.rememberedAs;
        if (rem && !tags.includes(rem)) tags.push(rem);
        for (const f of log.flagsGained) {
          if (!tags.includes(f)) tags.push(f);
        }

        sfx.correct();
        pushFloat('+' + (params.immediate.xpDelta || 0) + ' XP', '#ffe14a');

        set({
          stats: newStats,
          money: newMoney,
          totalXp: newXp,
          totalCoins: newCoins,
          pending: newPending,
          history: [...s.history, log],
          activeScenarioId: null,
          completedScenarioIds: s.completedScenarioIds.includes(params.scenarioId)
            ? s.completedScenarioIds
            : [...s.completedScenarioIds, params.scenarioId],
          scenariosPlayed: s.scenariosPlayed + 1,
          decisionsCount: s.decisionsCount + 1,
          reputationTags: tags
        });
      },

      processPending: () => {
        const s = get();
        if (s.pending.length === 0) return { processed: [] };

        // Decrementar todas y procesar las que llegan a 0.
        const stillPending: PendingConsequence[] = [];
        const processed: PendingConsequence[] = [];
        for (const p of s.pending) {
          const next = { ...p, remaining: p.remaining - 1 };
          if (next.remaining <= 0) {
            processed.push(next);
          } else {
            stillPending.push(next);
          }
        }

        if (processed.length === 0) {
          set({ pending: stillPending });
          return { processed: [] };
        }

        // Aplicar deltas acumulados.
        const newStats = { ...s.stats };
        let newMoney = s.money;
        let newXp = 0;
        let newCoins = 0;
        for (const p of processed) {
          if (p.delta) {
            for (const k of STAT_KEYS) {
              const d = p.delta[k];
              if (typeof d === 'number') newStats[k] = clamp(newStats[k] + d);
            }
          }
          newMoney = Math.max(0, newMoney + (p.moneyDelta || 0));
          newXp += p.xpDelta || 0;
          newCoins += p.coinDelta || 0;
          // Mostrar floater de la consecuencia principal.
          if (p.delta) {
            const main = Object.entries(p.delta).sort((a, b) => Math.abs(b[1] as number) - Math.abs(a[1] as number))[0];
            if (main && main[1] !== 0) {
              pushFloat(`${(main[1] as number) > 0 ? '+' : ''}${main[1]} ${STAT_LABELS[main[0] as StatKey]}`, '#9b5cff');
            }
          }
        }
        if (newXp > 0) useGame.getState().addXp(newXp);
        if (newCoins > 0) useGame.getState().addCoins(newCoins);
        sfx.unlock();

        set({ pending: stillPending, stats: newStats, money: newMoney });
        return { processed };
      },

      resetAll: () =>
        set({
          stats: { ...INITIAL_STATS },
          money: 50,
          history: [],
          pending: [],
          activeScenarioId: null,
          completedScenarioIds: [],
          scenariosPlayed: 0,
          decisionsCount: 0,
          totalXp: 0,
          totalCoins: 0,
          reputationTags: []
        })
    }),
    {
      name: 'phishing-hunter-decisions-v1',
      version: 1
    }
  )
);
