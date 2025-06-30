// 📦 init.js
document.addEventListener("DOMContentLoaded", () => {
  if (!window.db) {
    console.error("Firebase no está inicializado");
    return;
  }

  if (typeof initCrearCurso       === "function") initCrearCurso(db);
  if (typeof cargarCursosDocentes === "function") cargarCursosDocentes(db);
  if (typeof initAsignarDocente   === "function") initAsignarDocente(db);
  if (typeof cargarEstadisticas   === "function") cargarEstadisticas(db);
  if (typeof initGestionUsuarios === "function") initGestionUsuarios(db);


  // ¡Aquí agregamos la llamada!
  if (typeof cargarTablaDocentes   === "function") cargarTablaDocentes(db);
});
