// ============================================================
// Cyber Decisions — Modelo de datos
// ============================================================
// 6 stats con rango 0..100. Empiezan en 50 (neutral).
// Las decisiones modifican estos stats. Algunas consecuencias
// aparecen varios escenarios después (delayed effects).

export type StatKey =
  | 'seguridad'   // Seguridad Digital
  | 'reputacion'  // Reputación
  | 'confianza'   // Confianza
  | 'dinero'      // Dinero
  | 'conocimiento'// Conocimiento
  | 'privacidad'; // Privacidad

export const STAT_KEYS: StatKey[] = [
  'seguridad', 'reputacion', 'confianza', 'dinero', 'conocimiento', 'privacidad'
];

export const STAT_LABELS: Record<StatKey, string> = {
  seguridad: 'Seguridad Digital',
  reputacion: 'Reputación',
  confianza: 'Confianza',
  dinero: 'Dinero',
  conocimiento: 'Conocimiento',
  privacidad: 'Privacidad'
};

export const STAT_EMOJI: Record<StatKey, string> = {
  seguridad: '🛡️',
  reputacion: '⭐',
  confianza: '🤝',
  dinero: '💰',
  conocimiento: '🧠',
  privacidad: '🔒'
};

export const STAT_COLOR: Record<StatKey, string> = {
  seguridad: '#3eff9b',   // neon-green
  reputacion: '#ffe14a',  // neon-yellow
  confianza: '#3effe1',   // neon-cyan
  dinero: '#ff7a3e',      // neon-orange
  conocimiento: '#9b5cff',// neon-purple
  privacidad: '#ff3ea5'   // neon-pink
};

export const STAT_BLURB: Record<StatKey, string> = {
  seguridad: 'Capacidad de detectar y evitar amenazas.',
  reputacion: 'Cómo te ven los demás en el mundo digital.',
  confianza: 'Relación con familia, amigos y contactos.',
  dinero: 'Tu salud financiera virtual.',
  conocimiento: 'Lo que sabes sobre seguridad y privacidad.',
  privacidad: 'Cuánto controlas de tu información personal.'
};

export type StatDelta = Partial<Record<StatKey, number>>;

// ============================================================
// Consecuencias
// ============================================================
// Inmediata: visible al tomar la decisión.
// Retardada: aparece N escenarios después (N=1..4), creando
// cadenas de causa-efecto.

export interface Consequence {
  // Texto corto, frontal, en lenguaje adolescente.
  headline: string;
  // Detalle opcional (1 frase).
  detail?: string;
  // Modificadores de stats.
  delta?: StatDelta;
  // Modificadores de dinero del juego (separado de stat dinero).
  moneyDelta?: number;
  // Modificadores de XP.
  xpDelta?: number;
  // Modificadores de coins.
  coinDelta?: number;
  // Flags para logros / reputación narrativa.
  flags?: string[];
  // Flag individual (compatibilidad con escenarios simples).
  flag?: string;
}

export interface DelayedConsequence extends Consequence {
  // Aparece en este escenario de la cadena (1 = siguiente, 2 = dos después...).
  delayScenarios: number;
}

// ============================================================
// Personajes
// ============================================================

export type CharacterId =
  | 'amigo' | 'madre' | 'padre' | 'abuela' | 'hermano'
  | 'novia' | 'profesor' | 'banco' | 'soporte'
  | 'influencer' | 'desconocido' | 'reclutador'
  | 'marcas' | 'grupo';

export interface Character {
  id: CharacterId;
  name: string;
  emoji: string;
  relation: string;
  // Color del aura para la UI.
  color: string;
  // Personalidad breve (1-2 frases) que influye en su diálogo.
  personality: string;
}

export const CHARACTERS: Record<CharacterId, Character> = {
  amigo:        { id: 'amigo', name: 'Tu amigo Lucas', emoji: '🧑‍🦱', relation: 'Colega de clase', color: '#3effe1', personality: 'Confiado, bromista, te conoce hace años.' },
  madre:        { id: 'madre', name: 'Tu mamá', emoji: '👩', relation: 'Familia', color: '#ff3ea5', personality: 'Te quiere, se preocupa, no domina la tecnología.' },
  padre:        { id: 'padre', name: 'Tu papá', emoji: '👨', relation: 'Familia', color: '#9b5cff', personality: 'Práctico, te da consejos, espera que pienses.' },
  abuela:       { id: 'abuela', name: 'Tu abuela', emoji: '👵', relation: 'Familia', color: '#ffe14a', personality: 'Cariñosa, vulnerable a estafas, te adora.' },
  hermano:      { id: 'hermano', name: 'Tu hermano Dani', emoji: '👦', relation: 'Hermano menor', color: '#3eff9b', personality: 'Adolescente, te copia, le gustan los retos.' },
  novia:        { id: 'novia', name: 'Tu pareja', emoji: '💑', relation: 'Pareja', color: '#ff3ea5', personality: 'Cercana, te conoce bien, comparte contraseñas a veces.' },
  profesor:     { id: 'profesor', name: 'Profesor Martínez', emoji: '👨‍🏫', relation: 'Profesor', color: '#00c6ff', personality: 'Serio, te evalúa, no comparte datos por chat.' },
  banco:        { id: 'banco', name: 'Banco CyberBank', emoji: '🏦', relation: 'Institución', color: '#0050d4', personality: 'Nunca te pide claves. Si insiste, es falso.' },
  soporte:      { id: 'soporte', name: 'Soporte técnico', emoji: '🛠️', relation: 'Servicio técnico', color: '#3effe1', personality: 'No te llama para "reparar tu PC" sin que lo pidas.' },
  influencer:   { id: 'influencer', name: 'Influencer @moneyking', emoji: '📱', relation: 'Figura pública', color: '#ffe14a', personality: 'Promete riqueza fácil, vende humo.' },
  desconocido:  { id: 'desconocido', name: 'Desconocido/a', emoji: '🕵️', relation: 'Extraño', color: '#ff3e6a', personality: 'No sabes quién es. La cautela es tu aliada.' },
  reclutador:   { id: 'reclutador', name: 'Reclutador IT', emoji: '💼', relation: 'Profesional', color: '#9b5cff', personality: 'Oferta de trabajo, normalmente no pide datos bancarios.' },
  marcas:       { id: 'marcas', name: 'App desconocida', emoji: '📲', relation: 'Aplicación', color: '#3eff9b', personality: 'Solo debería pedirte lo justo y necesario.' },
  grupo:        { id: 'grupo', name: 'Grupo de WhatsApp', emoji: '👥', relation: 'Chat grupal', color: '#3effe1', personality: 'Una sola persona puede contaminar a todo el grupo.' }
};

// ============================================================
// Decisión / Escenario
// ============================================================

export type ChoiceId = 'a' | 'b' | 'c' | 'd';

export interface Choice {
  id: ChoiceId;
  // Texto del botón (lo que el jugador ve).
  label: string;
  // Resultado inmediato (visible al elegir).
  immediate: Consequence;
  // Consecuencias retardadas (cadena causa-efecto).
  delayed?: DelayedConsequence[];
  // Etiqueta sutil del tono de la opción (para UI).
  vibe?: 'safe' | 'risky' | 'neutral' | 'kind' | 'curious' | 'bold';
  // Para tracking/logros.
  flag?: string;
}

export type ScenarioChannel =
  | 'chat'       // Mensajería (WhatsApp, Telegram, DM)
  | 'social'     // Redes sociales (Instagram, TikTok, X)
  | 'call'       // Llamada / videollamada
  | 'sms'        // SMS
  | 'email'      // Email
  | 'web'        // Web / portal cautivo
  | 'irl'        // En la vida real (escaneas un QR, alguien en la calle)
  | 'app'        // Permisos de una app, instalación
  | 'inperson';  // En persona (cara a cara)

export interface Scenario {
  id: string;
  title: string;
  // Contexto: ambientación en 1-2 frases.
  setup: string;
  // Quiénes aparecen.
  characters: CharacterId[];
  // Quién te habla o dónde ocurre (channel).
  channel: ScenarioChannel;
  // Mensaje principal (lo que el jugador ve, a veces un mensaje del personaje).
  message: string;
  // Si el mensaje es del personaje y tiene 'remitente'.
  sender?: { name: string; handle?: string };
  // 2-4 opciones.
  choices: Choice[];
  // Categoría temática (para filtros/logros).
  theme: 'social' | 'finanzas' | 'identidad' | 'gaming' | 'familia' | 'trabajo' | 'datos' | 'ia';
  // Dificultad (1..3) — afecta XP/coins.
  difficulty: 1 | 2 | 3;
  // Tags para logros.
  tags: string[];
  // Si es parte de una cadena narrativa específica.
  arc?: string;
}
