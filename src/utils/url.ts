// GitHub Pages serves this project from a subpath (e.g. /escape-room/),
// configured via `base` in astro.config.mjs. Astro does NOT rewrite plain
// string hrefs/srcs you write yourself — only its own generated asset
// URLs — so every internal link must be passed through this helper.
// See: https://docs.astro.build/en/reference/api-reference/#importmetaenv

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
