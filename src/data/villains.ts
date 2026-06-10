export type VillainId = 'urgencia' | 'premio' | 'link' | 'clon' | 'ia';

export interface Villain {
  id: VillainId;
  name: string;
  emoji: string;
  tagline: string;
  trick: string;
  color: string;
  from: string;
}

export const VILLAINS: Record<VillainId, Villain> = {
  urgencia: {
    id: 'urgencia',
    name: 'Capitán Urgencia',
    emoji: '⏰',
    tagline: 'El terror del reloj',
    trick: 'Usa miedo y presión para que actúes sin pensar.',
    color: '#ff7a3e',
    from: 'Usa frases como “Tu cuenta será eliminada”, “Última oportunidad”, “Actúa ahora”.'
  },
  premio: {
    id: 'premio',
    name: 'Reina Premio',
    emoji: '👑',
    tagline: 'La reina de los regalos imposibles',
    trick: 'Te promete premios que nunca existieron.',
    color: '#ffe14a',
    from: '“Ganaste un premio”, “Obtén monedas gratis”, “Reclama tu recompensa”.'
  },
  link: {
    id: 'link',
    name: 'Doctor Link',
    emoji: '🔗',
    tagline: 'El mago de las URLs',
    trick: 'Crea enlaces casi idénticos a los originales.',
    color: '#3effe1',
    from: 'Camba una letra, agrega un guion, usa dominios parecidos: banc0.com, g00gle.com.'
  },
  clon: {
    id: 'clon',
    name: 'Señor Clon',
    emoji: '🎭',
    tagline: 'El maestro de las máscaras',
    trick: 'Copia sitios legítimos palabra por palabra.',
    color: '#9b5cff',
    from: 'Replica la estética de bancos, videojuegos, escuelas y redes sociales.'
  },
  ia: {
    id: 'ia',
    name: 'Fantasma IA',
    emoji: '👻',
    tagline: 'El rey de los deepfakes',
    trick: 'Usa voces, imágenes y videos generados por IA.',
    color: '#ff3ea5',
    from: 'Llama a tu “madre” con su voz, hace videollamadas con caras clonadas.'
  }
};

export const VILLAIN_LIST: Villain[] = Object.values(VILLAINS);
