document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("qs-container");

  container.innerHTML = `
    <section class="container text-center mb-5 pb-4" data-aos="fade-down">
      <!-- Logo centrado -->
      <div class="logo-circle mx-auto mb-4">
        <img src="../images/LOGO-SIN-FONDO-min.png"
             alt="SIV Consulting Logo"
             class="img-fluid"
             style="max-width:120px;">
      </div>
      <!-- Título -->
      <h1 class="fw-bold mb-2" style="letter-spacing:1.2px;">¿Quiénes Somos?</h1>
      <div class="gold-divider mx-auto mb-3"></div>
      <!-- Subtítulo / Línea descriptiva -->
      <p class="lead mb-0 text-dark-50">Asesoría técnica y formación de talento humano para la industria petrolera.</p>
    </section>

    <section class="container mb-5">
      <div class="row justify-content-center" data-aos="fade-up" data-aos-delay="100">
        <div class="col-lg-10">
          <div class="qs-box bg-white shadow-sm rounded-4 p-4 mb-4">
            <p class="qs-text mb-2">
              En <strong class="text-brand">SIV Consulting</strong> somos un equipo de profesionales especializados en capacitación técnica y servicios industriales para la industria petrolera, petroquímica, civil e industrial. Nos apasiona brindar conocimientos y herramientas para quienes buscan ingresar y crecer en el campo laboral, apostando siempre a la excelencia y soluciones tecnológicas a la medida de nuestros clientes.
            </p>
          </div>
        </div>
      </div>
      <div class="row g-4 justify-content-center mt-3">
        <!-- Misión -->
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
          <div class="card qs-card h-100 shadow border-0">
            <div class="card-body text-center">
              <div class="qs-icon mission mb-2"><i class="bi bi-bullseye"></i></div>
              <h5 class="card-title fw-bold text-brand mb-3">Misión</h5>
              <p class="card-text small text-muted">
                Proveer servicios industriales, asistencia y capacitación técnica de calidad en las áreas petrolera, mecánica, eléctrica, petroquímica, civil e industrial. Lo logramos con procesos de mejora continua, personal altamente calificado y tecnología de vanguardia.
              </p>
            </div>
          </div>
        </div>
        <!-- Visión -->
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
          <div class="card qs-card h-100 shadow border-0">
            <div class="card-body text-center">
              <div class="qs-icon vision mb-2"><i class="bi bi-eye"></i></div>
              <h5 class="card-title fw-bold text-brand mb-3">Visión</h5>
              <p class="card-text small text-muted">
                Ser líderes y referentes nacionales e internacionales en servicios industriales y capacitación técnica. Destacarnos por la responsabilidad, transparencia y ética profesional, dejando huella con soluciones innovadoras y talento humano de primer nivel.
              </p>
            </div>
          </div>
        </div>
        <!-- Valores -->
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="400">
          <div class="card qs-card h-100 shadow border-0">
            <div class="card-body text-center">
              <div class="qs-icon values mb-2"><i class="bi bi-award"></i></div>
              <h5 class="card-title fw-bold text-brand mb-3">Valores</h5>
              <ul class="list-unstyled mb-0 qs-val-list">
                <li><i class="bi bi-check-circle text-brand me-2"></i> Compromiso</li>
                <li><i class="bi bi-check-circle text-brand me-2"></i> Transparencia</li>
                <li><i class="bi bi-check-circle text-brand me-2"></i> Innovación</li>
                <li><i class="bi bi-check-circle text-brand me-2"></i> Trabajo en equipo</li>
                <li><i class="bi bi-check-circle text-brand me-2"></i> Seguridad</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
});
