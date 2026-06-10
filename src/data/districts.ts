export type DistrictId =
  | 'premios'
  | 'email'
  | 'social'
  | 'games'
  | 'chat'
  | 'shop'
  | 'bank'
  | 'ia';

export interface District {
  id: DistrictId;
  name: string;
  emoji: string;
  tagline: string;
  villain: 'urgencia' | 'premio' | 'link' | 'clon' | 'ia';
  gradient: string;
}

export const DISTRICTS: District[] = [
  {
    id: 'premios',
    name: 'Premios Falsos',
    emoji: '🎁',
    tagline: 'Donde los regalos imposibles viven.',
    villain: 'premio',
    gradient: 'from-neon-yellow/40 to-neon-orange/30'
  },
  {
    id: 'email',
    name: 'Correos Electrónicos',
    emoji: '📧',
    tagline: 'Buzones infestados de spam.',
    villain: 'urgencia',
    gradient: 'from-cyber-400/40 to-cyber-600/30'
  },
  {
    id: 'social',
    name: 'Redes Sociales',
    emoji: '📱',
    tagline: 'Perfiles falsos y estafas virales.',
    villain: 'clon',
    gradient: 'from-neon-purple/40 to-neon-pink/30'
  },
  {
    id: 'games',
    name: 'Videojuegos',
    emoji: '🎮',
    tagline: 'Skins gratis y trampas en línea.',
    villain: 'premio',
    gradient: 'from-neon-green/40 to-cyber-300/30'
  },
  {
    id: 'chat',
    name: 'Mensajería Instantánea',
    emoji: '💬',
    tagline: 'Mensajes con enlaces sospechosos.',
    villain: 'urgencia',
    gradient: 'from-neon-cyan/40 to-cyber-400/30'
  },
  {
    id: 'shop',
    name: 'Compras Online',
    emoji: '🛒',
    tagline: 'Ofertas demasiado buenas.',
    villain: 'link',
    gradient: 'from-neon-orange/40 to-neon-pink/30'
  },
  {
    id: 'bank',
    name: 'Bancos',
    emoji: '🏦',
    tagline: 'Falsos avisos de tu banco.',
    villain: 'clon',
    gradient: 'from-cyber-500/40 to-neon-purple/30'
  },
  {
    id: 'ia',
    name: 'Deepfakes & IA',
    emoji: '🤖',
    tagline: 'Voces y caras que no son reales.',
    villain: 'ia',
    gradient: 'from-neon-pink/40 to-neon-cyan/30'
  }
];
