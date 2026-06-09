/* Configuración de Supabase para Loopkeeper (claves públicas — seguras de exponer).
   La escritura está protegida por la Edge Function + clave de edición. */
window.LOOPAPP_SUPABASE = {
  url: "https://dhjkrrokvovlxmiuihxm.supabase.co",
  anonKey: "sb_publishable_hHy2mdmcf3KtK1yqVsJA8A_j8j5QnIB",
  saveFn: "https://dhjkrrokvovlxmiuihxm.supabase.co/functions/v1/menu-save",
};

/* Push (clave pública VAPID — segura de exponer) */
window.LOOPAPP_PUSH = {
  vapidPublic: "BEedc9nD6P4sSDkjT1ryWXp5qaZSF4OROlez6bIvg2lL2dsiRAulFW5fW0_UdW-hJgWvTJO0l6s322ooVH3Xneg",
};

/* ============================================================
   PRECIOS del plan Full — CAMBIA AQUÍ los montos cuando quieras.
   Solo edita el texto de "price" (y "note"/"badge" si quieres).
   ============================================================ */
window.LOOPAPP_PRICES = {
  currency: "COP",
  lifetime: { label: "De por vida", price: "$120.000", note: "Pago único · para siempre", badge: "Mejor valor", best: true },
  year:     { label: "Anual",       price: "$79.900",  note: "≈ $6.658/mes",             badge: "Ahorra 33%" },
  month:    { label: "Mensual",     price: "$9.900",   note: "Cancela cuando quieras" },
};
