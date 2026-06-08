#!/usr/bin/env node
// Regenera standalone.html desde las partes fuente.
// Uso: node build.js
const fs = require('fs');

const css    = fs.readFileSync('styles.css', 'utf8');
const cfg    = fs.readFileSync('config.js',  'utf8');
const appjs  = fs.readFileSync('app.js',     'utf8');

// Leer el head específico de standalone (hasta </style>) del archivo anterior
// Si standalone.html existe, preservar su <head> (contiene manifest inline + raw.githack URLs)
let head = '';
if (fs.existsSync('standalone.html')) {
  const prev = fs.readFileSync('standalone.html', 'utf8');
  const styleStart = prev.indexOf('<style>');
  const styleEnd   = prev.indexOf('</style>');
  if (styleStart !== -1 && styleEnd !== -1) {
    head = prev.slice(0, styleStart); // todo lo anterior a <style>
  }
}
if (!head) {
  // Fallback mínimo si no existe standalone anterior
  head = `<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />\n  <title>Loopapp</title>\n`;
}

// Body desde index.html (entre <body> y </body>, sin los <script src=...>)
const indexHtml = fs.readFileSync('index.html', 'utf8');
const bodyStart = indexHtml.indexOf('<body>') + '<body>'.length;
const bodyEnd   = indexHtml.lastIndexOf('</body>');
let bodyContent = indexHtml.slice(bodyStart, bodyEnd);
// Quitar las líneas de <script src=...> ya que van inline
bodyContent = bodyContent.replace(/\s*<script src="[^"]*"><\/script>/g, '');

const out = `${head}<style>\n${css}\n</style>\n<body>${bodyContent}\n<script>\n${cfg}\n</script>\n<script>\n${appjs}\n</script>\n</body>\n</html>`;

fs.writeFileSync('standalone.html', out, 'utf8');
console.log(`standalone.html regenerado (${Math.round(out.length/1024)}KB)`);
