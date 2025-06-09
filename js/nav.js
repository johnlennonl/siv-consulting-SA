// js/nav.js
// Inyección dinámica del navbar con rutas adaptativas

document.addEventListener('DOMContentLoaded', () => {
  const isPages = window.location.pathname.includes('/pages/');
  const base = isPages ? '../' : '';

  document.getElementById('navbar').innerHTML = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-black">
    <div class="container-fluid">
      <a class="navbar-brand" href="${base}index.html">
        <img src="${base}images/LOGO-SIN-FONDO-min.png" alt="Logo" height="60">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="${base}index.html">Inicio</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Nosotros</a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="${base}pages/quienes-somos.html">Quiénes Somos</a></li>
              <li><a class="dropdown-item" href="${base}pages/profesionales.html">Nuestros Profesionales</a></li>
              <li><a class="dropdown-item" href="${base}pages/politica-privacidad.html">Política de Privacidad</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Servicios</a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="${base}pages/mantenimiento-industrial.html">Mantenimiento Industrial</a></li>
              <li><a class="dropdown-item" href="${base}pages/operaciones-produccion.html">Operaciones de Producción</a></li>
              <li><a class="dropdown-item" href="${base}pages/ingenieria-tecnica.html">Ingeniería y Asistencia Técnica</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/cursos-tecnicos.html">Cursos Técnicos</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Blog</a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="${base}pages/blog-petroleo.html">Petróleo</a></li>
              <li><a class="dropdown-item" href="${base}pages/blog-salud.html">Salud</a></li>
              <li><a class="dropdown-item" href="${base}pages/blog-alumnos.html">Alumnos</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/contacto.html">Contacto</a></li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/tienda.html">Tienda</a></li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/mi-cuenta.html">Mi Cuenta</a></li>
        </ul>
      </div>
    </div>
  </nav>
  `;
});