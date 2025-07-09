document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const curso = window.cursos.find(c => c.id === id);
  const container = document.getElementById('curso-detail');

  if (!curso) {
    container.innerHTML = '<div class="alert alert-danger text-center my-5">Curso no encontrado.</div>';
    return;
  }

  const fecha = new Date(curso.fecha)
    .toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div class="row g-5 mb-4 align-items-center" data-aos="fade-up">
      <div class="col-lg-5 mb-4 mb-lg-0" data-aos="fade-right">
        <div class="detail-img-wrapper rounded-4 shadow-lg overflow-hidden">
          <img src="${curso.imagen}" alt="${curso.titulo}" class="img-fluid w-100">
        </div>
      </div>
      <div class="col-lg-7" data-aos="fade-left">
        <h1 class="fw-bold mb-3">${curso.titulo}</h1>
        <div class="mb-3">
          <span class="badge rounded-pill bg-warning text-dark me-2 px-3 py-2"><i class="bi bi-laptop me-1"></i>${curso.modalidad}</span>
          <span class="badge rounded-pill bg-info text-white me-2 px-3 py-2"><i class="bi bi-tags me-1"></i>${curso.categoria}</span>
          <span class="badge rounded-pill bg-secondary text-white px-3 py-2"><i class="bi bi-calendar-event me-1"></i>${fecha}</span>
        </div>
        <p class="text-muted mb-2">
          <i class="bi bi-person-circle me-1"></i>
          <strong>Instructor:</strong> ${curso.profesor}
        </p>
        <p class="text-muted mb-2">
          <i class="bi bi-clock me-1"></i>
          <strong>Duración:</strong> ${curso.duracion}
        </p>
        <p class="mb-4 description-curso lead">${curso.descripcion}</p>
        <a href="contacto.html" class="btn btn-custom btn-lg me-2 mb-2">Inscribirse Ahora</a>
        <a href="tienda.html" class="btn btn-outline-dark btn-lg mb-2">Volver a Tienda</a>
      </div>
    </div>

    <div class="detail-extra" data-aos="fade-up" data-aos-delay="200">
      <div class="row g-5">
        <div class="col-lg-6">
          <h3 class="fw-bold mb-3 text-warning">Temario</h3>
          <ul class="list-group list-group-flush mb-4">
            ${curso.temario.map(item => `
              <li class="list-group-item bg-transparent border-0 ps-0 d-flex align-items-center">
                <i class="bi bi-check-circle-fill text-success me-2"></i> ${item}
              </li>`).join('')}
          </ul>
          <h3 class="fw-bold mb-3 text-warning">Metodología</h3>
          <p class="mb-4">${curso.metodologia}</p>
        </div>
        <div class="col-lg-6">
          <h3 class="fw-bold mb-3 text-warning">Dirigido a</h3>
          <p class="mb-4">${curso.dirigido}</p>
          <h3 class="fw-bold mb-3 text-warning">Objetivos</h3>
          <p class="mb-4">${curso.objetivos}</p>
        </div>
      </div>
    </div>
  `;
});
