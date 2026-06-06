/* ============================================================
   Loopapp · Vista pública del menú (lo que ve el cliente al
   escanear el QR). Solo lectura, carga desde Supabase.
   ============================================================ */
const cfg = window.LOOPAPP_SUPABASE;
const slug = (new URLSearchParams(location.search).get('slug') || '').trim().toLowerCase();
const wrap = document.getElementById('wrap');
const menuEl = document.getElementById('menu');

const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

async function loadMenu() {
  if (!slug) { menuEl.innerHTML = `<div class="msg">Falta el identificador del menú en el enlace.</div>`; return; }
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/menus?slug=eq.${encodeURIComponent(slug)}&select=data`,
      { headers: { apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}` } }
    );
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    if (!rows.length) { menuEl.innerHTML = `<div class="msg">Menú no encontrado.<br>Verifica el enlace o pide al local que lo publique.</div>`; return; }
    render(rows[0].data || {});
  } catch (e) {
    menuEl.innerHTML = `<div class="msg">No se pudo cargar el menú.<br>Revisa tu conexión.</div>`;
  }
}

function applyBackground(d) {
  if (d.bgType === 'color' && d.bgColor) wrap.style.background = d.bgColor;
  else if (d.bgType === 'image' && d.bgImage) wrap.style.background = `center/cover no-repeat fixed url(${d.bgImage})`;
  else wrap.style.background = 'linear-gradient(180deg, var(--bg1), var(--bg2))';
}

function render(d) {
  applyBackground(d);
  const sections = Array.isArray(d.sections) ? d.sections : [];
  const hasItems = sections.some(s => (s.items || []).length);
  document.title = (d.brand || 'Menú');
  menuEl.innerHTML = `
    <div class="m-brand">
      <div class="name">${esc(d.brand) || 'Menú'}</div>
      <div class="tag">${esc(d.tagline)}</div>
      <div class="rule"></div>
    </div>
    ${(!sections.length || !hasItems)
      ? `<div class="m-empty">Este menú aún no tiene ítems.</div>`
      : sections.map(secHTML).join('')}
    <div class="powered">menú digital · Loopapp</div>
  `;
  menuEl.querySelectorAll('.m-sec').forEach(el =>
    el.querySelector('.m-head').onclick = () => el.classList.toggle('open'));
}

function secHTML(sec) {
  const items = sec.items || [];
  return `
    <div class="m-sec ${sec.open ? 'open' : ''}">
      <div class="m-head">
        <span class="t">${esc(sec.title) || 'Sección'}</span>
        <span class="r"><span class="count">${items.length} ítems</span><span class="m-chev"></span></span>
      </div>
      <div class="m-body"><div class="m-inner">
        ${items.map(it => `
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

loadMenu();
