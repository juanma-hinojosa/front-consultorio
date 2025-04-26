// src/utils/slugify.js
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")                     // Descompone caracteres Unicode (á -> a + ́)
    .replace(/[\u0300-\u036f]/g, "")       // Elimina los signos de acento
    .trim()
    .replace(/[^\w\s-]/g, "")              // Elimina cualquier cosa que no sea letra, número, espacio o guión
    .replace(/\s+/g, "-");                 // Reemplaza espacios por guiones


export default slugify;
