// Motor de generación procedural de escenarios Cyber Decisions.
// Sin LLM: combina plantillas + personajes + contextos. Crea
// escenarios plausibles y con consecuencia retardada.

import type { CharacterId, Scenario, Choice, StatDelta, ChoiceId } from './decisions';
import { CHARACTERS } from './decisions';

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================
// Bloques de construcción
// ============================================================

const HOOKS: Record<string, string[]> = {
  urgencia: [
    '{name} te escribe: "Es urgente, ¿puedes ayudarme con {task}? Tengo {time}."',
    '"Tengo {time} para resolver esto. ¿Me echas una mano?"',
    'Un mensaje con marca roja de "URGENTE".',
    'Te llega un correo: "Acción inmediata: tienes {time}."'
  ],
  premio: [
    '{name} te reenvía: "¡Felicidades! Ganaste un {prize}."',
    '"Has sido seleccionado para un {prize} exclusivo. Reclama ya."',
    'Un post con confeti virtual: "Sorteo de {prize} por nuestro aniversario."',
    '"Solo {n} ganadores, tú eres uno. Confirma tu dirección."'
  ],
  link: [
    '{name} te pasa un link sin contexto.',
    'Te llega un SMS con un enlace acortado.',
    'Una historia de IG dice "link en bio" con una URL sospechosa.',
    'Un amigo te reenvía: "Mira esto, es brutal 👉 {link}"'
  ],
  clon: [
    'Un perfil idéntico al de {name} (pero verificado como falso) te escribe.',
    'Recibes un mensaje del "soporte" de una marca que usas, pero algo no encaja.',
    'Una web idéntica a la de tu banco te pide "verificar identidad".',
    'El correo parece oficial pero el dominio tiene un guion extra.'
  ],
  ia: [
    'Una videollamada de {name}, pero los gestos van con delay y la voz suena rara.',
    'Te llega un audio de tu "madre" pidiéndote algo inusual.',
    'Un video tuyo aparece diciendo cosas que nunca dijiste.',
    'Una IA te llama por teléfono haciéndose pasar por un servicio.'
  ]
};

const PRIZES = ['iPhone 17 Pro', 'PS5 Slim', 'gift card de 200€', '1000 Robux', 'Boleto premium', 'Beca de estudios'];
const TASKS = ['hacer un bizum', 'compartir tu contraseña', 'entrar a una web', 'descargar una app', 'mandar un código', 'firmar algo'];
const TIMES = ['10 minutos', 'media hora', '2 horas', '24 horas', 'esta noche'];

const BODIES: Record<string, string[]> = {
  premio: [
    '"Solo necesitamos confirmar que eres tú. ¿Nos mandas tu dirección?"',
    '"Importe ganador: {prize}. Para cobrarlo, completa el formulario."',
    '"Confirma tu email y teléfono para recibir el premio en 24h."'
  ],
  clon: [
    '"Estimado cliente, hemos detectado un acceso no autorizado. Verifica tu identidad en este portal."',
    '"Por seguridad, necesitamos confirmar tu usuario y contraseña."',
    '"Su cuenta será suspendida. Reactivar aquí: {link}"'
  ],
  ia: [
    '"Hola cariño, soy yo. Tuve un problema, ¿me puedes enviar dinero? Te llamo luego."',
    '"Soy tu primo, se me rompió el móvil. ¿Me pasas un código que te llegó?"',
    '"Esto es un mensaje de tu banco. Necesitamos verificar tu identidad con tu voz."'
  ],
  link: [
    '"Mira, no tengo tiempo de explicarlo. Solo entra aquí: {link}"',
    '"Te paso este link rápido: {link}"',
    '"Encontré esto, es increíble 👉 {link}"'
  ],
  urgencia: [
    '"Ayuda, perdí mi teléfono y no tengo acceso a nada. ¿Me puedes prestar 50€ rápido?"',
    '"Estoy sin batería y sin poder llamar. Hazme bizum porfa."',
    '"No puedo hablar ahora, ¿me pasas un código que te llegó al móvil?"'
  ]
};

const FAKE_DOMAINS = [
  'banc0-secure-verify.app',
  'g00gle-support.top',
  'app1e-id-check.shop',
  'cyberbank-segure.top',
  'faceb00k-login.buzz',
  'inst4gram-help.tk',
  'whatsapp-support-biz.com',
  'twitch-prime-gift.xyz',
  'steamcommunity-secure.app',
  'discord-nitro-claim.top'
];

const SAFE_RESPONSES = [
  'Lo verifico por mi cuenta antes de hacer nada.',
  'Te llamo al número antiguo para confirmar.',
  'Mejor entro yo a la app oficial directamente.',
  'Le pregunto a alguien de confianza antes de actuar.',
  'Cambio mi contraseña y aviso al soporte oficial.'
];

const RISKY_RESPONSES = [
  'Hago lo que me pide.',
  'Le paso los datos rápido.',
  'Mando el código al toque.',
  'Entro al link ya mismo.'
];

// ============================================================
// Constructor de decisiones
// ============================================================

interface GenContext {
  character: CharacterId;
  archetype: keyof typeof HOOKS;
  difficulty: 1 | 2 | 3;
}

function buildChoices(ctx: GenContext, label: string): Choice[] {
  const safe: Choice = {
    id: 'a',
    label: pick(SAFE_RESPONSES),
    immediate: { headline: 'Verificaste antes de actuar.', delta: pickSafeDelta(), flag: 'verified_identity' },
    delayed: randomDelayed('safe'),
    vibe: 'safe',
    flag: 'verified_identity'
  };
  const risky: Choice = {
    id: 'b',
    label: pick(RISKY_RESPONSES),
    immediate: { headline: 'Actuaste sin verificar.', delta: pickRiskyDelta(ctx.archetype), flag: 'acted_unverified' },
    delayed: randomDelayed('risky', ctx.archetype),
    vibe: 'risky',
    flag: 'acted_unverified'
  };
  const report: Choice = {
    id: 'c',
    label: 'Lo denuncio y aviso a otros.',
    immediate: { headline: 'Reportaste la situación.', delta: { reputacion: 3, seguridad: 4, conocimiento: 3 }, flag: 'reported_phish' },
    delayed: randomDelayed('report'),
    vibe: 'safe',
    flag: 'reported_phish'
  };
  const alt: Choice = {
    id: 'd',
    label: 'Le explico a la otra persona lo que está pasando.',
    immediate: { headline: 'Educaste.', delta: { conocimiento: 4, confianza: 3 }, flag: 'educated_friend' },
    delayed: randomDelayed('safe'),
    vibe: 'kind',
    flag: 'educated_friend'
  };
  // Empezamos con la "correcta" como primera.
  return [safe, risky, report, alt];
}

function pickSafeDelta(): StatDelta {
  const opts: StatDelta[] = [
    { seguridad: 5, conocimiento: 3 },
    { seguridad: 4, confianza: 2 },
    { seguridad: 6, conocimiento: 4 },
    { conocimiento: 5, confianza: 3 }
  ];
  return pick(opts);
}

function pickRiskyDelta(archetype: keyof typeof HOOKS): StatDelta {
  switch (archetype) {
    case 'premio': return { privacidad: -10, dinero: -8, seguridad: -6 };
    case 'clon':   return { seguridad: -12, privacidad: -8, dinero: -10 };
    case 'ia':     return { seguridad: -10, privacidad: -10, dinero: -12 };
    case 'link':   return { seguridad: -8, privacidad: -6 };
    case 'urgencia':return { seguridad: -8, dinero: -8, confianza: -4 };
    default:       return { seguridad: -8 };
  }
}

function randomDelayed(tone: 'safe' | 'risky' | 'report', archetype?: keyof typeof HOOKS) {
  // 50% de las decisiones seguras también tienen consecuencia retardada
  // (positiva o de confirmación). 90% de las riesgosas.
  if (tone === 'safe' && Math.random() < 0.5) return undefined;
  if (tone === 'report' && Math.random() < 0.4) return undefined;

  const d = rand(1, 3);
  if (tone === 'risky') {
    const opts = [
      { delayScenarios: d, headline: 'La cuenta de tu amigo es comprometida.', detail: 'Porque le diste datos.', delta: { confianza: -10, reputacion: -8 } },
      { delayScenarios: d, headline: 'Aparecen cargos no autorizados.', detail: 'En tu tarjeta o la de alguien cercano.', delta: { dinero: -15, seguridad: -8 } },
      { delayScenarios: d, headline: 'Tu imagen aparece asociada a una estafa.', detail: 'Porque te clonaron.', delta: { reputacion: -12, privacidad: -10 } },
      { delayScenarios: d, headline: 'Alguien cercano cae por la misma estafa.', detail: 'Tu copia se propaga.', delta: { confianza: -8, reputacion: -6 } }
    ];
    return [pick(opts)];
  }
  if (tone === 'safe') {
    const opts = [
      { delayScenarios: d, headline: 'El banco confirma el intento de fraude.', delta: { confianza: 5, seguridad: 3 } },
      { delayScenarios: d, headline: 'Un amigo te agradece la lección.', delta: { confianza: 6, reputacion: 3 } },
      { delayScenarios: d, headline: 'La plataforma retira el contenido.', delta: { reputacion: 4 } }
    ];
    return [pick(opts)];
  }
  // report (default)
  return [{ delayScenarios: d, headline: 'La comunidad te reconoce como referente.', delta: { reputacion: 5, confianza: 3 } }];
}

// ============================================================
// Generador principal
// ============================================================

export function generateScenario(seed: number = Date.now()): Scenario {
  const archetype = pick(['urgencia', 'premio', 'link', 'clon', 'ia'] as const);
  const charPool: CharacterId[] = ['amigo', 'madre', 'padre', 'abuela', 'hermano', 'novia', 'banco', 'soporte', 'influencer', 'desconocido', 'reclutador', 'marcas', 'grupo'];
  const character = pick(charPool);
  const c = CHARACTERS[character];
  const difficulty = (rand(1, 3) as 1 | 2 | 3);

  const hook = pick(HOOKS[archetype])
    .replace('{name}', c.name)
    .replace('{task}', pick(TASKS))
    .replace('{time}', pick(TIMES))
    .replace('{prize}', pick(PRIZES))
    .replace('{link}', 'http://' + pick(FAKE_DOMAINS) + '/verify');

  const body = pick(BODIES[archetype] || BODIES.urgencia)
    .replace('{prize}', pick(PRIZES))
    .replace('{link}', 'http://' + pick(FAKE_DOMAINS));

  const title = (() => {
    switch (archetype) {
      case 'urgencia': return `Urgencia sospechosa de ${c.name}`;
      case 'premio':   return `Premio “imposible” a tu nombre`;
      case 'link':     return `Un enlace sin contexto`;
      case 'clon':     return `Sitio clonado de marca conocida`;
      case 'ia':       return `IA haciéndose pasar por alguien real`;
    }
  })();

  const label = (() => {
    switch (archetype) {
      case 'urgencia': return `${c.emoji} ${c.name}: "Necesito ${pick(TASKS)} ya"`;
      case 'premio':   return `${c.emoji} ${c.name}: "¡Ganaste ${pick(PRIZES)}!"`;
      case 'link':     return `${c.emoji} ${c.name} te envía un link`;
      case 'clon':     return `Portal falso de marca conocida`;
      case 'ia':       return `${c.emoji} ${c.name} (¿o no?): comportamiento raro`;
    }
  })();

  return {
    id: 'gen-' + seed.toString(36) + '-' + Math.random().toString(36).slice(2, 6),
    title,
    setup: 'Una situación aparece en tu línea de tiempo.',
    characters: [character],
    channel: pick(['chat', 'sms', 'email', 'social', 'call', 'app', 'irl'] as const),
    sender: { name: c.name, handle: '@' + c.id },
    message: `${hook} — ${body}`,
    choices: buildChoices({ character, archetype, difficulty }, label),
    theme: (archetype === 'premio' || archetype === 'clon') ? 'finanzas' : archetype === 'ia' ? 'ia' : 'social',
    difficulty,
    tags: [archetype, character, 'generado'],
    arc: undefined
  };
}

export function generateScenarioBatch(count: number = 3): Scenario[] {
  const out: Scenario[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count * 3 && out.length < count; i++) {
    const s = generateScenario(Date.now() + i);
    if (!used.has(s.id)) {
      used.add(s.id);
      out.push(s);
    }
  }
  return out;
}
