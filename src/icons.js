/* ============================================================
   TECH GLYPHS - Nerd Font icons for skill / tech / expertise chips.
   Keys are normalised (lowercase) chip labels; values are
   codepoints from JetBrains Mono Nerd Font (Devicons + Font Awesome).

   IMPORTANT: the self-hosted font (public/fonts/) is subset to ONLY
   the codepoints used here. If you add a new glyph below, also add its
   codepoint to scripts/subset list and regenerate the woff2
   (see README "Regenerating the icon font"). Otherwise it renders as tofu.
   ============================================================ */
export const TECH_ICONS = {
  // languages
  "c++": "\ue7a3",
  go: "\ue724",
  python: "\ue73c",
  zig: "\ue8ef",
  typescript: "\ue8ca",
  javascript: "\ue781",
  sql: "\uf1c0",
  // ml & hpc
  cuda: "\uf2db",
  mpi: "\uef09",
  openmp: "\uf2db",
  pytorch: "\ue87b",
  nsight: "\uf2db",
  rag: "\uee9c",
  opencv: "\ue854",
  // frameworks / cloud / tools
  reactjs: "\ue7ba",
  react: "\ue7ba",
  fastapi: "\ue7d5",
  spring: "\ue8ac",
  aws: "\ue7ad",
  "aws s3": "\ue7ad",
  cloudfront: "\ue7ad",
  terraform: "\ue8bd",
  postgresql: "\ue76e",
  snowflake: "\uf2dc",
  "rest apis": "\uf233",
  rest: "\uf233",
  cmake: "\uf1b2",
  // protocols / backend
  tcp: "\uef09",
  "http/1.1": "\uf0ac",
  http: "\uf0ac",
  "web crypto": "\uf023",
  "aes-256-gcm": "\uf023",
  jwt: "\uf084",
  ffmpeg: "\uf008",
  sqlite: "\ue7c4",
  sqlc: "\uf1c0",
  rss: "\uf09e",
  // ai / retrieval
  graphs: "\uefce",
  llm: "\uee9c",
  embeddings: "\uf1b3",
  "sentence-transformers": "\uee9c",
  gemini: "\uee0d",
  clip: "\uee9c",
  bm25: "\uf002",
  "function calling": "\uf120",
  // foundations
  markdown: "\ue73e",
  parsing: "\uf120",
  asyncio: "\ue73c",
  aiohttp: "\uf0ac",
  pygame: "\ue73c",
  // misc (handy for link labels / future use)
  github: "\ue709",
  git: "\ue702",
  docker: "\ue7b0",
};

/** Returns the Nerd Font glyph for a chip label, or "" if none is mapped. */
export function techIcon(label) {
  if (!label) return "";
  return TECH_ICONS[String(label).toLowerCase().trim()] || "";
}
