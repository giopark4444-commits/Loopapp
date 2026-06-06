/* ============================================================
   Loopapp · Módulo Menú (Fase 1) — theme Oscuro Elegante
   Editor de casillas desplegables + vista previa + QR fijo.
   Estado en localStorage.
   ============================================================ */
const KEY = 'loopapp.menu.v1';
const uid = () => Math.random().toString(36).slice(2, 9);

/* ---------- Estado ---------- */
let data = load();

function load() {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
  return seed();
}
function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
  flashSaved();
}
function seed() {
  return {
    brand: 'LA BODEGA', tagline: 'Bar & Cocina',
    bgType: 'gradient', bgColor: '#15110a', bgImage: null,
    publicUrl: '',
    sections: [
      { id: uid(), title: 'Entradas', open: false, items: [
        { id: uid(), emoji: '🥗', photo: null, name: 'Ensalada de la casa', desc: 'mix verde, queso de cabra y nueces', price: '$9' },
        { id: uid(), emoji: '🧀', photo: null, name: 'Tabla de quesos', desc: 'selección de 4 quesos y mermelada', price: '$13' },
      ]},
      { id: uid(), title: 'Platos fuertes', open: true, items: [
        { id: uid(), emoji: '🥩', photo: null, name: 'Bife de chorizo', desc: '300g, punto a elección, con guarnición', price: '$18' },
        { id: uid(), emoji: '🍝', photo: null, name: 'Pasta de la casa', desc: 'salsa pomodoro y albahaca fresca', price: '$14' },
      ]},
      { id: uid(), title: 'Bebidas', open: false, items: [
        { id: uid(), emoji: '🍷', photo: null, name: 'Copa de vino', desc: 'tinto / blanco de la casa', price: '$6' },
        { id: uid(), emoji: '🍺', photo: null, name: 'Cerveza artesanal', desc: 'rubia, roja o negra', price: '$5' },
      ]},
      { id: uid(), title: 'Postres', open: false, items: [
        { id: uid(), emoji: '🍰', photo: null, name: 'Cheesecake', desc: 'con coulis de frutos rojos', price: '$6' },
      ]},
    ],
  };
}

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
let savedTimer;
function flashSaved() {
  const n = $('#saved-note'); if (!n) return;
  n.textContent = 'Guardando…'; clearTimeout(savedTimer);
  savedTimer = setTimeout(() => n.textContent = 'Guardado automáticamente en este dispositivo ✓', 500);
}
function findSection(sid) { return data.sections.find(s => s.id === sid); }

/* ============================================================
   Identidad + Fondo (inputs estáticos)
   ============================================================ */
function bindStatic() {
  $('#f-brand').value = data.brand;
  $('#f-tagline').value = data.tagline;
  $('#f-brand').oninput = e => { data.brand = e.target.value; save(); renderPreview(); };
  $('#f-tagline').oninput = e => { data.tagline = e.target.value; save(); renderPreview(); };

  // Fondo
  $('#f-bgcolor').value = data.bgColor;
  $$('#bg-types button').forEach(b => b.onclick = () => setBgType(b.dataset.bg));
  $('#f-bgcolor').oninput = e => { data.bgColor = e.target.value; data.bgType = 'color'; save(); renderPreview(); };
  $('#f-bgimage').onchange = e => readImage(e.target.files[0], b64 => {
    data.bgImage = b64; data.bgType = 'image'; save(); syncBgUI(); renderPreview();
  });
  $('#bg-image-clear').onclick = () => { data.bgImage = null; data.bgType = 'gradient'; save(); syncBgUI(); renderPreview(); };
  syncBgUI();

  // QR
  $('#f-url').value = data.publicUrl;
  $('#f-url').oninput = e => { data.publicUrl = e.target.value.trim(); save(); renderQR(); };
  $('#qr-download').onclick = downloadQR;
  $('#qr-print').onclick = () => window.print();
}

function setBgType(type) { data.bgType = type; save(); syncBgUI(); renderPreview(); }
function syncBgUI() {
  $$('#bg-types button').forEach(b => b.classList.toggle('active', b.dataset.bg === data.bgType));
  $('#bg-color-field').hidden = data.bgType !== 'color';
  $('#bg-image-field').hidden = data.bgType !== 'image';
  $('#bg-image-clear').hidden = !data.bgImage;
}
function readImage(file, cb) {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => cb(r.result);
  r.readAsDataURL(file);
}

/* ============================================================
   Editor de secciones e ítems
   ============================================================ */
function buildAdmin() {
  const cont = $('#sections');
  cont.innerHTML = data.sections.map(sec => `
    <div class="sec" data-sid="${sec.id}">
      <div class="sec-top">
        <input class="sec-title" value="${esc(sec.title)}" placeholder="Nombre de la sección" />
        <div class="sec-tools">
          <button class="iconbtn s-up" title="Subir">▲</button>
          <button class="iconbtn s-down" title="Bajar">▼</button>
          <button class="iconbtn del s-del" title="Eliminar sección">🗑</button>
        </div>
      </div>
      <div class="items">
        ${sec.items.map(it => itemEditorHTML(it)).join('')}
      </div>
      <button class="add-item">＋ Ítem</button>
    </div>
  `).join('');

  // Bind por sección
  $$('.sec', cont).forEach(secEl => {
    const sid = secEl.dataset.sid;
    const sec = findSection(sid);
    $('.sec-title', secEl).oninput = e => { sec.title = e.target.value; save(); renderPreview(); };
    $('.s-del', secEl).onclick = () => { if (confirm(`¿Eliminar la sección "${sec.title}"?`)) { data.sections = data.sections.filter(s => s.id !== sid); save(); buildAdmin(); renderPreview(); } };
    $('.s-up', secEl).onclick = () => moveSection(sid, -1);
    $('.s-down', secEl).onclick = () => moveSection(sid, +1);
    $('.add-item', secEl).onclick = () => { sec.items.push({ id: uid(), emoji: '🍽️', photo: null, name: '', desc: '', price: '' }); save(); buildAdmin(); renderPreview(); };

    // Bind por ítem
    $$('.itm', secEl).forEach(itEl => {
      const iid = itEl.dataset.iid;
      const it = sec.items.find(x => x.id === iid);
      $('.i-name', itEl).oninput = e => { it.name = e.target.value; save(); renderPreview(); };
      $('.i-desc', itEl).oninput = e => { it.desc = e.target.value; save(); renderPreview(); };
      $('.i-price', itEl).oninput = e => { it.price = e.target.value; save(); renderPreview(); };
      $('.i-del', itEl).onclick = () => { sec.items = sec.items.filter(x => x.id !== iid); save(); buildAdmin(); renderPreview(); };
      $('.i-photo', itEl).onchange = e => readImage(e.target.files[0], b64 => { it.photo = b64; save(); buildAdmin(); renderPreview(); });
      const rm = $('.i-photo-rm', itEl);
      if (rm) rm.onclick = () => { it.photo = null; save(); buildAdmin(); renderPreview(); };
    });
  });
}

function itemEditorHTML(it) {
  const thumb = it.photo
    ? `<img src="${it.photo}" alt="" />`
    : esc(it.emoji || '🍽️');
  return `
    <div class="itm" data-iid="${it.id}">
      <div class="itm-row">
        <div class="itm-photo">
          <label class="itm-thumb" title="Subir foto">
            ${thumb}
            <input class="i-photo" type="file" accept="image/*" hidden />
          </label>
          ${it.photo ? `<label class="i-photo-rm" style="color:#ef4444">quitar</label>` : `<label>foto</label>`}
        </div>
        <div class="itm-fields">
          <input class="i-name" value="${esc(it.name)}" placeholder="Nombre del ítem" />
          <input class="i-desc" value="${esc(it.desc)}" placeholder="Descripción (opcional)" />
          <div class="itm-line">
            <input class="i-price price" value="${esc(it.price)}" placeholder="$0" />
            <button class="iconbtn del i-del" title="Eliminar ítem">🗑</button>
          </div>
        </div>
      </div>
    </div>`;
}

function moveSection(sid, dir) {
  const i = data.sections.findIndex(s => s.id === sid);
  const j = i + dir;
  if (j < 0 || j >= data.sections.length) return;
  [data.sections[i], data.sections[j]] = [data.sections[j], data.sections[i]];
  save(); buildAdmin(); renderPreview();
}

/* ============================================================
   Vista previa (menú real que verá el cliente)
   ============================================================ */
function renderPreview() {
  applyBackground();
  const scroll = $('#preview-scroll');
  const hasItems = data.sections.some(s => s.items.length);
  scroll.innerHTML = `
    <div class="m-brand">
      <div class="name">${esc(data.brand) || 'Tu bar'}</div>
      <div class="tag">${esc(data.tagline)}</div>
      <div class="rule"></div>
    </div>
    ${!data.sections.length || !hasItems
      ? `<div class="m-empty">Agrega secciones e ítems<br>para ver tu menú aquí ✨</div>`
      : data.sections.map(secPreviewHTML).join('')}
  `;
  // toggle desplegables
  $$('.m-sec', scroll).forEach(el => {
    $('.m-head', el).onclick = () => {
      const sec = findSection(el.dataset.sid);
      sec.open = !sec.open; save();
      el.classList.toggle('open', sec.open);
    };
  });
}

function secPreviewHTML(sec) {
  return `
    <div class="m-sec ${sec.open ? 'open' : ''}" data-sid="${sec.id}">
      <div class="m-head">
        <span class="t">${esc(sec.title) || 'Sección'}</span>
        <span class="r"><span class="count">${sec.items.length} ítems</span><span class="m-chev"></span></span>
      </div>
      <div class="m-body"><div class="m-inner">
        ${sec.items.map(it => `
          <div class="m-itm">
            <div class="ph">${it.photo ? `<img src="${it.photo}" alt="">` : esc(it.emoji || '🍽️')}</div>
            <div class="info">
              <div class="n">${esc(it.name) || 'Ítem'}</div>
              ${it.desc ? `<div class="d">${esc(it.desc)}</div>` : ''}
            </div>
            ${it.price ? `<div class="price">${esc(it.price)}</div>` : ''}
          </div>`).join('')}
      </div></div>
    </div>`;
}

function applyBackground() {
  const phone = $('#phone');
  if (data.bgType === 'color') phone.style.background = data.bgColor;
  else if (data.bgType === 'image' && data.bgImage)
    phone.style.background = `center/cover no-repeat url(${data.bgImage})`;
  else phone.style.background = 'linear-gradient(180deg, var(--bg1), var(--bg2))';
}

/* ============================================================
   QR fijo
   ============================================================ */
function qrUrl(size) {
  const u = data.publicUrl || '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(u)}`;
}
function renderQR() {
  const box = $('#qr-box');
  if (!data.publicUrl) {
    box.innerHTML = `<div class="ph">Escribe la URL pública arriba<br>para generar el QR imprimible</div>`;
    return;
  }
  box.innerHTML = `<img id="qr-img" src="${qrUrl(240)}" alt="QR del menú" />`;
}
async function downloadQR() {
  if (!data.publicUrl) { alert('Primero escribe la URL pública del menú.'); return; }
  try {
    const res = await fetch(qrUrl(600));
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'menu-qr.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } catch (e) {
    // fallback: abrir en pestaña nueva
    window.open(qrUrl(600), '_blank');
  }
}

/* ============================================================
   Tabs (móvil)
   ============================================================ */
function bindTabs() {
  $$('#tabs button').forEach(b => b.onclick = () => {
    $$('#tabs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $$('.pane').forEach(p => p.classList.remove('show'));
    $(`#pane-${b.dataset.tab}`).classList.add('show');
    if (b.dataset.tab === 'qr') renderQR();
  });
  $('#pane-editar').classList.add('show'); // por defecto en móvil
}

/* ---------- Arranque ---------- */
bindStatic();
buildAdmin();
renderPreview();
renderQR();
bindTabs();
