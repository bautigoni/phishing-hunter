// Plantillas para el "Modo Estafador" (perspectiva educativa y defensiva).
// El sistema siempre evalúa qué tan creíble sería la estafa y muestra
// por qué NO se debe usar para hacer daño real.

export interface EstafaTemplate {
  id: string;
  level: number;
  title: string;
  brand: string;
  brandColor: string;
  brandEmoji: string;
  cta: string;
  urgency: string;
  prize: string;
  link: string;
  sender: string;
}

export const ESTAFAS_BASE: EstafaTemplate[] = [
  {
    id: 't1',
    level: 1,
    title: 'Sorteo falso',
    brand: 'Mega Sorteos',
    brandColor: '#ffe14a',
    brandEmoji: '🎁',
    cta: 'Reclamar mi premio',
    urgency: 'Tienes 10 minutos o lo pierdes',
    prize: 'iPhone 17 Pro Max',
    link: 'http://mega-sorteos.pw/win',
    sender: 'sorteos@mega-sorteos.pw'
  },
  {
    id: 't2',
    level: 1,
    title: 'Gemas gratis',
    brand: 'Brawl Stars',
    brandColor: '#9b5cff',
    brandEmoji: '⭐',
    cta: 'Obtener 1000 gemas',
    urgency: 'Solo 30 cupos disponibles',
    prize: '1000 gemas gratis',
    link: 'http://brawlstars-rewards.tk/free',
    sender: 'rewards@brawlstars-rewards.tk'
  },
  {
    id: 't3',
    level: 2,
    title: 'Clon bancario',
    brand: 'BBVA',
    brandColor: '#004481',
    brandEmoji: '🏦',
    cta: 'Verificar identidad',
    urgency: 'Cuenta limitada por seguridad',
    prize: 'Acceso restaurado',
    link: 'http://bbva-net-cash.app/verify',
    sender: 'soporte@bbva-net-cash.app'
  },
  {
    id: 't4',
    level: 3,
    title: 'Mensaje de ingeniería social',
    brand: 'Mamá',
    brandColor: '#ff3ea5',
    brandEmoji: '💗',
    cta: 'Enviar dinero',
    urgency: 'Emergencia familiar',
    prize: 'Ayuda inmediata',
    link: 'Bizum al 612 000 999',
    sender: 'mama-ia-voice.com'
  },
  {
    id: 't5',
    level: 4,
    title: 'Estafa completa (deepfake)',
    brand: 'Banco Central',
    brandColor: '#003aa1',
    brandEmoji: '🤖',
    cta: 'Verificar identidad',
    urgency: 'Voz clonada + videollamada falsa',
    prize: 'Cuenta desbloqueada',
    link: 'Llamada desde +1 555 0001',
    sender: 'ia-voice-support.com'
  }
];

export const ESTAFADOR_LEVELS = [
  { level: 1, name: 'Crea un correo falso', description: 'Combina piezas para entender qué elementos son creíbles y cuáles son señales de alerta.' },
  { level: 2, name: 'Diseña una página falsa', description: 'Elige logo, colores y textos. El sistema te mostrará qué se ve sospechoso.' },
  { level: 3, name: 'Engaña a un NPC', description: 'Intenta que un NPC caiga. El NPC te explica por qué funciona o falla.' },
  { level: 4, name: 'Pide una contraseña', description: 'Aprende las técnicas de ingeniería social y por qué siempre fallan con personas informadas.' },
  { level: 5, name: 'Estafa completa', description: 'El sistema desarma una estafa completa paso a paso para que veas todas las señales.' }
];
