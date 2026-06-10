// Iconos inline SVG (no dependemos de librerías).
type IconProps = { className?: string; size?: number };

const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

export const Home = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);
export const Map = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v16M15 6v16" /></svg>
);
export const Trophy = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" /></svg>
);
export const Shop = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M3 9l1-5h16l1 5" /><path d="M3 9v11h18V9" /><path d="M9 13h6" /></svg>
);
export const User = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const Mail = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
export const Sms = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M21 12a8 8 0 0 1-11.4 7.3L3 21l1.7-6.6A8 8 0 1 1 21 12z" /></svg>
);
export const Globe = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
);
export const Sparkles = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" /></svg>
);
export const Sword = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M14 4l6 6-9 9-3-3 9-9z" /><path d="M5 19l3 3M8 16l-3 3" /></svg>
);
export const Cog = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
);
export const Lock = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
export const X = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Check = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M5 12l5 5 9-11" /></svg>
);
export const Star = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
);
export const Fire = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M12 2c2 4-2 5 0 9s5 3 5 7a5 5 0 0 1-10 0c0-3 2-4 2-7s-2-4 3-9z" /></svg>
);
export const Bolt = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg>
);
export const Coin = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="12" cy="12" r="9" /><path d="M9 9h5a2 2 0 0 1 0 4h-5M9 13h6a2 2 0 0 1 0 4H8" /></svg>
);
export const Heart = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" /></svg>
);
export const Help = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" /></svg>
);
export const Back = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
export const Search = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
export const Share = ({ className, size }: IconProps) => (
  <svg className={className} {...base(size)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
);
