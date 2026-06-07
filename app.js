/* ============================================================
   Loopapp — Todo lo que se repite, a la vista
   PWA sin dependencias. Estado en localStorage.
   ============================================================ */
const STORE_KEY = 'loopapp.loops.v1';

/* ---------- Iconos SVG monocromáticos ---------- */
const ICON = {
  menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  repeat: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
  bars: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  checksq: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  rotate: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  'chevron-left': '<polyline points="15 18 9 12 15 6"/>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'credit-card': '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'shopping-bag': '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  dumbbell: '<path d="M6 7v10"/><path d="M18 7v10"/><line x1="6" y1="12" x2="18" y2="12"/><path d="M3 9v6"/><path d="M21 9v6"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  car: '<path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M5 17H3v-5l2-5h9l4 5h2a1 1 0 0 1 1 1v4h-2"/><line x1="9" y1="17" x2="15" y2="17"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  pill: '<path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><path d="M21 15V2a5 4 0 0 0-3 4v6c0 1.1.9 2 2 2h1z"/><line x1="21" y1="15" x2="21" y2="22"/>',
  plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 5.3 3.5c.4.3.8.2 1.3 0l.5-.3c.4-.2.6-.6.5-1z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
};
function svg(name) { const i = ICON[name]; return i == null ? '' :
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i}</svg>`; }
function renderIcon(name) { return ICON[name] ? svg(name) : `<span class="emoji-ico">${escapeHtml(String(name || ''))}</span>`; }

/* ---------- Categorías / recurrencia / estados ---------- */
const CATEGORIES = {
  subs:     { label: 'Suscripciones', icon: 'credit-card' },
  money:    { label: 'Alquiler / Servicios', icon: 'wallet' },
  routine:  { label: 'Rutinas', icon: 'repeat' },
  home:     { label: 'Hogar', icon: 'home' },
  shopping: { label: 'Compras', icon: 'shopping-bag' },
};
const RECURRENCE = {
  none:    { label: 'Sin repetir', perMonth: 0 },
  weekly:  { label: 'Semanal',     perMonth: 4.3333 },
  monthly: { label: 'Mensual',     perMonth: 1 },
  yearly:  { label: 'Anual',       perMonth: 1 / 12 },
};
const STATES = {
  overdue:  { label: 'Vencido',  color: '#b3392b', order: 0 },
  urgent:   { label: 'Urgente',  color: '#c2722f', order: 1 },
  upcoming: { label: 'Próximo',  color: '#b0902f', order: 2 },
  ok:       { label: 'Al día',   color: '#5f8a55', order: 3 },
  neutral:  { label: 'Pendiente',color: '#5e7f9c', order: 4 },
};
const ICONS = ['credit-card','tv','music','cloud','smartphone','globe','zap','droplet','flame','home','car','shield','dumbbell','pill','leaf','heart','book','gift','utensils','plane','trash','wallet'];

/* ---------- Estado de la app ---------- */
let loops = load();
let activeSection = 'inicio';
let payFilter = 'all';   // all | manual | auto
let searchQuery = '';
let calOffset = 0;

/* ---------- Persistencia ---------- */
function load() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return seed();
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(loops)); scheduleSync(); }

function seed() {
  const d = offsetDate;
  return [
    { id: uid(), title: 'Netflix',     category: 'subs',    icon: 'tv',       amount: 15.99, autoPay: true,  recurrence: 'monthly', nextDate: d(3),  notifyDaysBefore: 5, history: [] },
    { id: uid(), title: 'Spotify',     category: 'subs',    icon: 'music',    amount: 11.99, autoPay: true,  recurrence: 'monthly', nextDate: d(12), notifyDaysBefore: 5, history: [] },
    { id: uid(), title: 'iCloud+',     category: 'subs',    icon: 'cloud',    amount: 2.99,  autoPay: true,  recurrence: 'monthly', nextDate: d(-1), notifyDaysBefore: 3, history: [] },
    { id: uid(), title: 'Dominio web', category: 'subs',    icon: 'globe',    amount: 12,    autoPay: false, recurrence: 'yearly',  nextDate: d(40), notifyDaysBefore: 14, history: [] },
    { id: uid(), title: 'Alquiler',    category: 'money',   icon: 'home',     amount: 800,   autoPay: false, recurrence: 'monthly', nextDate: d(8),  notifyDaysBefore: 5, history: [] },
    { id: uid(), title: 'Internet',    category: 'money',   icon: 'globe',    amount: 45,    autoPay: false, recurrence: 'monthly', nextDate: d(1),  notifyDaysBefore: 3, history: [] },
    { id: uid(), title: 'Seguro auto', category: 'money',   icon: 'shield',   amount: 90,    autoPay: false, recurrence: 'monthly', nextDate: d(-2), notifyDaysBefore: 4, history: [] },
    { id: uid(), title: 'Gimnasio',    category: 'routine', icon: 'dumbbell', amount: 30,    autoPay: true,  recurrence: 'monthly', nextDate: d(6),  notifyDaysBefore: 3, history: [] },
    { id: uid(), title: 'Regar plantas', category: 'home',  icon: 'leaf',     amount: null,  autoPay: false, recurrence: 'weekly',  nextDate: d(2),  notifyDaysBefore: 1, history: [] },
    { id: uid(), title: 'Cambiar filtro A/C', category: 'home', icon: 'trash', amount: null, autoPay: false, recurrence: 'yearly', nextDate: d(60), notifyDaysBefore: 14, history: [] },
    { id: uid(), title: 'Comprar regalo', category: 'shopping', icon: 'gift', amount: null,  autoPay: false, recurrence: 'none',    nextDate: d(5),  notifyDaysBefore: 2, history: [] },
  ];
}

/* ---------- Utilidades de fecha / estado ---------- */
function uid() { return Math.random().toString(36).slice(2, 10); }
function todayMid() { const t = new Date(); t.setHours(0,0,0,0); return t; }
function parseDate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); }
function fmtDate(dt) { return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`; }
function offsetDate(days) { const t = todayMid(); t.setDate(t.getDate() + days); return fmtDate(t); }
function daysUntil(s) { return Math.round((parseDate(s) - todayMid()) / 86400000); }

function statusOf(loop) {
  const dl = daysUntil(loop.nextDate);
  const notify = loop.notifyDaysBefore ?? 3;
  if (dl < 0) return 'overdue';
  if (dl <= 1) return 'urgent';
  if (dl <= notify) return 'upcoming';
  if (loop.category === 'shopping' && loop.recurrence === 'none') return 'neutral';
  return 'ok';
}
function payType(loop) { return !loop.amount ? 'task' : (loop.autoPay ? 'auto' : 'manual'); }

function cycleDays(loop) {
  switch (loop.recurrence) {
    case 'weekly': return 7; case 'monthly': return 30.44; case 'yearly': return 365;
    default: return Math.max((loop.notifyDaysBefore || 3) * 2, 14);
  }
}
function cdParts(loop) {
  const DAY = 86400000, pad = n => String(n).padStart(2,'0');
  const rem = parseDate(loop.nextDate).getTime() + DAY - Date.now();
  if (rem <= 0) { const od = Math.abs(daysUntil(loop.nextDate)); return { big: String(od), cl: `día${od===1?'':'s'} vencido` }; }
  const days = Math.floor(rem/DAY), hh = Math.floor((rem%DAY)/3600000), mm = Math.floor((rem%3600000)/60000), ss = Math.floor((rem%60000)/1000);
  if (days === 0) return { big: `${pad(hh)}:${pad(mm)}`, cl: 'vence hoy' };
  if (days === 1) return { big: '1 d', cl: 'para mañana' };
  return { big: `${days} d`, cl: 'restantes' };
}
function nextCycle(dateStr, recurrence) {
  const d = parseDate(dateStr), today = todayMid();
  do {
    if (recurrence === 'weekly') d.setDate(d.getDate()+7);
    else if (recurrence === 'monthly') d.setMonth(d.getMonth()+1);
    else if (recurrence === 'yearly') d.setFullYear(d.getFullYear()+1);
    else return null;
  } while (d <= today);
  return fmtDate(d);
}
function occursOn(loop, date) {
  const a = parseDate(loop.nextDate);
  switch (loop.recurrence) {
    case 'weekly': return date.getDay() === a.getDay();
    case 'monthly': return date.getDate() === a.getDate();
    case 'yearly': return date.getMonth() === a.getMonth() && date.getDate() === a.getDate();
    default: return fmtDate(date) === loop.nextDate;
  }
}
function monthlyCost(loop) { return !loop.amount ? 0 : loop.amount * (RECURRENCE[loop.recurrence]?.perMonth || 0); }
function money(n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function money0(n) { return '$' + Math.round(Number(n)).toLocaleString('en-US'); }

/* ---------- Acciones ---------- */
function markDone(id) {
  const loop = loops.find(l => l.id === id); if (!loop) return;
  const next = nextCycle(loop.nextDate, loop.recurrence);
  loop.history = loop.history || []; loop.history.push(loop.nextDate);
  if (next) loop.nextDate = next; else loops = loops.filter(l => l.id !== id);
  save(); render();
}
function upsertLoop(data) {
  if (data.id) { const i = loops.findIndex(l => l.id === data.id); if (i >= 0) loops[i] = { ...loops[i], ...data }; }
  else loops.push({ ...data, id: uid(), history: [] });
  save(); render();
}
function deleteLoop(id) { loops = loops.filter(l => l.id !== id); save(); render(); }

/* ============================================================
   Navegación
   ============================================================ */
const SECTIONS = [
  { key: 'inicio',    icon: 'grid',     label: 'Inicio' },
  { key: 'calendario',icon: 'calendar', label: 'Calendario' },
  { key: 'finanzas',  icon: 'wallet',   label: 'Finanzas' },
  { key: 'stats',     icon: 'bars',     label: 'Estadísticas' },
  { key: 'historial', icon: 'checksq',  label: 'Historial de pagos' },
];
function renderNav() {
  const nav = document.getElementById('nav');
  let html = SECTIONS.map(s =>
    `<a data-sec="${s.key}" class="${activeSection===s.key?'act':''}">${svg(s.icon)} ${s.label}</a>`).join('');
  html += `<div class="sep"></div><small>Ajustes</small>
    <a data-sec="ajustes" class="${activeSection==='ajustes'?'act':''}">${svg('sliders')} Datos y opciones</a>`;
  nav.innerHTML = html;
  nav.querySelectorAll('a[data-sec]').forEach(a => a.onclick = () => { activeSection = a.dataset.sec; closeDrawer(); render(); });
}
const drawer = () => document.getElementById('drawer');
function openDrawer() { renderNav(); document.getElementById('scrim').hidden = false; drawer().classList.add('open'); }
function closeDrawer() { document.getElementById('scrim').hidden = true; drawer().classList.remove('open'); }

/* ============================================================
   Render principal
   ============================================================ */
function render() {
  renderGreeting();
  const v = document.getElementById('view');
  if (activeSection === 'inicio') return renderInicio(v);
  if (activeSection === 'calendario') return renderCalendario(v);
  if (activeSection === 'finanzas') return renderFinanzas(v);
  if (activeSection === 'stats') return renderStats(v);
  if (activeSection === 'historial') return renderHistorial(v);
  if (activeSection === 'ajustes') return renderAjustes(v);
}
function renderGreeting() {
  const overdue = loops.filter(l => statusOf(l) === 'overdue').length;
  const urgent = loops.filter(l => ['urgent','upcoming'].includes(statusOf(l))).length;
  const n = overdue + urgent;
  const el = document.getElementById('greeting');
  el.textContent = n > 0 ? `${n} cosa${n>1?'s':''} necesita${n>1?'n':''} tu atención` : 'Todo bajo control ✓';
}

/* ---------- INICIO ---------- */
function visibleLoops() {
  let list = loops.slice();
  if (payFilter === 'manual') list = list.filter(l => payType(l) !== 'auto');
  else if (payFilter === 'auto') list = list.filter(l => payType(l) === 'auto');
  if (searchQuery) list = list.filter(l => l.title.toLowerCase().includes(searchQuery));
  return list.sort((a,b) => {
    const sa = STATES[statusOf(a)].order, sb = STATES[statusOf(b)].order;
    if (sa !== sb) return sa - sb;
    return daysUntil(a.nextDate) - daysUntil(b.nextDate);
  });
}
function renderInicio(v) {
  const overdue = loops.filter(l => statusOf(l)==='overdue').length;
  const urgent = loops.filter(l => statusOf(l)==='urgent').length;
  const monthly = loops.reduce((s,l) => s + monthlyCost(l), 0);
  const manuales = loops.filter(l => payType(l) !== 'auto').length;
  const seg = (k,t) => `<button class="${payFilter===k?'on':''}" data-pay="${k}">${t}</button>`;

  v.innerHTML = `
    <div class="sum">
      ${overdue ? `<span class="red">● ${overdue} vencido${overdue>1?'s':''}</span>` : ''}
      ${urgent ? `<span>● ${urgent} urgente${urgent>1?'s':''}</span>` : ''}
      <span><b>${money0(monthly)}</b> / mes</span>
      <span><b>${manuales}</b> manuales</span>
    </div>
    <div class="seg">${seg('all','Todos')}${seg('manual','Manuales')}${seg('auto','Automáticos')}</div>
    <input id="search" class="search-input" type="search" placeholder="Buscar Loop…" autocomplete="off" value="${escapeAttr(searchQuery)}" />
    <div class="list" id="list"></div>`;

  v.querySelectorAll('.seg button').forEach(b => b.onclick = () => { payFilter = b.dataset.pay; render(); });
  const s = v.querySelector('#search');
  s.oninput = (e) => { searchQuery = e.target.value.trim().toLowerCase(); renderList(); };
  renderList();
}
function renderList() {
  const cont = document.getElementById('list'); if (!cont) return;
  const list = visibleLoops();
  if (!list.length) {
    cont.innerHTML = `<div class="empty"><div class="em">${svg(searchQuery?'star':'repeat')}</div>
      <h3>${searchQuery ? 'Sin resultados' : 'Nada por aquí'}</h3>
      <p>${searchQuery ? 'Ningún Loop coincide.' : 'Toca “Nuevo” para agregar tu primer Loop.'}</p></div>`;
    return;
  }
  cont.innerHTML = list.map(rowHTML).join('');
  cont.querySelectorAll('.row').forEach(r => {
    const id = r.dataset.id;
    r.onclick = (e) => { if (!e.target.closest('.chk')) openForm(loops.find(l => l.id === id)); };
    const chk = r.querySelector('.chk');
    if (chk) chk.onclick = () => markDone(id);
  });
}
function rowHTML(loop) {
  const st = STATES[statusOf(loop)];
  const cd = cdParts(loop);
  const cat = CATEGORIES[loop.category];
  const pt = payType(loop);
  const tag = pt === 'auto' ? '<span class="tag auto">Auto</span>' : pt === 'task' ? '<span class="tag task">Tarea</span>' : '<span class="tag manual">Manual</span>';
  const meta = `${tag} ${RECURRENCE[loop.recurrence].label}${loop.amount ? ' · ' + money(loop.amount) : ''}`;
  return `
    <div class="row" data-id="${loop.id}" style="--st:${st.color}">
      <span class="ic">${renderIcon(loop.icon || cat.icon)}</span>
      <div class="mid">
        <div class="t">${escapeHtml(loop.title)}</div>
        <div class="m">${meta}</div>
      </div>
      <div class="right">
        <div class="cd">${cd.big}</div>
        <div class="cl">${cd.cl}</div>
      </div>
      <button class="chk" title="Marcar ${loop.amount ? 'pagado' : 'hecho'}">${svg('check')}</button>
    </div>`;
}
function tickCountdowns() {
  document.querySelectorAll('#list .row').forEach(r => {
    const loop = loops.find(l => l.id === r.dataset.id); if (!loop) return;
    const cd = cdParts(loop);
    const num = r.querySelector('.cd'), lab = r.querySelector('.cl');
    if (num) num.textContent = cd.big; if (lab) lab.textContent = cd.cl;
    r.style.setProperty('--st', STATES[statusOf(loop)].color);
  });
}

/* ---------- CALENDARIO ---------- */
function renderCalendario(v) {
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthName = base.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const todayStr = fmtDate(todayMid());
  let cells = '';
  ['L','M','X','J','V','S','D'].forEach(d => cells += `<div class="cal-dow">${d}</div>`);
  for (let i = 0; i < firstDow; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let day = 1; day <= days; day++) {
    const date = new Date(year, month, day), ds = fmtDate(date);
    const items = loops.filter(l => occursOn(l, date));
    const dots = items.slice(0,5).map(l => `<span class="d" style="background:${STATES[statusOf(l)].color}" title="${escapeHtml(l.title)}"></span>`).join('');
    cells += `<div class="cal-cell ${ds===todayStr?'today':''}"><span class="dn">${day}</span><div class="cal-dots">${dots}</div></div>`;
  }
  v.innerHTML = `
    <div class="cal-head">
      <button class="iconbtn" id="cprev" aria-label="Anterior">${svg('chevron-left')}</button>
      <h3>${monthName}</h3>
      <button class="iconbtn" id="cnext" aria-label="Siguiente">${svg('chevron-right')}</button>
    </div>
    <div class="cal-grid">${cells}</div>`;
  v.querySelector('#cprev').onclick = () => { calOffset--; render(); };
  v.querySelector('#cnext').onclick = () => { calOffset++; render(); };
}

/* ---------- FINANZAS ---------- */
function renderFinanzas(v) {
  const withAmt = loops.filter(l => l.amount);
  const monthly = withAmt.reduce((s,l) => s + monthlyCost(l), 0);
  const autoM = withAmt.filter(l => l.autoPay).reduce((s,l) => s + monthlyCost(l), 0);
  const manM = monthly - autoM;
  const byCat = {};
  withAmt.forEach(l => { byCat[l.category] = (byCat[l.category] || 0) + monthlyCost(l); });
  const maxCat = Math.max(1, ...Object.values(byCat));
  const catRows = Object.entries(byCat).sort((a,b) => b[1]-a[1]).map(([k,val]) => `
    <div class="brk-row">
      <span class="bn">${svg(CATEGORIES[k].icon)} ${CATEGORIES[k].label}</span>
      <span class="bv">${money0(val)}</span>
    </div>
    <div class="bar"><i style="width:${Math.round(val/maxCat*100)}%"></i></div>`).join('');
  const pctAuto = monthly ? Math.round(autoM/monthly*100) : 0;
  v.innerHTML = `
    <div class="sec-title">Finanzas</div>
    <div class="hero">
      <div class="big">${money0(monthly)}</div>
      <div class="lbl">gasto recurrente al mes</div>
      <div class="split">
        <div><span class="n">${money0(monthly*12)}</span><span class="t">al año</span></div>
        <div><span class="n">${withAmt.length}</span><span class="t">con monto</span></div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="n">${money0(autoM)}</div><div class="t">Automático (${pctAuto}%)</div></div>
      <div class="stat"><div class="n">${money0(manM)}</div><div class="t">Manual (${100-pctAuto}%)</div></div>
    </div>
    <div class="brk"><h4>Por categoría / mes</h4>${catRows || '<p class="sub" style="padding:0">Sin montos aún.</p>'}</div>`;
}

/* ---------- ESTADÍSTICAS ---------- */
function renderStats(v) {
  const counts = { overdue:0, urgent:0, upcoming:0, ok:0, neutral:0 };
  loops.forEach(l => counts[statusOf(l)]++);
  const total = loops.length;
  const alDia = counts.ok + counts.neutral;
  const pctOk = total ? Math.round(alDia/total*100) : 0;
  const pendientes = counts.overdue + counts.urgent + counts.upcoming;
  const pagados = loops.reduce((s,l) => s + (l.history ? l.history.length : 0), 0);
  const manualesPend = loops.filter(l => payType(l)!=='auto' && ['overdue','urgent','upcoming'].includes(statusOf(l))).length;
  v.innerHTML = `
    <div class="sec-title">Estadísticas</div>
    <div class="stat-grid">
      <div class="stat"><div class="n" style="color:var(--ok)">${pctOk}%</div><div class="t">al día</div></div>
      <div class="stat"><div class="n" style="color:var(--overdue)">${counts.overdue}</div><div class="t">vencidos</div></div>
      <div class="stat"><div class="n">${pendientes}</div><div class="t">pendientes</div></div>
      <div class="stat"><div class="n">${manualesPend}</div><div class="t">manuales por pagar</div></div>
      <div class="stat"><div class="n">${pagados}</div><div class="t">pagos registrados</div></div>
      <div class="stat"><div class="n">${total}</div><div class="t">loops activos</div></div>
    </div>
    <div class="brk"><h4>Por estado</h4>
      ${['overdue','urgent','upcoming','ok'].map(k => `
        <div class="brk-row"><span class="bn"><span style="width:10px;height:10px;border-radius:50%;background:${STATES[k].color};display:inline-block"></span> ${STATES[k].label}</span><span class="bv">${counts[k]}</span></div>`).join('')}
    </div>`;
}

/* ---------- HISTORIAL ---------- */
function renderHistorial(v) {
  const items = [];
  loops.forEach(l => (l.history || []).forEach(date => items.push({ title: l.title, icon: l.icon, amount: l.amount, date })));
  items.sort((a,b) => b.date.localeCompare(a.date));
  if (!items.length) {
    v.innerHTML = `<div class="sec-title">Historial de pagos</div>
      <div class="empty"><div class="em">${svg('checksq')}</div><h3>Aún sin registros</h3>
      <p>Cuando marques algo como pagado/hecho, aparecerá aquí.</p></div>`;
    return;
  }
  const rows = items.map(it => `
    <div class="row" style="--st:var(--ok)">
      <span class="ic">${renderIcon(it.icon || 'check')}</span>
      <div class="mid"><div class="t">${escapeHtml(it.title)}</div><div class="m">${fmtNice(it.date)}</div></div>
      <div class="right">${it.amount ? `<div class="amt">${money(it.amount)}</div>` : svg('check')}</div>
    </div>`).join('');
  v.innerHTML = `<div class="sec-title">Historial de pagos</div><div class="sub">${items.length} registro${items.length>1?'s':''}</div><div class="list">${rows}</div>`;
}
function fmtNice(ds) { try { return parseDate(ds).toLocaleDateString('es', { day:'numeric', month:'long', year:'numeric' }); } catch(e){ return ds; } }

/* ---------- AJUSTES ---------- */
function renderAjustes(v) {
  v.innerHTML = `
    <div class="sec-title">Datos y opciones</div>
    <div style="height:8px"></div>
    <button class="opt" id="o-notify">${svg('bell')} Activar avisos</button>
    <button class="opt" id="o-install" hidden>${svg('smartphone')} Instalar app</button>
    <button class="opt" id="o-export">${svg('download')} Exportar datos</button>
    <button class="opt" id="o-import">${svg('upload')} Importar datos</button>
    <button class="opt" id="o-about">${svg('info')} Acerca de Loopapp</button>
    <button class="opt danger" id="o-reset">${svg('rotate')} Restablecer datos de ejemplo</button>`;
  v.querySelector('#o-notify').onclick = setupPush;
  v.querySelector('#o-export').onclick = exportData;
  v.querySelector('#o-import').onclick = () => document.getElementById('import-file').click();
  v.querySelector('#o-about').onclick = () => alert('Loopapp — Todo lo que se repite, a la vista.\n\nSuscripciones, pagos, rutinas y recados con cuenta regresiva, prioridad y avisos.\nTus datos se guardan en este dispositivo.');
  v.querySelector('#o-reset').onclick = () => { if (confirm('¿Restablecer datos de ejemplo? (borra tus Loops actuales)')) { loops = seed(); save(); render(); } };
  const ib = v.querySelector('#o-install'); if (deferredPrompt) ib.hidden = false;
  ib.onclick = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; ib.hidden = true; };
}

/* ============================================================
   Formulario (modal)
   ============================================================ */
function openForm(loop) {
  const isEdit = !!loop;
  const data = loop || { title:'', category:'subs', icon:'credit-card', amount:'', autoPay:false, recurrence:'monthly', nextDate: offsetDate(7), notifyDaysBefore: 3 };
  const overlay = document.getElementById('modal-overlay'), modal = document.getElementById('modal');
  modal.innerHTML = `
    <h2>${isEdit ? 'Editar Loop' : 'Nuevo Loop'}</h2>
    <p class="modal-sub">Todo lo que se repite: una fecha, una prioridad, una cuenta regresiva.</p>
    <div class="field"><label>Categoría</label><div class="cat-picker" id="cat-picker">
      ${Object.entries(CATEGORIES).map(([k,c]) => `<button data-cat="${k}" class="${data.category===k?'sel':''}">${svg(c.icon)} ${c.label}</button>`).join('')}
    </div></div>
    <div class="field"><label>Nombre</label><input id="f-title" placeholder="Ej. Netflix, Alquiler, Regar plantas" value="${escapeAttr(data.title)}" /></div>
    <div class="field"><label>Icono</label><div class="icon-picker" id="icon-picker">
      ${ICONS.map(i => `<button data-icon="${i}" class="${data.icon===i?'sel':''}" title="${i}">${svg(i)}</button>`).join('')}
    </div></div>
    <div class="field-row">
      <div class="field"><label>Monto (opcional)</label><input id="f-amount" type="number" step="0.01" min="0" placeholder="0.00" value="${data.amount ?? ''}" /></div>
      <div class="field"><label>Repetición</label><select id="f-recurrence">
        ${Object.entries(RECURRENCE).map(([k,r]) => `<option value="${k}" ${data.recurrence===k?'selected':''}>${r.label}</option>`).join('')}
      </select></div>
    </div>
    <div class="field"><div class="toggle-row">
      <div><div class="tl">Pago automático</div><div class="ts">Se cobra solo; no tienes que pagarlo a mano.</div></div>
      <button type="button" class="switch ${data.autoPay?'on':''}" id="f-auto" aria-label="Pago automático"></button>
    </div></div>
    <div class="field-row">
      <div class="field"><label>Próxima fecha</label><input id="f-date" type="date" value="${data.nextDate}" /></div>
      <div class="field"><label>Avisar (días antes)</label><input id="f-notify" type="number" min="0" max="60" value="${data.notifyDaysBefore ?? 3}" /></div>
    </div>
    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="f-delete">Eliminar</button>` : ''}
      <button class="btn btn-ghost" id="f-cancel">Cancelar</button>
      <button class="btn btn-primary" id="f-save">${isEdit ? 'Guardar' : 'Agregar'}</button>
    </div>`;
  overlay.hidden = false;
  let sel = { category: data.category, icon: data.icon, autoPay: !!data.autoPay };
  modal.querySelectorAll('#cat-picker button').forEach(b => b.onclick = () => {
    sel.category = b.dataset.cat; modal.querySelectorAll('#cat-picker button').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); });
  modal.querySelectorAll('#icon-picker button').forEach(b => b.onclick = () => {
    sel.icon = b.dataset.icon; modal.querySelectorAll('#icon-picker button').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); });
  const sw = modal.querySelector('#f-auto');
  sw.onclick = () => { sel.autoPay = !sel.autoPay; sw.classList.toggle('on', sel.autoPay); };
  const close = () => { overlay.hidden = true; };
  modal.querySelector('#f-cancel').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  if (isEdit) modal.querySelector('#f-delete').onclick = () => { if (confirm(`¿Eliminar "${data.title}"?`)) { deleteLoop(data.id); close(); } };
  modal.querySelector('#f-save').onclick = () => {
    const title = modal.querySelector('#f-title').value.trim();
    if (!title) { modal.querySelector('#f-title').focus(); return; }
    const amountRaw = modal.querySelector('#f-amount').value;
    upsertLoop({
      id: isEdit ? data.id : undefined, title, category: sel.category, icon: sel.icon,
      amount: amountRaw === '' ? null : parseFloat(amountRaw), autoPay: sel.autoPay,
      recurrence: modal.querySelector('#f-recurrence').value, nextDate: modal.querySelector('#f-date').value,
      notifyDaysBefore: parseInt(modal.querySelector('#f-notify').value, 10) || 0,
    });
    close();
  };
}

/* ---------- Helpers HTML-safe ---------- */
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function escapeAttr(s) { return escapeHtml(s); }

/* ============================================================
   Eventos globales
   ============================================================ */
document.getElementById('add-btn').onclick = () => openForm(null);
document.getElementById('menu-toggle').onclick = openDrawer;
document.getElementById('scrim').onclick = closeDrawer;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); } });

/* Importar respaldo */
const importFile = document.getElementById('import-file');
importFile.onchange = (e) => {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const raw = JSON.parse(r.result);
      if (!Array.isArray(raw)) throw new Error('formato');
      if (!confirm(`Importar ${raw.length} Loop${raw.length===1?'':'s'}? Esto reemplazará los actuales.`)) return;
      loops = raw.map(l => ({
        id: l.id || uid(), title: String(l.title || 'Sin nombre'),
        category: CATEGORIES[l.category] ? l.category : 'routine', icon: l.icon || 'repeat',
        amount: (l.amount === 0 || l.amount) ? Number(l.amount) : null, autoPay: !!l.autoPay,
        recurrence: RECURRENCE[l.recurrence] ? l.recurrence : 'none',
        nextDate: /^\d{4}-\d{2}-\d{2}$/.test(l.nextDate) ? l.nextDate : offsetDate(7),
        notifyDaysBefore: Number.isFinite(+l.notifyDaysBefore) ? +l.notifyDaysBefore : 3,
        history: Array.isArray(l.history) ? l.history : [],
      }));
      save(); render();
    } catch (err) { alert('Archivo no válido. Debe ser un respaldo .json de Loopapp.'); }
    finally { importFile.value = ''; }
  };
  r.readAsText(file);
};
function exportData() {
  const blob = new Blob([JSON.stringify(loops, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `loopapp-backup-${fmtDate(todayMid())}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ============================================================
   Avisos: push real (app cerrada) + notificación local
   ============================================================ */
const NOTIFY_SENT_KEY = 'loopapp.notify.sent.v1', PUSH_ENABLED_KEY = 'loopapp.push.enabled', DEVICE_KEY = 'loopapp.device.id';
const SB = window.LOOPAPP_SUPABASE || {};
const VAPID_PUBLIC = (window.LOOPAPP_PUSH && window.LOOPAPP_PUSH.vapidPublic) || '';
function notifyEnabled() { return 'Notification' in window && Notification.permission === 'granted'; }
function pushEnabled() { return localStorage.getItem(PUSH_ENABLED_KEY) === '1'; }
function deviceId() { let id = localStorage.getItem(DEVICE_KEY); if (!id) { id = 'dev_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); localStorage.setItem(DEVICE_KEY, id); } return id; }
function urlB64(s) { const pad = '='.repeat((4 - s.length % 4) % 4); const b = (s+pad).replace(/-/g,'+').replace(/_/g,'/'); const raw = atob(b); const a = new Uint8Array(raw.length); for (let i=0;i<raw.length;i++) a[i]=raw.charCodeAt(i); return a; }
function sbHeaders() { return { 'Content-Type':'application/json', apikey: SB.anonKey, Authorization: `Bearer ${SB.anonKey}` }; }
let syncTimer;
function scheduleSync() { if (!pushEnabled()) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncReminders, 1500); }
async function syncReminders() {
  if (!pushEnabled() || !SB.url) return;
  const reminders = loops.map(l => ({ loop_id: l.id, title: l.title, next_date: l.nextDate, notify_days: l.notifyDaysBefore ?? 3 }));
  try { await fetch(`${SB.url}/functions/v1/push-sync`, { method:'POST', headers: sbHeaders(), body: JSON.stringify({ device_id: deviceId(), reminders }) }); } catch (e) {}
}
async function setupPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) { alert('Tu navegador no soporta notificaciones push.'); return; }
  if (!VAPID_PUBLIC || !SB.url) { alert('Falta configurar el push en el servidor.'); return; }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { alert('No se activaron los avisos.'); return; }
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64(VAPID_PUBLIC) });
    const res = await fetch(`${SB.url}/functions/v1/push-subscribe`, { method:'POST', headers: sbHeaders(), body: JSON.stringify({ device_id: deviceId(), subscription: sub }) });
    if (!res.ok) throw new Error(await res.text());
    localStorage.setItem(PUSH_ENABLED_KEY, '1'); await syncReminders(); checkDue();
    alert('Avisos activados 🔔\nTe llegarán aunque cierres la app.');
  } catch (e) { alert('No se pudieron activar los avisos push.'); }
}
function checkDue() {
  if (!notifyEnabled()) return;
  let sent = {}; try { sent = JSON.parse(localStorage.getItem(NOTIFY_SENT_KEY)) || {}; } catch (e) {}
  const today = fmtDate(todayMid());
  loops.forEach(l => {
    const st = statusOf(l);
    if (['overdue','urgent','upcoming'].includes(st)) {
      const key = `${l.id}@${today}`;
      if (!sent[key]) { try { new Notification(`Loopapp · ${l.title}`, { body: st==='overdue'?'¡Vencido!':'Próximo a vencer.', icon: 'icon.svg', tag: l.id }); } catch(e){} sent[key] = true; }
    }
  });
  localStorage.setItem(NOTIFY_SENT_KEY, JSON.stringify(sent));
}

/* Instalar PWA */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });

/* Service worker */
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

/* ---------- Arranque ---------- */
// Inyecta los iconos SVG estáticos (☰ del header, + de Nuevo, logo del drawer)
document.querySelectorAll('[data-ico]').forEach(el => el.insertAdjacentHTML('afterbegin', svg(el.dataset.ico)));
render();
checkDue();
setInterval(() => { if (activeSection === 'inicio' && document.getElementById('modal-overlay').hidden) tickCountdowns(); }, 1000);
setInterval(() => { checkDue(); }, 60000);
