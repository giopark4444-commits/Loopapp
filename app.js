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
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
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
  landmark: '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>',
  bike: '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 17.5V14l-3-3 4-3 2 3h2"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.7 2.7-2.5-.5-.5-2.5 2.7-2.7z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
  forward: '<polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
};
function svg(name) { const i = ICON[name]; return i == null ? '' :
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i}</svg>`; }
function renderIcon(name) { return ICON[name] ? svg(name) : `<span class="emoji-ico">${escapeHtml(String(name || ''))}</span>`; }

/* ---------- Categorías / recurrencia / estados ---------- */
const BASE_CATEGORIES = {
  entertainment: { label: 'Entretenimiento', icon: 'tv' },
  subs:          { label: 'Suscripciones',    icon: 'credit-card' },
  services:      { label: 'Servicios',        icon: 'zap' },
  home:          { label: 'Hogar',            icon: 'home' },
  maintenance:   { label: 'Mantenimiento',    icon: 'wrench' },
  health:        { label: 'Salud',            icon: 'heart' },
  meds:          { label: 'Medicamentos',     icon: 'pill' },
  transport:     { label: 'Transporte',       icon: 'car' },
  credit:        { label: 'Créditos / Deudas',icon: 'landmark' },
  taxes:         { label: 'Impuestos',        icon: 'file' },
  business:      { label: 'Empresa / Trabajo',icon: 'briefcase' },
  shopping:      { label: 'Compras',          icon: 'shopping-bag' },
  routine:       { label: 'Rutinas / Tareas', icon: 'repeat' },
  other:         { label: 'Otros',            icon: 'star' },
};
const CAT_MIGRATE = { money: 'services', vehicle: 'transport' };
const USER_CATS_KEY = 'loopapp.cats';
let CATEGORIES = {};
function loadCategories() {
  CATEGORIES = {};
  Object.keys(BASE_CATEGORIES).filter(k => k !== 'other').forEach(k => CATEGORIES[k] = BASE_CATEGORIES[k]);
  getUserCats().forEach(c => { if (c.key && c.label) CATEGORIES[c.key] = { label: c.label, icon: ICON[c.icon] ? c.icon : 'star', custom: true }; });
  CATEGORIES.other = BASE_CATEGORIES.other;
}
function getUserCats() { try { return JSON.parse(localStorage.getItem(USER_CATS_KEY)) || []; } catch (e) { return []; } }
function setUserCats(a) { localStorage.setItem(USER_CATS_KEY, JSON.stringify(a)); loadCategories(); }
function addUserCat(label, icon) { const a = getUserCats(); a.push({ key: 'u_' + Date.now().toString(36), label: String(label).slice(0, 24), icon }); setUserCats(a); }
function removeUserCat(key) { loops.forEach(l => { if (l.category === key) l.category = 'other'; }); save(); setUserCats(getUserCats().filter(c => c.key !== key)); }
function editUserCat(key, label, icon) { setUserCats(getUserCats().map(c => c.key === key ? { ...c, label: String(label).slice(0, 24), icon } : c)); }
loadCategories();
function catOf(loop) { return CATEGORIES[loop.category] || CATEGORIES.other; }
const RECURRENCE = {
  none:      { label: 'Sin repetir',    perMonth: 0 },
  weekly:    { label: 'Semanal',        perMonth: 4.3333 },
  biweekly:  { label: 'Cada 2 semanas', perMonth: 2.1667 },
  monthly:   { label: 'Mensual',        perMonth: 1 },
  bimonthly: { label: 'Bimestral',      perMonth: 0.5 },
  quarterly: { label: 'Trimestral',     perMonth: 1 / 3 },
  biannual:  { label: 'Semestral',      perMonth: 1 / 6 },
  yearly:    { label: 'Anual',          perMonth: 1 / 12 },
};
// Avance de la fecha y duración del ciclo por recurrencia
const STEP_DAYS = { weekly: 7, biweekly: 14 };
const STEP_MONTHS = { monthly: 1, bimonthly: 2, quarterly: 3, biannual: 6, yearly: 12 };
const CYCLE_DAYS = { weekly: 7, biweekly: 14, monthly: 30.44, bimonthly: 60.88, quarterly: 91.31, biannual: 182.6, yearly: 365 };
const STATES = {
  overdue:  { label: 'Vencido',  color: '#b3392b', order: 0 },
  urgent:   { label: 'Urgente',  color: '#c2722f', order: 1 },
  upcoming: { label: 'Próximo',  color: '#b0902f', order: 2 },
  ok:       { label: 'Al día',   color: '#5f8a55', order: 3 },
  neutral:  { label: 'Pendiente',color: '#5e7f9c', order: 4 },
};
const ICONS = ['star','credit-card','landmark','wallet','tv','music','cloud','smartphone','globe','zap','droplet','flame','home','car','bike','shield','file','key','wrench','briefcase','dumbbell','pill','leaf','heart','book','gift','utensils','plane','trash'];

/* ---------- Estado de la app ---------- */
let loops = load();
let activeSection = pref('ui.section', 'inicio');
let payFilter = pref('ui.pay', 'all');   // all | manual | auto | free
let activeCategory = pref('ui.cat', 'all');
let searchQuery = '';
let calOffset = 0;
let weekOffset = 0;
let calView = pref('ui.calview', 'month');
let loopSort = pref('ui.sort', 'priority');
let selectedDay = null;

/* ---------- Persistencia ---------- */
function load() {
  let arr;
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) arr = JSON.parse(raw); } catch (e) {}
  if (!Array.isArray(arr)) return seed();
  arr.forEach(l => { if (CAT_MIGRATE[l.category]) l.category = CAT_MIGRATE[l.category]; if (!CATEGORIES[l.category]) l.category = 'other'; });
  return arr;
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(loops)); scheduleSync(); }

function seed() {
  const d = offsetDate;
  return [
    { id: uid(), title: 'Netflix',     category: 'entertainment', icon: 'tv',     amount: 15.99, autoPay: true,  recurrence: 'monthly', nextDate: d(3),  notifyDaysBefore: 5, history: [] },
    { id: uid(), title: 'Spotify',     category: 'entertainment', icon: 'music',  amount: 11.99, currency: 'EUR', autoPay: true, recurrence: 'monthly', nextDate: d(12), notifyDaysBefore: 5, history: [] },
    { id: uid(), title: 'iCloud+',     category: 'subs',      icon: 'cloud',    amount: 2.99,  autoPay: true,  recurrence: 'monthly', nextDate: d(-1), notifyDaysBefore: 3, history: [] },
    { id: uid(), title: 'Dominio web', category: 'business',  icon: 'globe',    amount: 12,    autoPay: false, recurrence: 'yearly',  nextDate: d(40), notifyDaysBefore: 14, history: [] },
    { id: uid(), title: 'Alquiler',    category: 'home',      icon: 'home',     amount: 800,   autoPay: false, recurrence: 'monthly', nextDate: d(8),  notifyDaysBefore: 5, notes: 'Transferencia al casero', history: [] },
    { id: uid(), title: 'Internet',    category: 'services',  icon: 'globe',    amount: 45,    autoPay: false, recurrence: 'monthly', nextDate: d(1),  notifyDaysBefore: 3, history: [] },
    { id: uid(), title: 'Seguro auto', category: 'transport', icon: 'shield',   amount: 90,    autoPay: false, recurrence: 'monthly', nextDate: d(-2), notifyDaysBefore: 4, history: [] },
    { id: uid(), title: 'Tarjeta Visa', category: 'credit',   icon: 'landmark', amount: 250,   autoPay: false, recurrence: 'monthly', nextDate: d(15), notifyDaysBefore: 5, history: [] },
    { id: uid(), title: 'Permiso de circulación', category: 'transport', icon: 'file', amount: 35, autoPay: false, recurrence: 'yearly', nextDate: d(75), notifyDaysBefore: 14, history: [] },
    { id: uid(), title: 'Gimnasio',    category: 'health',    icon: 'dumbbell', amount: 30,    autoPay: true,  recurrence: 'monthly', nextDate: d(6),  notifyDaysBefore: 3, notes: '3 veces por semana', history: [] },
    { id: uid(), title: 'Regar plantas', category: 'routine', icon: 'leaf',     amount: null,  autoPay: false, recurrence: 'weekly',  nextDate: d(2),  notifyDaysBefore: 1, history: [] },
    { id: uid(), title: 'Cambiar filtro A/C', category: 'maintenance', icon: 'wrench', amount: null, autoPay: false, recurrence: 'yearly', nextDate: d(60), notifyDaysBefore: 14, history: [] },
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
  const r = recurOf(loop);
  if (!r) return Math.max((loop.notifyDaysBefore || 3) * 2, 14);
  if (r.unit === 'day') return r.n;
  if (r.unit === 'week') return 7 * r.n;
  if (r.unit === 'month') return 30.44 * r.n;
  return 365 * r.n;
}
function cdParts(loop) {
  const DAY = 86400000, pad = n => String(n).padStart(2,'0');
  const rem = parseDate(loop.nextDate).getTime() + DAY - Date.now();
  if (rem <= 0) { const od = Math.abs(daysUntil(loop.nextDate)); return { big: String(od), cl: `día${od===1?'':'s'} vencido`, pct: 100 }; }
  const days = Math.floor(rem/DAY), hh = Math.floor((rem%DAY)/3600000), mm = Math.floor((rem%3600000)/60000);
  const pct = Math.max(6, Math.min(100, Math.round((1 - (rem/DAY) / cycleDays(loop)) * 100)));
  if (days === 0) return { big: `${pad(hh)}:${pad(mm)}`, cl: 'vence hoy', pct };
  if (days === 1) return { big: '1 d', cl: 'para mañana', pct };
  return { big: `${days} d`, cl: 'restantes', pct };
}
function nextCycle(loop) {
  const r = recurOf(loop); if (!r) return null;
  const d = parseDate(loop.nextDate), today = todayMid();
  do {
    if (r.unit === 'day') d.setDate(d.getDate() + r.n);
    else if (r.unit === 'week') d.setDate(d.getDate() + 7 * r.n);
    else if (r.unit === 'month') d.setMonth(d.getMonth() + r.n);
    else d.setFullYear(d.getFullYear() + r.n);
  } while (d <= today);
  return fmtDate(d);
}
function occursOn(loop, date) {
  const r = recurOf(loop), a = parseDate(loop.nextDate);
  if (!r) return fmtDate(date) === loop.nextDate;
  if (r.unit === 'day') { const diff = Math.round((date - a) / 86400000); return diff % r.n === 0; }
  if (r.unit === 'week') { const diff = Math.round((date - a) / 86400000); return diff % (7 * r.n) === 0; }
  if (date.getDate() !== a.getDate()) return false;
  const md = (date.getFullYear() - a.getFullYear()) * 12 + (date.getMonth() - a.getMonth());
  const stepM = r.unit === 'month' ? r.n : 12 * r.n;
  return md % stepM === 0;
}
/* ---------- Recurrencia flexible: { n, unit } ---------- */
const UNIT_LABEL = { day: ['día','días'], week: ['semana','semanas'], month: ['mes','meses'], year: ['año','años'] };
const LEGACY_RECUR = { daily:{n:1,unit:'day'}, weekly:{n:1,unit:'week'}, biweekly:{n:2,unit:'week'},
  monthly:{n:1,unit:'month'}, bimonthly:{n:2,unit:'month'}, quarterly:{n:3,unit:'month'}, biannual:{n:6,unit:'month'}, yearly:{n:1,unit:'year'} };
function recurOf(loop) {
  if (loop.recur && loop.recur.unit) {
    if (loop.recur.unit === 'none') return null;
    return { n: Math.max(1, parseInt(loop.recur.n, 10) || 1), unit: loop.recur.unit };
  }
  return LEGACY_RECUR[loop.recurrence] || null;
}
function recurLabel(loop) {
  const r = recurOf(loop);
  if (!r) return 'Sin repetir';
  const nice = { '1day':'Diario','1week':'Semanal','2week':'Quincenal','1month':'Mensual','2month':'Bimestral','3month':'Trimestral','6month':'Semestral','1year':'Anual' }[r.n + r.unit];
  if (nice) return nice;
  const lbl = UNIT_LABEL[r.unit];
  return 'Cada ' + r.n + ' ' + (r.n === 1 ? lbl[0] : lbl[1]);
}
function perMonthOf(loop) {
  const r = recurOf(loop); if (!r) return 0;
  if (r.unit === 'day') return 30.4375 / r.n;
  if (r.unit === 'week') return 4.34524 / r.n;
  if (r.unit === 'month') return 1 / r.n;
  return 1 / (12 * r.n); // year
}
function monthlyCost(loop) { return !loop.amount ? 0 : loop.amount * perMonthOf(loop); }

/* ---------- Preferencias (moneda, avisos, etc.) ---------- */
const CURRENCIES = { USD:'$', EUR:'€', GBP:'£', MXN:'$', COP:'$', ARS:'$', CLP:'$', BRL:'R$', PEN:'S/' };
function pref(k, def) { const v = localStorage.getItem('loopapp.' + k); return v === null ? def : v; }
function setPref(k, v) { localStorage.setItem('loopapp.' + k, v); }
function symOf(code) { return CURRENCIES[code] || CURRENCIES[pref('currency','USD')] || '$'; }
function money(n, code) { return symOf(code) + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function money0(n, code) { return symOf(code) + Math.round(Number(n)).toLocaleString('en-US'); }
function amtLabel(loop) { if (!loop.amount) return ''; const def = pref('currency','USD'); const code = loop.currency || def; const m = money(loop.amount, code); return code !== def ? m + ' ' + code : m; }

/* ---------- Temas ---------- */
const THEMES = [
  { key:'marfil',  label:'Marfil',  sw:'#c25c3c', bg:'#f6f4ef' },
  { key:'noche',   label:'Noche',   sw:'#d98a63', bg:'#1b1916' },
  { key:'menta',   label:'Menta',   sw:'#3f8f6f', bg:'#eef4ef' },
  { key:'lavanda', label:'Lavanda', sw:'#7c6bb0', bg:'#f2eff8' },
  { key:'oceano',  label:'Océano',  sw:'#3f74a8', bg:'#eef2f6' },
];
function applyTheme(name) {
  const t = THEMES.find(x => x.key === name) ? name : 'marfil';
  document.body.dataset.theme = t;
  setPref('theme', t);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = (THEMES.find(x => x.key === t) || {}).bg || '#f6f4ef';
}
const LAYOUTS = [{ key:'list', label:'Lista', icon:'list' }, { key:'comfy', label:'Cómodo', icon:'menu' }, { key:'cards', label:'Tarjetas', icon:'grid' }];
function applyLayout(name) {
  const l = LAYOUTS.find(x => x.key === name) ? name : 'list';
  document.body.dataset.layout = l;
  setPref('layout', l);
}

/* ---------- Color de celda del calendario (dividido si hay varias) ---------- */
function cellBg(colors) {
  if (colors.length === 1) return colors[0];
  const step = 100 / colors.length;
  const stops = colors.map((c, i) => `${c} ${(i*step).toFixed(2)}% ${((i+1)*step).toFixed(2)}%`).join(', ');
  return `linear-gradient(135deg, ${stops})`;
}

/* ---------- Acciones ---------- */
const DONE_KEY = 'loopapp.done';
function getDone() { try { return JSON.parse(localStorage.getItem(DONE_KEY)) || []; } catch (e) { return []; } }
function setDone(log) { localStorage.setItem(DONE_KEY, JSON.stringify(log)); }
function logDone(loop) {
  const log = getDone();
  log.push({ id: loop.id, title: loop.title, icon: loop.icon, amount: loop.amount, category: loop.category,
    recurrence: loop.recurrence, notifyDaysBefore: loop.notifyDaysBefore, autoPay: !!loop.autoPay, date: loop.nextDate, ts: Date.now() });
  setDone(log);
}
function markDone(id) {
  const loop = loops.find(l => l.id === id); if (!loop) return;
  logDone(loop);
  const next = nextCycle(loop);
  loop.history = loop.history || []; loop.history.push(loop.nextDate);
  if (next) loop.nextDate = next; else loops = loops.filter(l => l.id !== id);
  save(); render();
}
/* Restaurar un check (deshacer): regresa el Loop a su fecha original */
function restoreDone(ts) {
  const log = getDone(); const i = log.findIndex(e => e.ts === ts); if (i < 0) return;
  const e = log[i];
  const existing = loops.find(l => l.id === e.id);
  if (existing) {
    existing.nextDate = e.date; // recurrente: regresa la fecha
    if (existing.history) { const hi = existing.history.lastIndexOf(e.date); if (hi >= 0) existing.history.splice(hi, 1); }
  } else {
    loops.push({ id: e.id || uid(), title: e.title, icon: e.icon, amount: e.amount, category: CATEGORIES[e.category] ? e.category : 'routine',
      recurrence: RECURRENCE[e.recurrence] ? e.recurrence : 'none', nextDate: e.date, notifyDaysBefore: e.notifyDaysBefore ?? 3, autoPay: !!e.autoPay, history: [] });
  }
  log.splice(i, 1); setDone(log);
  save(); render();
}
function upsertLoop(data) {
  if (data.id) { const i = loops.findIndex(l => l.id === data.id); if (i >= 0) loops[i] = { ...loops[i], ...data }; }
  else loops.push({ ...data, id: uid(), history: [] });
  save(); render();
}
function deleteLoop(id) { loops = loops.filter(l => l.id !== id); save(); render(); }
function snoozeLoop(id) {
  const loop = loops.find(l => l.id === id); if (!loop) return;
  const next = nextCycle(loop);
  if (next) loop.nextDate = next;
  else { const d = parseDate(loop.nextDate); d.setDate(d.getDate() + 7); loop.nextDate = fmtDate(d); }
  save(); render();
}
function duplicateLoop(id) {
  const loop = loops.find(l => l.id === id); if (!loop) return;
  loops.push({ ...loop, id: uid(), title: loop.title + ' (copia)', history: [] });
  save(); render();
}
function shareLoop(loop) {
  const parts = [loop.title];
  if (loop.amount) parts.push(amtLabel(loop));
  parts.push(recurLabel(loop), 'Próx.: ' + loop.nextDate);
  if (loop.notes) parts.push(loop.notes);
  const text = 'Loopapp · ' + parts.join(' · ');
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else { try { navigator.clipboard.writeText(text); alert('Copiado:\n\n' + text); } catch (e) { alert(text); } }
}

/* ============================================================
   Navegación
   ============================================================ */
const SECTIONS = [
  { key: 'inicio',    icon: 'grid',     label: 'Inicio' },
  { key: 'loops',     icon: 'list',     label: 'Loops' },
  { key: 'calendario',icon: 'calendar', label: 'Calendario' },
  { key: 'finanzas',  icon: 'wallet',   label: 'Finanzas' },
  { key: 'stats',     icon: 'bars',     label: 'Estadísticas' },
  { key: 'historial', icon: 'checksq',  label: 'Completados' },
];
function renderNav() {
  const nav = document.getElementById('nav');
  let html = SECTIONS.map(s =>
    `<a data-sec="${s.key}" class="${activeSection===s.key?'act':''}">${svg(s.icon)} ${s.label}</a>`).join('');
  html += `<div class="sep"></div><small>Ajustes</small>
    <a data-sec="ajustes" class="${activeSection==='ajustes'?'act':''}">${svg('sliders')} Datos y opciones</a>`;
  nav.innerHTML = html;
  nav.querySelectorAll('a[data-sec]').forEach(a => a.onclick = () => { activeSection = a.dataset.sec; setPref('ui.section', activeSection); closeDrawer(); render(); });
}
const drawer = () => document.getElementById('drawer');
function openDrawer() { renderNav(); document.getElementById('scrim').hidden = false; drawer().classList.add('open'); }
function closeDrawer() { document.getElementById('scrim').hidden = true; drawer().classList.remove('open'); }

/* ============================================================
   Render principal
   ============================================================ */
function render() {
  renderGreeting();
  renderNav();
  const v = document.getElementById('view');
  if (activeSection === 'inicio') return renderInicio(v);
  if (activeSection === 'loops') return renderLoops(v);
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
  if (activeCategory !== 'all') list = list.filter(l => l.category === activeCategory);
  if (payFilter === 'manual') list = list.filter(l => payType(l) === 'manual');
  else if (payFilter === 'auto') list = list.filter(l => payType(l) === 'auto');
  else if (payFilter === 'free') list = list.filter(l => payType(l) === 'task');
  if (searchQuery) list = list.filter(l => l.title.toLowerCase().includes(searchQuery));
  return list.sort((a,b) => {
    const sa = STATES[statusOf(a)].order, sb = STATES[statusOf(b)].order;
    if (sa !== sb) return sa - sb;
    return daysUntil(a.nextDate) - daysUntil(b.nextDate);
  });
}
function renderInicio(v) {
  if (!loops.length) {
    v.innerHTML = `<div class="welcome">
      <div class="wc-logo">${svg('repeat')}</div>
      <h2>Bienvenido a Loopapp</h2>
      <p>Todo lo que se repite —pagos, suscripciones, rutinas, recados— en un solo lugar, con cuenta regresiva, prioridad y avisos.</p>
      <button class="btn btn-primary" id="wc-new">Crear mi primer Loop</button>
      <button class="wc-link" id="wc-seed">Ver con datos de ejemplo</button>
    </div>`;
    v.querySelector('#wc-new').onclick = () => openForm(null);
    v.querySelector('#wc-seed').onclick = () => { loops = seed(); save(); render(); };
    return;
  }
  const def = pref('currency','USD');
  const overdue = loops.filter(l => statusOf(l)==='overdue').length;
  const urgent = loops.filter(l => statusOf(l)==='urgent').length;
  const monthly = loops.filter(l => (l.currency||def)===def).reduce((s,l) => s + monthlyCost(l), 0);
  const manuales = loops.filter(l => payType(l) === 'manual').length;
  const seg = (k,t) => `<button class="${payFilter===k?'on':''}" data-pay="${k}">${t}</button>`;
  const curCat = activeCategory === 'all' ? { label:'Todas las categorías', icon:'list' } : (CATEGORIES[activeCategory] || { label:'Todas las categorías', icon:'list' });
  const catOpt = (key,label,icon) => `<button class="catopt ${activeCategory===key?'on':''}" data-cat="${key}">${svg(icon)} ${label}</button>`;
  let catMenu = catOpt('all','Todas las categorías','list');
  Object.keys(CATEGORIES).forEach(k => { catMenu += catOpt(k, CATEGORIES[k].label, CATEGORIES[k].icon); });

  v.innerHTML = `
    <div class="sum">
      ${overdue ? `<span class="red">● ${overdue} vencido${overdue>1?'s':''}</span>` : ''}
      ${urgent ? `<span>● ${urgent} urgente${urgent>1?'s':''}</span>` : ''}
      <span><b>${money0(monthly, def)}</b> / mes</span>
      <span><b>${manuales}</b> manuales</span>
    </div>
    <div class="catbar">
      <button class="catsel" id="catsel" aria-haspopup="true">${svg(curCat.icon)}<span>${curCat.label}</span>${svg('chevron-down')}</button>
      <div class="catmenu" id="catmenu" hidden>${catMenu}</div>
    </div>
    <div class="seg">${seg('all','Todos')}${seg('manual','Manuales')}${seg('auto','Automáticos')}${seg('free','Gratis')}</div>
    <input id="search" class="search-input" type="search" placeholder="Buscar Loop…" autocomplete="off" value="${escapeAttr(searchQuery)}" />
    <div class="list" id="list"></div>`;

  const catsel = v.querySelector('#catsel'), catmenu = v.querySelector('#catmenu');
  catsel.onclick = (e) => { e.stopPropagation(); catmenu.hidden = !catmenu.hidden; };
  catmenu.querySelectorAll('.catopt').forEach(b => b.onclick = () => { activeCategory = b.dataset.cat; setPref('ui.cat', activeCategory); render(); });
  v.querySelectorAll('.seg button').forEach(b => b.onclick = () => { payFilter = b.dataset.pay; setPref('ui.pay', payFilter); render(); });
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
  const cat = catOf(loop);
  const pt = payType(loop);
  const tag = pt === 'auto' ? '<span class="tag auto">Auto</span>' : pt === 'task' ? '<span class="tag task">Tarea</span>' : '<span class="tag manual">Manual</span>';
  const meta = `${tag} ${recurLabel(loop)}${loop.amount ? ' · ' + amtLabel(loop) : ''}`;
  return `
    <div class="row" data-id="${loop.id}" style="--st:${st.color}">
      <div class="row-top">
        <span class="ic">${renderIcon(loop.icon || cat.icon)}</span>
        <div class="mid">
          <div class="t">${escapeHtml(loop.title)}</div>
          <div class="m">${meta}</div>
          ${loop.notes ? `<div class="note">${escapeHtml(loop.notes)}</div>` : ''}
        </div>
        <div class="right">
          <div class="cd">${cd.big}</div>
          <div class="cl">${cd.cl}</div>
        </div>
        <button class="chk" title="Marcar ${loop.amount ? 'pagado' : 'hecho'}">${svg('check')}</button>
      </div>
      <div class="rowbar"><i style="width:${cd.pct}%"></i></div>
    </div>`;
}
function tickCountdowns() {
  document.querySelectorAll('#list .row').forEach(r => {
    const loop = loops.find(l => l.id === r.dataset.id); if (!loop) return;
    const cd = cdParts(loop);
    const num = r.querySelector('.cd'), lab = r.querySelector('.cl'), bar = r.querySelector('.rowbar > i');
    if (num) num.textContent = cd.big; if (lab) lab.textContent = cd.cl;
    if (bar) bar.style.width = cd.pct + '%';
    r.style.setProperty('--st', STATES[statusOf(loop)].color);
  });
}

/* ---------- LOOPS (todos, ordenables) ---------- */
const SORTS = { priority:'Importancia', date:'Próxima fecha', price:'Precio', interval:'Intervalo', name:'Nombre', category:'Categoría' };
function bindRows(scope) {
  scope.querySelectorAll('.row[data-id]').forEach(r => {
    const id = r.dataset.id;
    r.onclick = (e) => { if (!e.target.closest('.chk')) openForm(loops.find(l => l.id === id)); };
    const chk = r.querySelector('.chk'); if (chk) chk.onclick = () => markDone(id);
  });
}
function sortLoops(list) {
  const a = list.slice();
  if (loopSort === 'priority') a.sort((x,y) => (STATES[statusOf(x)].order - STATES[statusOf(y)].order) || (daysUntil(x.nextDate) - daysUntil(y.nextDate)));
  else if (loopSort === 'date') a.sort((x,y) => daysUntil(x.nextDate) - daysUntil(y.nextDate));
  else if (loopSort === 'price') a.sort((x,y) => (y.amount || 0) - (x.amount || 0));
  else if (loopSort === 'interval') a.sort((x,y) => cycleDays(x) - cycleDays(y));
  else if (loopSort === 'name') a.sort((x,y) => x.title.localeCompare(y.title, 'es'));
  else if (loopSort === 'category') a.sort((x,y) => x.category.localeCompare(y.category) || x.title.localeCompare(y.title, 'es'));
  return a;
}
function renderLoops(v) {
  const list = sortLoops(loops);
  const opts = Object.entries(SORTS).map(([k,l]) => `<option value="${k}" ${loopSort===k?'selected':''}>${l}</option>`).join('');
  v.innerHTML = `
    <div class="sec-title">Loops</div>
    <div class="sortbar"><span>${list.length} loop${list.length===1?'':'s'}</span>
      <select id="loop-sort" aria-label="Ordenar">${opts}</select></div>
    <div class="list" id="list">${list.length ? list.map(rowHTML).join('') : `<div class="empty"><div class="em">${svg('list')}</div><h3>Sin loops</h3><p>Toca “Nuevo” para crear uno.</p></div>`}</div>`;
  const sel = v.querySelector('#loop-sort'); sel.onchange = () => { loopSort = sel.value; setPref('ui.sort', loopSort); render(); };
  bindRows(v);
}

/* ---------- CALENDARIO ---------- */
function calCellHTML(date, todayStr) {
  const ds = fmtDate(date);
  const items = loops.filter(l => occursOn(l, date));
  const colors = items.slice(0, 6).map(l => STATES[statusOf(l)].color);
  const filled = colors.length > 0;
  const style = filled ? ` style="background:${cellBg(colors)}"` : '';
  return `<div class="cal-cell ${ds===todayStr?'today':''} ${filled?'filled':''} ${ds===selectedDay?'sel':''}" data-date="${ds}"${style}><span class="dn">${date.getDate()}</span></div>`;
}
function dayDetailHTML() {
  if (!selectedDay) return '';
  const date = parseDate(selectedDay);
  const items = loops.filter(l => occursOn(l, date)).sort((a,b) => STATES[statusOf(a)].order - STATES[statusOf(b)].order);
  const nice = date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
  return `<div class="day-detail">
    <div class="dd-head"><h4>${nice}</h4><button class="dd-add" id="dd-add">${svg('plus')} Agregar aquí</button></div>
    ${items.length ? `<div class="list">${items.map(rowHTML).join('')}</div>` : `<p class="dd-empty">Nada programado este día.<br>Toca “Agregar aquí” para crear un Loop.</p>`}
  </div>`;
}
function calMonth() {
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthName = base.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const todayStr = fmtDate(todayMid());
  let cells = '';
  ['L','M','X','J','V','S','D'].forEach(d => cells += `<div class="cal-dow">${d}</div>`);
  for (let i = 0; i < firstDow; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let day = 1; day <= days; day++) cells += calCellHTML(new Date(year, month, day), todayStr);
  return `<div class="cal-head"><button class="iconbtn" id="cprev">${svg('chevron-left')}</button><h3>${monthName}</h3><button class="iconbtn" id="cnext">${svg('chevron-right')}</button></div><div class="cal-grid">${cells}</div>${dayDetailHTML()}`;
}
function calWeek() {
  const today = todayMid();
  const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const todayStr = fmtDate(today);
  const title = `${monday.toLocaleDateString('es',{day:'numeric',month:'short'})} – ${sunday.toLocaleDateString('es',{day:'numeric',month:'short'})}`;
  let cells = '';
  ['L','M','X','J','V','S','D'].forEach(d => cells += `<div class="cal-dow">${d}</div>`);
  for (let i = 0; i < 7; i++) { const dt = new Date(monday); dt.setDate(monday.getDate() + i); cells += calCellHTML(dt, todayStr); }
  return `<div class="cal-head"><button class="iconbtn" id="cprev">${svg('chevron-left')}</button><h3 style="text-transform:none">${title}</h3><button class="iconbtn" id="cnext">${svg('chevron-right')}</button></div><div class="cal-grid">${cells}</div>${dayDetailHTML()}`;
}
function calAgenda() {
  const today = todayMid();
  const DAYS = 14;
  let blocks = '', any = false, totalCount = 0;
  for (let i = 0; i < DAYS; i++) {
    const date = new Date(today); date.setDate(today.getDate() + i);
    const items = loops.filter(l => occursOn(l, date)).sort((a,b) => STATES[statusOf(a)].order - STATES[statusOf(b)].order);
    if (!items.length) continue;
    any = true; totalCount += items.length;
    const nice = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : date.toLocaleDateString('es', { weekday:'long', day:'numeric', month:'short' });
    blocks += `<div class="agenda-day"><div class="ag-h"><span>${nice}</span><span class="ag-c">${items.length}</span></div><div class="list">${items.map(rowHTML).join('')}</div></div>`;
  }
  const head = `<div class="sec-title" style="padding-top:8px">Próximos 14 días${totalCount ? ` · ${totalCount}` : ''}</div>`;
  if (!any) return head + `<div class="empty"><div class="em">${svg('clock')}</div><h3>Dos semanas libres</h3><p>No hay nada en los próximos 14 días.</p></div>`;
  return head + blocks;
}
function renderCalendario(v) {
  const seg = (k,l) => `<button class="${calView===k?'on':''}" data-cv="${k}">${l}</button>`;
  const body = calView === 'week' ? calWeek() : calView === 'agenda' ? calAgenda() : calMonth();
  v.innerHTML = `<div class="seg" style="margin:14px 16px 4px">${seg('month','Mes')}${seg('week','Semana')}${seg('agenda','Agenda')}</div>${body}`;
  v.querySelectorAll('.seg button[data-cv]').forEach(b => b.onclick = () => { calView = b.dataset.cv; setPref('ui.calview', calView); render(); });
  if (calView === 'month') { v.querySelector('#cprev').onclick = () => { calOffset--; render(); }; v.querySelector('#cnext').onclick = () => { calOffset++; render(); }; }
  if (calView === 'week') { v.querySelector('#cprev').onclick = () => { weekOffset--; render(); }; v.querySelector('#cnext').onclick = () => { weekOffset++; render(); }; }
  if (calView !== 'agenda') v.querySelectorAll('.cal-cell[data-date]').forEach(c => c.onclick = () => { selectedDay = (selectedDay === c.dataset.date) ? null : c.dataset.date; render(); });
  const add = v.querySelector('#dd-add'); if (add) add.onclick = () => openForm(null, { date: selectedDay });
  bindRows(v);
}

/* ---------- FINANZAS ---------- */
function renderFinanzas(v) {
  const def = pref('currency','USD');
  const withAmt = loops.filter(l => l.amount);
  const byCur = {};
  withAmt.forEach(l => { const c = l.currency || def; byCur[c] = (byCur[c] || 0) + monthlyCost(l); });
  const curs = Object.keys(byCur);
  const primary = byCur[def] !== undefined ? def : (curs.slice().sort((a,b) => byCur[b]-byCur[a])[0] || def);
  const inPrim = withAmt.filter(l => (l.currency || def) === primary);
  const monthly = byCur[primary] || 0;
  const autoM = inPrim.filter(l => l.autoPay).reduce((s,l) => s + monthlyCost(l), 0);
  const manM = monthly - autoM;
  const pctAuto = monthly ? Math.round(autoM/monthly*100) : 0;
  const byCat = {}; inPrim.forEach(l => { byCat[l.category] = (byCat[l.category] || 0) + monthlyCost(l); });
  const maxCat = Math.max(1, ...Object.values(byCat));
  const catRows = Object.entries(byCat).sort((a,b) => b[1]-a[1]).map(([k,val]) => `
    <div class="brk-row"><span class="bn">${svg(CATEGORIES[k].icon)} ${CATEGORIES[k].label}</span><span class="bv">${money0(val, primary)}</span></div>
    <div class="bar"><i style="width:${Math.round(val/maxCat*100)}%"></i></div>`).join('');
  const curRows = curs.length > 1 ? `<div class="brk"><h4>Por moneda / mes</h4>${
    curs.sort((a,b) => byCur[b]-byCur[a]).map(c => `<div class="brk-row"><span class="bn">${c} ${CURRENCIES[c] || ''}</span><span class="bv">${money0(byCur[c], c)} · ${money0(byCur[c]*12, c)}/año</span></div>`).join('')
  }</div>` : '';
  const topRows = inPrim.slice().sort((a,b) => monthlyCost(b) - monthlyCost(a)).slice(0, 5)
    .map(l => `<div class="brk-row"><span class="bn">${svg(catOf(l).icon)} ${escapeHtml(l.title)}</span><span class="bv">${money0(monthlyCost(l), primary)}/mes</span></div>`).join('');
  v.innerHTML = `
    <div class="sec-title">Finanzas</div>
    <div class="hero">
      <div class="big">${money0(monthly, primary)}</div>
      <div class="lbl">gasto recurrente al mes${curs.length > 1 ? ' · ' + primary : ''}</div>
      <div class="split">
        <div><span class="n">${money0(monthly*12, primary)}</span><span class="t">al año</span></div>
        <div><span class="n">${inPrim.length}</span><span class="t">con monto</span></div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="n">${money0(autoM, primary)}</div><div class="t">Automático (${pctAuto}%)</div></div>
      <div class="stat"><div class="n">${money0(manM, primary)}</div><div class="t">Manual (${100-pctAuto}%)</div></div>
    </div>
    ${curRows}
    ${topRows ? `<div class="brk"><h4>Mayores gastos / mes</h4>${topRows}</div>` : ''}
    <div class="brk"><h4>Por categoría / mes${curs.length > 1 ? ' (' + primary + ')' : ''}</h4>${catRows || '<p class="sub" style="padding:0">Sin montos aún.</p>'}</div>`;
}

/* ---------- ESTADÍSTICAS ---------- */
function renderStats(v) {
  const counts = { overdue:0, urgent:0, upcoming:0, ok:0, neutral:0 };
  loops.forEach(l => counts[statusOf(l)]++);
  const total = loops.length;
  const alDia = counts.ok + counts.neutral;
  const pctOk = total ? Math.round(alDia/total*100) : 0;
  const pendientes = counts.overdue + counts.urgent + counts.upcoming;
  const pagados = getDone().length;
  const manualesPend = loops.filter(l => payType(l)!=='auto' && ['overdue','urgent','upcoming'].includes(statusOf(l))).length;
  const order = ['overdue','urgent','upcoming','ok'];
  const statusBar = `<div class="statusbar">${order.filter(k => counts[k]).map(k => `<span style="flex:${counts[k]};background:${STATES[k].color}" title="${STATES[k].label}: ${counts[k]}"></span>`).join('') || '<span style="flex:1;background:var(--line2)"></span>'}</div>`;
  const legend = `<div class="legend">${order.map(k => `<span><i style="background:${STATES[k].color}"></i>${STATES[k].label} ${counts[k]}</span>`).join('')}</div>`;
  const load = monthlyLoad();
  const maxL = Math.max(1, ...load.map(x => x.count));
  const chart = `<div class="chart">${load.map(x => `<div class="chart-col"><div class="chart-bar" style="height:${Math.max(3, Math.round(x.count/maxL*100))}px"></div><div class="chart-n">${x.count}</div><div class="chart-l">${x.label}</div></div>`).join('')}</div>`;
  const done = getDone();
  const onTime = done.filter(e => e.ts <= parseDate(e.date).getTime() + 86400000).length;
  const pctOnTime = done.length ? Math.round(onTime / done.length * 100) : 100;
  const dload = doneByMonth();
  const maxD = Math.max(1, ...dload.map(x => x.count));
  const doneChart = `<div class="chart">${dload.map(x => `<div class="chart-col"><div class="chart-bar" style="height:${Math.max(3, Math.round(x.count/maxD*100))}px;background:var(--ok)"></div><div class="chart-n">${x.count}</div><div class="chart-l">${x.label}</div></div>`).join('')}</div>`;
  // ---- Insights: gasto, categoría top, racha, proyección ----
  const def = pref('currency','USD');
  const withAmt = loops.filter(l => l.amount);
  const byCur = {}; withAmt.forEach(l => { const c = l.currency || def; byCur[c] = (byCur[c] || 0) + monthlyCost(l); });
  const curs = Object.keys(byCur);
  const primary = byCur[def] !== undefined ? def : (curs.slice().sort((a,b) => byCur[b]-byCur[a])[0] || def);
  const monthlySpend = byCur[primary] || 0;
  const byCat = {}; withAmt.filter(l => (l.currency||def)===primary).forEach(l => { byCat[l.category] = (byCat[l.category]||0) + monthlyCost(l); });
  const topCat = Object.entries(byCat).sort((a,b) => b[1]-a[1])[0];
  const doneSorted = done.slice().sort((a,b) => b.ts - a.ts);
  let streak = 0; for (const e of doneSorted) { if (e.ts <= parseDate(e.date).getTime() + 86400000) streak++; else break; }
  const busiest = load.reduce((m,x) => x.count > m.count ? x : m, load[0] || { count:0 });
  const nextL = loops.filter(l => statusOf(l) !== 'neutral').sort((a,b) => daysUntil(a.nextDate) - daysUntil(b.nextDate))[0];
  const doneThisMonth = dload.length ? dload[dload.length-1].count : 0;
  const ins = [];
  if (nextL) { const d = daysUntil(nextL.nextDate); ins.push({ icon:'clock', t:`Lo próximo: <b>${escapeHtml(nextL.title)}</b> ${d<0?'<span class="ins-bad">vencido</span>':d===0?'hoy':d===1?'mañana':`en ${d} días`}` }); }
  if (topCat) { const c = CATEGORIES[topCat[0]] || CATEGORIES.other; ins.push({ icon:c.icon, t:`Tu mayor gasto: <b>${c.label}</b> · ${money0(topCat[1],primary)}/mes` }); }
  if (streak > 0) ins.push({ icon:'flame', t:`Racha de <b>${streak}</b> a tiempo seguido${streak>1?'s':''}` });
  if (busiest && busiest.count) ins.push({ icon:'calendar', t:`Mes más cargado: <b style="text-transform:capitalize">${busiest.label}</b> · ${busiest.count} vencimientos` });
  if (monthlySpend) ins.push({ icon:'wallet', t:`Proyección 12 meses: <b>${money0(monthlySpend*12,primary)}</b>${curs.length>1?' · '+primary:''}` });
  const insHTML = ins.length ? `<div class="brk"><h4>Resumen</h4><div class="insights">${ins.map(x => `<div class="ins-row"><span class="ins-ic">${svg(x.icon)}</span><span>${x.t}</span></div>`).join('')}</div></div>` : '';
  v.innerHTML = `
    <div class="sec-title">Estadísticas</div>
    <div class="stat-grid">
      <div class="stat"><div class="n" style="color:var(--ok)">${pctOk}%</div><div class="t">al día</div></div>
      <div class="stat"><div class="n" style="color:var(--overdue)">${counts.overdue}</div><div class="t">vencidos</div></div>
      <div class="stat"><div class="n">${pendientes}</div><div class="t">pendientes</div></div>
      <div class="stat"><div class="n">${manualesPend}</div><div class="t">manuales por pagar</div></div>
      <div class="stat"><div class="n">${pagados}</div><div class="t">completados</div></div>
      <div class="stat"><div class="n" style="color:var(--ok)">${pctOnTime}%</div><div class="t">a tiempo</div></div>
      ${monthlySpend ? `<div class="stat"><div class="n">${money0(monthlySpend*12, primary)}</div><div class="t">proyectado / año</div></div>` : ''}
      <div class="stat"><div class="n">${doneThisMonth}</div><div class="t">hechos este mes</div></div>
    </div>
    ${insHTML}
    <div class="brk"><h4>Estado general</h4>${statusBar}${legend}</div>
    <div class="brk"><h4>Carga próximos 6 meses</h4>${chart}</div>
    ${done.length ? `<div class="brk"><h4>Completados por mes</h4>${doneChart}</div>` : ''}`;
}
function doneByMonth() {
  const out = [], base = new Date(); base.setDate(1); const done = getDone();
  for (let m = 5; m >= 0; m--) {
    const d0 = new Date(base.getFullYear(), base.getMonth() - m, 1), y = d0.getFullYear(), mo = d0.getMonth();
    const count = done.filter(e => { const t = new Date(e.ts); return t.getFullYear() === y && t.getMonth() === mo; }).length;
    out.push({ label: d0.toLocaleDateString('es', { month: 'short' }), count });
  }
  return out;
}
function monthlyLoad() {
  const out = [], base = new Date(); base.setDate(1);
  for (let m = 0; m < 6; m++) {
    const d0 = new Date(base.getFullYear(), base.getMonth() + m, 1);
    const days = new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate();
    let count = 0;
    for (let day = 1; day <= days; day++) { const date = new Date(d0.getFullYear(), d0.getMonth(), day); count += loops.filter(l => occursOn(l, date)).length; }
    out.push({ label: d0.toLocaleDateString('es', { month: 'short' }), count });
  }
  return out;
}

/* ---------- HISTORIAL ---------- */
function renderHistorial(v) {
  const items = getDone().slice().sort((a,b) => b.ts - a.ts);
  if (!items.length) {
    v.innerHTML = `<div class="sec-title">Completados</div>
      <div class="empty"><div class="em">${svg('checksq')}</div><h3>Aún sin registros</h3>
      <p>Cuando marques algo como pagado/hecho aparecerá aquí, y podrás restaurarlo.</p></div>`;
    return;
  }
  const rows = items.map(it => `
    <div class="row">
      <div class="row-top">
        <span class="ic">${renderIcon(it.icon || 'check')}</span>
        <div class="mid"><div class="t">${escapeHtml(it.title)}</div><div class="m">${fmtNice(it.date)}${it.amount ? ' · ' + money(it.amount) : ''}</div></div>
        <button class="undo-btn" data-ts="${it.ts}" title="Restaurar">${svg('rotate')}</button>
      </div>
    </div>`).join('');
  v.innerHTML = `<div class="sec-title">Completados</div><div class="sub">${items.length} registro${items.length>1?'s':''} · toca ↩ para restaurar</div><div class="list">${rows}</div>`;
  v.querySelectorAll('.undo-btn').forEach(b => b.onclick = () => restoreDone(Number(b.dataset.ts)));
}
function fmtNice(ds) { try { return parseDate(ds).toLocaleDateString('es', { day:'numeric', month:'long', year:'numeric' }); } catch(e){ return ds; } }

/* ---------- AJUSTES ---------- */
function renderAjustes(v) {
  const cur = pref('currency','USD'), dn = pref('defaultNotify','3'), da = pref('defaultAuto','0')==='1', theme = pref('theme','marfil'), lay = pref('layout','list');
  v.innerHTML = `
    <div class="sec-title">Ajustes</div>
    <div class="themes">
      <h4>Tema</h4>
      <div class="swatches">
        ${THEMES.map(t => `<div class="swatch ${theme===t.key?'sel':''}" data-theme="${t.key}">
          <div class="sw" style="background:${t.bg};--swa:${t.sw}"></div><div class="lb">${t.label}</div></div>`).join('')}
      </div>
    </div>
    <div class="themes">
      <h4>Diseño</h4>
      <div class="layouts">
        ${LAYOUTS.map(o => `<button class="lay ${lay===o.key?'sel':''}" data-lay="${o.key}">${svg(o.icon)}<span>${o.label}</span></button>`).join('')}
      </div>
    </div>
    <div class="brk"><h4>Preferencias</h4>
      <div class="pref"><div class="pl"><div class="tl">Moneda</div><div class="ts">Símbolo en montos y finanzas</div></div>
        <select id="p-cur">${Object.keys(CURRENCIES).map(c => `<option value="${c}" ${cur===c?'selected':''}>${c} ${CURRENCIES[c]}</option>`).join('')}</select></div>
      <div class="pref"><div class="pl"><div class="tl">Avisar por defecto</div><div class="ts">Días antes en cada Loop nuevo</div></div>
        <input id="p-notify" type="number" min="0" max="60" value="${dn}" /></div>
      <div class="pref"><div class="pl"><div class="tl">Pago automático por defecto</div><div class="ts">Loops nuevos marcados como auto</div></div>
        <button type="button" class="switch ${da?'on':''}" id="p-auto" aria-label="Pago automático por defecto"></button></div>
    </div>
    <div class="brk"><h4>Categorías</h4>
      <div class="catlist">
        ${Object.keys(CATEGORIES).map(k => `<div class="catrow">${svg(CATEGORIES[k].icon)}<span>${CATEGORIES[k].label}</span>${CATEGORIES[k].custom ? `<button class="catedit" data-cat="${k}" aria-label="Editar">${svg('pencil')}</button><button class="catdel" data-cat="${k}" aria-label="Eliminar">${svg('trash')}</button>` : ''}</div>`).join('')}
      </div>
      <button class="opt" id="o-addcat">${svg('plus')} Agregar categoría</button>
    </div>
    <div class="brk"><h4>Avisos</h4>
      <button class="opt" id="o-notify">${svg('bell')} ${pushEnabled() ? 'Avisos activados ✓ · reconfigurar' : 'Activar avisos push'}</button></div>
    <div class="brk"><h4>Calendario</h4>
      <button class="opt" id="o-ics">${svg('calendar')} Añadir todo (.ics, una vez)</button>
      ${calEnabled() ? `
      <div class="weburl">
        <div class="wl-tl">${svg('check')} Suscripción activa — se actualiza sola</div>
        <input id="o-calurl" readonly value="${escapeAttr(webcalUrl())}" onclick="this.select()" />
        <div class="wl-actions">
          <button class="wl-btn" id="o-calopen">Abrir en Calendario</button>
          <button class="wl-btn ghost" id="o-calcopy">Copiar enlace</button>
          <button class="wl-btn ghost" id="o-caloff">Desactivar</button>
        </div>
        <p class="sub" style="padding:8px 0 0;font-size:11.5px">Pégalo en Apple/Google Calendar como “calendario por suscripción”. Tus loops aparecen y se actualizan solos cada pocas horas. No compartas este enlace.</p>
      </div>` : `
      <button class="opt" id="o-calsub">${svg('repeat')} Suscripción que se actualiza sola (webcal)</button>`}
    </div>
    <div class="brk"><h4>Datos y respaldo</h4>
      <div class="data-info">${loops.length} loop${loops.length===1?'':'s'} · ${getDone().length} completado${getDone().length===1?'':'s'} · ${getUserCats().length} categoría${getUserCats().length===1?'':'s'} propia${getUserCats().length===1?'':'s'}</div>
      <button class="opt" id="o-export">${svg('download')} Exportar copia (archivo)</button>
      <button class="opt" id="o-copy">${svg('copy')} Copiar respaldo (texto)</button>
      <button class="opt" id="o-import">${svg('upload')} Importar desde archivo</button>
      <button class="opt" id="o-paste">${svg('file')} Restaurar desde texto pegado</button>
      <button class="opt" id="o-install" hidden>${svg('smartphone')} Instalar como app</button>
      <button class="opt danger" id="o-reset">${svg('rotate')} Restablecer datos de ejemplo</button></div>
    <p class="sub" style="text-align:center;margin:18px 16px 0;font-size:12px">Loopapp · tus datos se guardan en este dispositivo</p>`;
  v.querySelectorAll('.swatch').forEach(s => s.onclick = () => { applyTheme(s.dataset.theme); render(); });
  v.querySelectorAll('.lay').forEach(b => b.onclick = () => { applyLayout(b.dataset.lay); render(); });
  v.querySelector('#p-cur').onchange = (e) => { setPref('currency', e.target.value); render(); };
  v.querySelector('#p-notify').onchange = (e) => { setPref('defaultNotify', String(Math.max(0, Math.min(60, parseInt(e.target.value) || 0)))); };
  const pa = v.querySelector('#p-auto'); pa.onclick = () => { const on = pref('defaultAuto','0') !== '1'; setPref('defaultAuto', on?'1':'0'); pa.classList.toggle('on', on); };
  v.querySelectorAll('.catedit').forEach(b => b.onclick = () => openCatForm(b.dataset.cat));
  v.querySelectorAll('.catdel').forEach(b => b.onclick = () => { if (confirm('¿Eliminar esta categoría? Los loops que la usen pasarán a "Otros".')) { removeUserCat(b.dataset.cat); render(); } });
  v.querySelector('#o-addcat').onclick = () => openCatForm();
  v.querySelector('#o-ics').onclick = () => { if (!loops.length) { alert('No hay Loops que exportar.'); return; } downloadICS(loops, 'loopapp'); };
  const subBtn = v.querySelector('#o-calsub'); if (subBtn) subBtn.onclick = enableCal;
  const calopen = v.querySelector('#o-calopen'); if (calopen) calopen.onclick = () => { location.href = webcalUrl(); };
  const calcopy = v.querySelector('#o-calcopy'); if (calcopy) calcopy.onclick = () => { const u = webcalUrl(); try { navigator.clipboard.writeText(u); } catch (e) { const i = v.querySelector('#o-calurl'); i.select(); document.execCommand('copy'); } calcopy.textContent = 'Copiado ✓'; };
  const caloff = v.querySelector('#o-caloff'); if (caloff) caloff.onclick = () => { if (confirm('¿Desactivar la suscripción? Tus loops se quitarán de la nube.')) disableCal(); };
  v.querySelector('#o-notify').onclick = setupPush;
  v.querySelector('#o-export').onclick = exportData;
  v.querySelector('#o-copy').onclick = copyBackup;
  v.querySelector('#o-paste').onclick = pasteBackup;
  v.querySelector('#o-import').onclick = () => document.getElementById('import-file').click();
  v.querySelector('#o-reset').onclick = () => { if (confirm('¿Restablecer datos de ejemplo? (borra tus Loops actuales)')) { loops = seed(); save(); render(); } };
  const ib = v.querySelector('#o-install'); if (deferredPrompt) ib.hidden = false;
  ib.onclick = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; ib.hidden = true; };
}

/* ============================================================
   Formulario (modal)
   ============================================================ */
function openForm(loop, opts) {
  const isEdit = !!loop;
  const data = loop || { title:'', category:'subs', icon:'credit-card', amount:'', currency: pref('currency','USD'), autoPay: pref('defaultAuto','0')==='1', recur: { n:1, unit:'month' }, nextDate: (opts && opts.date) || offsetDate(7), notifyDaysBefore: parseInt(pref('defaultNotify','3'),10) || 3, notes: '' };
  const _r = recurOf(data); const ru = _r ? _r.unit : 'none'; const rn = _r ? _r.n : 1;
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
      <div class="field"><label>Moneda</label><select id="f-cur">
        ${Object.keys(CURRENCIES).map(c => `<option value="${c}" ${(data.currency || pref('currency','USD'))===c?'selected':''}>${c} ${CURRENCIES[c]}</option>`).join('')}
      </select></div>
    </div>
    <div class="field"><label>Repetición</label>
      <div class="field-row" style="gap:10px">
        <input id="f-rec-n" type="number" min="1" max="999" inputmode="numeric" value="${rn}" style="flex:0 0 88px;text-align:center" />
        <select id="f-rec-unit" style="flex:1">
          <option value="none" ${ru==='none'?'selected':''}>No se repite</option>
          <option value="day" ${ru==='day'?'selected':''}>días</option>
          <option value="week" ${ru==='week'?'selected':''}>semanas</option>
          <option value="month" ${ru==='month'?'selected':''}>meses</option>
          <option value="year" ${ru==='year'?'selected':''}>años</option>
        </select>
      </div>
      <p class="rec-hint" id="rec-hint"></p>
    </div>
    <div class="field"><div class="toggle-row">
      <div><div class="tl">Pago automático</div><div class="ts">Se cobra solo; no tienes que pagarlo a mano.</div></div>
      <button type="button" class="switch ${data.autoPay?'on':''}" id="f-auto" aria-label="Pago automático"></button>
    </div></div>
    <div class="field-row">
      <div class="field"><label>Próxima fecha</label><input id="f-date" type="date" value="${data.nextDate}" /></div>
      <div class="field"><label>Avisar (días antes)</label><input id="f-notify" type="number" min="0" max="60" value="${data.notifyDaysBefore ?? 3}" /></div>
    </div>
    <div class="field"><label>Notas (opcional)</label><textarea id="f-notes" rows="2" placeholder="Ej. número de cuenta, recordatorio, link…">${escapeHtml(data.notes || '')}</textarea></div>
    ${isEdit ? `<div class="form-actions">
      <button type="button" class="fa-btn" id="f-skip">${svg('forward')} Saltar fecha</button>
      <button type="button" class="fa-btn" id="f-dup">${svg('copy')} Duplicar</button>
      <button type="button" class="fa-btn" id="f-share">${svg('share')} Compartir</button>
      <button type="button" class="fa-btn" id="f-ics">${svg('calendar')} Calendario</button>
    </div>` : ''}
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
  const recN = modal.querySelector('#f-rec-n'), recU = modal.querySelector('#f-rec-unit'), recH = modal.querySelector('#rec-hint');
  function updRec() {
    recN.style.display = recU.value === 'none' ? 'none' : '';
    recH.textContent = recU.value === 'none' ? 'No se repite' : recurLabel({ recur: { n: Math.max(1, parseInt(recN.value, 10) || 1), unit: recU.value } });
  }
  recU.onchange = updRec; recN.oninput = updRec; updRec();
  const close = () => { overlay.hidden = true; };
  if (isEdit) {
    modal.querySelector('#f-ics').onclick = () => downloadICS([data], 'loop');
    modal.querySelector('#f-skip').onclick = () => { snoozeLoop(data.id); close(); };
    modal.querySelector('#f-dup').onclick = () => { duplicateLoop(data.id); close(); };
    modal.querySelector('#f-share').onclick = () => shareLoop(data);
  }
  modal.querySelector('#f-cancel').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  if (isEdit) modal.querySelector('#f-delete').onclick = () => { if (confirm(`¿Eliminar "${data.title}"?`)) { deleteLoop(data.id); close(); } };
  modal.querySelector('#f-save').onclick = () => {
    const title = modal.querySelector('#f-title').value.trim();
    if (!title) { modal.querySelector('#f-title').focus(); return; }
    const amountRaw = modal.querySelector('#f-amount').value;
    const ruv = modal.querySelector('#f-rec-unit').value;
    const rnv = Math.max(1, parseInt(modal.querySelector('#f-rec-n').value, 10) || 1);
    upsertLoop({
      id: isEdit ? data.id : undefined, title, category: sel.category, icon: sel.icon,
      amount: amountRaw === '' ? null : parseFloat(amountRaw), currency: modal.querySelector('#f-cur').value, autoPay: sel.autoPay,
      recur: ruv === 'none' ? { unit: 'none' } : { n: rnv, unit: ruv }, nextDate: modal.querySelector('#f-date').value,
      notifyDaysBefore: parseInt(modal.querySelector('#f-notify').value, 10) || 0,
      notes: modal.querySelector('#f-notes').value.trim(),
    });
    close();
  };
}

/* ---------- Crear categoría personalizada ---------- */
function openCatForm(edit) {
  const overlay = document.getElementById('modal-overlay'), modal = document.getElementById('modal');
  const cur = edit && CATEGORIES[edit] ? CATEGORIES[edit] : null;
  let selIcon = cur ? cur.icon : 'star';
  modal.innerHTML = `
    <h2>${cur ? 'Editar categoría' : 'Nueva categoría'}</h2>
    <p class="modal-sub">Crea una categoría a tu medida.</p>
    <div class="field"><label>Nombre</label><input id="c-name" placeholder="Ej. Mascotas, Educación, Donaciones" maxlength="24" value="${cur ? escapeAttr(cur.label) : ''}" /></div>
    <div class="field"><label>Icono</label><div class="icon-picker" id="c-icons">
      ${ICONS.map(i => `<button data-icon="${i}" class="${i===selIcon?'sel':''}">${svg(i)}</button>`).join('')}
    </div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="c-cancel">Cancelar</button>
      <button class="btn btn-primary" id="c-save">${cur ? 'Guardar' : 'Crear'}</button>
    </div>`;
  overlay.hidden = false;
  modal.querySelectorAll('#c-icons button').forEach(b => b.onclick = () => { selIcon = b.dataset.icon; modal.querySelectorAll('#c-icons button').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); });
  const close = () => { overlay.hidden = true; };
  modal.querySelector('#c-cancel').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  modal.querySelector('#c-save').onclick = () => {
    const name = modal.querySelector('#c-name').value.trim();
    if (!name) { modal.querySelector('#c-name').focus(); return; }
    if (edit) editUserCat(edit, name, selIcon); else addUserCat(name, selIcon);
    close(); render();
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
document.addEventListener('click', (e) => {
  const m = document.getElementById('catmenu'), s = document.getElementById('catsel');
  if (m && !m.hidden && s && !m.contains(e.target) && !s.contains(e.target)) m.hidden = true;
});

/* ---------- Respaldo completo (loops + completados + categorías + prefs) ---------- */
function normalizeLoop(l) {
  return {
    id: l.id || uid(), title: String(l.title || 'Sin nombre'),
    category: CATEGORIES[l.category] ? l.category : 'routine', icon: l.icon || 'repeat',
    amount: (l.amount === 0 || l.amount) ? Number(l.amount) : null,
    currency: CURRENCIES[l.currency] ? l.currency : undefined, autoPay: !!l.autoPay,
    recurrence: RECURRENCE[l.recurrence] ? l.recurrence : 'none',
    recur: (l.recur && l.recur.unit) ? l.recur : undefined,
    nextDate: /^\d{4}-\d{2}-\d{2}$/.test(l.nextDate) ? l.nextDate : offsetDate(7),
    notifyDaysBefore: Number.isFinite(+l.notifyDaysBefore) ? +l.notifyDaysBefore : 3,
    notes: String(l.notes || '').slice(0, 500),
    history: Array.isArray(l.history) ? l.history : [],
  };
}
function buildBackup() {
  return {
    app: 'loopapp', version: 2, exportedAt: new Date().toISOString(),
    currency: pref('currency', 'USD'),
    prefs: { defaultNotify: pref('defaultNotify','3'), defaultAuto: pref('defaultAuto','0'), theme: pref('theme','marfil'), layout: pref('layout','list') },
    cats: getUserCats(), done: getDone(), loops,
  };
}
function applyBackup(data) {
  let arr, done, cats, prefs, currency;
  if (Array.isArray(data)) { arr = data; }                       // formato antiguo (solo loops)
  else if (data && Array.isArray(data.loops)) { arr = data.loops; done = data.done; cats = data.cats; prefs = data.prefs || {}; currency = data.currency; }
  else throw new Error('formato');
  if (Array.isArray(cats)) setUserCats(cats);                    // restaura categorías antes de validar loops
  loops = arr.map(normalizeLoop);
  if (Array.isArray(done)) setDone(done);
  if (currency && CURRENCIES[currency]) setPref('currency', currency);
  if (prefs) {
    if (prefs.defaultNotify != null) setPref('defaultNotify', String(prefs.defaultNotify));
    if (prefs.defaultAuto != null) setPref('defaultAuto', String(prefs.defaultAuto));
    if (prefs.theme) applyTheme(prefs.theme);
    if (prefs.layout) applyLayout(prefs.layout);
  }
  save(); render();
}
function backupCount(data) { return Array.isArray(data) ? data.length : (data && Array.isArray(data.loops) ? data.loops.length : 0); }

/* Importar respaldo (archivo) */
const importFile = document.getElementById('import-file');
importFile.onchange = (e) => {
  const file = e.target.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      const n = backupCount(data);
      if (!n && !Array.isArray(data) && !(data && data.loops)) throw new Error('formato');
      if (!confirm(`Importar ${n} Loop${n===1?'':'s'}? Esto reemplazará los datos actuales.`)) return;
      applyBackup(data);
    } catch (err) { alert('Archivo no válido. Debe ser un respaldo .json de Loopapp.'); }
    finally { importFile.value = ''; }
  };
  r.readAsText(file);
};
function exportData() {
  const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `loopapp-backup-${fmtDate(todayMid())}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function copyBackup() {
  const text = JSON.stringify(buildBackup());
  const done = () => alert('Respaldo copiado ✓\nGuárdalo en tus notas o envíatelo. Para restaurarlo usa “Restaurar desde texto pegado”.');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(() => prompt('Copia este respaldo:', text));
  else prompt('Copia este respaldo:', text);
}
function pasteBackup() {
  const text = prompt('Pega aquí el texto del respaldo:');
  if (!text) return;
  try {
    const data = JSON.parse(text.trim());
    const n = backupCount(data);
    if (!n && !(data && data.loops)) throw new Error('formato');
    if (!confirm(`Restaurar ${n} Loop${n===1?'':'s'}? Esto reemplazará los datos actuales.`)) return;
    applyBackup(data);
  } catch (e) { alert('El texto no es un respaldo válido de Loopapp.'); }
}

/* ---------- Exportar al calendario (Apple / Google) ---------- */
function icsEsc(s) { return String(s).replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n'); }
function icsStamp() { return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
function loopRRule(l) { const r = recurOf(l); if (!r) return null; const f = { day:'DAILY', week:'WEEKLY', month:'MONTHLY', year:'YEARLY' }[r.unit]; return 'FREQ=' + f + (r.n > 1 ? ';INTERVAL=' + r.n : ''); }
function loopVEvent(l) {
  const RR = loopRRule(l);
  const sum = l.title + (l.amount ? ' — ' + amtLabel(l) : '');
  const cat = CATEGORIES[l.category] ? CATEGORIES[l.category].label : '';
  const desc = [cat, recurLabel(l), payType(l) === 'auto' ? 'pago automático' : ''].filter(Boolean).join(' · ');
  const e = ['BEGIN:VEVENT', 'UID:' + (l.id || uid()) + '@loopapp', 'DTSTAMP:' + icsStamp(),
    'DTSTART;VALUE=DATE:' + l.nextDate.replace(/-/g, ''), 'SUMMARY:' + icsEsc(sum), 'DESCRIPTION:' + icsEsc(desc)];
  if (RR) e.push('RRULE:' + RR);
  const nd = l.notifyDaysBefore || 0;
  if (nd > 0) e.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(l.title), 'TRIGGER:-P' + nd + 'D', 'END:VALARM');
  e.push('END:VEVENT');
  return e.join('\r\n');
}
function buildICS(list) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Loopapp//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Loopapp',
    ...list.map(loopVEvent), 'END:VCALENDAR'].join('\r\n');
}
function downloadICS(list, name) {
  const blob = new Blob([buildICS(list)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = (name || 'loopapp') + '.ics'; a.click();
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
function scheduleSync() { if (!pushEnabled() && !calEnabled()) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => { syncReminders(); syncCal(); }, 1500); }
async function syncReminders() {
  if (!pushEnabled() || !SB.url) return;
  const reminders = loops.map(l => ({ loop_id: l.id, title: l.title, next_date: l.nextDate, notify_days: l.notifyDaysBefore ?? 3 }));
  try { await fetch(`${SB.url}/functions/v1/push-sync`, { method:'POST', headers: sbHeaders(), body: JSON.stringify({ device_id: deviceId(), reminders }) }); } catch (e) {}
}

/* ---------- Suscripción de calendario (webcal) ---------- */
const CAL_ENABLED_KEY = 'loopapp.cal.enabled';
function calEnabled() { return localStorage.getItem(CAL_ENABLED_KEY) === '1'; }
function webcalUrl() { return SB.url.replace(/^https?:/, 'webcal:') + '/functions/v1/calendar?device=' + deviceId() + '&apikey=' + encodeURIComponent(SB.anonKey || ''); }
function calLoopsPayload() {
  return loops.map(l => ({ loop_id: l.id, title: l.title, next_date: l.nextDate, recur: recurOf(l), notify_days: l.notifyDaysBefore ?? 3, category: catOf(l).label, amount: l.amount, currency: l.currency || pref('currency','USD') }));
}
async function syncCal() {
  if (!calEnabled() || !SB.url) return;
  try { await fetch(`${SB.url}/functions/v1/cal-sync`, { method:'POST', headers: sbHeaders(), body: JSON.stringify({ device_id: deviceId(), loops: calLoopsPayload() }) }); } catch (e) {}
}
async function enableCal() {
  if (!SB.url) { alert('Falta configurar el servidor.'); return; }
  localStorage.setItem(CAL_ENABLED_KEY, '1');
  try {
    const res = await fetch(`${SB.url}/functions/v1/cal-sync`, { method:'POST', headers: sbHeaders(), body: JSON.stringify({ device_id: deviceId(), loops: calLoopsPayload() }) });
    if (!res.ok) throw new Error();
    render();
  } catch (e) { localStorage.removeItem(CAL_ENABLED_KEY); alert('No se pudo activar la suscripción. Revisa tu conexión.'); }
}
async function disableCal() {
  localStorage.removeItem(CAL_ENABLED_KEY);
  try { await fetch(`${SB.url}/functions/v1/cal-sync`, { method:'POST', headers: sbHeaders(), body: JSON.stringify({ device_id: deviceId(), loops: [] }) }); } catch (e) {}
  render();
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
applyTheme(pref('theme', (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'noche' : 'marfil'));
applyLayout(pref('layout', 'list'));
// Inyecta los iconos SVG estáticos (☰ del header, + de Nuevo, logo del drawer)
document.querySelectorAll('[data-ico]').forEach(el => el.insertAdjacentHTML('afterbegin', svg(el.dataset.ico)));
render();
checkDue();
setInterval(() => { if ((activeSection === 'inicio' || activeSection === 'loops') && document.getElementById('modal-overlay').hidden) tickCountdowns(); }, 1000);
setInterval(() => { checkDue(); }, 60000);
