import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, VillainId } from '@/data/missions';
import { ACHIEVEMENTS, type AchievementStats } from '@/data/achievements';
import { SHOP_ITEMS, type ShopItem } from '@/data/shop';

export interface Player {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  bestStreak: number;
  solved: number;
  perfect: number;
  byVillain: Record<string, number>;
  byDistrict: Record<string, number>;
  fastestMs: number | null;
  grandmaGuesses: number;
  duelsWon: number;
  estafasBuilt: number;
  totalReactionsMs: number;
  reactionsCount: number;
}

export interface Inventory {
  hat: string | null;
  backpack: string | null;
  skin: string | null;
  effect: string | null;
  pet: string | null;
}

interface GameState {
  player: Player;
  inventory: Inventory;
  unlockedAchievements: string[];
  ownedItems: string[];
  daily: { date: string; missionIds: string[]; completed: string[] } | null;
  completedMissions: string[];
  perfectMissions: string[];
  avatar: string;

  // actions
  setName: (n: string) => void;
  setAvatar: (a: string) => void;
  addXp: (xp: number) => void;
  addCoins: (c: number) => void;
  registerSolve: (params: { missionId: string; district: string; villain: VillainId; xp: number; coins: number; perfect: boolean; ms: number }) => void;
  recordGrandma: () => void;
  recordDuelWin: () => void;
  recordEstafa: () => void;
  buyItem: (id: string) => boolean;
  equip: (slot: keyof Inventory, id: string | null) => void;
  setDaily: (date: string, ids: string[]) => void;
  markDailyDone: (id: string) => void;
  resetAll: () => void;
}

const initialPlayer: Player = {
  name: 'Agente',
  avatar: '🛡️',
  level: 1,
  xp: 0,
  coins: 200,
  streak: 0,
  bestStreak: 0,
  solved: 0,
  perfect: 0,
  byVillain: {},
  byDistrict: {},
  fastestMs: null,
  grandmaGuesses: 0,
  duelsWon: 0,
  estafasBuilt: 0,
  totalReactionsMs: 0,
  reactionsCount: 0
};

const initialInventory: Inventory = {
  hat: null,
  backpack: null,
  skin: null,
  effect: null,
  pet: 'pet-firewall'
};

function xpForLevel(level: number) {
  return Math.round(120 * Math.pow(level, 1.4));
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,
      inventory: initialInventory,
      unlockedAchievements: [],
      ownedItems: ['pet-firewall'],
      daily: null,
      completedMissions: [],
      perfectMissions: [],
      avatar: '🛡️',

      setName: (n) => set((s) => ({ player: { ...s.player, name: n || 'Agente' } })),
      setAvatar: (a) => set({ avatar: a }),

      addXp: (xp) =>
        set((s) => {
          let level = s.player.level;
          let totalXp = s.player.xp + xp;
          while (totalXp >= xpForLevel(level)) {
            totalXp -= xpForLevel(level);
            level += 1;
          }
          return { player: { ...s.player, xp: totalXp, level } };
        }),

      addCoins: (c) => set((s) => ({ player: { ...s.player, coins: s.player.coins + c } })),

      registerSolve: ({ missionId, district, villain, xp, coins, perfect, ms }) =>
        set((s) => {
          if (s.completedMissions.includes(missionId) && !s.daily?.missionIds.includes(missionId)) {
            return s; // ya resuelta fuera del daily
          }
          const newPlayer: Player = {
            ...s.player,
            xp: s.player.xp + xp,
            coins: s.player.coins + coins,
            solved: s.player.solved + 1,
            perfect: s.player.perfect + (perfect ? 1 : 0),
            streak: s.player.streak + 1,
            bestStreak: Math.max(s.player.bestStreak, s.player.streak + 1),
            byVillain: { ...s.player.byVillain, [villain]: (s.player.byVillain[villain] || 0) + 1 },
            byDistrict: { ...s.player.byDistrict, [district]: (s.player.byDistrict[district] || 0) + 1 },
            fastestMs: s.player.fastestMs === null ? ms : Math.min(s.player.fastestMs, ms),
            totalReactionsMs: s.player.totalReactionsMs + ms,
            reactionsCount: s.player.reactionsCount + 1
          };
          // Subir nivel
          let level = newPlayer.level;
          let totalXp = newPlayer.xp;
          while (totalXp >= xpForLevel(level)) {
            totalXp -= xpForLevel(level);
            level += 1;
          }
          newPlayer.xp = totalXp;
          newPlayer.level = level;

          // Achievements
          const stats: AchievementStats = {
            solved: newPlayer.solved,
            perfect: newPlayer.perfect,
            byVillain: newPlayer.byVillain,
            byDistrict: newPlayer.byDistrict,
            streak: newPlayer.streak,
            fastestMs: newPlayer.fastestMs,
            grandmaGuesses: newPlayer.grandmaGuesses,
            duelsWon: newPlayer.duelsWon,
            level: newPlayer.level,
            estafasBuilt: newPlayer.estafasBuilt
          };
          const newlyUnlocked: string[] = [];
          for (const a of ACHIEVEMENTS) {
            if (!s.unlockedAchievements.includes(a.id) && a.test(stats)) {
              newlyUnlocked.push(a.id);
              newPlayer.xp += a.xpReward;
              newPlayer.coins += a.coinReward;
            }
          }

          const completedMissions = s.completedMissions.includes(missionId)
            ? s.completedMissions
            : [...s.completedMissions, missionId];
          const perfectMissions = perfect && !s.perfectMissions.includes(missionId)
            ? [...s.perfectMissions, missionId]
            : s.perfectMissions;

          return {
            player: newPlayer,
            unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked],
            completedMissions,
            perfectMissions
          };
        }),

      recordGrandma: () => set((s) => ({ player: { ...s.player, grandmaGuesses: s.player.grandmaGuesses + 1 } })),
      recordDuelWin: () => set((s) => ({ player: { ...s.player, duelsWon: s.player.duelsWon + 1 } })),
      recordEstafa: () => set((s) => ({ player: { ...s.player, estafasBuilt: s.player.estafasBuilt + 1 } })),

      buyItem: (id) => {
        const item = SHOP_ITEMS.find((i) => i.id === id);
        if (!item) return false;
        const s = get();
        if (s.ownedItems.includes(id)) return false;
        if (s.player.coins < item.price) return false;
        set({
          player: { ...s.player, coins: s.player.coins - item.price },
          ownedItems: [...s.ownedItems, id]
        });
        return true;
      },

      equip: (slot, id) =>
        set((s) => {
          if (id && !s.ownedItems.includes(id)) return s;
          return { inventory: { ...s.inventory, [slot]: id } };
        }),

      setDaily: (date, ids) => set({ daily: { date, missionIds: ids, completed: [] } }),
      markDailyDone: (id) =>
        set((s) => {
          if (!s.daily) return s;
          if (s.daily.completed.includes(id)) return s;
          return { daily: { ...s.daily, completed: [...s.daily.completed, id] } };
        }),

      resetAll: () =>
        set({
          player: initialPlayer,
          inventory: initialInventory,
          unlockedAchievements: [],
          ownedItems: ['pet-firewall'],
          daily: null,
          completedMissions: [],
          perfectMissions: [],
          avatar: '🛡️'
        })
    }),
    { name: 'phishing-hunter-save-v1' }
  )
);

export function xpToNext(level: number, currentXp: number) {
  return xpForLevel(level) - currentXp;
}

export function xpThreshold(level: number) {
  return xpForLevel(level);
}
