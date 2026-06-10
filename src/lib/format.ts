export function clsx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(' ');
}

export function pickAvatar(seed: string) {
  const list = ['🛡️', '🦊', '🐼', '🐯', '🐲', '🦄', '🐺', '🦅', '🐱', '🐶', '🦝', '🐨'];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}
