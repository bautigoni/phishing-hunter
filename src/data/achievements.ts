export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'común' | 'rara' | 'épica' | 'legendaria';
  xpReward: number;
  coinReward: number;
  test: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  solved: number;
  perfect: number;
  byVillain: Record<string, number>;
  byDistrict: Record<string, number>;
  streak: number;
  fastestMs: number | null;
  grandmaGuesses: number;
  duelsWon: number;
  level: number;
  estafasBuilt: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'Cazador Novato', description: 'Resuelve tu primer caso.', emoji: '🥉', rarity: 'común', xpReward: 50, coinReward: 20, test: (s) => s.solved >= 1 },
  { id: 'a2', name: 'Aprendiz Digital', description: 'Resuelve 5 casos.', emoji: '📘', rarity: 'común', xpReward: 100, coinReward: 40, test: (s) => s.solved >= 5 },
  { id: 'a3', name: 'Inspector Cibernético', description: 'Resuelve 15 casos.', emoji: '🛡️', rarity: 'rara', xpReward: 200, coinReward: 80, test: (s) => s.solved >= 15 },
  { id: 'a4', name: 'Detector Maestro', description: 'Resuelve 30 casos.', emoji: '🎯', rarity: 'épica', xpReward: 400, coinReward: 150, test: (s) => s.solved >= 30 },
  { id: 'a5', name: 'Rompe Estafas', description: 'Resuelve 50 casos.', emoji: '💥', rarity: 'épica', xpReward: 600, coinReward: 250, test: (s) => s.solved >= 50 },
  { id: 'a6', name: 'Ojo de Águila', description: 'Resuelve 100 casos.', emoji: '🦅', rarity: 'legendaria', xpReward: 1000, coinReward: 500, test: (s) => s.solved >= 100 },
  { id: 'a7', name: 'Leyenda Digital', description: 'Alcanza el nivel 20.', emoji: '👑', rarity: 'legendaria', xpReward: 1500, coinReward: 800, test: (s) => s.level >= 20 },
  { id: 'a8', name: 'Perfect Vision', description: 'Resuelve 10 casos sin fallar.', emoji: '✨', rarity: 'rara', xpReward: 200, coinReward: 100, test: (s) => s.perfect >= 10 },
  { id: 'a9', name: 'Reflejos de Rayo', description: 'Resuelve un caso en menos de 6 segundos.', emoji: '⚡', rarity: 'épica', xpReward: 300, coinReward: 120, test: (s) => s.fastestMs !== null && s.fastestMs < 6000 },
  { id: 'a10', name: 'Cazador del Tiempo', description: 'Vence al Capitán Urgencia 10 veces.', emoji: '⏰', rarity: 'rara', xpReward: 200, coinReward: 90, test: (s) => (s.byVillain.urgencia || 0) >= 10 },
  { id: 'a11', name: 'Destructor de Premios', description: 'Vence a Reina Premio 10 veces.', emoji: '👑', rarity: 'rara', xpReward: 200, coinReward: 90, test: (s) => (s.byVillain.premio || 0) >= 10 },
  { id: 'a12', name: 'Cazador de Links', description: 'Vence a Doctor Link 10 veces.', emoji: '🔗', rarity: 'rara', xpReward: 200, coinReward: 90, test: (s) => (s.byVillain.link || 0) >= 10 },
  { id: 'a13', name: 'Anti-Clon', description: 'Vence a Señor Clon 10 veces.', emoji: '🎭', rarity: 'rara', xpReward: 200, coinReward: 90, test: (s) => (s.byVillain.clon || 0) >= 10 },
  { id: 'a14', name: 'Cazador de Fantasmas', description: 'Vence a Fantasma IA 10 veces.', emoji: '👻', rarity: 'épica', xpReward: 350, coinReward: 150, test: (s) => (s.byVillain.ia || 0) >= 10 },
  { id: 'a15', name: 'Maestro de Distritos', description: 'Resuelve al menos un caso en cada distrito.', emoji: '🗺️', rarity: 'épica', xpReward: 400, coinReward: 180, test: (s) => Object.keys(s.byDistrict).length >= 8 },
  { id: 'a16', name: 'Racha Imparable', description: 'Consigue una racha de 5.', emoji: '🔥', rarity: 'rara', xpReward: 200, coinReward: 100, test: (s) => s.streak >= 5 },
  { id: 'a17', name: 'Racha Legendaria', description: 'Consigue una racha de 15.', emoji: '🌟', rarity: 'épica', xpReward: 500, coinReward: 250, test: (s) => s.streak >= 15 },
  { id: 'a18', name: 'Defensor del Abuelo', description: 'Responde "¿Caería tu abuelo?" 10 veces.', emoji: '👴', rarity: 'rara', xpReward: 200, coinReward: 100, test: (s) => s.grandmaGuesses >= 10 },
  { id: 'a19', name: 'Duelista Nato', description: 'Gana 5 duelos.', emoji: '⚔️', rarity: 'rara', xpReward: 250, coinReward: 120, test: (s) => s.duelsWon >= 5 },
  { id: 'a20', name: 'Estafador Estudioso', description: 'Construye 3 estafas en Modo Estafador.', emoji: '🎓', rarity: 'rara', xpReward: 250, coinReward: 120, test: (s) => s.estafasBuilt >= 3 }
];
