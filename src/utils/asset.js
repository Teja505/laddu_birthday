// Resolves a public/ asset path to the correct URL, respecting Vite's configured base
// (e.g. "/laddu_birthday/" in production, "/" in dev).
export function asset(path) {
  return import.meta.env.BASE_URL + path;
}
