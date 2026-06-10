# 🎯 Phishing Hunter — Cyber City

> **El videojuego educativo premium para aprender ciberseguridad.**
> Una aventura dentro de **Cyber City**, donde los jugadores se convierten en agentes que detectan phishing, ingeniería social, estafas online, deepfakes y fraudes de videojuegos.

Diseñado para niños y adolescentes de **10 a 16 años** (y para todos los que quieran aprender jugando). Se siente como un juego AAA: similar a Duolingo, Brawl Stars o Among Us. **No como una plataforma educativa.**

---

## ✨ Características

- 🎮 **8 distritos temáticos** (Premisos, Email, Redes, Videojuegos, Chat, Compras, Bancos, IA/Deepfakes).
- 🦹 **5 villanos memorables**, cada uno con un truco distinto:
  - ⏰ **Capitán Urgencia** (presión y miedo)
  - 👑 **Reina Premio** (regalos imposibles)
  - 🔗 **Doctor Link** (URLs falsas)
  - 🎭 **Señor Clon** (sitios copiados)
  - 👻 **Fantasma IA** (deepfakes y voces clonadas)
- 🤖 **Byte**, tu robot compañero, te guía en cada misión.
- 🐕 **Firewall**, el perro-robot, es tu mascota desbloqueable.
- 🎯 **Detección por clicks**: toca cada parte sospechosa (remitente, enlace, mensaje, urgencia) y el juego explica por qué.
- 🎭 **Modo Estafador**: aprende cómo piensa un atacante (perspectiva siempre educativa y defensiva).
- 👴 **Mecánica viral "¿Caería tu abuelo?"**: predice el porcentaje de cada grupo etario que caería. Comparte el resultado.
- ⚔️ **Duelos 1v1** contra rivales NPC, con clasificación semanal.
- 📅 **Desafíos diarios** generados proceduralmente (estilo IA).
- 🏆 **+20 logros** y **sistema de progresión** con XP, monedas, niveles y cosméticos.
- 🛍️ **Tienda** con sombreros, mochilas, skins, efectos y mascotas.
- 📊 **Estadísticas detalladas** por villano y distrito.
- 🔊 **Audio procedural** con WebAudio (sin assets externos).
- 📱 **PWA instalable**, modo oscuro por defecto, responsive.
- ✨ Estética premium: gradientes, glow, partículas, confeti, microanimaciones.

---

## 🧱 Stack técnico

- **React 18 + TypeScript + Vite** — base moderna y rápida.
- **Tailwind CSS 3** — theming completo de Cyber City (colores neon, animaciones, glassmorphism).
- **Framer Motion** — transiciones y microinteracciones de calidad consola.
- **Zustand + persist** — estado del juego (XP, monedas, logros, inventario) con persistencia local.
- **React Router** — navegación SPA.
- **vite-plugin-pwa + Workbox** — instalable y offline-first.
- **WebAudio API** — efectos de sonido generados al vuelo (sin assets).

Sin backend obligatorio: corre 100% en el cliente. Los datos simulados (rivales, stats de "abuelo") están listos para reemplazarse por una API real cuando se integre un backend.

---

## 🚀 Desarrollo local

```bash
npm install
npm run dev      # abre http://localhost:5173
npm run build    # build de producción en /dist
npm run preview  # sirve /dist localmente
```

Requisitos: Node 18+ (probado con Node 22) y npm 10+.

---

## 🗂️ Estructura

```
src/
├── components/      UI reusable (Button, Modal, ProgressBar, Byte, Confetti, Topbar, BottomNav...)
├── data/            Villanos, distritos, misiones, logros, tienda, generador procedural
├── lib/             Utilidades (audio, formato)
├── pages/           Pantallas (Home, Map, Play, Mission, Duel, Estafador, Grandma, Daily, Shop, Profile...)
├── store/           Estado global (Zustand) + caché en memoria para misiones diarias
└── styles/          Tailwind + estilos globales
```

---

## 🎓 Filosofía educativa

- **Aprendizaje invisible**: las pistas enseñan la teoría solo cuando el jugador las encuentra.
- **Defensivo, nunca ofensivo**: el "Modo Estafador" siempre desarma las estafas en lugar de enseñar a hacer daño.
- **Conversación y viralidad**: "¿Caería tu abuelo?" está pensado para discutirlo en familia.
- **Mentalidad de crecimiento**: cada error es una lección con explicación visual.

---

## 🛣️ Hoja de ruta (cuando se integre backend)

- [ ] Cuentas de usuario + sincronización en la nube.
- [ ] Multijugador real (WebSockets) en lugar del rival NPC.
- [ ] Generación de contenido con LLM (correos, SMS, perfiles) bajo prompt.
- [ ] Panel para profesores con métricas agregadas.
- [ ] Marketplace de cosméticos creado por la comunidad.
- [ ] Localización (ES, EN, PT, FR, IT).

---

## 📄 Licencia

MIT.
