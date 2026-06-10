export type ItemSlot = 'hat' | 'backpack' | 'skin' | 'effect' | 'pet';

export interface ShopItem {
  id: string;
  name: string;
  slot: ItemSlot;
  emoji: string;
  price: number;
  rarity: 'común' | 'rara' | 'épica' | 'legendaria';
  description: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hat-cap', name: 'Gorra Byte', slot: 'hat', emoji: '🧢', price: 200, rarity: 'común', description: 'Una gorra azul eléctrica.' },
  { id: 'hat-crown', name: 'Corona Neón', slot: 'hat', emoji: '👑', price: 1500, rarity: 'legendaria', description: 'Brilla en la oscuridad.' },
  { id: 'hat-helmet', name: 'Casco Firewall', slot: 'hat', emoji: '⛑️', price: 600, rarity: 'rara', description: 'Protegido contra el spam.' },
  { id: 'hat-wizard', name: 'Sombrero Hacker', slot: 'hat', emoji: '🎩', price: 900, rarity: 'épica', description: 'Para los más listos.' },
  { id: 'backpack-glider', name: 'Mochila Planeador', slot: 'backpack', emoji: '🎒', price: 350, rarity: 'común', description: 'Carga baterías extra.' },
  { id: 'backpack-jet', name: 'Jetpack Holográfico', slot: 'backpack', emoji: '🚀', price: 1200, rarity: 'épica', description: 'Vuela por Cyber City.' },
  { id: 'backpack-shield', name: 'Escudo de Datos', slot: 'backpack', emoji: '🛡️', price: 700, rarity: 'rara', description: 'Defensa adicional.' },
  { id: 'skin-neon', name: 'Skin Neón Cyber', slot: 'skin', emoji: '🦺', price: 800, rarity: 'épica', description: 'Brilla con luz neón.' },
  { id: 'skin-arcade', slot: 'skin', name: 'Skin Arcade 8-bit', emoji: '🕹️', price: 400, rarity: 'rara', description: 'Estilo retro.' },
  { id: 'effect-confetti', name: 'Confetti Trail', slot: 'effect', emoji: '🎉', price: 300, rarity: 'común', description: 'Estela de confeti.' },
  { id: 'effect-glitch', name: 'Glitch Trail', slot: 'effect', emoji: '🟪', price: 600, rarity: 'rara', description: 'Pixel art a tu paso.' },
  { id: 'effect-fire', name: 'Estela de Fuego', slot: 'effect', emoji: '🔥', price: 1000, rarity: 'épica', description: '¡Arde!' },
  { id: 'pet-firewall', name: 'Firewall', slot: 'pet', emoji: '🐕‍🦺', price: 0, rarity: 'épica', description: 'Mascota inicial. Te protege.' },
  { id: 'pet-antivirus', name: 'Antivirus', slot: 'pet', emoji: '🐱', price: 800, rarity: 'rara', description: 'Caza virus en la red.' },
  { id: 'pet-bot', name: 'Bot Defender', slot: 'pet', emoji: '🤖', price: 1200, rarity: 'épica', description: 'Compañero metálico.' },
  { id: 'pet-byte', name: 'Byte Mini', slot: 'pet', emoji: '🤖', price: 600, rarity: 'rara', description: 'Pequeño Byte robot.' },
  { id: 'pet-crypto', name: 'Crypto Cat', slot: 'pet', emoji: '🐈‍⬛', price: 1500, rarity: 'legendaria', description: 'Gato cifrado de elite.' },
  { id: 'pet-owl', name: 'Búho Centinela', slot: 'pet', emoji: '🦉', price: 1100, rarity: 'épica', description: 'Ve en la oscuridad.' }
];
