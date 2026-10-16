// Default inline illustrations, used whenever a config.* image path isn't provided.

export const DEFAULT_ENVELOPE_SVG = `<svg viewBox="0 0 300 200" aria-hidden="true">
  <rect x="12" y="30" width="276" height="160" rx="12" fill="#efd6a8" stroke="#d1b07a" stroke-width="2"/>
  <path d="M12 42 L150 135 L288 42" fill="none" stroke="#d1b07a" stroke-width="2"/>
  <path d="M12 190 L120 110 M288 190 L180 110" stroke="#d1b07a" stroke-width="2"/>
  <path d="M12 42 Q150 -10 288 42 L150 135Z" fill="#f4e0b8" stroke="#d1b07a" stroke-width="2"/>
  <path d="M150 112 q-30 -30 -48 -10 q10 22 48 10 q38 12 48 -10 q-18 -20 -48 10z" fill="#a98ad0"/>
  <path d="M150 128 q-8 14 -20 30 M150 128 q8 14 20 30" stroke="#a98ad0" stroke-width="9" stroke-linecap="round"/>
  <path d="M150 140 c-22 -18 -14 -36 0 -26 c14 -10 22 8 0 26z" fill="#d9406b" stroke="#fff" stroke-width="2"/>
  <g stroke="#7a9a5a" fill="none" stroke-width="2"><path d="M40 170 q10 -40 8 -60"/><path d="M262 170 q-10 -40 -8 -60"/></g>
  <circle cx="48" cy="108" r="7" fill="#f08aa6"/><circle cx="254" cy="108" r="7" fill="#f08aa6"/>
</svg>`;

export const DEFAULT_CAKE_SVG = `<svg viewBox="0 0 300 260" aria-hidden="true">
  <ellipse cx="150" cy="238" rx="130" ry="14" fill="#e7e1e6"/>
  <rect x="40" y="170" width="220" height="62" rx="10" fill="#f8e7dc"/><path d="M40 176 h220 v14 q-10 14 -20 0 q-10 16 -22 0 q-10 14 -22 0 q-12 16 -24 0 q-12 14 -24 0 q-12 16 -24 0 q-12 14 -22 0 q-14 16 -22 0z" fill="#e85d8a"/>
  <rect x="62" y="116" width="176" height="56" rx="10" fill="#f6e6a0"/><rect x="62" y="150" width="176" height="14" fill="#c9b8f0"/><path d="M62 122 h176 v12 q-10 12 -22 0 q-12 14 -24 0 q-12 12 -24 0 q-12 14 -24 0 q-12 12 -24 0 q-12 14 -22 0 q-10 12 -16 0z" fill="#e85d8a"/>
  <rect x="88" y="70" width="124" height="48" rx="10" fill="#fbe9ec"/><path d="M88 76 h124 v12 q-8 12 -18 0 q-10 14 -20 0 q-10 12 -20 0 q-10 14 -20 0 q-10 12 -18 0 q-8 10 -12 0z" fill="#e85d8a"/>
  <circle cx="120" cy="62" r="7" fill="#c8202f"/><circle cx="180" cy="62" r="7" fill="#c8202f"/>
  <rect x="116" y="38" width="7" height="22" rx="2" fill="#f6a1b8"/><rect x="177" y="38" width="7" height="22" rx="2" fill="#f6a1b8"/>
  <g class="flame"><path d="M119.5 20 q7 10 0 18 q-7 -8 0 -18z" fill="#ffb347"/><path d="M180.5 20 q7 10 0 18 q-7 -8 0 -18z" fill="#ffb347"/></g>
</svg>`;

export const DEFAULT_CAKE_ICON_SVG = `<svg viewBox="0 0 160 190" aria-hidden="true">
  <ellipse cx="80" cy="176" rx="64" ry="9" fill="#e7e1e6"/><rect x="22" y="110" width="116" height="62" rx="10" fill="#f08aa6"/>
  <rect x="34" y="70" width="92" height="42" rx="9" fill="#fbe9ec"/><path d="M34 76 h92 v10 q-8 10 -16 0 q-8 12 -16 0 q-8 10 -16 0 q-8 12 -16 0 q-8 10 -12 0z" fill="#e85d8a"/>
  <circle cx="62" cy="62" r="7" fill="#c8202f"/><circle cx="98" cy="62" r="7" fill="#c8202f"/>
  <rect x="76" y="40" width="7" height="26" rx="2" fill="#f6a1b8"/><g class="flame"><path d="M79.5 20 q7 10 0 18 q-7 -8 0 -18z" fill="#ffb347"/></g>
</svg>`;

export function bearSvg(opts = {}, mascotImage) {
  if (mascotImage) return `<img src="${mascotImage}" alt="">`;
  return `<svg viewBox="0 0 160 190" aria-hidden="true"><ellipse cx="80" cy="140" rx="46" ry="44" fill="#e0a45c"/><ellipse cx="80" cy="150" rx="28" ry="28" fill="#f5d9a8"/>
    <circle cx="42" cy="58" r="17" fill="#e0a45c"/><circle cx="118" cy="58" r="17" fill="#e0a45c"/><circle cx="42" cy="58" r="8" fill="#f2b9a0"/><circle cx="118" cy="58" r="8" fill="#f2b9a0"/>
    <circle cx="80" cy="82" r="44" fill="#e8b068"/><ellipse cx="80" cy="98" rx="20" ry="15" fill="#f5d9a8"/><ellipse cx="80" cy="92" rx="6" ry="4.5" fill="#4a2c2c"/>
    ${opts.sleep
      ? '<path d="M56 78 q8 6 16 0 M88 78 q8 6 16 0" stroke="#4a2c2c" stroke-width="3" fill="none" stroke-linecap="round"/>'
      : '<circle cx="62" cy="76" r="5" fill="#4a2c2c"/><circle cx="98" cy="76" r="5" fill="#4a2c2c"/><circle cx="64" cy="74" r="1.8" fill="#fff"/><circle cx="100" cy="74" r="1.8" fill="#fff"/>'}
    <path d="M72 102 q8 8 16 0" stroke="#4a2c2c" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="52" cy="92" r="7" fill="#f4a3a3" opacity=".7"/><circle cx="108" cy="92" r="7" fill="#f4a3a3" opacity=".7"/>
    <path d="M62 42 L80 6 L98 42z" fill="#a98ad0"/><circle cx="80" cy="6" r="6" fill="#f9d56e"/><path d="M68 34 h24" stroke="#fff" stroke-width="3"/>
    ${opts.balloon
      ? '<path d="M122 120 Q140 80 132 40" stroke="#b8284f" stroke-width="2" fill="none"/><ellipse cx="132" cy="28" rx="16" ry="20" fill="#f08aa6"/><ellipse cx="127" cy="22" rx="4" ry="7" fill="#fff" opacity=".5"/><circle cx="118" cy="128" r="11" fill="#e8b068"/>'
      : '<circle cx="46" cy="124" r="11" fill="#e8b068"/><circle cx="114" cy="124" r="11" fill="#e8b068"/>'}
  </svg>`;
}
