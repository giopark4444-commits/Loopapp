/* ============================================================
   Loopapp — Todo lo que se repite, a la vista
   PWA sin dependencias. Estado en localStorage.
   ============================================================ */

const STORE_KEY = 'loopapp.loops.v1';

/* ---------- Categorías ---------- */
const CATEGORIES = {
  subs:     { label: 'Suscripciones', icon: '💳', color: '#a855f7' },
  money:    { label: 'Alquiler / Servicios', icon: '💰', color: '#22c55e' },
  routine:  { label: 'Rutinas', icon: '🔁', color: '#38bdf8' },
  home:     { label: 'Hogar', icon: '🏠', color: '#f59e0b' },
  shopping: { label: 'Compras', icon: '🛒', color: '#ec4899' },
};

/* ---------- Recurrencia ---------- */
const RECURRENCE = {
  none:    { label: 'Sin repetir', perMonth: 0 },
  weekly:  { label: 'Semanal',     perMonth: 4.3333 },
  monthly: { label: 'Mensual',     perMonth: 1 },
  yearly:  { label: 'Anual',       perMonth: 1 / 12 },
};

/* ---------- Estados (semáforo) ---------- */
const STATES = {
  overdue:  { label: 'Vencido',  color: '#ef4444', icon: '⚠️', order: 0 },
  urgent:   { label: 'Urgente',  color: '#f97316', icon: '❗', order: 1 },
  upcoming: { label: 'Próximo',  color: '#eab308', icon: '⏳', order: 2 },
  ok:       { label: 'Al día',   color: '#22c55e', icon: '✓',  order: 3 },
  neutral:  { label: 'Pendiente',color: '#38bdf8', icon: '•',  order: 4 },
};

const ICONS = ['💳','📺','🎵','🎮','☁️','📱','💡','💧','🔥','🌐','🏠','🚗','🛡️','🏋️','💊','🌱','🧹','🐶','📚','🎁','🍽️','✈️'];

/* ============================================================
   Estado de la app
   ============================================================ */
let loops = load();
let activeFilter = 'all';
let activeView = 'board';

/* ---------- Persistencia ---------- */
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return seed();
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(loops)); }

/* ---------- Datos de ejemplo (primera vez) ---------- */
function seed() {
  const d = offsetDate;
  return [
    { id: uid(), title: 'Netflix',        category: 'subs',    icon: '📺', amount: 15.99, currency: 'USD', recurrence: 'monthly', nextDate: d(3),   notifyDaysBefore: 5, notes: '' },
    { id: uid(), title: 'Spotify',        category: 'subs',    icon: '🎵', amount: 11.99, currency: 'USD', recurrence: 'monthly', nextDate: d(12),  notifyDaysBefore: 5, notes: '' },
    { id: uid(), title: 'iCloud+',        category: 'subs',    icon: '☁️', amount: 2.99,  currency: 'USD', recurrence: 'monthly', nextDate: d(-1),  notifyDaysBefore: 3, notes: '' },
    { id: uid(), title: 'Dominio web',    category: 'subs',    icon: '🌐', amount: 12.00, currency: 'USD', recurrence: 'yearly',  nextDate: d(40),  notifyDaysBefore: 14, notes: '' },
    { id: uid(), title: 'Alquiler',       category: 'money',   icon: '🏠', amount: 800,   currency: 'USD', recurrence: 'monthly', nextDate: d(8),   notifyDaysBefore: 5, notes: '' },
    { id: uid(), title: 'Internet',       category: 'money',   icon: '🌐', amount: 45,    currency: 'USD', recurrence: 'monthly', nextDate: d(1),   notifyDaysBefore: 3, notes: '' },
    { id: uid(), title: 'Seguro auto',    category: 'money',   icon: '🛡️', amount: 90,    currency: 'USD', recurrence: 'monthly', nextDate: d(-2),  notifyDaysBefore: 4, notes: '' },
    { id: uid(), title: 'Gimnasio',       category: 'routine', icon: '🏋️', amount: 30,    currency: 'USD', recurrence: 'monthly', nextDate: d(6),   notifyDaysBefore: 3, notes: '3 veces/semana' },
    { id: uid(), title: 'Regar plantas',  category: 'home',    icon: '🌱', amount: null,  currency: 'USD', recurrence: 'weekly',  nextDate: d(2),   notifyDaysBefore: 1, notes: '' },
    { id: uid(), title: 'Cambiar filtro A/C', category: 'home', icon: '🧹', amount: null, currency: 'USD', recurrence: 'yearly',  nextDate: d(60),  notifyDaysBefore: 14, notes: '' },
    { id: uid(), title: 'Comprar regalo', category: 'shopping',icon: '🎁', amount: null,  currency: 'USD', recurrence: 'none',    nextDate: d(5),   notifyDaysBefore: 2, notes: '' },
  ];
}

/* ============================================================
   Utilidades de fecha y estado
   ============================================================ */
function uid() { return Math.random().toString(36).slice(2, 10); }
function todayMid() { const t = new Date(); t.setHours(0,0,0,0); return t; }
function parseDate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); }
function fmtDate(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}
function offsetDate(days) { const t = todayMid(); t.setDate(t.getDate() + days); return fmtDate(t); }

function daysUntil(dateStr) {
  return Math.round((parseDate(dateStr) - todayMid()) / 86400000);
}

function statusOf(loop) {
  const dl = daysUntil(loop.nextDate);
  const notify = loop.notifyDaysBefore ?? 3;
  // Compras sin repetición y sin fecha cercana -> neutral, salvo vencidas
  if (dl < 0) return 'overdue';
  if (dl <= 1) return 'urgent';
  if (dl <= notify) return 'upcoming';
  if (loop.category === 'shopping' && loop.recurrence === 'none') return 'neutral';
  return 'ok';
}

function countdownText(loop) {
  const dl = daysUntil(loop.nextDate);
  if (dl < 0) return { num: Math.abs(dl), label: `día${Math.abs(dl)===1?'':'s'} vencido` };
  if (dl === 0) {
    // Cuenta regresiva real: horas y minutos hasta el fin del día
    const endOfDay = todayMid(); endOfDay.setDate(endOfDay.getDate() + 1);
    const ms = endOfDay.getTime() - Date.now();
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
    return { num: `${h}h ${m}m`, label: 'vence hoy', sm: true };
  }
  if (dl === 1) {
    // Tiempo real que falta hasta mañana (24–48 h)
    const ms = parseDate(loop.nextDate).getTime() - Date.now();
    const h = Math.floor((ms % 86400000) / 3600000);
    return { num: `1d ${h}h`, label: 'para mañana', sm: true };
  }
  return { num: dl, label: 'días restantes' };
}

/* Avanzar al próximo ciclo según recurrencia */
function nextCycle(dateStr, recurrence) {
  const d = parseDate(dateStr);
  const today = todayMid();
  // Avanza al menos un periodo, y sigue hasta superar hoy
  do {
    if (recurrence === 'weekly') d.setDate(d.getDate() + 7);
    else if (recurrence === 'monthly') d.setMonth(d.getMonth() + 1);
    else if (recurrence === 'yearly') d.setFullYear(d.getFullYear() + 1);
    else return null; // 'none' -> no se repite
  } while (d <= today);
  return fmtDate(d);
}

/* ¿El loop ocurre en esta fecha? (considera la recurrencia) */
function occursOn(loop, date) {
  const anchor = parseDate(loop.nextDate);
  switch (loop.recurrence) {
    case 'weekly':  return date.getDay() === anchor.getDay();
    case 'monthly': return date.getDate() === anchor.getDate();
    case 'yearly':  return date.getMonth() === anchor.getMonth() && date.getDate() === anchor.getDate();
    default:        return fmtDate(date) === loop.nextDate; // 'none'
  }
}

/* Costo mensual normalizado (solo loops con monto) */
function monthlyCost(loop) {
  if (!loop.amount) return 0;
  return loop.amount * (RECURRENCE[loop.recurrence]?.perMonth || 0);
}
function money(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/* ============================================================
   Acciones
   ============================================================ */
function markDone(id) {
  const loop = loops.find(l => l.id === id);
  if (!loop) return;
  const next = nextCycle(loop.nextDate, loop.recurrence);
  loop.history = loop.history || [];
  loop.history.push(loop.nextDate);
  if (next) {
    loop.nextDate = next;        // se reinicia al próximo ciclo
  } else {
    loops = loops.filter(l => l.id !== id);  // sin repetición -> se completa y archiva
  }
  save(); render();
}

function upsertLoop(data) {
  if (data.id) {
    const i = loops.findIndex(l => l.id === data.id);
    if (i >= 0) loops[i] = { ...loops[i], ...data };
  } else {
    loops.push({ ...data, id: uid(), history: [] });
  }
  save(); render();
}
function deleteLoop(id) { loops = loops.filter(l => l.id !== id); save(); render(); }

/* ============================================================
   Render principal
   ============================================================ */
function visibleLoops() {
  let list = loops.slice();
  if (activeFilter !== 'all') list = list.filter(l => l.category === activeFilter);
  // Orden por urgencia y, dentro, por días restantes
  return list.sort((a, b) => {
    const sa = STATES[statusOf(a)].order, sb = STATES[statusOf(b)].order;
    if (sa !== sb) return sa - sb;
    return daysUntil(a.nextDate) - daysUntil(b.nextDate);
  });
}

function render() {
  renderGreeting();
  renderSummary();
  renderFilters();
  renderView();
}

function renderGreeting() {
  const h = new Date().getHours();
  const saludo = h < 6 ? 'Buenas noches' : h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
  const overdue = loops.filter(l => statusOf(l) === 'overdue').length;
  const el = document.getElementById('greeting');
  el.textContent = overdue > 0
    ? `${saludo} — tienes ${overdue} pendiente${overdue>1?'s':''} vencido${overdue>1?'s':''}`
    : `${saludo} — todo bajo control ✨`;
}

function renderSummary() {
  const bar = document.getElementById('summary-bar');
  const counts = { overdue: 0, urgent: 0, upcoming: 0, ok: 0 };
  loops.forEach(l => { const s = statusOf(l); if (counts[s] !== undefined) counts[s]++; });
  const totalMonthly = loops.reduce((sum, l) => sum + monthlyCost(l), 0);

  const pill = (state, n) => `
    <div class="summary-pill">
      <span class="dot" style="background:${STATES[state].color}"></span>
      ${n} <span class="sub">${STATES[state].label.toLowerCase()}</span>
    </div>`;

  bar.innerHTML = `
    <div class="summary-pill total">${money(totalMonthly)} <span style="opacity:.85;font-weight:500">/ mes</span></div>
    ${counts.overdue ? pill('overdue', counts.overdue) : ''}
    ${counts.urgent ? pill('urgent', counts.urgent) : ''}
    ${counts.upcoming ? pill('upcoming', counts.upcoming) : ''}
    ${pill('ok', counts.ok)}
  `;
}

function renderFilters() {
  const el = document.getElementById('filters');
  const chip = (key, label) =>
    `<button class="filter-chip ${activeFilter===key?'active':''}" data-filter="${key}">${label}</button>`;
  let html = chip('all', '✨ Todos');
  for (const [key, c] of Object.entries(CATEGORIES)) {
    const n = loops.filter(l => l.category === key).length;
    html += chip(key, `${c.icon} ${c.label}${n ? ` (${n})` : ''}`);
  }
  el.innerHTML = html;
  el.querySelectorAll('.filter-chip').forEach(b =>
    b.onclick = () => { activeFilter = b.dataset.filter; render(); });
}

function renderView() {
  const main = document.getElementById('main');
  document.querySelectorAll('#view-switch button').forEach(b =>
    b.classList.toggle('active', b.dataset.view === activeView));

  if (activeView === 'board') return renderBoard(main);
  if (activeView === 'subs') return renderSubs(main);
  if (activeView === 'calendar') return renderCalendar(main);
}

/* ---------- Vista: Tablero ---------- */
function renderBoard(main) {
  const list = visibleLoops();
  if (!list.length) return renderEmpty(main);

  main.innerHTML = `<div class="cards-grid">${list.map(cardHTML).join('')}</div>`;
  main.querySelectorAll('.loop-card').forEach(card => {
    const id = card.dataset.id;
    card.onclick = (e) => { if (!e.target.closest('.done-btn')) openForm(loops.find(l => l.id === id)); };
    const done = card.querySelector('.done-btn');
    if (done) done.onclick = () => markDone(id);
  });
}

function cardHTML(loop) {
  const st = statusOf(loop);
  const s = STATES[st];
  const cd = countdownText(loop);
  const cat = CATEGORIES[loop.category];
  const doneLabel = loop.amount ? 'Pagado ✓' : 'Hecho ✓';
  return `
    <div class="loop-card" data-id="${loop.id}" style="--state-color:${s.color}">
      <div class="card-head">
        <span class="card-icon">${loop.icon || cat.icon}</span>
        <span class="state-badge">${s.icon} ${s.label}</span>
      </div>
      <div class="title">${escapeHtml(loop.title)}</div>
      <div class="countdown">
        <span class="count-num${cd.sm ? ' sm' : ''}">${cd.num}</span>
        <span class="count-label">${cd.label}</span>
      </div>
      <div class="meta">
        <span class="amount">${loop.amount ? money(loop.amount) : '<span style="color:var(--text-dim)">—</span>'}</span>
        <span class="cycle">${cat.icon} ${RECURRENCE[loop.recurrence].label}</span>
      </div>
      <button class="done-btn">${doneLabel}</button>
    </div>`;
}

/* ---------- Vista: Suscripciones (tracking) ---------- */
function renderSubs(main) {
  const subs = loops.filter(l => l.category === 'subs');
  const monthly = subs.reduce((s, l) => s + monthlyCost(l), 0);
  const yearly = monthly * 12;

  if (!subs.length) {
    main.innerHTML = `<div class="empty"><div class="em">💳</div>
      <h3>Sin suscripciones aún</h3>
      <p>Agrega Netflix, Spotify, tu nube… y mira cuánto gastas al mes.</p></div>`;
    return;
  }

  const rows = subs
    .sort((a, b) => daysUntil(a.nextDate) - daysUntil(b.nextDate))
    .map(l => {
      const s = STATES[statusOf(l)];
      const dl = daysUntil(l.nextDate);
      const when = dl < 0 ? `vencido hace ${Math.abs(dl)}d` : dl === 0 ? 'vence hoy' : dl === 1 ? 'mañana' : `en ${dl} días`;
      return `
        <div class="sub-row" data-id="${l.id}" style="--state-color:${s.color}">
          <span class="ic">${l.icon || '💳'}</span>
          <div class="info">
            <div class="n">${escapeHtml(l.title)}</div>
            <div class="d">${RECURRENCE[l.recurrence].label} · ${money(monthlyCost(l))}/mes</div>
          </div>
          <div class="right">
            <div class="a">${l.amount ? money(l.amount) : '—'}</div>
            <div class="c">${s.icon} ${when}</div>
          </div>
        </div>`;
    }).join('');

  main.innerHTML = `
    <div class="subs-hero">
      <div class="big">${money(monthly)}</div>
      <div class="label">en suscripciones al mes</div>
      <div class="split">
        <div><span class="n">${subs.length}</span><span class="t">activas</span></div>
        <div><span class="n">${money(yearly)}</span><span class="t">al año</span></div>
      </div>
    </div>
    <div class="subs-list">${rows}</div>`;

  main.querySelectorAll('.sub-row').forEach(r =>
    r.onclick = () => openForm(loops.find(l => l.id === r.dataset.id)));
}

/* ---------- Vista: Calendario ---------- */
let calOffset = 0;
function renderCalendar(main) {
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthName = base.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // lunes=0
  const days = new Date(year, month + 1, 0).getDate();
  const todayStr = fmtDate(todayMid());

  let cells = '';
  const dows = ['L','M','X','J','V','S','D'];
  dows.forEach(d => cells += `<div class="cal-dow">${d}</div>`);
  for (let i = 0; i < firstDow; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let day = 1; day <= days; day++) {
    const date = new Date(year, month, day);
    const ds = fmtDate(date);
    // Considera la recurrencia: muestra cada Loop en todas sus fechas del mes
    const items = loops.filter(l => occursOn(l, date));
    const dots = items.slice(0, 5).map(l =>
      `<span class="d" style="background:${STATES[statusOf(l)].color}" title="${escapeHtml(l.title)}"></span>`).join('');
    cells += `<div class="cal-cell ${ds===todayStr?'today':''}">
      <span class="day-num">${day}</span><div class="cal-dots">${dots}</div></div>`;
  }

  main.innerHTML = `
    <div class="cal-head">
      <button class="icon-btn" id="cal-prev">‹</button>
      <h3 style="text-transform:capitalize">${monthName}</h3>
      <button class="icon-btn" id="cal-next">›</button>
    </div>
    <div class="cal-grid">${cells}</div>`;
  main.querySelector('#cal-prev').onclick = () => { calOffset--; renderCalendar(main); };
  main.querySelector('#cal-next').onclick = () => { calOffset++; renderCalendar(main); };
}

function renderEmpty(main) {
  main.innerHTML = `<div class="empty"><div class="em">🔄</div>
    <h3>Nada por aquí todavía</h3>
    <p>Toca el botón <strong>＋</strong> para agregar tu primer Loop:<br>
    una suscripción, un pago, una rutina o un recado.</p></div>`;
}

/* ============================================================
   Formulario (modal)
   ============================================================ */
function openForm(loop) {
  const isEdit = !!loop;
  const data = loop || { title: '', category: 'subs', icon: '💳', amount: '', currency: 'USD',
                         recurrence: 'monthly', nextDate: offsetDate(7), notifyDaysBefore: 3, notes: '' };

  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');

  modal.innerHTML = `
    <h2>${isEdit ? 'Editar Loop' : 'Nuevo Loop'}</h2>
    <p class="modal-sub">Todo lo que se repite: una fecha, un color, una cuenta regresiva.</p>

    <div class="field">
      <label>Categoría</label>
      <div class="cat-picker" id="cat-picker">
        ${Object.entries(CATEGORIES).map(([k,c]) =>
          `<button data-cat="${k}" class="${data.category===k?'sel':''}">${c.icon} ${c.label}</button>`).join('')}
      </div>
    </div>

    <div class="field">
      <label>Nombre</label>
      <input id="f-title" placeholder="Ej. Netflix, Alquiler, Regar plantas" value="${escapeAttr(data.title)}" />
    </div>

    <div class="field">
      <label>Icono</label>
      <div class="icon-picker" id="icon-picker">
        ${ICONS.map(i => `<button data-icon="${i}" class="${data.icon===i?'sel':''}">${i}</button>`).join('')}
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label>Monto (opcional)</label>
        <input id="f-amount" type="number" step="0.01" min="0" placeholder="0.00" value="${data.amount ?? ''}" />
      </div>
      <div class="field">
        <label>Repetición</label>
        <select id="f-recurrence">
          ${Object.entries(RECURRENCE).map(([k,r]) =>
            `<option value="${k}" ${data.recurrence===k?'selected':''}>${r.label}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label>Próxima fecha</label>
        <input id="f-date" type="date" value="${data.nextDate}" />
      </div>
      <div class="field">
        <label>Avisar (días antes)</label>
        <input id="f-notify" type="number" min="0" max="60" value="${data.notifyDaysBefore ?? 3}" />
      </div>
    </div>

    <div class="modal-actions">
      ${isEdit ? `<button class="btn btn-danger" id="f-delete">Eliminar</button>` : ''}
      <button class="btn btn-ghost" id="f-cancel">Cancelar</button>
      <button class="btn btn-primary" id="f-save">${isEdit ? 'Guardar' : 'Agregar'}</button>
    </div>
  `;

  overlay.hidden = false;
  let sel = { category: data.category, icon: data.icon };

  modal.querySelectorAll('#cat-picker button').forEach(b => b.onclick = () => {
    sel.category = b.dataset.cat;
    modal.querySelectorAll('#cat-picker button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
  });
  modal.querySelectorAll('#icon-picker button').forEach(b => b.onclick = () => {
    sel.icon = b.dataset.icon;
    modal.querySelectorAll('#icon-picker button').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
  });

  const close = () => { overlay.hidden = true; };
  modal.querySelector('#f-cancel').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  if (isEdit) modal.querySelector('#f-delete').onclick = () => {
    if (confirm(`¿Eliminar "${data.title}"?`)) { deleteLoop(data.id); close(); }
  };

  modal.querySelector('#f-save').onclick = () => {
    const title = modal.querySelector('#f-title').value.trim();
    if (!title) { modal.querySelector('#f-title').focus(); return; }
    const amountRaw = modal.querySelector('#f-amount').value;
    upsertLoop({
      id: isEdit ? data.id : undefined,
      title,
      category: sel.category,
      icon: sel.icon,
      amount: amountRaw === '' ? null : parseFloat(amountRaw),
      currency: 'USD',
      recurrence: modal.querySelector('#f-recurrence').value,
      nextDate: modal.querySelector('#f-date').value,
      notifyDaysBefore: parseInt(modal.querySelector('#f-notify').value, 10) || 0,
    });
    close();
  };
}

/* ============================================================
   Helpers HTML-safe
   ============================================================ */
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function escapeAttr(s) { return escapeHtml(s); }

/* ============================================================
   Eventos globales
   ============================================================ */
document.getElementById('add-btn').onclick = () => openForm(null);

/* ---------- Menú desplegable del header ---------- */
const menuToggle = document.getElementById('menu-toggle');
const appMenu = document.getElementById('app-menu');
function closeMenu() { appMenu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.onclick = (e) => {
  e.stopPropagation();
  const open = appMenu.hidden;
  appMenu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
};
document.addEventListener('click', (e) => {
  if (!appMenu.hidden && !appMenu.contains(e.target) && e.target !== menuToggle) closeMenu();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

document.getElementById('reset-data').onclick = () => {
  closeMenu();
  if (confirm('¿Restablecer datos de ejemplo? (borra tus Loops actuales)')) {
    loops = seed(); save(); render();
  }
};

document.getElementById('about-app').onclick = () => {
  closeMenu();
  alert('Loopapp — Todo lo que se repite, a la vista.\n\n' +
        'Lleva el control de suscripciones, pagos, rutinas y recados con cuenta ' +
        'regresiva, semáforo de estados y avisos.\n\nTus datos se guardan en este dispositivo.');
};

document.querySelectorAll('#view-switch button').forEach(b =>
  b.onclick = () => { activeView = b.dataset.view; render(); });

/* ============================================================
   Avisos (notificaciones locales del navegador)
   ============================================================ */
const NOTIFY_SENT_KEY = 'loopapp.notify.sent.v1';
function notifyEnabled() { return 'Notification' in window && Notification.permission === 'granted'; }

document.getElementById('enable-notify').onclick = async () => {
  closeMenu();
  if (!('Notification' in window)) { alert('Tu navegador no soporta notificaciones.'); return; }
  let perm = Notification.permission;
  if (perm !== 'granted') perm = await Notification.requestPermission();
  if (perm === 'granted') { alert('Avisos activados 🔔\nTe avisaremos cuando algo esté por vencer (con la app abierta).'); checkDue(); }
  else alert('No se activaron los avisos. Puedes habilitarlos en los permisos del navegador.');
};

function checkDue() {
  if (!notifyEnabled()) return;
  let sent = {};
  try { sent = JSON.parse(localStorage.getItem(NOTIFY_SENT_KEY)) || {}; } catch (e) {}
  const today = fmtDate(todayMid());
  loops.forEach(l => {
    const st = statusOf(l);
    if (st === 'overdue' || st === 'urgent' || st === 'upcoming') {
      const key = `${l.id}@${today}`;
      if (!sent[key]) {
        const body = st === 'overdue'
          ? '¡Vencido! Tócalo para revisarlo.'
          : `Próximo a vencer (${l.nextDate}).`;
        try { new Notification(`Loopapp · ${l.title}`, { body, icon: 'icon.svg', tag: l.id }); } catch (e) {}
        sent[key] = true;
      }
    }
  });
  localStorage.setItem(NOTIFY_SENT_KEY, JSON.stringify(sent));
}

/* ============================================================
   Instalar como app (PWA)
   ============================================================ */
let deferredPrompt = null;
const installBtn = document.getElementById('install-app');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.onclick = async () => {
  closeMenu();
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
};

/* Service worker (modo offline / instalable) */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

/* ============================================================
   Arranque + refresco en vivo de cuentas regresivas / avisos
   ============================================================ */
render();
checkDue();
// Cada minuto: actualiza las cuentas regresivas en vivo y revisa vencimientos
setInterval(() => {
  if (document.getElementById('modal-overlay').hidden) {
    renderSummary();
    if (activeView === 'board') renderView();
  }
  checkDue();
}, 60000);
