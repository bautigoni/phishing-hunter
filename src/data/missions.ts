export type Difficulty = 'principiante' | 'intermedio' | 'avanzado' | 'experto';
export type VillainId = 'urgencia' | 'premio' | 'link' | 'clon' | 'ia';
export type Surface = 'email' | 'sms' | 'web' | 'social' | 'chat' | 'profile';

export interface Clue {
  id: string;
  selector: string;
  hint: string;
  explanation: string;
}

export interface Mission {
  id: string;
  title: string;
  district:
    | 'premios'
    | 'email'
    | 'social'
    | 'games'
    | 'chat'
    | 'shop'
    | 'bank'
    | 'ia';
  surface: Surface;
  difficulty: Difficulty;
  villain: 'urgencia' | 'premio' | 'link' | 'clon' | 'ia';
  xp: number;
  coins: number;
  from: { name: string; handle: string; avatarSeed: string };
  subject?: string;
  body: string;
  link?: { text: string; realHref: string; displayed: string };
  imageUrl?: string;
  mediaCaption?: string;
  clues: Clue[];
  redFlags: string[];
}

const C = (id: string, selector: string, hint: string, explanation: string): Clue => ({
  id,
  selector,
  hint,
  explanation
});

export const MISSIONS: Mission[] = [
  // ============================================
  // DISTRICT 1: PREMIOS FALSOS
  // ============================================
  {
    id: 'm-premios-1',
    title: 'El premio imposible',
    district: 'premios',
    surface: 'email',
    difficulty: 'principiante',
    villain: 'premio',
    xp: 80,
    coins: 30,
    from: { name: 'Mega Sorteos Cyber', handle: 'sorteos@meg4-cybersorteos.pw', avatarSeed: 'gift' },
    subject: '🎉 ¡HAS GANADO UN IPHONE 17 PRO! Reclama AHORA',
    body: 'Felicidades!!! Has sido seleccionado como ganador absoluto de un iPhone 17 Pro Max + 5.000 USD. Confirma tus datos en 10 minutos o perderás tu premio. Haz clic YA en el botón de abajo.',
    link: { text: '👉 Reclamar mi premio', realHref: 'http://meg4-cybersorteos.pw/claim', displayed: 'http://www.apple.com/claim' },
    clues: [
      C('c1', '[data-clue="from"]', 'Remitente sospechoso', 'El dominio “meg4-cybersorteos.pw” no pertenece a Apple ni a ninguna marca oficial.'),
      C('c2', '[data-clue="subject"]', 'Emoción exagerada', 'Los premios reales no prometen emoción ni presionan con emojis múltiples.'),
      C('c3', '[data-clue="link"]', 'Enlace falso', 'El texto dice apple.com pero el enlace real va a un dominio .pw sospechoso.'),
      C('c4', '[data-clue="urgency"]', 'Urgencia falsa', '“10 minutos o pierdes todo” es la firma del phishing de premios.')
    ],
    redFlags: ['Remitente desconocido', 'Emoción exagerada', 'Urgencia artificial', 'Dominio falso']
  },
  {
    id: 'm-premios-2',
    title: 'Monedas gratis infinito',
    district: 'premios',
    surface: 'sms',
    difficulty: 'principiante',
    villain: 'premio',
    xp: 80,
    coins: 30,
    from: { name: 'Brawl Stars', handle: '+1 555 0142', avatarSeed: 'brawl' },
    body: 'BRAWL STARS: 1000 gemas gratis para ti! Reclama aqui: http://brawlstars-reward.tk/gem. Solo 30 cupos.',
    link: { text: 'http://brawlstars-reward.tk/gem', realHref: 'http://brawlstars-reward.tk/gem', displayed: 'http://brawlstars-reward.tk/gem' },
    clues: [
      C('c1', '[data-clue="from"]', 'Remitente genérico', 'Supercell nunca envía gemas por SMS desde un número corto.'),
      C('c2', '[data-clue="link"]', 'Dominio .tk', '“.tk” es una extensión barata muy usada para estafas.'),
      C('c3', '[data-clue="urgency"]', 'Cupos falsos', '“Solo 30 cupos” es presión para que no pienses.')
    ],
    redFlags: ['Número desconocido', 'Dominio .tk', 'Cupos limitados']
  },

  // ============================================
  // DISTRICT 2: CORREOS ELECTRÓNICOS
  // ============================================
  {
    id: 'm-email-1',
    title: 'La cuenta bloqueada',
    district: 'email',
    surface: 'email',
    difficulty: 'intermedio',
    villain: 'urgencia',
    xp: 110,
    coins: 40,
    from: { name: 'Soporte Steam', handle: 'no-reply@steamsupport-secure.com', avatarSeed: 'steam' },
    subject: '⚠️ Actividad sospechosa detectada en tu cuenta',
    body: 'Hemos detectado un inicio de sesión no autorizado desde Kazajistán. Si no fuiste tú, verifica tu cuenta inmediatamente o será suspendida en 24 horas. Haz clic en el siguiente enlace para confirmar tu identidad.',
    link: { text: 'https://steampowered.com/verify', realHref: 'http://steamsupport-secure.com/login', displayed: 'https://steampowered.com/verify' },
    clues: [
      C('c1', '[data-clue="from"]', 'Dominio falso', 'El dominio real es steampowered.com, no steamsupport-secure.com.'),
      C('c2', '[data-clue="link"]', 'Enlace disfrazado', 'El texto dice steampowered.com pero el href real va a un sitio falso.'),
      C('c3', '[data-clue="urgency"]', 'Amenaza de suspensión', '“Suspendida en 24h” es presión para evitar que pienses.')
    ],
    redFlags: ['Dominio falso', 'Enlace disfrazado', 'Amenaza de tiempo']
  },
  {
    id: 'm-email-2',
    title: 'Factura que no pediste',
    district: 'email',
    surface: 'email',
    difficulty: 'intermedio',
    villain: 'link',
    xp: 110,
    coins: 40,
    from: { name: 'Amazon Billing', handle: 'billing@amaz0n-billing.support', avatarSeed: 'amazon' },
    subject: 'Tu pedido #113-4582 fue cobrado: $899.99',
    body: 'Hola, confirmamos el cobro de tu pedido a la tarjeta Visa **** 2244 por $899.99. Si no reconoces este cargo, cancela aquí:',
    link: { text: 'Cancelar pedido', realHref: 'http://amaz0n-billing.support/refund', displayed: 'https://amazon.com/cancel' },
    clues: [
      C('c1', '[data-clue="from"]', 'Cero por O', '“amaz0n” con cero en lugar de O. Truco clásico.'),
      C('c2', '[data-clue="link"]', 'Enlace falso', 'El href real no es amazon.com.'),
      C('c3', '[data-clue="body"]', 'Pedido que no hiciste', 'Si no hiciste el pedido, no entres al link: entra a Amazon directamente.')
    ],
    redFlags: ['Caracteres sustituidos', 'Cobro no reconocido', 'Enlace a dominio falso']
  },

  // ============================================
  // DISTRICT 3: REDES SOCIALES
  // ============================================
  {
    id: 'm-social-1',
    title: 'El sorteo del influencer',
    district: 'social',
    surface: 'social',
    difficulty: 'intermedio',
    villain: 'premio',
    xp: 110,
    coins: 40,
    from: { name: 'MrBeast Oficial', handle: '@mrbeast_real_2026', avatarSeed: 'beast' },
    mediaCaption: '¡SORTEAMOS 10 iPHONES! Sigue a @mrbeast_real_2026, dale like y comenta tu email para participar. ¡Solo 24 horas!',
    body: 'Comparte este post y manda tus datos a promo@mrbeast-gift.buzz para recibir tu premio. Cupos limitados.',
    clues: [
      C('c1', '[data-clue="handle"]', 'Handle falso', '“_real_2026” añadido al final es la pista más obvia de cuenta clon.'),
      C('c2', '[data-clue="body"]', 'Pide email en comentarios', 'MrBeast jamás pide datos por DM ni comentarios.'),
      C('c3', '[data-clue="email"]', 'Email .buzz', 'Una marca real no usa “.buzz” para sus promociones.')
    ],
    redFlags: ['Cuenta falsa', 'Pide datos personales', 'Urgencia de 24h']
  },
  {
    id: 'm-social-2',
    title: 'La cripto de tu amigo',
    district: 'social',
    surface: 'chat',
    difficulty: 'avanzado',
    villain: 'clon',
    xp: 140,
    coins: 55,
    from: { name: 'Lucas (amigo)', handle: '@lucas_ok.7', avatarSeed: 'lucas' },
    body: 'ey bro, encontré una plataforma donde te regalan $50 solo por registrarte. Yo ya saqué $300 ayer. Mete tu tarjeta, es seguro te lo juro. link: pay-invest-crypto.io/signup',
    link: { text: 'pay-invest-crypto.io/signup', realHref: 'https://pay-invest-crypto.io/signup', displayed: 'https://pay-invest-crypto.io/signup' },
    clues: [
      C('c1', '[data-clue="body"]', 'Te urge a meter tarjeta', 'Un amigo de verdad no te pediría datos bancarios por chat.'),
      C('c2', '[data-clue="link"]', 'Dominio recién creado', '“pay-invest-crypto” suena genérico: tres palabras genéricas juntas son sospechosas.'),
      C('c3', '[data-clue="style"]', 'Lenguaje agresivo', '“es seguro te lo juro” es la firma de los scam que quieren convencerte rápido.')
    ],
    redFlags: ['Mensaje fuera de contexto', 'Pide datos bancarios', 'Dominio genérico']
  },

  // ============================================
  // DISTRICT 4: VIDEOJUEGOS
  // ============================================
  {
    id: 'm-games-1',
    title: 'Skins gratis Fortnite',
    district: 'games',
    surface: 'web',
    difficulty: 'principiante',
    villain: 'premio',
    xp: 80,
    coins: 30,
    from: { name: 'Fortnite Crew', handle: 'fortnitecrew-free.com', avatarSeed: 'fort' },
    body: 'Inicia sesión con tu cuenta de Epic Games para reclamar 5.000 V-Bucks gratis. Solo necesitas tu usuario y contraseña.',
    imageUrl: 'fortnite',
    clues: [
      C('c1', '[data-clue="domain"]', 'No es fortnite.com', 'Epic Games usa fortnite.com y epicgames.com, nunca “-free.com”.'),
      C('c2', '[data-clue="body"]', 'Pide contraseña', 'Epic jamás te pedirá contraseña fuera de su app oficial.'),
      C('c3', '[data-clue="title"]', '“Gratis” exagerado', 'Las recompensas reales llegan dentro del juego, no en webs externas.')
    ],
    redFlags: ['Dominio falso', 'Pide contraseña', 'Recompensa exagerada']
  },
  {
    id: 'm-games-2',
    title: 'El generador de Robux',
    district: 'games',
    surface: 'web',
    difficulty: 'avanzado',
    villain: 'ia',
    xp: 150,
    coins: 60,
    from: { name: 'Robux Generator Pro', handle: 'rblx-generator.online', avatarSeed: 'roblox' },
    body: 'Generador verificado por IA. Solo ingresa tu usuario y la cantidad de Robux. No pedimos contraseña, ¡es 100% seguro!',
    imageUrl: 'roblox',
    clues: [
      C('c1', '[data-clue="body"]', '“Verificado por IA”', 'La IA no verifica estafas: esto es marketing falso.'),
      C('c2', '[data-clue="body"]', '“No pedimos contraseña”', 'Dicen eso para sonar confiables, pero igual buscan robarte la cuenta.'),
      C('c3', '[data-clue="domain"]', 'Generador = estafa', 'Los Robux, gemas o V-Bucks gratis no existen. Punto.')
    ],
    redFlags: ['Oferta imposible', 'No oficial', 'Trucos con IA como cebo']
  },

  // ============================================
  // DISTRICT 5: MENSAJERÍA
  // ============================================
  {
    id: 'm-chat-1',
    title: 'El paquete perdido',
    district: 'chat',
    surface: 'sms',
    difficulty: 'intermedio',
    villain: 'urgencia',
    xp: 100,
    coins: 35,
    from: { name: 'DHL Express', handle: '+44 7700 900123', avatarSeed: 'dhl' },
    body: 'DHL: Tu paquete no pudo ser entregado por falta de direccion. Paga 1.99 EUR de reenvio: http://dhl-redeliver.top/pay',
    link: { text: 'http://dhl-redeliver.top/pay', realHref: 'http://dhl-redeliver.top/pay', displayed: 'http://dhl-redeliver.top/pay' },
    clues: [
      C('c1', '[data-clue="from"]', 'Número internacional', 'DHL no manda SMS desde números personales del Reino Unido.'),
      C('c2', '[data-clue="link"]', 'Dominio .top', '“.top” es una extensión barata y muy usada para phishing.'),
      C('c3', '[data-clue="body"]', 'Cobro de “1.99”', 'Cobros pequeños son cebos para robar datos de tarjeta.')
    ],
    redFlags: ['Número internacional', 'Cobro pequeño', 'Dominio .top']
  },
  {
    id: 'm-chat-2',
    title: 'WhatsApp mamá',
    district: 'chat',
    surface: 'chat',
    difficulty: 'avanzado',
    villain: 'urgencia',
    xp: 150,
    coins: 60,
    from: { name: 'Mamá', handle: '+34 612 000 999', avatarSeed: 'mom' },
    body: 'Hola cariño, se me rompió el móvil y estoy usando este número temporal. ¿Me puedes hacer una transferencia de 250€ urgentemente? Te paso el Bizum luego cuando arregle el mío. Por favor no me dejes tirada 🥺',
    clues: [
      C('c1', '[data-clue="from"]', 'Número nuevo', 'Tu mamá no cambia de número sin avisarte. Verifica siempre por llamada de voz.'),
      C('c2', '[data-clue="body"]', 'Pide dinero', 'Si alguien te pide dinero por chat, confirma por otra vía antes de enviar.'),
      C('c3', '[data-clue="body"]', 'Apela a la emoción', 'Los emojis de tristeza y la palabra “urgente” son manipulación emocional.')
    ],
    redFlags: ['Número desconocido', 'Pide dinero', 'Apela a emociones']
  },

  // ============================================
  // DISTRICT 6: COMPRAS ONLINE
  // ============================================
  {
    id: 'm-shop-1',
    title: 'PlayStation 5 al 70%',
    district: 'shop',
    surface: 'web',
    difficulty: 'avanzado',
    villain: 'premio',
    xp: 140,
    coins: 55,
    from: { name: 'GamerStore', handle: 'gamer-store-outlet.shop', avatarSeed: 'shop' },
    body: 'PS5 Slim + 2 juegos por solo $299. ¡Última unidad! Acepta crypto, PayPal y tarjeta. Envío gratis 24h.',
    imageUrl: 'shop',
    clues: [
      C('c1', '[data-clue="domain"]', 'Dominio .shop', 'Las tiendas reales usan dominios oficiales, no “.shop”.'),
      C('c2', '[data-clue="body"]', 'Paga con crypto', 'Las tiendas legítimas aceptan pagos comunes. Cripto = imposible rastrear.'),
      C('c3', '[data-clue="body"]', '“Última unidad”', 'Urgencia falsa para impedir que compares precios.')
    ],
    redFlags: ['Precio irreal', 'Dominio genérico', 'Métodos de pago sospechosos']
  },

  // ============================================
  // DISTRICT 7: BANCOS
  // ============================================
  {
    id: 'm-bank-1',
    title: 'BBVA falso',
    district: 'bank',
    surface: 'web',
    difficulty: 'experto',
    villain: 'clon',
    xp: 200,
    coins: 80,
    from: { name: 'BBVA Net Cash', handle: 'bbva-net-cash.app', avatarSeed: 'bbva' },
    body: 'Estimado cliente, por seguridad hemos limitado su acceso. Verifique su identidad con DNI y clave de acceso para reactivar la cuenta.',
    imageUrl: 'bbva',
    clues: [
      C('c1', '[data-clue="domain"]', 'No es bbva.es', 'BBVA real solo usa bbva.es o bbva.com. Este “.app” es falso.'),
      C('c2', '[data-clue="body"]', 'Pide DNI + clave', 'Un banco NUNCA pide tu clave completa ni foto del DNI por web.'),
      C('c3', '[data-clue="style"]', 'Clon casi perfecto', 'La estética copia el banco, pero el dominio es la prueba definitiva.')
    ],
    redFlags: ['Dominio falso', 'Pide datos sensibles', 'Copia exacta del banco']
  },

  // ============================================
  // DISTRICT 8: DEEPFAKES & IA
  // ============================================
  {
    id: 'm-ia-1',
    title: 'La voz de tu madre',
    district: 'ia',
    surface: 'chat',
    difficulty: 'experto',
    villain: 'ia',
    xp: 220,
    coins: 90,
    from: { name: 'Mamá (¿?)', handle: 'mama-ia-voice.com', avatarSeed: 'deepmom' },
    body: '“Hola hijo, soy yo, mamá. Tuve un accidente y necesito 1.500€ para la operación. Por favor, no llames a papá, no quiero preocuparlo. Manda el dinero a este número: ES12 3456 0000 12 3456789012. Te llamaré luego.”',
    clues: [
      C('c1', '[data-clue="from"]', 'Origen IA', 'La nota de voz fue generada por IA: tono plano, sin ruido ambiente.'),
      C('c2', '[data-clue="body"]', 'Aisla a la víctima', '“No llames a papá” es la señal más clara de intento de fraude.'),
      C('c3', '[data-clue="body"]', 'Pide transferencia', 'Una emergencia médica real no se paga por transferencia a desconocidos.')
    ],
    redFlags: ['Voz clonada por IA', 'Manipulación emocional', 'Aislamiento del entorno']
  }
];

export const MISSIONS_BY_DIFFICULTY: Record<Difficulty, Mission[]> = {
  principiante: MISSIONS.filter((m) => m.difficulty === 'principiante'),
  intermedio: MISSIONS.filter((m) => m.difficulty === 'intermedio'),
  avanzado: MISSIONS.filter((m) => m.difficulty === 'avanzado'),
  experto: MISSIONS.filter((m) => m.difficulty === 'experto')
};
