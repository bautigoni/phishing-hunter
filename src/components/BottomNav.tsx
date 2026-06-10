import { NavLink } from 'react-router-dom';
import { Home, Map, Trophy, Shop, Sword, Sparkles } from './Icon';

const items = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/map', label: 'Mapa', icon: Map },
  { to: '/play', label: 'Jugar', icon: Sparkles, big: true },
  { to: '/duel', label: 'Duelo', icon: Sword },
  { to: '/shop', label: 'Tienda', icon: Shop },
  { to: '/profile', label: 'Perfil', icon: Trophy }
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-white/5 bg-ink-900/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto grid grid-cols-6">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-semibold uppercase tracking-wider relative ${
                  isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {it.big ? (
                    <span className="-mt-7 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyber-300 via-neon-purple to-neon-pink flex items-center justify-center shadow-glow border-2 border-ink-900">
                      <Icon className="h-5 w-5 text-ink-900" size={22} />
                    </span>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  <span>{it.label}</span>
                  {isActive && !it.big && (
                    <span className="absolute -top-0.5 h-0.5 w-6 rounded bg-gradient-to-r from-cyber-300 to-neon-pink" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
