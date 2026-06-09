# 🛡️ Loopkeeper — *Todo lo que se repite, a la vista*

Dashboard visual para organizar **todas tus responsabilidades recurrentes** —suscripciones, alquiler, servicios, rutinas, mantenimiento del hogar y recados— bajo una sola idea: cada cosa es un **"Loop"** con una **cuenta regresiva** y un **color según su estado**.

> Lo que se repite y tiene fecha, es un Loop. Lo rojo arriba, lo verde abajo. Nunca se te olvida nada.

## ✨ Qué hace hoy (MVP funcional)

- **Tracking de suscripciones** 💳 — registra Netflix, Spotify, tu nube, etc. y ve el **total al mes y al año** de un vistazo.
- **Dashboard visual** con tarjetas de cuenta regresiva, ordenadas automáticamente por urgencia.
- **Semáforo por estado** (con icono + texto, accesible):
  - 🟢 **Al día** · 🟡 **Próximo** · 🟠 **Urgente (hoy/mañana)** · 🔴 **Vencido**
- **5 categorías:** Suscripciones · Alquiler/Servicios · Rutinas · Hogar · Compras.
- **Recurrencia:** semanal, mensual, anual o sin repetir.
- **Auto-reinicio:** marcas *Pagado/Hecho* y el Loop salta solo a su próxima fecha.
- **Vista calendario** con mapa de colores del mes.
- **Resumen superior:** total mensual de compromisos + cuántos vencidos / próximos.
- **Aviso configurable** por Loop (cuántos días antes pasa a "próximo").
- **PWA offline e instalable** — funciona en móvil y escritorio, sin conexión, sin cuenta. Datos guardados localmente.

## 🚀 Cómo correrla

No necesita build ni dependencias. Sirve la carpeta con cualquier servidor estático:

```bash
# opción 1
python3 -m http.server 8000
# opción 2
npx serve .
```

Luego abre `http://localhost:8000`. En el móvil, usa *"Agregar a pantalla de inicio"* para instalarla como app.

> El service worker requiere `http(s)://` (no `file://`). Para una prueba rápida sin servidor, igual funciona todo menos el modo offline.

## 🗂️ Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura de la app |
| `styles.css` | Diseño (tema oscuro, tarjetas, semáforo) |
| `app.js` | Lógica: estados, cuentas regresivas, recurrencia, tracking, formulario |
| `manifest.webmanifest` / `sw.js` / `icon.svg` | PWA (instalable + offline) |

## 🧾 Módulo Menú (Fase 1 — nuevo)

Rubro para crear el **menú digital del bar** (theme *Oscuro Elegante*) que los clientes ven al escanear un QR.

- **Editor de casillas desplegables** — agregar/editar/eliminar **secciones** e **ítems**, reordenar.
- Cada ítem: **nombre, descripción, precio y foto** (o emoji si no subes foto).
- **Fondo personalizable** — degradado, color sólido o **imagen cargada**.
- **Vista previa en vivo** (maqueta de celular) que refleja cada cambio.
- **QR fijo imprimible** — apunta a una URL fija; descarga PNG o imprime.
- Todo se guarda automáticamente en el dispositivo (localStorage).

Se abre desde el ícono 🧾 en la cabecera del dashboard, o directamente en `menu.html`.

### ☁️ Backend en vivo (Supabase)

El menú se publica en la nube para que los clientes lo vean al escanear el QR:

- **`config.js`** — URL y clave pública de Supabase (seguras de exponer).
- **`m.html` / `m.js`** — página pública (solo lectura) que ve el cliente; el QR apunta a `m.html?slug=<tu-bar>`.
- Tabla `menus` en Supabase con **lectura pública** (RLS) y **escritura protegida**: los cambios pasan por la Edge Function `menu-save`, que valida tu **clave de edición**.
- En el editor, pestaña **QR**: define la dirección (slug), guarda tu **clave de edición** y pulsa **Publicar**. La URL pública y el QR se generan solos. **Traer de la nube** sincroniza el menú en otro dispositivo (con la misma clave).

> El QR se genera vía un servicio de imagen (requiere internet del administrador). Las fotos se guardan embebidas (base64); para catálogos grandes conviene migrar a Supabase Storage más adelante.

## 🔭 Próximos pasos (roadmap)

- 🔔 Notificaciones push de vencimientos.
- ☁️ Cuenta + sincronización entre dispositivos.
- 🏦 Conexión bancaria opcional (auto-detección de suscripciones).
- 🌈 Temas y colores personalizados, widgets de pantalla de inicio.
- 📊 Estadísticas de gasto e historial de rachas.

---

Hecho como un dashboard *visual-first*: el protagonista es la cuenta regresiva y el color, no una lista aburrida.
