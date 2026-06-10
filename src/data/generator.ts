import type { Mission, Difficulty, Surface, VillainId } from './missions';

const firstNames = ['Sofía', 'Mateo', 'Lucía', 'Hugo', 'Martina', 'Leo', 'Valeria', 'Lucas', 'Camila', 'Daniel', 'Paula', 'Iván', 'Emma', 'Thiago', 'Renata'];
const lastNames = ['García', 'Martínez', 'López', 'Hernández', 'Pérez', 'Gómez', 'Ruiz', 'Díaz', 'Vargas', 'Romero', 'Soto', 'Castro'];
const banks = ['BBVA', 'Santander', 'CaixaBank', 'Sabadell', 'Bankinter'];
const shops = ['Amazon', 'AliExpress', 'MercadoLibre', 'eBay', 'Temu'];
const games = ['Fortnite', 'Roblox', 'Brawl Stars', 'Free Fire', 'Minecraft'];

const urgentSubjects = [
  '⚠️ Verificación obligatoria en 24h',
  'Tu cuenta será suspendida hoy',
  'Detectamos actividad sospechosa',
  'Confirma tu identidad ahora',
  'Acción inmediata requerida'
];

const premioSubjects = [
  '🎁 ¡Ganaste un premio exclusivo!',
  'Has sido seleccionado: 500€ de regalo',
  'Tu cupón expirará pronto',
  'Sorteo VIP - Reclama ya',
  'Gemas gratis por tiempo limitado'
];

const linkSubjects = [
  'Confirma tu dirección de envío',
  'Reembolso disponible',
  'Pago rechazado, actualiza datos',
  'Tu pedido está en camino',
  'Verifica tu cuenta bancaria'
];

const iaSubjects = [
  'Hola, soy tu primo (videollamada)',
  'Voz clonada - emergencia familiar',
  'Mensaje de voz sospechoso',
  'Video generado por IA',
  'Llamada con IA'
];

const urgentBodies = [
  'Estimado usuario, hemos detectado un inicio de sesión desde un dispositivo no reconocido. Si no fuiste tú, confirma tu identidad inmediatamente o perderás acceso a tu cuenta.',
  'Por tu seguridad, tu cuenta ha sido limitada. Tienes 24 horas para verificar tus datos o el servicio será suspendido permanentemente.',
  'Hemos identificado una transacción no autorizada. Para cancelar el cargo, confirma tus datos haciendo clic en el siguiente enlace.',
  'Tu suscripción ha sido cancelada por falta de pago. Reactiva ahora o perderás todos tus beneficios.'
];

const premioBodies = [
  '¡Felicidades! Has sido elegido ganador de un increíble premio. Reclama tu recompensa antes de que expire. Solo necesitamos tu dirección y un pequeño pago de envío.',
  'Has ganado monedas/gems gratis. Para activar tu premio, completa un breve formulario con tus datos personales.',
  'Sorteo exclusivo: 1.000 participantes, 5 ganadores. Has sido uno de ellos. Reclama tu regalo en los próximos 30 minutos.',
  'Tu cuenta ha sido bonificada con 500€. Ingresa tus datos bancarios para recibir la transferencia.'
];

const linkBodies = [
  'Tu pedido #{order} ha sido confirmado. El cargo aparecerá en tu tarjeta en las próximas 24h. Si no reconoces este cargo, cancela aquí:',
  'Hemos procesado un reembolso de $89.99 a tu favor. Para recibirlo, confirma los datos de tu tarjeta:',
  'Hola, te envié un documento importante. Ábrelo y firma cuanto antes. Aquí está el archivo:',
  'Tu dirección de envío no es válida. Actualízala para recibir tu paquete:'
];

const iaBodies = [
  '"Hola, soy tu primo" (audio generado por IA). Me he metido en un lío y necesito que me transfieras 200€ urgentemente. No llames a mi madre, no quiero preocuparla.',
  '"Hola mamá" (voz clonada). Tuve un accidente, estoy en el hospital. Necesito 1.500€ para la operación. Manda el dinero a esta cuenta, por favor.',
  '"Hola, soy el director del banco" (videollamada falsa). Hay un problema con tu cuenta y necesitamos verificarte con una clave.',
  '"Hola, soy el soporte técnico" (audio IA). Tu ordenador está infectado. Paga 99€ por la limpieza remota.'
];

const clonBodies = [
  'Estimado cliente, su sesión ha expirado. Por motivos de seguridad le solicitamos que vuelva a iniciar sesión e introduzca su clave completa.',
  'Hemos actualizado nuestros sistemas. Le pedimos que confirme su información personal: nombre completo, DNI, fecha de nacimiento y clave de acceso.',
  'Su tarjeta ha sido bloqueada preventivamente. Desbloquéela introduciendo los 16 dígitos y el CVV.',
  'Confirme su dirección y número de teléfono haciendo clic en el siguiente enlace oficial:'
];

const templates: Record<VillainId, { subjects: string[]; bodies: string[] }> = {
  urgencia: { subjects: urgentSubjects, bodies: urgentBodies },
  premio: { subjects: premioSubjects, bodies: premioBodies },
  link: { subjects: linkSubjects, bodies: linkBodies },
  clon: { subjects: linkSubjects, bodies: clonBodies },
  ia: { subjects: iaSubjects, bodies: iaBodies }
};

const domainsByCategory: Record<string, string[]> = {
  bank: banks.map((b) => `${b.toLowerCase()}-secure-verify.com`),
  shop: shops.map((s) => `${s.toLowerCase()}-offers.shop`),
  games: games.map((g) => `${g.toLowerCase().replace(/\s/g, '')}-rewards.tk`),
  email: ['accounts-verify-center.com', 'security-alert-center.app', 'support-mail-billing.xyz'],
  social: ['promo-influencer.buzz', 'gift-events-center.top'],
  chat: ['dhl-redeliver.top', 'correos-es-info.app', 'whatsapp-support-biz.com'],
  ia: ['deepvoice-clone.io', 'ai-helper-now.xyz', 'urgent-call-ai.app']
};

const suffixes = ['.top', '.tk', '.buzz', '.xyz', '.app', '.pw', '.shop'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildFakeDomain(cat: string) {
  const list = domainsByCategory[cat] || [];
  return pick(list);
}

function buildRealLikeDomain(cat: string) {
  if (cat === 'bank') return pick(banks).toLowerCase() + '.es';
  if (cat === 'shop') return pick(shops).toLowerCase() + '.com';
  if (cat === 'games') return 'supercell.com';
  if (cat === 'social') return 'instagram.com';
  return 'gmail.com';
}

function makeClue(selector: string, hint: string, explanation: string) {
  return { id: 'g' + Math.random().toString(36).slice(2, 8), selector, hint, explanation };
}

export interface GenerateOptions {
  villain: VillainId;
  difficulty: Difficulty;
  surface: Surface;
  district: Mission['district'];
}

export function generateMission(opts: GenerateOptions): Mission {
  const { villain, difficulty, surface, district } = opts;
  const t = templates[villain];
  const subject = pick(t.subjects);
  const body = pick(t.bodies).replace('{order}', '#' + rand(100000, 999999));
  const fakeDomain = buildFakeDomain(district);
  const realDomain = buildRealLikeDomain(district);
  const linkText = `https://${realDomain}/verify`;
  const realHref = `http://${fakeDomain}/login-${rand(1000, 9999)}`;

  const name = pick(firstNames) + ' ' + pick(lastNames);
  const fromName = (() => {
    switch (villain) {
      case 'premio': return pick(['Mega Sorteos', 'Club Premios', 'VIP Rewards']);
      case 'urgencia': return pick(['Soporte Seguridad', 'Alertas Sistema', 'Verificación']);
      case 'link': return pick(['Notificaciones', 'Servicio al Cliente', 'Centro de Ayuda']);
      case 'clon': return pick([pick(banks), 'Soporte Oficial', 'Atención Cliente']);
      case 'ia': return pick(['Mensaje IA', 'Soporte por Voz', 'Videollamada']);
    }
  })();

  const handle = `no-reply@${fakeDomain}`;
  const xp = difficulty === 'principiante' ? 80 : difficulty === 'intermedio' ? 110 : difficulty === 'avanzado' ? 150 : 220;
  const coins = Math.round(xp * 0.4);

  const clues = [
    makeClue('[data-clue="from"]', 'Remitente sospechoso', `El dominio “${fakeDomain}” no pertenece a la marca real.`),
    makeClue('[data-clue="link"]', 'Enlace falso', 'El texto dice un dominio oficial pero el enlace real va a otro lugar.'),
    makeClue('[data-clue="urgency"]', 'Urgencia artificial', '“24h”, “última oportunidad” o “ahora” son signos claros de presión.')
  ];
  if (villain === 'premio') {
    clues.push(makeClue('[data-clue="subject"]', 'Emoción exagerada', 'Los premios reales no prometen emoción extrema.'));
  }
  if (villain === 'ia') {
    clues.push(makeClue('[data-clue="body"]', 'Apela a emoción', 'Voz clonada + emergencia = truco de Fantasma IA.'));
  }
  if (villain === 'clon') {
    clues.push(makeClue('[data-clue="body"]', 'Pide datos sensibles', 'Una marca real nunca pide contraseñas ni DNI completos por email.'));
  }

  return {
    id: 'gen-' + Math.random().toString(36).slice(2, 10),
    title: subject,
    district,
    surface,
    difficulty,
    villain,
    xp,
    coins,
    from: { name: `${fromName}`, handle, avatarSeed: villain },
    subject,
    body,
    link: surface === 'email' || surface === 'sms' || surface === 'web'
      ? { text: linkText, realHref, displayed: linkText }
      : undefined,
    clues,
    redFlags: ['Dominio falso', 'Urgencia', 'Emoción exagerada']
  };
}

export function generateDailyMissions(): Mission[] {
  const villains: VillainId[] = ['urgencia', 'premio', 'link', 'clon', 'ia'];
  const surfaces: Surface[] = ['email', 'sms', 'web', 'social', 'chat'];
  const districts: Mission['district'][] = ['premios', 'email', 'social', 'games', 'chat', 'shop', 'bank', 'ia'];
  const diffs: Difficulty[] = ['principiante', 'intermedio', 'avanzado'];

  return [0, 1, 2].map((i) =>
    generateMission({
      villain: pick(villains),
      difficulty: diffs[i],
      surface: pick(surfaces),
      district: pick(districts)
    })
  );
}
