// Sintetizador simple de efectos con WebAudio. No requiere assets externos.
let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}

function tone(freq: number, durMs: number, type: OscillatorType = 'sine', gain = 0.08, attack = 0.005, release = 0.18) {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durMs / 1000 + release);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + durMs / 1000 + release + 0.05);
}

export const sfx = {
  click: () => tone(620, 60, 'square', 0.04, 0.001, 0.04),
  correct: () => {
    tone(660, 90, 'triangle', 0.08, 0.001, 0.08);
    setTimeout(() => tone(990, 120, 'triangle', 0.08, 0.001, 0.1), 70);
    setTimeout(() => tone(1320, 180, 'triangle', 0.08, 0.001, 0.16), 150);
  },
  wrong: () => {
    tone(220, 140, 'sawtooth', 0.07, 0.001, 0.16);
    setTimeout(() => tone(180, 200, 'sawtooth', 0.07, 0.001, 0.2), 90);
  },
  levelUp: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 140, 'triangle', 0.09, 0.001, 0.16), i * 90));
  },
  unlock: () => {
    [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => tone(f, 100, 'sine', 0.06, 0.001, 0.12), i * 60));
  },
  coin: () => {
    tone(988, 60, 'square', 0.06, 0.001, 0.08);
    setTimeout(() => tone(1318, 100, 'square', 0.06, 0.001, 0.12), 50);
  },
  tick: () => tone(800, 25, 'square', 0.03, 0.001, 0.02)
};
