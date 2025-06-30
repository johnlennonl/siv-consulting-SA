// 📦 init.js
document.addEventListener("DOMContentLoaded", () => {
  if (!window.db) {
    console.error("Firebase no está inicializado");
    return;
  }

  // Llamamos a cada inicializador de los módulos
  if (typeof initCrearCurso === "function") initCrearCurso(db);
  if (typeof cargarCursosDocentes === "function") cargarCursosDocentes(db);
  if (typeof initAsignarDocente === "function") initAsignarDocente(db);
  if (typeof cargarEstadisticas === "function") cargarEstadisticas(db);
  // Puedes seguir agregando más funciones aquí
});
