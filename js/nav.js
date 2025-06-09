document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('navbar').innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img src="images/LOGO-SIN-FONDO-min.png" alt="Logo" height="80">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="#">Inicio</a></li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Nosotros</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Quienes somos</a></li>
                <li><a class="dropdown-item" href="#">Nuestros Profesionales</a></li>
                <li><a class="dropdown-item" href="#">Política de Privacidad</a></li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Servicios</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Mantenimiento Industrial</a></li>
                <li><a class="dropdown-item" href="#">Operaciones de Producción</a></li>
                <li><a class="dropdown-item" href="#">Ingeniería y Asistencia Técnica</a></li>
              </ul>
            </li>

            <li class="nav-item"><a class="nav-link" href="#">Cursos Técnicos</a></li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Blog</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Petróleo</a></li>
                <li><a class="dropdown-item" href="#">Salud</a></li>
                <li><a class="dropdown-item" href="#">Alumnos</a></li>
              </ul>
            </li>

            <li class="nav-item"><a class="nav-link" href="#">Contacto</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Tienda</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Mi Cuenta</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;
});
