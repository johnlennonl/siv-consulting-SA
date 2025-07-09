// js/nav.js
document.addEventListener('DOMContentLoaded', () => {
  const isPages = window.location.pathname.includes('/pages/');
  const base = isPages ? '../' : '';

  document.getElementById('navbar').innerHTML = `
  <nav class="navbar navbar-expand-lg navbar-dark siv-navbar shadow-sm">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="${base}index.html">
        <img src="${base}images/LOGO-SIN-FONDO-min.png" alt="Logo" height="60" style="border-radius: 12px;">
        <span class="fw-bold d-none d-md-inline" style="letter-spacing:1.2px;">SIV Consulting</span>
      </a>
      <button class="navbar-toggler border-0 rounded" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto align-items-center gap-lg-2">
          <li class="nav-item"><a class="nav-link" href="${base}index.html"><i class="bi bi-house-door-fill me-1"></i>Inicio</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"><i class="bi bi-people-fill me-1"></i>Nosotros</a>
            <ul class="dropdown-menu dropdown-menu-dark animate__animated animate__fadeInDown">
              <li><a class="dropdown-item" href="${base}pages/quienes-somos.html"><i class="bi bi-person-vcard-fill me-1"></i>Quiénes Somos</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"><i class="bi bi-gear-fill me-1"></i>Servicios</a>
            <ul class="dropdown-menu dropdown-menu-dark animate__animated animate__fadeInDown">
              <li><a class="dropdown-item" href="${base}pages/mantenimiento-industrial.html"><i class="bi bi-tools me-1"></i>Mantenimiento Industrial</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/cursos-tecnicos.html"><i class="bi bi-mortarboard-fill me-1"></i>Cursos Técnicos</a></li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/contacto.html"><i class="bi bi-envelope-fill me-1"></i>Contacto</a></li>
          <li class="nav-item"><a class="nav-link" href="${base}pages/tienda.html"><i class="bi bi-shop me-1"></i>Tienda</a></li>
          <li class="nav-item">
            <a class="nav-link btn btn-sm btn-custom px-3 ms-lg-2" href="${base}pages/login.html" style="font-weight:700;">
              <i class="bi bi-person-circle me-1"></i>Mi Cuenta
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `;
});
