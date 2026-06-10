import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ESTAFADOR_LEVELS, ESTAFAS_BASE, type EstafaTemplate } from '@/data/estafador';
import { useGame } from '@/store/gameStore';
import { Modal } from '@/components/Modal';
import { Byte } from '@/components/Byte';
import { sfx } from '@/lib/sound';
import { Back, Sparkles, Check, X, Help } from '@/components/Icon';

export function Estafador() {
  const [level, setLevel] = useState(1);
  const [showLevel, setShowLevel] = useState<EstafaTemplate | null>(null);
  const [combo, setCombo] = useState({ sender: '', brand: '', cta: '', urgency: '', link: '' });
  const { recordEstafa } = useGame();

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-neon-orange" /> Modo Estafador</h1>
          <p className="text-xs text-white/60">Aprende cómo piensa un villano. Perspectiva siempre educativa y defensiva.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold">Constructor de estafas</h2>
            <span className="chip text-[10px]">Nivel {level}</span>
          </div>

          <BuilderFields combo={combo} setCombo={setCombo} />

          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Vista previa</div>
            <div className="rounded-2xl border border-white/10 bg-ink-700/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <div className="font-display font-bold text-sm">{combo.brand || 'Tu marca falsa'}</div>
                <div className="text-xs font-mono text-white/60 break-all">{combo.sender || 'remitente@falso.com'}</div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-sm font-semibold">{combo.urgency || 'Tu mensaje de urgencia'}</div>
                <div className="text-sm">{combo.cta || 'Tu llamada a la acción'}</div>
                <a className="inline-block text-cyber-300 underline text-xs break-all" href="#" onClick={(e) => e.preventDefault()}>{combo.link || 'http://tu-enlace-falso'}</a>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={() => { sfx.click(); setLevel((l) => Math.max(1, l - 1)); }} className="btn-ghost text-xs">- Nivel</button>
            <button onClick={() => { sfx.click(); setLevel((l) => Math.min(5, l + 1)); }} className="btn-ghost text-xs">+ Nivel</button>
            <button onClick={() => { sfx.unlock(); recordEstafa(); setShowLevel(ESTAFAS_BASE[Math.min(level - 1, ESTAFAS_BASE.length - 1)]); }} className="btn-pink flex-1">
              <Help className="h-4 w-4" /> Analizar con IA
            </button>
          </div>
        </section>

        <aside className="space-y-3">
          <div className="glass p-4">
            <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Plantillas</div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
              {ESTAFAS_BASE.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sfx.click();
                    setLevel(t.level);
                    setCombo({
                      sender: t.sender,
                      brand: t.brand,
                      cta: t.cta,
                      urgency: t.urgency,
                      link: t.link
                    });
                  }}
                  className="w-full text-left rounded-xl p-3 border border-white/10 hover:border-white/20 transition"
                  style={{ background: `linear-gradient(180deg, ${t.brandColor}22, transparent 60%)` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.brandEmoji}</span>
                    <div className="font-display font-bold text-sm">{t.title}</div>
                  </div>
                  <div className="text-[10px] text-white/60">Nivel {t.level}</div>
                </button>
              ))}
            </div>
          </div>
          <Byte emotion="thinking">
            Construye una estafa. Te diré qué tan creíble es y por qué no se debe usar.
          </Byte>
        </aside>
      </div>

      <section>
        <h2 className="font-display text-lg font-bold mb-3">Niveles del Modo Estafador</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ESTAFADOR_LEVELS.map((lv) => (
            <motion.div
              key={lv.level}
              whileHover={{ y: -2 }}
              className={`rounded-2xl p-4 border transition cursor-pointer ${level === lv.level ? 'border-neon-pink bg-neon-pink/10' : 'border-white/10 hover:border-white/20'}`}
              onClick={() => { sfx.click(); setLevel(lv.level); }}
            >
              <div className="text-2xl">{lv.level === 1 ? '📧' : lv.level === 2 ? '🎨' : lv.level === 3 ? '🗣️' : lv.level === 4 ? '🔑' : '🧩'}</div>
              <div className="font-display font-bold text-sm mt-1">Nivel {lv.level}</div>
              <div className="text-[10px] text-white/60 mt-0.5">{lv.name}</div>
              <p className="text-[11px] text-white/70 mt-2">{lv.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Modal open={showLevel !== null} onClose={() => setShowLevel(null)} variant="pink" title={`Análisis de Nivel ${showLevel?.level}`} size="lg">
        {showLevel && <EstafaAnalysis t={showLevel} />}
      </Modal>
    </div>
  );
}

function BuilderFields({ combo, setCombo }: { combo: { brand: string; sender: string; urgency: string; cta: string; link: string }; setCombo: (c: { brand: string; sender: string; urgency: string; cta: string; link: string }) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Field label="Marca suplantada" value={combo.brand} onChange={(v: string) => setCombo({ ...combo, brand: v })} placeholder="ej. Amazon, BBVA" />
      <Field label="Remitente" value={combo.sender} onChange={(v: string) => setCombo({ ...combo, sender: v })} placeholder="ej. soporte@fake.com" mono />
      <Field label="Urgencia / cebo" value={combo.urgency} onChange={(v: string) => setCombo({ ...combo, urgency: v })} placeholder="ej. Tu cuenta será eliminada en 24h" full />
      <Field label="Llamada a la acción" value={combo.cta} onChange={(v: string) => setCombo({ ...combo, cta: v })} placeholder="ej. Reclamar premio, Verificar identidad" full />
      <Field label="Enlace" value={combo.link} onChange={(v: string) => setCombo({ ...combo, link: v })} placeholder="http://..." mono full />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono, full }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; full?: boolean }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase tracking-widest text-white/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full bg-ink-900 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-cyber-300 ${mono ? 'font-mono text-xs' : ''}`}
      />
    </label>
  );
}

function EstafaAnalysis({ t }: { t: EstafaTemplate }) {
  const flags: { label: string; ok: boolean; tip: string }[] = [
    { label: 'Remitente oficial', ok: !t.sender.includes('gmail') && !t.sender.includes('yahoo') && !t.sender.includes('outlook'), tip: 'Marcas reales envían desde su propio dominio.' },
    { label: 'Urgencia', ok: false, tip: 'Apelar al miedo o la prisa es un truco clásico de ingeniería social.' },
    { label: 'Enlace verificable', ok: t.link.startsWith('https://') && !t.link.includes('-'), tip: 'HTTPS y dominios oficiales; evita guiones y TLDs raras.' },
    { label: 'No pide datos sensibles', ok: !t.cta.toLowerCase().includes('contraseña') && !t.cta.toLowerCase().includes('dni'), tip: 'Una marca jamás pide contraseñas ni DNI completos por email.' },
    { label: 'Tono profesional', ok: !t.brand.includes('Sorteo'), tip: 'Errores ortográficos o emoción exagerada = mala señal.' }
  ];
  const score: number = Math.round((flags.filter((f: { ok: boolean }) => f.ok).length / flags.length) * 100);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10" style={{ background: `linear-gradient(180deg, ${t.brandColor}30, transparent)` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{t.brandEmoji}</span>
            <div>
              <div className="font-display font-bold">{t.brand}</div>
              <div className="text-[10px] font-mono text-white/60 break-all">{t.sender}</div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="font-semibold">{t.urgency}</div>
          <div>{t.cta}</div>
          <a className="text-cyber-300 underline text-xs break-all" href="#" onClick={(e) => e.preventDefault()}>{t.link}</a>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-display font-bold">Credibilidad defensiva</span>
          <span className="tabular-nums">{score}/100</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full" style={{ width: `${score}%`, background: score > 60 ? '#3eff9b' : score > 30 ? '#ffe14a' : '#ff3e6a' }} />
        </div>
        <p className="text-[11px] text-white/60 mt-1">A mayor credibilidad, más peligrosa sería si se usara para hacer daño. Por eso, mejor aprender a detectarla.</p>
      </div>

      <div className="space-y-1">
        {flags.map((f) => (
          <div key={f.label} className="flex items-start gap-2 text-sm">
            {f.ok ? <Check className="h-4 w-4 text-neon-green mt-0.5 shrink-0" /> : <X className="h-4 w-4 text-neon-red mt-0.5 shrink-0" />}
            <div>
              <div className={`font-semibold ${f.ok ? 'text-neon-green' : 'text-neon-red'}`}>{f.label}</div>
              <div className="text-xs text-white/60">{f.tip}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs">
        <div className="font-display font-bold text-white text-sm mb-1">Resumen educativo</div>
        <p>Las estafas reales combinan varios trucos a la vez. La defensa es revisar remitente, enlace, tono y sentido común. Si dudas, contacta directamente a la marca por su app o web oficial.</p>
      </div>
    </div>
  );
}
