document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("main").innerHTML = `
    <!-- Sección Servicios -->
   <section class="servicios text-center text-white position-relative">
  <div class="overlay-servicios"></div>
  <div class="container py-5 position-relative">
    <h2 class="display-5 fw-bold" data-aos="fade-up">SERVICIOS PETROLEROS</h2>
    <p class="lead parrafoServicios" data-aos="fade-up" data-aos-delay="100">
      Contamos con un personal de experiencia para realizar servicios en la industria petrolera
      con tecnología de vanguardia y altos estándares de calidad y desempeño.
    </p>
    <a href="#" class="btn btn-custom mt-3" data-aos="fade-up" data-aos-delay="200">Ver más</a>
  </div>
</section>

    <!-- Sección Próximos Cursos -->
    <section class="cursos bg-cursos py-5">
      <div class="container">
        <h2 class="text-center  fw-bold mb-5" data-aos="zoom-in">PRÓXIMOS CURSOS</h2>

        <!-- Curso 1 -->
        <div class="card mb-4 curso-card" data-aos="fade-up">
          <div class="row g-0 align-items-center">
            <div class="col-md-4 text-center">
              <img src="images/BOMBEO.jpg" class="img-fluid rounded-start" alt="Curso 1">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-bold">OPTIMIZACIÓN DE SISTEMAS DE BOMBEO MECÁNICO</h5>
                <p class="card-text">Este curso integral está diseñado para proporcionar a los profesionales de la industria petrolera las herramientas necesarias para maximizar eficiencia y reducir costos operativos.</p>
                <p class=" fechaCurso card-text  fw-semibold">📅 31 de mayo de 2025</p>
                <a href="#" class="btn btn-dark">Ver más</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Curso 2 -->
        <div class="card mb-4 curso-card" data-aos="fade-up" data-aos-delay="100">
          <div class="row g-0 align-items-center">
            <div class="col-md-4 text-center">
              <img src="images/curso-de-esp.png" class="img-fluid rounded-start" alt="Curso 2">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-bold">CURSO INTEGRAL DE SISTEMAS DE BOMBEO ELECTROSUMERGIBLE</h5>
                <p class="card-text">Curso completo para entender los sistemas BES, sus componentes, teoría hidráulica y fundamentos eléctricos.</p>
                <p class=" fechaCurso card-text  fw-semibold">📅 14 de junio de 2025</p>
                <a href="#" class="btn btn-dark">Ver más</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Curso 3 -->
        <div class="card mb-4 curso-card" data-aos="fade-up" data-aos-delay="200">
          <div class="row g-0 align-items-center">
            <div class="col-md-4 text-center">
              <img src="images/seguridad-industrial-3-min.jpg" class="img-fluid rounded-start" alt="Curso 3">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-bold">SEGURIDAD INDUSTRIAL EN INSTALACIONES PETROLERAS</h5>
                <p class="card-text">Adquiere conocimientos clave sobre seguridad y prevención de riesgos laborales en la industria petrolera.</p>
                <p class=" fechaCurso card-text  fw-semibold">📅 19 de abril de 2025</p>
                <a href="#" class="btn btn-dark">Ver más</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
});

// Mostrar/ocultar botón al hacer scroll
window.addEventListener("scroll", () => {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (window.scrollY > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

// Scroll suave hacia arriba
document.getElementById("scrollTopBtn").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
