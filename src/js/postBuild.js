import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import especialidades from "../assets/js/list.js";

// Necesario para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, "../../dist");

const domain = "https://consultoriosanmarcos.com/";

// Función para sanitizar el título: minúsculas, sin tildes ni caracteres especiales
function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD")              // separa letras de sus tildes
        .replace(/[\u0300-\u036f]/g, '') // elimina las tildes
        .replace(/[^a-z0-9\s-]/g, '')  // elimina caracteres especiales
        .trim()
        .replace(/\s+/g, '-');         // reemplaza espacios por guiones
}

// Generar rutas dinámicas a partir del array de especialidades
const dynamicUrls = especialidades.map(item => {
    const slug = slugify(item.title);
    return `<url><loc>${domain}especialidades/${slug}</loc></url>`;
}).join("\n  ");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${domain}</loc></url>
  <url><loc>${domain}especialidades</loc></url>
  <url><loc>${domain}about</loc></url>
  <url><loc>${domain}blogs</loc></url>
  ${dynamicUrls}
</urlset>
`;

const htaccessContent = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;

const redirectsContent = `
/*    /index.html   200
`;

const robotsContent = `
User-agent: *
Allow: /

Sitemap: ${domain}sitemap.xml
Host: ${domain}
`;

fs.writeFileSync(path.join(buildDir, ".htaccess"), htaccessContent);
fs.writeFileSync(path.join(buildDir, "_redirects"), redirectsContent);
fs.writeFileSync(path.join(buildDir, "robots.txt"), robotsContent);
fs.writeFileSync(path.join(buildDir, "sitemap.xml"), sitemapContent);

console.log("✅ Archivos post-build generados correctamente en /dist");
