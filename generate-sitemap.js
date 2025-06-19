import fs from 'fs';
import fetch from 'node-fetch';
import especialidades from './src/assets/js/list.js';

const BASE_URL = 'https://www.consultoriosanmarcos.com'; // CAMBIAR por tu dominio real

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar tildes
    .replace(/\s+/g, '-') // reemplazar espacios por guiones
    .replace(/[^\w-]/g, ''); // eliminar caracteres no válidos
}

async function generateSitemap() {
  const staticRoutes = [
    '/',
    '/about',
    '/especialidades',
    // '/blog',
    // `/especialidades-externas/...especialidades`, // Ruta estática
  ];

  let specialties = [];
  let blogs = [];

  try {
    // Hacer las dos peticiones de manera concurrente
    const [specialtiesRes, blogsRes] = await Promise.all([
      fetch('https://consultorio-back-xg97.onrender.com/api/specialties'),
      fetch('https://consultorio-back-xg97.onrender.com/api/blogs')
    ]);

    // Asegurarse de que las respuestas sean exitosas
    if (specialtiesRes.ok) specialties = await specialtiesRes.json();
    else console.error('❌ Error al obtener specialties:', specialtiesRes.statusText);

    if (blogsRes.ok) blogs = await blogsRes.json();
    else console.error('❌ Error al obtener blogs:', blogsRes.statusText);

  } catch (err) {
    console.error('❌ Error al obtener datos:', err.message);
  }

  // Generar rutas dinámicas
  const dynamicSpecialties = specialties.map(s => `/especialidades/${slugify(s.title)}`);
  const dynamicBlogs = blogs.map(b => `/${slugify(b.title)}?id=${b._id}`);
  const dynamicEspecialidadesExternas = especialidades.map(e => `/especialidades-externas/${slugify(e.title)}`);

  console.log(dynamicEspecialidadesExternas);

  // Unir todas las rutas
  const allRoutes = [
    ...staticRoutes,
    ...dynamicEspecialidadesExternas,
    ...dynamicSpecialties,
    ...dynamicBlogs
  ];

  // Crear el contenido del archivo sitemap
  const sitemapEntries = allRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

  // Guardar el archivo sitemap.xml
  try {
    fs.writeFileSync('dist/sitemap.xml', sitemapContent.trim());
    console.log('✅ sitemap.xml generado correctamente con', allRoutes.length, 'rutas.');
  } catch (error) {
    console.error('❌ Error al escribir sitemap.xml:', error.message);
  }
}

generateSitemap();
