import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SHOP_ITEMS, type ShopItem } from '@/data/shop';
import { useGame } from '@/store/gameStore';
import { Modal } from '@/components/Modal';
import { Back, Coin, Shop as ShopIcon, Check } from '@/components/Icon';
import { sfx } from '@/lib/sound';
import type { ItemSlot } from '@/data/shop';

const SLOTS: { id: ItemSlot; label: string; emoji: string }[] = [
  { id: 'hat', label: 'Sombreros', emoji: '🎩' },
  { id: 'backpack', label: 'Mochilas', emoji: '🎒' },
  { id: 'skin', label: 'Skins', emoji: '🧥' },
  { id: 'effect', label: 'Efectos', emoji: '✨' },
  { id: 'pet', label: 'Mascotas', emoji: '🐾' }
];

const RARITY_COLOR: Record<ShopItem['rarity'], string> = {
  común: '#a4d7ff',
  rara: '#9b5cff',
  épica: '#ff3ea5',
  legendaria: '#ffe14a'
};

export function Shop() {
  const { player, ownedItems, inventory, buyItem, equip } = useGame();
  const [slot, setSlot] = useState<ItemSlot>('hat');
  const [feedback, setFeedback] = useState<string | null>(null);

  const items = SHOP_ITEMS.filter((i) => i.slot === slot);

  function tryBuy(item: ShopItem) {
    if (ownedItems.includes(item.id)) {
      equip(item.slot, item.id);
      sfx.unlock();
      setFeedback(`¡${item.name} equipado!`);
      return;
    }
    if (player.coins < item.price) {
      sfx.wrong();
      setFeedback('No tienes suficientes monedas. Juega más misiones.');
      return;
    }
    if (buyItem(item.id)) {
      sfx.unlock();
      setFeedback(`¡${item.name} comprado y equipado!`);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <Link to="/" onClick={() => sfx.click()} className="btn-ghost p-2"><Back /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><ShopIcon className="h-5 w-5 text-neon-pink" /> Tienda Cyber</h1>
          <p className="text-xs text-white/60">Personaliza a tu agente. Todo cosmético: cero ventaja competitiva.</p>
        </div>
        <div className="ml-auto chip"><Coin className="h-3.5 w-3.5 text-neon-yellow" /> {player.coins}</div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SLOTS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSlot(s.id); sfx.click(); }}
            className={`p-3 rounded-xl border transition ${slot === s.id ? 'border-white/40 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
          >
            <div className="text-2xl">{s.emoji}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => {
          const owned = ownedItems.includes(it.id);
          const equipped = inventory[it.slot] === it.id;
          return (
            <motion.div
              key={it.id}
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 p-4"
              style={{ background: `linear-gradient(180deg, ${RARITY_COLOR[it.rarity]}11, transparent 60%)` }}
            >
              <div className="absolute top-2 right-2 chip text-[9px]" style={{ color: RARITY_COLOR[it.rarity], borderColor: RARITY_COLOR[it.rarity] }}>{it.rarity}</div>
              <div className="text-5xl">{it.emoji}</div>
              <div className="font-display font-bold mt-2">{it.name}</div>
              <div className="text-xs text-white/60 mt-0.5">{it.description}</div>
              <div className="mt-3 flex items-center gap-2">
                {equipped ? (
                  <button disabled className="btn-green text-xs flex-1 opacity-100">
                    <Check className="h-3.5 w-3.5" /> Equipado
                  </button>
                ) : owned ? (
                  <button onClick={() => tryBuy(it)} className="btn-ghost text-xs flex-1">Equipar</button>
                ) : (
                  <button onClick={() => tryBuy(it)} className="btn-primary text-xs flex-1">
                    <Coin className="h-3.5 w-3.5" /> {it.price}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={feedback !== null} onClose={() => setFeedback(null)} variant="success" title="¡Listo!">
        <p className="text-sm">{feedback}</p>
        <button onClick={() => setFeedback(null)} className="btn-primary w-full mt-3">Seguir comprando</button>
      </Modal>
    </div>
  );
}
