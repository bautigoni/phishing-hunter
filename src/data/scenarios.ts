import type { Scenario } from './decisions';

// 50 escenarios curados. Cada uno tiene 2-4 decisiones, consecuencia
// inmediata y, en la mayoría, al menos una consecuencia retardada.

export const SCENARIOS: Scenario[] = [
  // ---------------- 1 ----------------
  {
    id: 'd01',
    title: 'El primo que pide tu contraseña',
    setup: 'Tu primo te escribe desde el grupo familiar. Dice que perdió acceso a su cuenta.',
    characters: ['amigo'],
    channel: 'chat',
    sender: { name: 'Mateo (primo)', handle: '+34 612 555 111' },
    message: 'Ey, se me borró la contraseña del Insta y no me deja entrar. ¿Me dejas usar la tuya un momento solo para ver un mensaje? Te la devuelvo en seguida 🙏',
    choices: [
      {
        id: 'a',
        label: 'Le paso mi usuario y contraseña.',
        immediate: { headline: 'Compartiste tus credenciales.', detail: 'Tu primo ya tiene acceso total a tu cuenta.', delta: { seguridad: -10, privacidad: -15 }, flag: 'shared_password' },
        delayed: [
          { delayScenarios: 2, headline: 'Publicación sospechosa en tu perfil.', detail: 'Alguien publicó desde tu cuenta un enlace a "regalos gratis".', delta: { reputacion: -15, privacidad: -10 } }
        ],
        vibe: 'risky',
        flag: 'shared_password'
      },
      {
        id: 'b',
        label: 'Le digo que use el "Recuperar contraseña" del propio Instagram.',
        immediate: { headline: 'Le diste el consejo correcto.', delta: { seguridad: 4, conocimiento: 3 }, flag: 'helped_friend' },
        delayed: [
          { delayScenarios: 3, headline: 'Mateo recuperó su cuenta solo.', detail: 'Y te lo agradeció.', delta: { confianza: 5 } }
        ],
        vibe: 'safe',
        flag: 'helped_friend'
      },
      {
        id: 'c',
        label: 'Le paso mi usuario, pero no la contraseña.',
        immediate: { headline: 'Le diste tu usuario, no la contraseña.', detail: 'Aún así, el usuario es la mitad del problema.', delta: { seguridad: -3, privacidad: -5 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Le llamo por teléfono para confirmar que es él.',
        immediate: { headline: 'Verificaste su identidad.', delta: { seguridad: 5, confianza: 2 }, flag: 'verified_identity' },
        vibe: 'safe',
        flag: 'verified_identity'
      }
    ],
    theme: 'social',
    difficulty: 1,
    tags: ['contraseña', 'familia', 'ingeniería-social'],
    arc: 'contraseña'
  },

  // ---------------- 2 ----------------
  {
    id: 'd02',
    title: 'Mensaje del banco con un link',
    setup: 'Recibes un SMS que parece del banco. Tiene un enlace y un tono de urgencia.',
    characters: ['banco'],
    channel: 'sms',
    sender: { name: 'CyberBank', handle: '+44 7700 900077' },
    message: 'CyberBank: detectamos acceso no autorizado a tu cuenta. Verifica identidad en 12h o será bloqueada: http://cyberbank-segure-app.top/login',
    choices: [
      {
        id: 'a',
        label: 'Hago clic en el enlace para verificar.',
        immediate: { headline: 'Entraste a un sitio falso.', detail: 'Tu usuario y contraseña ya pueden estar en manos de un estafador.', delta: { seguridad: -15, privacidad: -10, dinero: -20 }, flag: 'clicked_phish' },
        delayed: [
          { delayScenarios: 2, headline: 'Cargo no reconocido en tu tarjeta.', detail: 'Una compra sospechosa aparece.', delta: { dinero: -25 } }
        ],
        vibe: 'risky',
        flag: 'clicked_phish'
      },
      {
        id: 'b',
        label: 'Ignoro el SMS y entro a la app del banco directamente.',
        immediate: { headline: 'Verificaste por la app oficial.', delta: { seguridad: 6, conocimiento: 3 }, flag: 'verified_official' },
        vibe: 'safe',
        flag: 'verified_official'
      },
      {
        id: 'c',
        label: 'Reenvío el SMS al banco para denunciar.',
        immediate: { headline: 'Ayudaste a que otros no caigan.', delta: { seguridad: 4, reputacion: 3 }, flag: 'reported_phish' },
        delayed: [
          { delayScenarios: 3, headline: 'El banco confirma el intento de fraude.', detail: 'Y te lo agradece con un email oficial.', delta: { confianza: 5 } }
        ],
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Respondo al SMS pidiendo más datos.',
        immediate: { headline: 'Respondiste a un número falso.', detail: 'Ahora saben que tu número está activo.', delta: { seguridad: -6, privacidad: -4 } },
        vibe: 'risky'
      }
    ],
    theme: 'finanzas',
    difficulty: 1,
    tags: ['phishing', 'sms', 'banco']
  },

  // ---------------- 3 ----------------
  {
    id: 'd03',
    title: 'Gemas infinitas en Brawl Stars',
    setup: 'Ves un post en TikTok: "Generador de gemas 2026 verificado por IA 🤖"',
    characters: ['influencer'],
    channel: 'social',
    message: 'Generador OFICIAL de gemas. Ingresa tu usuario, NO pedimos contraseña. Entrega inmediata. 8000 cupos. Link: gems-pro-2026.tk',
    choices: [
      {
        id: 'a',
        label: 'Ingreso mi usuario "por si acaso".',
        immediate: { headline: 'Compartiste tu usuario.', detail: 'El siguiente paso siempre será pedirte más datos.', delta: { seguridad: -8, privacidad: -6 } },
        delayed: [
          { delayScenarios: 1, headline: 'Te contactan pidiendo tu código de verificación.', detail: 'Dicen ser "soporte del juego".', delta: { seguridad: -10 } }
        ],
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Denuncio el video como estafa.',
        immediate: { headline: 'Reportaste la estafa.', delta: { seguridad: 4, reputacion: 4, conocimiento: 3 }, flag: 'reported_phish' },
        delayed: [
          { delayScenarios: 2, headline: 'El video se elimina.', delta: { reputacion: 3 } }
        ],
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'c',
        label: 'Lo dejo en visto.',
        immediate: { headline: 'Lo ignoraste.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      },
      {
        id: 'd',
        label: 'Le escribo al creador para decirle que es falso.',
        immediate: { headline: 'Le avisaste.', detail: 'Puede que sea el propio estafador o una cuenta hackeada.', delta: { conocimiento: 3 } },
        vibe: 'safe'
      }
    ],
    theme: 'gaming',
    difficulty: 1,
    tags: ['juegos', 'phishing', 'redes']
  },

  // ---------------- 4 ----------------
  {
    id: 'd04',
    title: 'Un desconocido te sigue y te habla por DM',
    setup: 'Un perfil sin foto, 0 publicaciones y 12 seguidores te envía un mensaje directo.',
    characters: ['desconocido'],
    channel: 'social',
    sender: { name: 'aesthetic_404_', handle: '@aesthetic_404_' },
    message: 'Hola, vi tu perfil y me encantaste. ¿Puedo hacerte unas fotos artísticas? Te pagaré 200€. Soy fotógrafo 📸',
    choices: [
      {
        id: 'a',
        label: 'Le respondo y pasamos al chat privado.',
        immediate: { headline: 'Aceptaste hablar con un desconocido.', delta: { seguridad: -6, privacidad: -6 } },
        delayed: [
          { delayScenarios: 2, headline: 'Te pide fotos personales o tu dirección.', detail: 'La conversación escala.', delta: { privacidad: -12, seguridad: -8 } }
        ],
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Le pido su portfolio en una web verificable.',
        immediate: { headline: 'Pediste pruebas verificables.', delta: { seguridad: 3, conocimiento: 2 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Bloqueo y denuncio la cuenta.',
        immediate: { headline: 'Lo bloqueaste.', delta: { seguridad: 6, reputacion: 3 }, flag: 'blocked_stranger' },
        vibe: 'safe',
        flag: 'blocked_stranger'
      },
      {
        id: 'd',
        label: 'Le respondo para ver qué quiere.',
        immediate: { headline: 'Le diste conversación.', detail: 'A veces los estafadores solo necesitan que respondas.', delta: { seguridad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'social',
    difficulty: 2,
    tags: ['grooming', 'redes', 'desconocido']
  },

  // ---------------- 5 ----------------
  {
    id: 'd05',
    title: 'Tu amigo te pide un Bizum "urgente"',
    setup: 'Lucas te escribe desde un número nuevo. Dice que se le rompió el móvil.',
    characters: ['amigo'],
    channel: 'chat',
    sender: { name: 'Lucas (número nuevo)', handle: '+34 711 000 222' },
    message: 'Ey bro, se me rompió el mío. ¿Me haces un bizum de 30€? Te los devuelvo mañana. Estoy sin batería y no puedo llamar 🙏',
    choices: [
      {
        id: 'a',
        label: 'Le hago el bizum ya.',
        immediate: { headline: 'Enviaste el dinero.', detail: 'A un número que no puedes confirmar que sea Lucas.', delta: { dinero: -15, confianza: -4 }, flag: 'sent_money' },
        delayed: [
          { delayScenarios: 1, headline: 'Lucas real te escribe: "Oye, me hackearon".', delta: { dinero: -10, confianza: -8 } }
        ],
        vibe: 'risky',
        flag: 'sent_money'
      },
      {
        id: 'b',
        label: 'Le llamo al número antiguo para confirmar.',
        immediate: { headline: 'Verificaste por otra vía.', delta: { seguridad: 6, confianza: 3 }, flag: 'verified_identity' },
        vibe: 'safe',
        flag: 'verified_identity'
      },
      {
        id: 'c',
        label: 'Le pido una foto actual con un gesto que solo él sepa.',
        immediate: { headline: 'Verificación creativa.', detail: 'Aun así, las fotos pueden venir de su cuenta hackeada.', delta: { seguridad: 4 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Le digo que hasta confirmar, no envío nada.',
        immediate: { headline: 'Te protegiste.', delta: { seguridad: 5, confianza: 2 } },
        vibe: 'safe'
      }
    ],
    theme: 'finanzas',
    difficulty: 1,
    tags: ['bizum', 'amigo', 'suplantación']
  },

  // ---------------- 6 ----------------
  {
    id: 'd06',
    title: 'Te etiquetan en una foto comprometida',
    setup: 'Una foto donde sales en una situación incómoda. Te etiquetan públicamente.',
    characters: ['amigo'],
    channel: 'social',
    message: 'Tu amigo te etiquetó en una foto: "Jajaja mirad a Gonza ayer 😂😂" — la foto tiene 80 likes en 20 minutos.',
    choices: [
      {
        id: 'a',
        label: 'Le pido que la borre y, si no, denuncio.',
        immediate: { headline: 'Defendiste tu imagen.', delta: { reputacion: 3, privacidad: 5 } },
        delayed: [
          { delayScenarios: 2, headline: 'Tu amigo entiende y sube una foto divertida contigo.', detail: 'Mejora la relación.', delta: { confianza: 6, reputacion: 3 } }
        ],
        vibe: 'safe',
        flag: 'spoke_up'
      },
      {
        id: 'b',
        label: 'No hago nada, "es una broma".',
        immediate: { headline: 'Dejaste pasar.', delta: { reputacion: -8, confianza: -3 } },
        delayed: [
          { delayScenarios: 3, headline: 'La foto la comparte alguien que no conoces.', delta: { reputacion: -10, privacidad: -6 } }
        ],
        vibe: 'risky'
      },
      {
        id: 'c',
        label: 'La borro yo mismo de mi perfil.',
        immediate: { headline: 'Retiraste la etiqueta.', detail: 'Pero sigue en el perfil de tu amigo.', delta: { privacidad: 3 } },
        vibe: 'neutral'
      },
      {
        id: 'd',
        label: 'Le contesto en público con una broma.',
        immediate: { headline: 'Lo tomaste con humor.', delta: { reputacion: 2, confianza: 2 } },
        vibe: 'kind'
      }
    ],
    theme: 'identidad',
    difficulty: 2,
    tags: ['reputación', 'bullying', 'privacidad']
  },

  // ---------------- 7 ----------------
  {
    id: 'd07',
    title: 'Una app te pide todos los permisos',
    setup: 'Una app de filtros gratuita te pide acceso a contactos, cámara, micrófono y ubicación.',
    characters: ['marcas'],
    channel: 'app',
    message: '"Filtros Pro 2026" solicita: Contactos ✅ | Cámara ✅ | Micrófono ✅ | Ubicación ✅ | Almacenamiento ✅',
    choices: [
      {
        id: 'a',
        label: 'Acepto todo para usar la app ya.',
        immediate: { headline: 'Aceptaste todo.', detail: 'La app ahora puede leer tus contactos, escuchar y rastrear tu ubicación.', delta: { privacidad: -18, seguridad: -8 }, flag: 'gave_all_permissions' },
        delayed: [
          { delayScenarios: 2, headline: 'Recibes publicidad dirigida de contactos tuyos.', detail: 'Tus contactos aparecen como "¿lo conoces?" en otras apps.', delta: { privacidad: -10 } }
        ],
        vibe: 'risky',
        flag: 'gave_all_permissions'
      },
      {
        id: 'b',
        label: 'Solo acepto cámara y niego el resto.',
        immediate: { headline: 'Fuiste selectivo.', delta: { seguridad: 4, privacidad: 4 }, flag: 'selective_permissions' },
        vibe: 'safe',
        flag: 'selective_permissions'
      },
      {
        id: 'c',
        label: 'Desinstalo y busco una alternativa respetuosa.',
        immediate: { headline: 'Rechazaste la app.', delta: { seguridad: 6, privacidad: 6, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Acepto todo y luego cambio permisos en Ajustes.',
        immediate: { headline: 'Pospusiste la decisión.', detail: 'La app ya obtuvo los datos.', delta: { privacidad: -10 } },
        vibe: 'risky'
      }
    ],
    theme: 'datos',
    difficulty: 1,
    tags: ['permisos', 'privacidad', 'apps']
  },

  // ---------------- 8 ----------------
  {
    id: 'd08',
    title: 'Tu madre te pide instalar un "limpiador"',
    setup: 'Tu madre te llama: le salió un aviso de virus en el navegador.',
    characters: ['madre'],
    channel: 'irl',
    message: '"Gonza, me salió un aviso rojo enorme de que mi PC tiene 47 virus y tengo que llamar ya al 900 123 456. ¿Tú qué crees?"',
    choices: [
      {
        id: 'a',
        label: 'Le digo que llame al número.',
        immediate: { headline: 'Aceptó una estafa.', detail: 'Le cobrarán entre 50 y 300€ por "soporte".', delta: { seguridad: -10, dinero: -15, confianza: -4 }, flag: 'parent_scam' },
        delayed: [
          { delayScenarios: 2, headline: 'Te llama: "Cobran 99€ al mes por algo que no sé qué es".', delta: { dinero: -20, confianza: -8 } }
        ],
        vibe: 'risky',
        flag: 'parent_scam'
      },
      {
        id: 'b',
        label: 'Cierro el navegador y le explico que es falso.',
        immediate: { headline: 'La educaste.', delta: { seguridad: 5, conocimiento: 4, confianza: 6 }, flag: 'educated_parent' },
        delayed: [
          { delayScenarios: 2, headline: 'Tu madre te manda la siguiente captura dudosa para que la revises.', detail: 'Ahora consulta antes de actuar.', delta: { confianza: 8 } }
        ],
        vibe: 'safe',
        flag: 'educated_parent'
      },
      {
        id: 'c',
        label: 'Voy a su casa y lo soluciono en persona.',
        immediate: { headline: 'Fuiste en persona.', delta: { seguridad: 6, confianza: 8, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Le digo que sí pero sin importancia.',
        immediate: { headline: 'No la tomaste en serio.', detail: 'Tu madre sintió que no le importas.', delta: { confianza: -8 } },
        vibe: 'risky'
      }
    ],
    theme: 'familia',
    difficulty: 2,
    tags: ['estafa', 'familia', 'educación']
  },

  // ---------------- 9 ----------------
  {
    id: 'd09',
    title: 'Una cripto "garantizada"',
    setup: 'Un influencer con 800K seguidores dice que tiene el "sistema infalible".',
    characters: ['influencer'],
    channel: 'social',
    message: 'CryptoMoon AI: "Ganancias del 30% mensual GARANTIZADAS. Solo 100 plazas. Deposita 50€ y empieza HOY. Link en bio."',
    choices: [
      {
        id: 'a',
        label: 'Invierto 50€ para probar.',
        immediate: { headline: 'Invertiste 50€.', detail: 'En un esquema que promete rendimientos imposibles.', delta: { dinero: -15, conocimiento: -3 }, flag: 'crypto_scam' },
        delayed: [
          { delayScenarios: 1, headline: 'Te piden "impuestos" para sacar tu dinero.', delta: { dinero: -25 } },
          { delayScenarios: 3, headline: 'La web desaparece.', delta: { dinero: -30, reputacion: -5 } }
        ],
        vibe: 'risky',
        flag: 'crypto_scam'
      },
      {
        id: 'b',
        label: 'Denuncio y aviso a mis amigos.',
        immediate: { headline: 'Protegiste a otros.', delta: { seguridad: 4, reputacion: 3, conocimiento: 4 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'c',
        label: 'Investigo quién es y busco estafas similares.',
        immediate: { headline: 'Investigaste.', detail: 'Descubres 40 reportes de estafa con el mismo texto.', delta: { conocimiento: 6 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Le pregunto al influencer dudas técnicas.',
        immediate: { headline: 'Le hiciste pensar.', detail: 'Te responde con evasivas. La estafa se delata sola.', delta: { conocimiento: 3 } },
        vibe: 'safe'
      }
    ],
    theme: 'finanzas',
    difficulty: 1,
    tags: ['cripto', 'estafa', 'influencer']
  },

  // ---------------- 10 ----------------
  {
    id: 'd10',
    title: 'El grupo de WhatsApp añade a un extraño',
    setup: 'Alguien añadió a "SARA 💼 OFERTAS LABORALES" a tu grupo del insti.',
    characters: ['grupo', 'reclutador'],
    channel: 'chat',
    message: 'SARA: "Hola! Soy reclutadora de TechJobs. Ofrezco prácticas de 600€/mes solo 2h al día. Manda tu CV a trabajofacil@jobs-rapido.tk"',
    choices: [
      {
        id: 'a',
        label: 'Mando mi CV al correo.',
        immediate: { headline: 'Enviaste tu CV a un email falso.', detail: 'Tu nombre, dirección y datos están en manos de desconocidos.', delta: { privacidad: -12, seguridad: -6 }, flag: 'shared_cv' },
        delayed: [
          { delayScenarios: 2, headline: 'Te contactan "empresas" dudosas con tus datos.', delta: { privacidad: -10 } }
        ],
        vibe: 'risky',
        flag: 'shared_cv'
      },
      {
        id: 'b',
        label: 'Pregunto al grupo si alguien la conoce.',
        immediate: { headline: 'Verificaste.', delta: { seguridad: 4, confianza: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Le digo al admin del grupo que la saque.',
        immediate: { headline: 'Protegiste al grupo.', delta: { seguridad: 6, reputacion: 4, confianza: 3 }, flag: 'protected_group' },
        delayed: [
          { delayScenarios: 2, headline: 'El admin te lo agradece.', delta: { reputacion: 4, confianza: 4 } }
        ],
        vibe: 'safe',
        flag: 'protected_group'
      },
      {
        id: 'd',
        label: 'La ignoro.',
        immediate: { headline: 'Lo dejaste pasar.', delta: { seguridad: 1 } },
        vibe: 'neutral'
      }
    ],
    theme: 'trabajo',
    difficulty: 2,
    tags: ['grupo', 'phishing', 'datos']
  },

  // ---------------- 11 ----------------
  {
    id: 'd11',
    title: 'Una videollamada del "soporte de Microsoft"',
    setup: 'Te llega un correo y luego una videollamada de un número internacional. Dicen ser soporte.',
    characters: ['soporte'],
    channel: 'call',
    message: '"Hola, soy técnico certificado de Microsoft. Tu PC está infectada y emite datos ahora mismo. Necesito que instales AnyDesk para repararlo de forma remota."',
    choices: [
      {
        id: 'a',
        label: 'Instalo AnyDesk y les doy el código.',
        immediate: { headline: 'Diste control remoto.', detail: 'Ya pueden ver todo lo que haces y robarte.', delta: { seguridad: -18, privacidad: -15, dinero: -20 }, flag: 'gave_remote' },
        delayed: [
          { delayScenarios: 2, headline: 'Detectan cargos en tu tarjeta y robo de cripto si tienes.', delta: { dinero: -25, privacidad: -10 } }
        ],
        vibe: 'risky',
        flag: 'gave_remote'
      },
      {
        id: 'b',
        label: 'Cuelgo y llamo yo al soporte oficial de Microsoft.',
        immediate: { headline: 'Verificaste por tu cuenta.', delta: { seguridad: 6, conocimiento: 4 }, flag: 'verified_official' },
        vibe: 'safe',
        flag: 'verified_official'
      },
      {
        id: 'c',
        label: 'Cuelgo y bloqueo el número.',
        immediate: { headline: 'Lo bloqueaste.', delta: { seguridad: 5, reputacion: 2 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Sigo la llamada por curiosidad.',
        immediate: { headline: 'Les diste tiempo.', detail: 'Te seguirán insistiendo.', delta: { seguridad: -5, privacidad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'ia',
    difficulty: 2,
    tags: ['soporte-falso', 'AnyDesk', 'vishing']
  },

  // ---------------- 12 ----------------
  {
    id: 'd12',
    title: 'Tu hermano menor quiere una skin "gratis"',
    setup: 'Dani, tu hermano de 12 años, te enseña una web con un generador de skins.',
    characters: ['hermano'],
    channel: 'irl',
    message: '"Gonza, mira, aquí me dan 5000 Robux gratis. Solo tengo que meter la contraseña de mi Roblox. ¿Tú lo harías?"',
    choices: [
      {
        id: 'a',
        label: 'Sí, le pongo yo la contraseña.',
        immediate: { headline: 'Compartiste la cuenta de tu hermano.', delta: { seguridad: -10, confianza: -6 }, flag: 'helped_minor_unsafe' },
        delayed: [
          { delayScenarios: 2, headline: 'Pierden la cuenta y los items comprados.', delta: { dinero: -15, confianza: -8 } }
        ],
        vibe: 'risky',
        flag: 'helped_minor_unsafe'
      },
      {
        id: 'b',
        label: 'Le explicas que no existe y lo acompañas a denunciar la web.',
        immediate: { headline: 'Lo educaste.', delta: { conocimiento: 6, confianza: 8, seguridad: 4 }, flag: 'educated_minor' },
        delayed: [
          { delayScenarios: 3, headline: 'Dani te cuenta la siguiente web rara que vio.', delta: { confianza: 5 } }
        ],
        vibe: 'safe',
        flag: 'educated_minor'
      },
      {
        id: 'c',
        label: 'Le dices que no y ya.',
        immediate: { headline: 'Lo rechazaste sin explicar.', delta: { confianza: -3, conocimiento: -2 } },
        vibe: 'neutral'
      },
      {
        id: 'd',
        label: 'Le compras Robux legítimos.',
        immediate: { headline: 'Le regalaste Robux oficiales.', delta: { dinero: -10, confianza: 10 }, flag: 'kind_gesture' },
        vibe: 'kind',
        flag: 'kind_gesture'
      }
    ],
    theme: 'familia',
    difficulty: 1,
    tags: ['gaming', 'menores', 'educación']
  },

  // ---------------- 13 ----------------
  {
    id: 'd13',
    title: 'Te ofrecen ser "probador" de productos',
    setup: 'Una empresa te escribe para "evaluar" productos y pagarte 200€ por reseña.',
    characters: ['reclutador'],
    channel: 'email',
    sender: { name: 'ReviewPro', handle: 'jobs@reviewpro-eu.com' },
    message: '"¡Felicidades! Ha sido seleccionado como tester premium. Para empezar, envíenos sus datos bancarios para recibir el pago."',
    choices: [
      {
        id: 'a',
        label: 'Envío mis datos bancarios.',
        immediate: { headline: 'Compartiste datos bancarios.', detail: 'Clásico paso previo al robo.', delta: { seguridad: -15, dinero: -15, privacidad: -10 }, flag: 'sent_bank' },
        delayed: [
          { delayScenarios: 1, headline: 'Intentan cargos pequeños para verificar la tarjeta.', delta: { dinero: -10 } }
        ],
        vibe: 'risky',
        flag: 'sent_bank'
      },
      {
        id: 'b',
        label: 'Denuncio el email y bloque al remitente.',
        immediate: { headline: 'Lo bloqueaste.', delta: { seguridad: 5, reputacion: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'c',
        label: 'Busco la empresa en internet y leo reseñas.',
        immediate: { headline: 'Investigaste.', detail: 'No existe. Era un cebo.', delta: { conocimiento: 5 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Respondo pidiendo más info.',
        immediate: { headline: 'Mostraste interés.', detail: 'Ahora saben que tu email es válido.', delta: { seguridad: -4, privacidad: -4 } },
        vibe: 'risky'
      }
    ],
    theme: 'trabajo',
    difficulty: 2,
    tags: ['estafa', 'banco', 'email']
  },

  // ---------------- 14 ----------------
  {
    id: 'd14',
    title: 'Tu pareja te pide compartir contraseñas "por confianza"',
    setup: 'Lleváis 6 meses. Te dice que compartir contraseñas es "señal de confianza".',
    characters: ['novia'],
    channel: 'chat',
    message: '"Si de verdad confías en mí, pásame tu Instagram. No tengo nada que esconder, ¿verdad?"',
    choices: [
      {
        id: 'a',
        label: 'Le paso la contraseña "porque la quiero".',
        immediate: { headline: 'Compartiste tu contraseña por amor.', delta: { privacidad: -10, confianza: 3 }, flag: 'shared_password' },
        delayed: [
          { delayScenarios: 3, headline: 'Rompéis. Ella tiene acceso a todo y mensajes privados.', delta: { privacidad: -15, reputacion: -10, confianza: -12 } }
        ],
        vibe: 'risky',
        flag: 'shared_password'
      },
      {
        id: 'b',
        label: 'Le explico que la confianza no se demuestra así.',
        immediate: { headline: 'Le diste una lección de privacidad.', delta: { conocimiento: 5, confianza: 4 }, flag: 'set_boundary' },
        vibe: 'safe',
        flag: 'set_boundary'
      },
      {
        id: 'c',
        label: 'Le digo que sí pero le doy una contraseña vieja.',
        immediate: { headline: 'Truco.', detail: 'No es solución a largo plazo.', delta: { privacidad: -3, confianza: 2 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Cambio el tema.',
        immediate: { headline: 'Lo evitaste.', detail: 'El tema seguirá ahí.', delta: { confianza: -2 } },
        vibe: 'neutral'
      }
    ],
    theme: 'identidad',
    difficulty: 2,
    tags: ['contraseña', 'pareja', 'límites']
  },

  // ---------------- 15 ----------------
  {
    id: 'd15',
    title: 'Un QR sospechoso en la calle',
    setup: 'Encuentras un adhesivo sobre el código de un parquímetro: "Escanea para 1h gratis".',
    characters: ['desconocido'],
    channel: 'irl',
    message: 'El QR dice "Paga aquí tu estacionamiento" pero tiene pegatina encima de otro QR original.',
    choices: [
      {
        id: 'a',
        label: 'Lo escaneo, total es solo un QR.',
        immediate: { headline: 'Escaneaste un QR falso.', detail: 'Puede llevar a una web de phishing o a instalar una app dañina.', delta: { seguridad: -10, privacidad: -8 }, flag: 'scanned_qr' },
        delayed: [
          { delayScenarios: 1, headline: 'Tu móvil abre una web que pide datos de tarjeta.', detail: 'Suerte si no los pusiste.', delta: { dinero: -10 } }
        ],
        vibe: 'risky',
        flag: 'scanned_qr'
      },
      {
        id: 'b',
        label: 'Quito la pegatina y aviso al ayuntamiento.',
        immediate: { headline: 'Civic hacking.', delta: { reputacion: 8, seguridad: 4, confianza: 3 }, flag: 'civic_action' },
        delayed: [
          { delayScenarios: 2, headline: 'El consistorio lo agradece en redes.', delta: { reputacion: 6 } }
        ],
        vibe: 'safe',
        flag: 'civic_action'
      },
      {
        id: 'c',
        label: 'Saco foto y la reviso con un antivirus de URLs.',
        immediate: { headline: 'Lo analizaste.', detail: 'Resultado: 8 motores lo marcan como phishing.', delta: { seguridad: 5, conocimiento: 4 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'No escaneo pero tampoco aviso.',
        immediate: { headline: 'No actuaste.', detail: 'Otra persona puede caer.', delta: { seguridad: 1 } },
        vibe: 'neutral'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['qrishing', 'qr', 'estafa']
  },

  // ---------------- 16 ----------------
  {
    id: 'd16',
    title: 'Tu profesor te pide datos por WhatsApp',
    setup: 'Un profesor nuevo del insti te pide tu número "para temas académicos".',
    characters: ['profesor'],
    channel: 'chat',
    message: '"Hola, soy el profe nuevo. Pásame tu número y el de tus padres para crear un grupo de clase. Es obligatorio para la asignatura."',
    choices: [
      {
        id: 'a',
        label: 'Le paso mi número y el de mis padres.',
        immediate: { headline: 'Compartiste datos familiares.', detail: 'Por un canal no oficial.', delta: { privacidad: -10 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Le sugiero usar el canal oficial del colegio.',
        immediate: { headline: 'Propusiste el canal oficial.', delta: { seguridad: 4, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Verifico que sea profesor (foto, lista del cole).',
        immediate: { headline: 'Verificaste.', delta: { seguridad: 5, confianza: 3 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Le doy solo mi número, el de mis padres no.',
        immediate: { headline: 'Compartiste a medias.', detail: 'Aún así, lo diste por canal informal.', delta: { privacidad: -5 } },
        vibe: 'risky'
      }
    ],
    theme: 'trabajo',
    difficulty: 3,
    tags: ['educación', 'datos', 'whatsapp']
  },

  // ---------------- 17 ----------------
  {
    id: 'd17',
    title: 'Una IA te llama con la voz de tu madre',
    setup: 'Recibes una llamada. La voz es idéntica a la de tu madre. Te dice que tuvo un accidente.',
    characters: ['madre'],
    channel: 'call',
    message: '"Gonza, soy mamá. Tuve un accidente. Necesito que me transfieras 1.500€ a este número. No llames a papá, no quiero preocuparlo."',
    choices: [
      {
        id: 'a',
        label: 'Hago la transferencia inmediatamente.',
        immediate: { headline: 'Enviaste 1.500€ a un estafador.', delta: { dinero: -30, confianza: -10, seguridad: -10 }, flag: 'deepfake_voice' },
        delayed: [
          { delayScenarios: 1, headline: 'Llamas a tu madre: está perfecta, no sabía nada.', delta: { confianza: -15, dinero: -10 } }
        ],
        vibe: 'risky',
        flag: 'deepfake_voice'
      },
      {
        id: 'b',
        label: 'Cuelgo y llamo a mi madre a su número real.',
        immediate: { headline: 'Verificaste por canal seguro.', delta: { seguridad: 8, conocimiento: 6, confianza: 3 }, flag: 'verified_identity' },
        vibe: 'safe',
        flag: 'verified_identity'
      },
      {
        id: 'c',
        label: 'Le hago una pregunta que solo mi madre sabría.',
        immediate: { headline: 'Prueba personal.', detail: 'La IA se queda en silencio o cambia de tema.', delta: { seguridad: 6, conocimiento: 5 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Dudo y le digo que necesito 10 minutos.',
        immediate: { headline: 'Te tomaste un tiempo.', delta: { seguridad: 3 } },
        vibe: 'neutral'
      }
    ],
    theme: 'ia',
    difficulty: 3,
    tags: ['deepfake', 'voz', 'ia']
  },

  // ---------------- 18 ----------------
  {
    id: 'd18',
    title: 'Una videollamada de un "amigo" se ve rara',
    setup: 'Lucas te llama por videollamada. Pero tiene la cara un poco rara, los gestos van con delay.',
    characters: ['amigo'],
    channel: 'call',
    message: '"Ey bro, prestame 200€ urgentemente, te los devuelvo mañana. Es porfa, no me preguntes. Manda bizum ya."',
    choices: [
      {
        id: 'a',
        label: 'Hago el bizum porque "lo veo".',
        immediate: { headline: 'Cayó un deepfake en tiempo real.', delta: { dinero: -25, seguridad: -8, confianza: -8 }, flag: 'deepfake_video' },
        delayed: [
          { delayScenarios: 1, headline: 'Lucas real te escribe: "no te pidió nada mi familia, ¿verdad?"', delta: { dinero: -10, confianza: -10 } }
        ],
        vibe: 'risky',
        flag: 'deepfake_video'
      },
      {
        id: 'b',
        label: 'Cuelgo y le escribo a Lucas a su número real.',
        immediate: { headline: 'Verificaste por canal alterno.', delta: { seguridad: 7, conocimiento: 5 }, flag: 'verified_identity' },
        vibe: 'safe',
        flag: 'verified_identity'
      },
      {
        id: 'c',
        label: 'Le digo que confirme algo solo él sepa.',
        immediate: { headline: 'Prueba de identidad.', detail: 'La IA no puede improvisar.', delta: { seguridad: 6 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Cuelgo sin más.',
        immediate: { headline: 'Reaccionaste con cautela.', delta: { seguridad: 3 } },
        vibe: 'neutral'
      }
    ],
    theme: 'ia',
    difficulty: 3,
    tags: ['deepfake', 'video', 'amigo']
  },

  // ---------------- 19 ----------------
  {
    id: 'd19',
    title: 'Una "gift card" del Apple Store',
    setup: 'Tu "soporte técnico" dice que para devolverte 89€ de un cobro, necesitas comprar una gift card.',
    characters: ['soporte'],
    channel: 'call',
    message: '"Estimado cliente, le devolveremos 89€ si compra una gift card de Apple de 50€ y nos da el código. Es el nuevo protocolo."',
    choices: [
      {
        id: 'a',
        label: 'Compro la gift card y doy el código.',
        immediate: { headline: 'Compraste y diste una gift card.', delta: { dinero: -20, seguridad: -8, privacidad: -6 }, flag: 'gift_card' },
        delayed: [
          { delayScenarios: 1, headline: 'Te piden otra gift card porque "la primera no se procesó".', delta: { dinero: -15 } }
        ],
        vibe: 'risky',
        flag: 'gift_card'
      },
      {
        id: 'b',
        label: 'Cuelgo. Ningún servicio legítimo pide gift cards.',
        immediate: { headline: 'Detectaste el patrón.', delta: { seguridad: 8, conocimiento: 6 }, flag: 'spotted_scam' },
        vibe: 'safe',
        flag: 'spotted_scam'
      },
      {
        id: 'c',
        label: 'Sigo la llamada para grabarles.',
        immediate: { headline: 'Investigación.', detail: 'Cuidado: te pueden pedir datos sin querer.', delta: { conocimiento: 5 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Le paso el número a la policía.',
        immediate: { headline: 'Lo reportaste.', delta: { reputacion: 6, seguridad: 4 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      }
    ],
    theme: 'finanzas',
    difficulty: 1,
    tags: ['gift-card', 'estafa', 'soporte']
  },

  // ---------------- 20 ----------------
  {
    id: 'd20',
    title: 'Una cuenta falsa clona tu perfil',
    setup: 'Tu amiga Sofía te avisa: "Vi un perfil idéntico al tuyo pidiendo dinero a mis contactos".',
    characters: ['amigo'],
    channel: 'social',
    message: '"Alguien te está suplantando. Están pidiendo Bizum a tu lista de contactos."',
    choices: [
      {
        id: 'a',
        label: 'Reporto el perfil falso y aviso a todos mis contactos.',
        immediate: { headline: 'Movilizaste a tu red.', delta: { reputacion: 5, seguridad: 5, confianza: 4 }, flag: 'network_response' },
        delayed: [
          { delayScenarios: 2, headline: 'La cuenta se elimina. Tres contactos evitan caer.', delta: { reputacion: 6, confianza: 5 } }
        ],
        vibe: 'safe',
        flag: 'network_response'
      },
      {
        id: 'b',
        label: 'Hago mi cuenta privada temporalmente.',
        immediate: { headline: 'Limitaste el daño.', delta: { privacidad: 4, seguridad: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Denuncio y ya.',
        immediate: { headline: 'Lo reportaste solo.', delta: { seguridad: 3 } },
        vibe: 'neutral'
      },
      {
        id: 'd',
        label: 'Le contesto al perfil falso.',
        immediate: { headline: 'Te expusiste al estafador.', delta: { seguridad: -4, privacidad: -4 } },
        vibe: 'risky'
      }
    ],
    theme: 'identidad',
    difficulty: 2,
    tags: ['suplantación', 'clon', 'redes']
  },

  // ---------------- 21 ----------------
  {
    id: 'd21',
    title: 'Un grupo de Telegram te "regala" un NFT',
    setup: 'Te invitan a un grupo con 2.000 miembros. Dicen que regalan NFTs de Bored Apes.',
    characters: ['grupo', 'desconocido'],
    channel: 'chat',
    message: '"Conecta tu wallet de MetaMask para reclamar tu NFT gratis. Solo firma la transacción, no tiene coste."',
    choices: [
      {
        id: 'a',
        label: 'Conecto MetaMask y firmo la transacción.',
        immediate: { headline: 'Firmaste un contrato malicioso.', detail: 'Vaciarán tu wallet en segundos.', delta: { dinero: -30, seguridad: -15, privacidad: -8 }, flag: 'wallet_drained' },
        delayed: [
          { delayScenarios: 1, headline: 'Todos tus fondos desaparecen.', delta: { dinero: -30 } }
        ],
        vibe: 'risky',
        flag: 'wallet_drained'
      },
      {
        id: 'b',
        label: 'Salgo del grupo y denuncio.',
        immediate: { headline: 'Te protegiste.', delta: { seguridad: 6, conocimiento: 4 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'c',
        label: 'Investigo el contrato en la web antes de firmar.',
        immediate: { headline: 'Auditoría rápida.', detail: 'Descubres que da permisos totales a una dirección desconocida.', delta: { conocimiento: 8 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Pregunto en el grupo si es legítimo.',
        immediate: { headline: 'Te expusiste.', detail: 'Te contestan bots.', delta: { seguridad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'finanzas',
    difficulty: 3,
    tags: ['crypto', 'wallet', 'nft']
  },

  // ---------------- 22 ----------------
  {
    id: 'd22',
    title: 'Te etiquetan en "saliste en este video"',
    setup: 'Un contacto te etiqueta en un video de YouTube con tu foto y un titular escandaloso.',
    characters: ['amigo'],
    channel: 'social',
    message: 'Video: "ESTUDIANTE GANAZA MILLONES - MIRALO" con tu foto de perfil y un clickbait brutal.',
    choices: [
      {
        id: 'a',
        label: 'Hago clic para ver.',
        immediate: { headline: 'Entraste a un sitio sospechoso.', detail: 'Posible phishing o malware.', delta: { seguridad: -8, privacidad: -5 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Denuncio el video y aviso a mi contacto.',
        immediate: { headline: 'Cerraste el problema.', delta: { seguridad: 5, reputacion: 3, confianza: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Pido a la plataforma que retire mi foto.',
        immediate: { headline: 'Defendiste tu imagen.', delta: { privacidad: 5, reputacion: 3 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Lo dejo en visto.',
        immediate: { headline: 'No actuaste.', detail: 'El video sigue circulando.', delta: { reputacion: -3 } },
        vibe: 'neutral'
      }
    ],
    theme: 'identidad',
    difficulty: 2,
    tags: ['clickbait', 'phishing', 'imagen']
  },

  // ---------------- 23 ----------------
  {
    id: 'd23',
    title: 'Una encuesta "para ganar un iPhone"',
    setup: 'Una web te pide contestar 4 preguntas y luego tus datos personales.',
    characters: ['marcas'],
    channel: 'web',
    message: '"¡Felicidades! Eres el visitante 1.000.000. Responde 4 preguntas y te llevas un iPhone 17 Pro."',
    choices: [
      {
        id: 'a',
        label: 'Respondo y dejo mis datos.',
        immediate: { headline: 'Compartiste datos personales por una promesa falsa.', delta: { privacidad: -12, seguridad: -4 }, flag: 'shared_data' },
        delayed: [
          { delayScenarios: 2, headline: 'Tu correo entra en 5 listas de spam.', delta: { privacidad: -6 } }
        ],
        vibe: 'risky',
        flag: 'shared_data'
      },
      {
        id: 'b',
        label: 'Cierro la pestaña.',
        immediate: { headline: 'Detectaste la trampa.', delta: { seguridad: 4, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Denuncio el sitio.',
        immediate: { headline: 'Lo reportaste.', delta: { reputacion: 3, seguridad: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Respondo con datos falsos.',
        immediate: { headline: 'Truco.', detail: 'No soluciona el problema de raíz.', delta: { privacidad: -2 } },
        vibe: 'risky'
      }
    ],
    theme: 'datos',
    difficulty: 1,
    tags: ['encuesta', 'datos', 'premio-falso']
  },

  // ---------------- 24 ----------------
  {
    id: 'd24',
    title: 'Un "amigo" publica que se fue de viaje',
    setup: 'Ves una historia de tu amigo con foto en el aeropuerto. Te pide ayuda en un comentario.',
    characters: ['amigo'],
    channel: 'social',
    message: 'Historia: "Me robaron la maleta, sin pasaporte ni dinero. ¿Me puedes hacer bizum de 100€? Te devuelvo en cuanto llegue."',
    choices: [
      {
        id: 'a',
        label: 'Hago el bizum ya.',
        immediate: { headline: 'Enviaste dinero.', detail: 'A un perfil posiblemente hackeado.', delta: { dinero: -20, seguridad: -6 }, flag: 'sent_money' },
        vibe: 'risky',
        flag: 'sent_money'
      },
      {
        id: 'b',
        label: 'Le escribo en privado para verificar.',
        immediate: { headline: 'Verificaste.', delta: { seguridad: 5, confianza: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Le llamo por teléfono.',
        immediate: { headline: 'Llamada directa.', delta: { seguridad: 6, confianza: 3 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Lo comento en la historia para que otros vean.',
        immediate: { headline: 'Movida.', detail: 'Tu comentario también lo ven los hackers.', delta: { seguridad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'social',
    difficulty: 2,
    tags: ['amigo', 'suplantación', 'dinero']
  },

  // ---------------- 25 ----------------
  {
    id: 'd25',
    title: 'Una actualización del sistema es urgente',
    setup: 'Tu móvil muestra un mensaje: "Actualiza Android AHORA o se borrarán tus datos".',
    characters: ['marcas'],
    channel: 'app',
    message: '"¡Aviso crítico! 47 virus detectados. Pulsa aquí para eliminar."',
    choices: [
      {
        id: 'a',
        label: 'Pulso y descargo "Mobile Security PRO".',
        immediate: { headline: 'Instalaste un malware.', delta: { seguridad: -15, privacidad: -10 }, flag: 'installed_malware' },
        delayed: [
          { delayScenarios: 1, headline: 'Tu móvil muestra publicidad invasiva.', delta: { privacidad: -8 } }
        ],
        vibe: 'risky',
        flag: 'installed_malware'
      },
      {
        id: 'b',
        label: 'Cierro y voy a Ajustes > Actualizaciones oficiales.',
        immediate: { headline: 'Usaste el canal oficial.', delta: { seguridad: 6, conocimiento: 4 }, flag: 'verified_official' },
        vibe: 'safe',
        flag: 'verified_official'
      },
      {
        id: 'c',
        label: 'Reinicio el móvil por si acaso.',
        immediate: { headline: 'Reset suave.', detail: 'A veces funciona, pero mejor verificar el origen.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      },
      {
        id: 'd',
        label: 'Lo dejo, total solo es un aviso.',
        immediate: { headline: 'No actuaste.', detail: 'El aviso seguirá.', delta: { seguridad: -2 } },
        vibe: 'risky'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['malware', 'apps', 'móvil']
  },

  // ---------------- 26 ----------------
  {
    id: 'd26',
    title: 'Una marca te etiqueta en una promo que no pediste',
    setup: 'Te llega un mensaje: "Has sido seleccionado como embajador de nuestra marca".',
    characters: ['marcas'],
    channel: 'email',
    sender: { name: 'BrandGlobal', handle: 'marketing@brandglobal.shop' },
    message: '"Felicidades, embajador! Te enviaremos un pack gratis. Solo danos tu dirección y un pequeño pago de envío de 1.99€."',
    choices: [
      {
        id: 'a',
        label: 'Pago 1.99€ y dejo mi dirección.',
        immediate: { headline: 'Compartiste dirección y tarjeta.', detail: 'Los 1.99€ son el cebo para verificar la tarjeta.', delta: { privacidad: -10, dinero: -10, seguridad: -6 }, flag: 'card_verification' },
        delayed: [
          { delayScenarios: 2, headline: 'Te llegan cargos pequeños no autorizados.', delta: { dinero: -10 } }
        ],
        vibe: 'risky',
        flag: 'card_verification'
      },
      {
        id: 'b',
        label: 'Lo ignoro.',
        immediate: { headline: 'Lo ignoraste.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      },
      {
        id: 'c',
        label: 'Denuncio el email.',
        immediate: { headline: 'Lo reportaste.', delta: { seguridad: 4, reputacion: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Respondo para preguntar.',
        immediate: { headline: 'Respondiste.', detail: 'Tu email es válido.', delta: { privacidad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'finanzas',
    difficulty: 1,
    tags: ['embajador', 'phishing', 'email']
  },

  // ---------------- 27 ----------------
  {
    id: 'd27',
    title: 'Un amigo de la infancia te busca "solo para saludar"',
    setup: 'Alguien que no ves hace 5 años te escribe de repente. Te cuenta una historia triste.',
    characters: ['amigo'],
    channel: 'chat',
    sender: { name: 'Marcos (de la infancia)', handle: '+34 666 000 333' },
    message: '"Hola Gonza, cuánto tiempo. Estoy en un momento difícil. ¿Me puedes prestar 50€ por bizum? Te los devuelvo en una semana, palabra."',
    choices: [
      {
        id: 'a',
        label: 'Le envío el dinero por la confianza vieja.',
        immediate: { headline: 'Enviaste dinero.', delta: { dinero: -10, confianza: -2 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Le sugiero vernos en persona y ahí decidimos.',
        immediate: { headline: 'Propusiste un encuentro.', detail: 'Si acepta, señal positiva.', delta: { seguridad: 4, confianza: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Le pregunto datos concretos de su vida para verificar.',
        immediate: { headline: 'Lo testeaste.', detail: 'Si es Marcos, no le importa responder.', delta: { seguridad: 4 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Le digo que no tengo ahora mismo.',
        immediate: { headline: 'Te excusaste.', detail: 'Honesto y seguro.', delta: { seguridad: 3 } },
        vibe: 'neutral'
      }
    ],
    theme: 'social',
    difficulty: 2,
    tags: ['amigo', 'dinero', 'estafa']
  },

  // ---------------- 28 ----------------
  {
    id: 'd28',
    title: 'Un chat "secreto" del insti se filtra',
    setup: 'Aparecen capturas de un chat privado donde se habla de varios alumnos.',
    characters: ['amigo', 'grupo'],
    channel: 'social',
    message: 'Captura: aparecen mensajes privados tuyos reenviados por un tercero.',
    choices: [
      {
        id: 'a',
        label: 'Hago capturas y denuncio al que las filtró.',
        immediate: { headline: 'Defendiste tu privacidad.', delta: { privacidad: 5, reputacion: 3 }, flag: 'spoke_up' },
        vibe: 'safe',
        flag: 'spoke_up'
      },
      {
        id: 'b',
        label: 'Hago mi cuenta privada y no comento nada.',
        immediate: { headline: 'Te protegiste.', delta: { privacidad: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Respondo con capturas mías.',
        immediate: { headline: 'Escalaste el conflicto.', delta: { reputacion: -3, confianza: -4 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Hago como si no hubiera pasado.',
        immediate: { headline: 'No actuaste.', detail: 'El daño sigue.', delta: { reputacion: -5 } },
        vibe: 'risky'
      }
    ],
    theme: 'identidad',
    difficulty: 2,
    tags: ['filtración', 'privacidad', 'bullying']
  },

  // ---------------- 29 ----------------
  {
    id: 'd29',
    title: 'Te piden guardar el código de verificación de otro',
    setup: 'Un amigo te pasa un SMS con un código de 6 dígitos y te pide que se lo digas.',
    characters: ['amigo'],
    channel: 'chat',
    message: '"Oye, ¿te llegó un código? Es que estoy creando una cuenta con tu número de referencia. Pásamelo, porfa."',
    choices: [
      {
        id: 'a',
        label: 'Le paso el código.',
        immediate: { headline: 'Compartiste tu código 2FA.', detail: 'Es la llave de acceso a tu cuenta.', delta: { seguridad: -18, privacidad: -10 }, flag: 'shared_2fa' },
        delayed: [
          { delayScenarios: 1, headline: 'Pierdes acceso a tu cuenta principal.', delta: { privacidad: -10, seguridad: -10 } }
        ],
        vibe: 'risky',
        flag: 'shared_2fa'
      },
      {
        id: 'b',
        label: 'Le digo que NUNCA se comparten códigos.',
        immediate: { headline: 'Lo educaste.', delta: { seguridad: 6, conocimiento: 5, confianza: 2 }, flag: 'educated_friend' },
        vibe: 'safe',
        flag: 'educated_friend'
      },
      {
        id: 'c',
        label: 'Le llamo por teléfono para verificar.',
        immediate: { headline: 'Verificación por llamada.', delta: { seguridad: 6 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Le digo que me lo pida por otro canal mañana.',
        immediate: { headline: 'Te tomaste un tiempo.', detail: 'Si insiste, es mala señal.', delta: { seguridad: 3 } },
        vibe: 'neutral'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['2fa', 'código', 'amigo']
  },

  // ---------------- 30 ----------------
  {
    id: 'd30',
    title: 'Un "amigo" en común te pide tu clave del WiFi',
    setup: 'Estás en casa de un amigo. Te pide la clave del WiFi "para no gastar datos".',
    characters: ['amigo'],
    channel: 'inperson',
    message: '"Ey, pásame la clave de tu WiFi, que me estoy quedando sin datos."',
    choices: [
      {
        id: 'a',
        label: 'Le paso la clave.',
        immediate: { headline: 'Compartiste tu WiFi.', detail: 'Puede acceder a tu red y dispositivos.', delta: { seguridad: -8, privacidad: -5 }, flag: 'shared_wifi' },
        delayed: [
          { delayScenarios: 2, headline: 'Detectas un dispositivo extraño en tu red.', delta: { seguridad: -8 } }
        ],
        vibe: 'risky',
        flag: 'shared_wifi'
      },
      {
        id: 'b',
        label: 'Le digo que use sus datos.',
        immediate: { headline: 'Te negaste.', detail: 'Límite sano.', delta: { seguridad: 4, confianza: -1 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Le creo una red de invitados con límite de tiempo.',
        immediate: { headline: 'Red de invitados.', detail: 'Buena práctica avanzada.', delta: { seguridad: 6, conocimiento: 4 }, flag: 'guest_network' },
        vibe: 'safe',
        flag: 'guest_network'
      },
      {
        id: 'd',
        label: 'Le doy la clave solo si me la devuelve.',
        immediate: { headline: 'Trato.', detail: 'No cambia el riesgo.', delta: { seguridad: -5 } },
        vibe: 'risky'
      }
    ],
    theme: 'familia',
    difficulty: 1,
    tags: ['wifi', 'red', 'amigo']
  },

  // ---------------- 31 ----------------
  {
    id: 'd31',
    title: 'Recibes un código de verificación que NO pediste',
    setup: 'Te llega un SMS de tu banco con un código 2FA que tú no has solicitado.',
    characters: ['banco'],
    channel: 'sms',
    sender: { name: 'CyberBank', handle: 'CyberBank' },
    message: '"Tu código de verificación es 483920. No lo compartas con nadie."',
    choices: [
      {
        id: 'a',
        label: 'No hago nada.',
        immediate: { headline: 'Inacción.', detail: 'Alguien está intentando entrar a tu cuenta.', delta: { seguridad: -5 } },
        delayed: [
          { delayScenarios: 1, headline: 'Te llaman haciéndose pasar por el banco.', delta: { seguridad: -8 } }
        ],
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Cambio la contraseña de mi banco ahora.',
        immediate: { headline: 'Acción preventiva.', delta: { seguridad: 8, conocimiento: 4 }, flag: 'preventive_action' },
        vibe: 'safe',
        flag: 'preventive_action'
      },
      {
        id: 'c',
        label: 'Llamo al banco para reportar.',
        immediate: { headline: 'Lo reportaste.', delta: { seguridad: 6, reputacion: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Borro el SMS y ya.',
        immediate: { headline: 'Lo borraste.', detail: 'Pero la contraseña sigue siendo vulnerable.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      }
    ],
    theme: 'finanzas',
    difficulty: 2,
    tags: ['2fa', 'banco', 'phishing']
  },

  // ---------------- 32 ----------------
  {
    id: 'd32',
    title: 'Una web te pide el DNI para "verificar edad"',
    setup: 'Una web de un juego online te pide foto del DNI para verificar que eres mayor de edad.',
    characters: ['marcas'],
    channel: 'web',
    message: '"Sube una foto de tu DNI por delante y por detrás. Es obligatorio para jugar."',
    choices: [
      {
        id: 'a',
        label: 'Subo las dos fotos.',
        immediate: { headline: 'Compartiste tu DNI completo.', detail: 'Uno de los datos más sensibles.', delta: { privacidad: -18, seguridad: -8 }, flag: 'shared_dni' },
        delayed: [
          { delayScenarios: 2, headline: 'Suplantan tu identidad para abrir cuentas.', delta: { dinero: -20, privacidad: -12 } }
        ],
        vibe: 'risky',
        flag: 'shared_dni'
      },
      {
        id: 'b',
        label: 'Verifico que la web sea oficial.',
        immediate: { headline: 'Lo verificaste.', detail: 'Si no, mejor no jugar ahí.', delta: { seguridad: 4 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Busco una alternativa que no pida DNI.',
        immediate: { headline: 'Rechazo razonable.', delta: { seguridad: 5, privacidad: 5 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Subo una foto borrosa.',
        immediate: { headline: 'Truco parcial.', detail: 'A veces funciona, otras no.', delta: { privacidad: -4 } },
        vibe: 'risky'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['dni', 'identidad', 'verificación']
  },

  // ---------------- 33 ----------------
  {
    id: 'd33',
    title: 'Un amigo te reta a una "app reto"',
    setup: 'Tu amigo te pasa un link a una app que "predice tu futuro según tu nombre".',
    characters: ['amigo'],
    channel: 'chat',
    message: '"Jajaja míralo. Te pide nombre completo, fecha de nacimiento y foto. A ver qué te sale."',
    choices: [
      {
        id: 'a',
        label: 'Meto mis datos para ver qué dice.',
        immediate: { headline: 'Compartiste datos personales por diversión.', delta: { privacidad: -10, conocimiento: -2 }, flag: 'shared_data' },
        delayed: [
          { delayScenarios: 2, headline: 'Recibes spam de tarot y videncia.', delta: { privacidad: -6 } }
        ],
        vibe: 'risky',
        flag: 'shared_data'
      },
      {
        id: 'b',
        label: 'Le digo que no y le explico por qué.',
        immediate: { headline: 'Lo educaste.', delta: { conocimiento: 5, confianza: 3 }, flag: 'educated_friend' },
        vibe: 'safe',
        flag: 'educated_friend'
      },
      {
        id: 'c',
        label: 'Pongo un nombre falso.',
        immediate: { headline: 'Truco.', detail: 'No es sostenible pero te protege esta vez.', delta: { privacidad: -1 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Lo ignoro.',
        immediate: { headline: 'No participaste.', delta: { seguridad: 1 } },
        vibe: 'neutral'
      }
    ],
    theme: 'social',
    difficulty: 1,
    tags: ['app', 'datos', 'reto']
  },

  // ---------------- 34 ----------------
  {
    id: 'd34',
    title: 'Te llegan paquetes que no pediste',
    setup: 'Llegan paquetes a tu nombre que no pediste. Dentro hay productos baratos.',
    characters: ['marcas'],
    channel: 'irl',
    message: 'Reparte entrega 3 paquetes. Uno contiene un USB. Otro, un collar. Otro, un papel con un QR.',
    choices: [
      {
        id: 'a',
        label: 'Conecto el USB a mi PC por curiosidad.',
        immediate: { headline: 'Conectaste un USB desconocido.', delta: { seguridad: -20, privacidad: -10 }, flag: 'brushing_attack' },
        delayed: [
          { delayScenarios: 1, headline: 'Tu PC empieza a comportarse raro.', delta: { seguridad: -10 } }
        ],
        vibe: 'risky',
        flag: 'brushing_attack'
      },
      {
        id: 'b',
        label: 'Escaneo el QR con el móvil, no con mi PC.',
        immediate: { headline: 'Lo analizaste con cuidado.', detail: 'Mejor opción si quieres ver qué pasa.', delta: { seguridad: 3, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Lo denuncio a la policía y a la empresa de paquetería.',
        immediate: { headline: 'Lo reportaste.', delta: { seguridad: 6, reputacion: 4 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Lo tiro todo.',
        immediate: { headline: 'Lo descartaste.', detail: 'Rápido y seguro.', delta: { seguridad: 4 } },
        vibe: 'safe'
      }
    ],
    theme: 'datos',
    difficulty: 3,
    tags: ['paquete', 'brushing', 'qr']
  },

  // ---------------- 35 ----------------
  {
    id: 'd35',
    title: 'Un profesor sube tus notas a una IA pública',
    setup: 'Te enteras de que el profesor subió una lista con tus notas a ChatGPT para "analizarlas".',
    characters: ['profesor'],
    channel: 'inperson',
    message: '"No te preocupes, no pongo tu nombre, solo tus notas."',
    choices: [
      {
        id: 'a',
        label: 'No digo nada, total son solo notas.',
        immediate: { headline: 'Inacción.', detail: 'Aún sin nombre, los datos pueden identificarte.', delta: { privacidad: -8 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Le pregunto qué datos exactamente subió.',
        immediate: { headline: 'Averiguaste el alcance.', delta: { privacidad: 3, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Le solicito que borre los datos y no los use sin consentimiento.',
        immediate: { headline: 'Defendiste tus derechos.', delta: { privacidad: 6, reputacion: 3, conocimiento: 4 }, flag: 'gdpr_rights' },
        delayed: [
          { delayScenarios: 2, headline: 'El profesor entiende y cambia el procedimiento.', delta: { reputacion: 4 } }
        ],
        vibe: 'safe',
        flag: 'gdpr_rights'
      },
      {
        id: 'd',
        label: 'Hago una queja formal al colegio.',
        immediate: { headline: 'Escalaste el problema.', detail: 'Poner límites tiene consecuencias.', delta: { reputacion: -3, privacidad: 6 } },
        vibe: 'bold'
      }
    ],
    theme: 'trabajo',
    difficulty: 2,
    tags: ['datos', 'educación', 'ia']
  },

  // ---------------- 36 ----------------
  {
    id: 'd36',
    title: 'Un juego te pide desactivar el antivirus',
    setup: 'Un trainer/cheat de un juego te pide que desactives el antivirus "porque lo detecta como falso positivo".',
    characters: ['marcas'],
    channel: 'app',
    message: '"Desactiva Windows Defender o no funcionará. Es un falso positivo, tranquilo."',
    choices: [
      {
        id: 'a',
        label: 'Desactivo el antivirus.',
        immediate: { headline: 'Desactivaste tu defensa.', detail: 'El trainer probablemente sea un malware.', delta: { seguridad: -20, privacidad: -10 }, flag: 'disabled_av' },
        delayed: [
          { delayScenarios: 1, headline: 'Detectan un troyano en tu sistema.', delta: { seguridad: -10, privacidad: -8 } }
        ],
        vibe: 'risky',
        flag: 'disabled_av'
      },
      {
        id: 'b',
        label: 'No descargo trainers.',
        immediate: { headline: 'Te mantuviste limpio.', delta: { seguridad: 6, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Lo paso por VirusTotal antes de instalar.',
        immediate: { headline: 'Auditoría previa.', detail: '15 motores lo marcan como troyano.', delta: { conocimiento: 6 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Lo descargo pero solo para analizarlo.',
        immediate: { headline: 'Análisis en sandbox.', detail: 'Si lo haces sin preparar el entorno, te infectas igual.', delta: { seguridad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'gaming',
    difficulty: 2,
    tags: ['malware', 'antivirus', 'trainer']
  },

  // ---------------- 37 ----------------
  {
    id: 'd37',
    title: 'Te invitan a una "inversión exclusiva" en grupo VIP',
    setup: 'Un grupo de Telegram con 50 personas dice tener un "sistema infalible de arbitraje cripto".',
    characters: ['grupo', 'influencer'],
    channel: 'chat',
    message: '"Solo 50€ de entrada, ganancias diarias del 5%. Acceso vitalicio. Mañana se cierra el cupo."',
    choices: [
      {
        id: 'a',
        label: 'Entro con 50€.',
        immediate: { headline: 'Pago de entrada.', delta: { dinero: -10, conocimiento: -3 }, flag: 'crypto_scam' },
        delayed: [
          { delayScenarios: 2, headline: 'Te piden más dinero para "subir de nivel".', delta: { dinero: -15 } },
          { delayScenarios: 4, headline: 'El grupo desaparece.', delta: { dinero: -10 } }
        ],
        vibe: 'risky',
        flag: 'crypto_scam'
      },
      {
        id: 'b',
        label: 'Denuncio el grupo.',
        immediate: { headline: 'Lo cerraste.', delta: { reputacion: 4, seguridad: 4 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'c',
        label: 'Pregunto detalles técnicos del "arbitraje".',
        immediate: { headline: 'Cuestionamiento.', detail: 'No pueden explicar.', delta: { conocimiento: 5 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Lo ignoro.',
        immediate: { headline: 'No caíste.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      }
    ],
    theme: 'finanzas',
    difficulty: 2,
    tags: ['cripto', 'grupo', 'estafa']
  },

  // ---------------- 38 ----------------
  {
    id: 'd38',
    title: 'Una IA publica una foto tuya manipulada',
    setup: 'Aparece un video deepfake tuyo diciendo algo que nunca dijiste. Se viraliza.',
    characters: ['amigo'],
    channel: 'social',
    message: 'El video tiene 10K reproducciones. Algunos amigos te preguntan si eres tú.',
    choices: [
      {
        id: 'a',
        label: 'Denuncio y exijo que lo retiren.',
        immediate: { headline: 'Lo combates.', delta: { reputacion: 4, privacidad: 5 }, flag: 'spoke_up' },
        delayed: [
          { delayScenarios: 2, headline: 'La plataforma lo retira.', delta: { reputacion: 5 } }
        ],
        vibe: 'safe',
        flag: 'spoke_up'
      },
      {
        id: 'b',
        label: 'Hago una story desmintiendo.',
        immediate: { headline: 'Te defendiste.', delta: { reputacion: 3, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'No digo nada y espero que pase.',
        immediate: { headline: 'Esperaste.', detail: 'El daño escala.', delta: { reputacion: -10 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Hago un video imitando para reírme.',
        immediate: { headline: 'Respuesta con humor.', detail: 'Funciona a veces, otras empeora.', delta: { reputacion: -2 } },
        vibe: 'risky'
      }
    ],
    theme: 'ia',
    difficulty: 3,
    tags: ['deepfake', 'imagen', 'reputación']
  },

  // ---------------- 39 ----------------
  {
    id: 'd39',
    title: 'Una red social te notifica un "login sospechoso"',
    setup: 'Recibes un email: "Login desde iPhone 14, Madrid. Si no fuiste tú, haz clic aquí".',
    characters: ['marcas'],
    channel: 'email',
    sender: { name: 'InstaSecure', handle: 'no-reply@insta-secure-mail.com' },
    message: 'Dispositivo: iPhone 14, Madrid, 03:47. Si no fuiste tú, verifica tu cuenta.',
    choices: [
      {
        id: 'a',
        label: 'Hago clic en el enlace del email.',
        immediate: { headline: 'Entraste a phishing.', detail: 'El email es falso: el dominio no es oficial.', delta: { seguridad: -12, privacidad: -8 }, flag: 'clicked_phish' },
        vibe: 'risky',
        flag: 'clicked_phish'
      },
      {
        id: 'b',
        label: 'Abro la app y reviso la sección de seguridad.',
        immediate: { headline: 'Verificaste por la app.', delta: { seguridad: 6, conocimiento: 4 }, flag: 'verified_official' },
        vibe: 'safe',
        flag: 'verified_official'
      },
      {
        id: 'c',
        label: 'Denuncio el email.',
        immediate: { headline: 'Lo reportaste.', delta: { reputacion: 3, seguridad: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Cambio la contraseña por si acaso.',
        immediate: { headline: 'Acción preventiva.', delta: { seguridad: 6, conocimiento: 3 } },
        vibe: 'safe'
      }
    ],
    theme: 'social',
    difficulty: 2,
    tags: ['phishing', 'login', 'redes']
  },

  // ---------------- 40 ----------------
  {
    id: 'd40',
    title: 'Un reclutador de esports te pide un "depósito"',
    setup: 'Un supuesto cazatalentos de un equipo de esports te ofrece una prueba. Piden 80€ de "inscripción".',
    characters: ['reclutador'],
    channel: 'chat',
    message: '"¡Tienes talento! Te seleccionamos para el equipo pro. Solo 80€ de inscripción y equipamiento incluido."',
    choices: [
      {
        id: 'a',
        label: 'Pago los 80€ y mando mis datos.',
        immediate: { headline: 'Pagaste y enviaste datos.', delta: { dinero: -15, privacidad: -8, seguridad: -5 }, flag: 'esports_scam' },
        delayed: [
          { delayScenarios: 1, headline: 'Te piden más dinero para "level 2".', delta: { dinero: -15 } }
        ],
        vibe: 'risky',
        flag: 'esports_scam'
      },
      {
        id: 'b',
        label: 'Pido verificaciones oficiales del equipo.',
        immediate: { headline: 'Pediste pruebas.', delta: { seguridad: 4 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Investigo el equipo en internet y redes.',
        immediate: { headline: 'Investigaste.', detail: 'No existe. Es estafa.', delta: { conocimiento: 5 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Lo denuncio.',
        immediate: { headline: 'Lo reportaste.', delta: { reputacion: 3, seguridad: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      }
    ],
    theme: 'gaming',
    difficulty: 2,
    tags: ['esports', 'estafa', 'deporte']
  },

  // ---------------- 41 ----------------
  {
    id: 'd41',
    title: 'Una app te pide un selfie con tu DNI',
    setup: 'Una app financiera te pide foto sosteniendo tu DNI para "verificación de identidad".',
    characters: ['marcas'],
    channel: 'app',
    message: '"Selfie holding ID. Asegúrate que se vean ambos documentos y tu rostro."',
    choices: [
      {
        id: 'a',
        label: 'Tomo la foto y la subo.',
        immediate: { headline: 'Compartiste selfie+DNI.', detail: 'Con eso, alguien puede suplantarte.', delta: { privacidad: -18, seguridad: -10 }, flag: 'shared_dni' },
        delayed: [
          { delayScenarios: 2, headline: 'Detectan intentos de apertura de cuentas a tu nombre.', delta: { dinero: -15 } }
        ],
        vibe: 'risky',
        flag: 'shared_dni'
      },
      {
        id: 'b',
        label: 'Verifico que la app sea oficial.',
        immediate: { headline: 'Lo verificaste.', delta: { seguridad: 5, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Tapo la información que no es obligatoria.',
        immediate: { headline: 'Parcial.', detail: 'Aún así, datos sensibles van.', delta: { privacidad: -8 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'No uso esa app.',
        immediate: { headline: 'Rechazo.', delta: { seguridad: 4, privacidad: 4 } },
        vibe: 'safe'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['dni', 'app', 'identidad']
  },

  // ---------------- 42 ----------------
  {
    id: 'd42',
    title: 'Tu madre te reenvía una cadena de WhatsApp',
    setup: 'Te llega: "Reenvía esto a 10 personas o se te cortará WhatsApp mañana".',
    characters: ['madre'],
    channel: 'chat',
    message: '"POR FAVOR REENVÍA. Es real, le pasó a la prima de mi amiga. Si no, mañana pierdes la cuenta."',
    choices: [
      {
        id: 'a',
        label: 'Reenvío para no perder WhatsApp.',
        immediate: { headline: 'Difundiste spam.', detail: 'A 10 contactos. Y perderás su confianza.', delta: { reputacion: -5, confianza: -4 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Le explico a mi madre que es falso.',
        immediate: { headline: 'Educación familiar.', delta: { conocimiento: 4, confianza: 5 }, flag: 'educated_parent' },
        delayed: [
          { delayScenarios: 2, headline: 'Mi madre me manda la siguiente cadena dudosa.', detail: 'Consulta antes de reenviar.', delta: { confianza: 4 } }
        ],
        vibe: 'safe',
        flag: 'educated_parent'
      },
      {
        id: 'c',
        label: 'Lo dejo en visto.',
        immediate: { headline: 'Lo ignoraste.', delta: { confianza: -2 } },
        vibe: 'neutral'
      },
      {
        id: 'd',
        label: 'Verifico en la web de Maldita.es.',
        immediate: { headline: 'Verificación externa.', delta: { conocimiento: 5 } },
        vibe: 'safe'
      }
    ],
    theme: 'familia',
    difficulty: 1,
    tags: ['cadena', 'whatsapp', 'hoax']
  },

  // ---------------- 43 ----------------
  {
    id: 'd43',
    title: 'Una "beca" increíble para tu perfil',
    setup: 'Una fundación te escribe diciendo que ganaste una beca de 2.000€ para "jóvenes talentos".',
    characters: ['marcas'],
    channel: 'email',
    sender: { name: 'Fundación Youth', handle: 'becas@fundacion-youth.support' },
    message: '"¡Felicidades! Tu perfil fue seleccionado. Para recibir los 2.000€, completa este formulario con tus datos y los de tu cuenta bancaria."',
    choices: [
      {
        id: 'a',
        label: 'Relleno todo con mis datos.',
        immediate: { headline: 'Compartiste datos bancarios.', delta: { privacidad: -15, dinero: -10, seguridad: -8 }, flag: 'sent_bank' },
        delayed: [
          { delayScenarios: 1, headline: 'Te cobran una "tasa de gestión".', delta: { dinero: -15 } }
        ],
        vibe: 'risky',
        flag: 'sent_bank'
      },
      {
        id: 'b',
        label: 'Verifico la fundación en registros oficiales.',
        immediate: { headline: 'Lo verificaste.', detail: 'No existe. Es phishing.', delta: { conocimiento: 5 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Denuncio el email.',
        immediate: { headline: 'Lo reportaste.', delta: { seguridad: 4, reputacion: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Respondo pidiendo info oficial.',
        immediate: { headline: 'Te expusiste.', detail: 'Tu email es válido.', delta: { privacidad: -3 } },
        vibe: 'risky'
      }
    ],
    theme: 'trabajo',
    difficulty: 2,
    tags: ['beca', 'phishing', 'email']
  },

  // ---------------- 44 ----------------
  {
    id: 'd44',
    title: 'Tu hermano publica una foto íntima tuya',
    setup: 'Dani subió una foto de una conversación privada tuya a su estado.',
    characters: ['hermano'],
    channel: 'social',
    message: 'Dani: "jajaja mirad lo que me dijo mi hermano" (screenshot de tu mensaje privado)',
    choices: [
      {
        id: 'a',
        label: 'Le exijo que la borre y, si no, le bloqueo.',
        immediate: { headline: 'Pusiste un límite.', delta: { privacidad: 5, reputacion: 3, confianza: 3 }, flag: 'set_boundary' },
        vibe: 'safe',
        flag: 'set_boundary'
      },
      {
        id: 'b',
        label: 'Le contesto en público con la misma energía.',
        immediate: { headline: 'Escalaste el conflicto.', delta: { reputacion: -3, confianza: -5 } },
        vibe: 'risky'
      },
      {
        id: 'c',
        label: 'Le digo a mis padres.',
        immediate: { headline: 'Escalaste a la familia.', delta: { confianza: -3 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Hago como si nada.',
        immediate: { headline: 'Inacción.', detail: 'El daño sigue.', delta: { reputacion: -4 } },
        vibe: 'neutral'
      }
    ],
    theme: 'familia',
    difficulty: 2,
    tags: ['hermano', 'privacidad', 'límites']
  },

  // ---------------- 45 ----------------
  {
    id: 'd45',
    title: 'Te invitan a una "comunidad privada" de ciberseguridad',
    setup: 'Un canal de Discord te invita a una "comunidad VIP" con "métodos para ganar dinero online".',
    characters: ['grupo', 'desconocido'],
    channel: 'chat',
    message: '"Solo 30 plazas. Comparte tu email para recibir la invitación. No es para todos."',
    choices: [
      {
        id: 'a',
        label: 'Dejo mi email.',
        immediate: { headline: 'Compartiste tu email.', delta: { privacidad: -5 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Pregunto quién está detrás y qué métodos enseñan.',
        immediate: { headline: 'Cuestionamiento.', detail: 'Nadie contesta claramente.', delta: { seguridad: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Denuncio el canal.',
        immediate: { headline: 'Lo reportaste.', delta: { reputacion: 3, seguridad: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Lo ignoro.',
        immediate: { headline: 'No caíste.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      }
    ],
    theme: 'social',
    difficulty: 1,
    tags: ['discord', 'email', 'comunidad']
  },

  // ---------------- 46 ----------------
  {
    id: 'd46',
    title: 'Una marca te ofrece "embajador" si publicas a diario',
    setup: 'Te contacta una marca de cosmética teen. Te regalará productos a cambio de 5 stories/semana.',
    characters: ['marcas'],
    channel: 'email',
    sender: { name: 'GlowUpBrand', handle: 'pr@glowup-brand.shop' },
    message: '"Acepta: postear 5 stories/semana, etiquetarnos siempre, no hablar mal. Te enviamos un kit gratis. Solo necesitamos tu dirección."',
    choices: [
      {
        id: 'a',
        label: 'Acepto y doy mi dirección.',
        immediate: { headline: 'Compartiste dirección.', detail: 'Y aceptaste condiciones leoninas.', delta: { privacidad: -10, reputacion: -3 } },
        vibe: 'risky'
      },
      {
        id: 'b',
        label: 'Negocio las condiciones: solo 2 stories y solo positivas.',
        immediate: { headline: 'Negociación.', delta: { reputacion: 4, confianza: 3 } },
        vibe: 'bold'
      },
      {
        id: 'c',
        label: 'Leo el contrato completo con mis padres.',
        immediate: { headline: 'Leíste el contrato.', detail: 'Descubriste cláusulas abusivas.', delta: { conocimiento: 6 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Rechazo.',
        immediate: { headline: 'Te mantuviste libre.', delta: { reputacion: 3, privacidad: 3 } },
        vibe: 'safe'
      }
    ],
    theme: 'identidad',
    difficulty: 2,
    tags: ['marca', 'publicidad', 'contrato']
  },

  // ---------------- 47 ----------------
  {
    id: 'd47',
    title: 'Te llega un mail "Has sido demandado"',
    setup: 'Email: "Tiene 24h para responder a una demanda judicial. Adjunto: notificación.pdf"',
    characters: ['marcas'],
    channel: 'email',
    sender: { name: 'Juzgado', handle: 'notificaciones@juzgado-nacional.tk' },
    message: 'Estimado: tiene 24h. Si no responde, se procede. Descargue el PDF.',
    choices: [
      {
        id: 'a',
        label: 'Abro el PDF.',
        immediate: { headline: 'Abriste un PDF malicioso.', delta: { seguridad: -15, privacidad: -10 }, flag: 'clicked_phish' },
        delayed: [
          { delayScenarios: 1, headline: 'Tu PC tiene un troyano.', delta: { seguridad: -10 } }
        ],
        vibe: 'risky',
        flag: 'clicked_phish'
      },
      {
        id: 'b',
        label: 'Verifico con el colegio de abogados.',
        immediate: { headline: 'Verificación oficial.', delta: { seguridad: 5, conocimiento: 4 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Denuncio y elimino.',
        immediate: { headline: 'Lo reportaste.', delta: { seguridad: 4, reputacion: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      },
      {
        id: 'd',
        label: 'Lo ignoro.',
        immediate: { headline: 'No caíste.', delta: { seguridad: 2 } },
        vibe: 'neutral'
      }
    ],
    theme: 'trabajo',
    difficulty: 2,
    tags: ['phishing', 'pdf', 'email']
  },

  // ---------------- 48 ----------------
  {
    id: 'd48',
    title: 'Te ofrecen "WiFi gratis" en una plaza',
    setup: 'Ves una red WiFi abierta: "FREE_WIFI_CITY". Te puedes conectar sin clave.',
    characters: ['desconocido'],
    channel: 'irl',
    message: 'Red WiFi abierta. Al conectarte, aparece un portal que te pide email y número de teléfono para "verificar acceso".',
    choices: [
      {
        id: 'a',
        label: 'Conecto y pongo mis datos.',
        immediate: { headline: 'Compartiste email y teléfono en WiFi pública.', delta: { seguridad: -10, privacidad: -10 }, flag: 'shared_data' },
        delayed: [
          { delayScenarios: 1, headline: 'Te llegan SMS de spam.', delta: { privacidad: -6 } }
        ],
        vibe: 'risky',
        flag: 'shared_data'
      },
      {
        id: 'b',
        label: 'Uso mi VPN y datos móviles en su lugar.',
        immediate: { headline: 'Te protegiste.', delta: { seguridad: 6, conocimiento: 3 }, flag: 'preventive_action' },
        vibe: 'safe',
        flag: 'preventive_action'
      },
      {
        id: 'c',
        label: 'Conecto pero no lleno el formulario.',
        immediate: { headline: 'Sin datos, sin riesgo mayor.', detail: 'Aún así, la red puede monitorear.', delta: { seguridad: -3 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Denuncio el portal cautivo.',
        immediate: { headline: 'Aviso al CERT local.', delta: { reputacion: 4, seguridad: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['wifi', 'portal-cautivo', 'phishing']
  },

  // ---------------- 49 ----------------
  {
    id: 'd49',
    title: 'Una app educativa te pide permisos absurdos',
    setup: 'Una app de matemáticas pide acceso a cámara, micrófono, ubicación y contactos.',
    characters: ['marcas'],
    channel: 'app',
    message: '"MathGenius PRO" solicita: Cámara ✅ | Micrófono ✅ | Ubicación ✅ | Contactos ✅ | Almacenamiento ✅',
    choices: [
      {
        id: 'a',
        label: 'Acepto todo, total es gratis.',
        immediate: { headline: 'Aceptaste permisos innecesarios.', delta: { privacidad: -15, seguridad: -5 }, flag: 'gave_all_permissions' },
        vibe: 'risky',
        flag: 'gave_all_permissions'
      },
      {
        id: 'b',
        label: 'Solo permito lo que la app necesita.',
        immediate: { headline: 'Fuiste selectivo.', delta: { seguridad: 5, privacidad: 5 }, flag: 'selective_permissions' },
        vibe: 'safe',
        flag: 'selective_permissions'
      },
      {
        id: 'c',
        label: 'Busco una alternativa con buena reputación.',
        immediate: { headline: 'Rechazo razonable.', delta: { seguridad: 5, privacidad: 5, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'd',
        label: 'Denuncio la app a Google Play.',
        immediate: { headline: 'Lo reportaste.', delta: { reputacion: 4, seguridad: 3 }, flag: 'reported_phish' },
        vibe: 'safe',
        flag: 'reported_phish'
      }
    ],
    theme: 'datos',
    difficulty: 1,
    tags: ['apps', 'permisos', 'privacidad']
  },

  // ---------------- 50 ----------------
  {
    id: 'd50',
    title: 'Tu cuenta principal: ¿2FA o solo contraseña?',
    setup: 'Reflexión: tu cuenta de email principal solo tiene contraseña. Llevas 5 años con la misma.',
    characters: ['marcas'],
    channel: 'app',
    message: 'Tu cuenta está protegida solo con una contraseña de 2019. Podrías activar verificación en dos pasos.',
    choices: [
      {
        id: 'a',
        label: 'Activo 2FA con una app autenticadora.',
        immediate: { headline: 'Activaste 2FA.', delta: { seguridad: 10, conocimiento: 4 }, flag: 'enabled_2fa' },
        delayed: [
          { delayScenarios: 1, headline: 'Detectan un intento de login bloqueado por 2FA.', delta: { seguridad: 5, confianza: 3 } }
        ],
        vibe: 'safe',
        flag: 'enabled_2fa'
      },
      {
        id: 'b',
        label: 'Cambio a una contraseña más fuerte.',
        immediate: { headline: 'Reforzaste la contraseña.', delta: { seguridad: 5, conocimiento: 3 } },
        vibe: 'safe'
      },
      {
        id: 'c',
        label: 'Lo dejo para otro día.',
        immediate: { headline: 'Pospusiste.', detail: 'Tu cuenta sigue vulnerable.', delta: { seguridad: -2 } },
        vibe: 'risky'
      },
      {
        id: 'd',
        label: 'Activo 2FA por SMS.',
        immediate: { headline: '2FA por SMS.', detail: 'Mejor que nada, pero vulnerable a SIM-swap.', delta: { seguridad: 5 } },
        vibe: 'neutral'
      }
    ],
    theme: 'datos',
    difficulty: 2,
    tags: ['2fa', 'cuenta', 'contraseña']
  }
];

export const SCENARIOS_BY_ID: Record<string, Scenario> = SCENARIOS.reduce(
  (acc, s) => { acc[s.id] = s; return acc; },
  {} as Record<string, Scenario>
);
