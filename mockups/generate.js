/* Generador de 6 mockups de menú digital (casillas desplegables) en SVG.
   Cada SVG es una maqueta de celular con el mismo menú, distinto theme. */
const fs = require('fs');

const W = 400, H = 820, PAD = 22;
const CW = W - PAD * 2;

const THEMES = [
  {
    file: '1-oscuro-elegante', name: 'Oscuro Elegante',
    bg: ['#15110a', '#241a0d'], screen: '#15110a',
    card: '#221c12', cardBorder: '#3a2f1c',
    title: '#f5e9cf', text: '#f5e9cf', sub: '#b09a72', accent: '#d4af37',
    chip: '#3a2f1c', font: "'Georgia', serif", brand: 'LA BODEGA',
    tagline: 'Bar & Cocina', photo: ['#3a2f1c', '#5a4a26'], header: '#d4af37',
  },
  {
    file: '2-claro-minimal', name: 'Claro Minimal',
    bg: ['#ffffff', '#f3f4f6'], screen: '#fafafa',
    card: '#ffffff', cardBorder: '#e6e7eb',
    title: '#111827', text: '#111827', sub: '#9ca3af', accent: '#111827',
    chip: '#f3f4f6', font: "'Helvetica Neue', Arial, sans-serif", brand: 'NORDIC',
    tagline: 'café & bar', photo: ['#eef2ff', '#e0e7ff'], header: '#111827',
  },
  {
    file: '3-madera-rustico', name: 'Madera / Rústico',
    bg: ['#2b1d12', '#3d2a18'], screen: '#2b1d12',
    card: '#3a2719', cardBorder: '#5a3d24',
    title: '#f6e7d3', text: '#f6e7d3', sub: '#c7a583', accent: '#e0852f',
    chip: '#5a3d24', font: "'Georgia', serif", brand: 'EL ROBLE',
    tagline: 'parrilla & tragos', photo: ['#5a3d24', '#7a5230'], header: '#e0852f',
  },
  {
    file: '4-neon-nocturno', name: 'Neón Nocturno',
    bg: ['#0a0a18', '#160a2a'], screen: '#0a0a18',
    card: '#160f2e', cardBorder: '#2c1f55',
    title: '#f0e9ff', text: '#f0e9ff', sub: '#9d8bd0', accent: '#ff3da6',
    chip: '#2c1f55', font: "'Helvetica Neue', Arial, sans-serif", brand: 'NEÓN',
    tagline: 'cocktail club', photo: ['#2c1f55', '#5a2c8a'], header: '#22d3ee',
  },
  {
    file: '5-pastel-cozy', name: 'Pastel / Acogedor',
    bg: ['#fdf2f4', '#fce7eb'], screen: '#fdf6f7',
    card: '#ffffff', cardBorder: '#f3d9df',
    title: '#5b3a44', text: '#5b3a44', sub: '#b08a94', accent: '#e8738f',
    chip: '#fce7eb', font: "'Helvetica Neue', Arial, sans-serif", brand: 'Dulce',
    tagline: 'brunch & vino', photo: ['#fce7eb', '#fbd3dd'], header: '#e8738f',
  },
  {
    file: '6-clasico-bistro', name: 'Clásico Bistró',
    bg: ['#f5efe2', '#ece2cd'], screen: '#f5efe2',
    card: '#fbf7ee', cardBorder: '#ddd0b4',
    title: '#2f2a20', text: '#2f2a20', sub: '#8a7d64', accent: '#9a3b2e',
    chip: '#ece2cd', font: "'Georgia', serif", brand: 'BISTRÓ 1921',
    tagline: 'cuisine maison', photo: ['#ece2cd', '#d8c9a8'], header: '#9a3b2e',
  },
];

function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

function rrect(x,y,w,h,r,fill,stroke){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="1"`:''}/>`;
}
// chevron: dir 'down' o 'up'
function chevron(cx,cy,color,up){
  const d = up ? `M${cx-6} ${cy+3} L${cx} ${cy-3} L${cx+6} ${cy+3}` : `M${cx-6} ${cy-3} L${cx} ${cy+3} L${cx+6} ${cy-3}`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function collapsed(t, y, label, count){
  const h = 54;
  return `
    ${rrect(PAD, y, CW, h, 16, t.card, t.cardBorder)}
    <text x="${PAD+18}" y="${y+h/2+5}" font-family="${t.font}" font-size="16" font-weight="600" fill="${t.title}">${esc(label)}</text>
    <text x="${W-PAD-46}" y="${y+h/2+5}" font-family="${t.font}" font-size="12" fill="${t.sub}">${count}</text>
    ${chevron(W-PAD-22, y+h/2, t.sub, false)}
  `;
}

function item(t, y, gradId, emoji, name, desc, price){
  const h = 92, ph = 64;
  return `
    ${rrect(PAD+10, y, CW-20, h, 14, t.chip)}
    ${rrect(PAD+20, y+14, ph, ph, 12, `url(#${gradId})`)}
    <text x="${PAD+20+ph/2}" y="${y+14+ph/2+9}" font-size="26" text-anchor="middle">${emoji}</text>
    <text x="${PAD+98}" y="${y+28}" font-family="${t.font}" font-size="15" font-weight="700" fill="${t.text}">${esc(name)}</text>
    <text x="${PAD+98}" y="${y+48}" font-family="${t.font}" font-size="11.5" fill="${t.sub}">${esc(desc)}</text>
    <text x="${PAD+98}" y="${y+64}" font-family="${t.font}" font-size="11.5" fill="${t.sub}">${esc('servido con guarnición')}</text>
    ${rrect(W-PAD-74, y+h-30, 56, 22, 11, t.accent)}
    <text x="${W-PAD-46}" y="${y+h-15}" font-family="${t.font}" font-size="12.5" font-weight="700" fill="${t.screen}" text-anchor="middle">${esc(price)}</text>
  `;
}

function expanded(t, y, label){
  // contenedor con header resaltado + 2 items
  const headH = 50;
  const bodyTop = y + headH + 6;
  const itemsH = 92*2 + 12;
  const totalH = headH + 6 + itemsH + 12;
  return {
    h: totalH,
    svg: `
      ${rrect(PAD, y, CW, totalH, 18, t.card, t.cardBorder)}
      ${rrect(PAD, y, CW, headH, 18, t.accent)}
      <rect x="${PAD}" y="${y+headH-18}" width="${CW}" height="18" fill="${t.accent}"/>
      <text x="${PAD+18}" y="${y+headH/2+5}" font-family="${t.font}" font-size="16" font-weight="700" fill="${t.screen}">${esc(label)}</text>
      ${chevron(W-PAD-22, y+headH/2, t.screen, true)}
      ${item(t, bodyTop, 'ph1', '🥩', 'Bife de chorizo', '300g, punto a elección', '$18')}
      ${item(t, bodyTop+92+12, 'ph2', '🍝', 'Pasta de la casa', 'salsa pomodoro y albahaca', '$14')}
    `
  };
}

function buildSVG(t){
  let y = 132;
  const e = expanded(t, y + 54 + 12, 'Platos fuertes');
  // composición
  const blocks = [];
  blocks.push(collapsed(t, y, 'Entradas', '6 ítems')); // y=132
  blocks.push(e.svg);                                    // expandido
  const afterExp = (y + 54 + 12) + e.h + 12;
  blocks.push(collapsed(t, afterExp, 'Bebidas', '12 ítems'));
  blocks.push(collapsed(t, afterExp + 66, 'Postres', '4 ítems'));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/>
    </linearGradient>
    <linearGradient id="ph1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.photo[0]}"/><stop offset="1" stop-color="${t.photo[1]}"/>
    </linearGradient>
    <linearGradient id="ph2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.photo[1]}"/><stop offset="1" stop-color="${t.photo[0]}"/>
    </linearGradient>
    <clipPath id="screen"><rect x="0" y="0" width="${W}" height="${H}" rx="40"/></clipPath>
  </defs>

  <g clip-path="url(#screen)">
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#bg)"/>

    <!-- notch -->
    <rect x="${W/2-50}" y="14" width="100" height="22" rx="11" fill="${t.screen}" opacity="0.5"/>

    <!-- header / brand -->
    <text x="${W/2}" y="78" font-family="${t.font}" font-size="26" font-weight="800" fill="${t.header}" text-anchor="middle" letter-spacing="1">${esc(t.brand)}</text>
    <text x="${W/2}" y="100" font-family="${t.font}" font-size="12.5" fill="${t.sub}" text-anchor="middle" letter-spacing="2">${esc(t.tagline.toUpperCase())}</text>
    <line x1="${W/2-30}" y1="112" x2="${W/2+30}" y2="112" stroke="${t.accent}" stroke-width="2"/>

    ${blocks.join('\n')}

    <!-- footer QR hint -->
    ${rrect(PAD, H-74, CW, 50, 16, t.card, t.cardBorder)}
    ${rrect(PAD+12, H-66, 34, 34, 7, t.title)}
    <text x="${PAD+58}" y="${H-46}" font-family="${t.font}" font-size="12.5" font-weight="700" fill="${t.title}">Menú digital · ${esc(t.name)}</text>
    <text x="${PAD+58}" y="${H-31}" font-family="${t.font}" font-size="11" fill="${t.sub}">escanea el QR para verlo en tu mesa</text>
  </g>
  <!-- marco -->
  <rect x="1" y="1" width="${W-2}" height="${H-2}" rx="39" fill="none" stroke="#000" stroke-width="2" opacity="0.25"/>
</svg>`;
}

THEMES.forEach(t => {
  const svg = buildSVG(t);
  fs.writeFileSync(`/home/user/Loopapp/mockups/menu-${t.file}.svg`, svg);
  console.log('✅', `menu-${t.file}.svg`);
});
console.log('Listo: 6 mockups generados');
