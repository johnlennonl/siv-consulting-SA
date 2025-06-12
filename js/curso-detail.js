// js/curso-detail.js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const curso = window.cursos.find(c => c.id === id);
  const container = document.getElementById('curso-detail');

  if (!curso) {
    container.innerHTML = '<p class="text-center text-danger">Curso no encontrado.</p>';
    return;
  }

  const fecha = new Date(curso.fecha)
    .toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div class="row g-4 mb-5" data-aos="fade-up">
      <div class="col-md-5" data-aos="fade-right">
        <img src="${curso.imagen}" alt="${curso.titulo}" class="img-fluid rounded shadow">
      </div>
      <div class="col-md-7" data-aos="fade-left">
        <h1 class="fw-bold mb-3">${curso.titulo}</h1>
        <p class="text-muted mb-2">
          <i class="bi bi-person-fill me-1"></i>
          <strong>Instructor:</strong> ${curso.profesor}
        </p>
        <p class="text-muted mb-2">
          <i class="bi bi-laptop me-1"></i>
          <strong>Modalidad:</strong> ${curso.modalidad}
        </p>
        <p class="text-muted mb-2">
          <i class="bi bi-tags-fill me-1"></i>
          <strong>Categoría:</strong> ${curso.categoria}
        </p>
        <p class="text-muted mb-2">
          <i class="bi bi-calendar-event-fill me-1"></i>
          <strong>Fecha:</strong> ${fecha}
        </p>
        <p class="text-muted mb-2">
          <i class="bi bi-clock-fill me-1"></i>
          <strong>Duración:</strong> ${curso.duracion}
        </p>
        <p class="mb-4 description-curso">${curso.descripcion}</p>
        <a href="contacto.html" class="btn btn-custom me-2 mb-2">Inscribirse Ahora</a>
        <a href="tienda.html" class="btn btn-outline-light mb-2">Volver a Tienda</a>
      </div>
    </div>

    <div data-aos="fade-up" data-aos-delay="200">
      <h3 class="fw-bold mb-3">Temario</h3>
      <ul class="list-group mb-4">
        ${curso.temario.map(item => `<li class="list-group-item">${item}</li>`).join('')}
      </ul>

      <h3 class="fw-bold mb-3">Metodología</h3>
      <p class="mb-4">${curso.metodologia}</p>

      <h3 class="fw-bold mb-3">Dirigido a</h3>
      <p class="mb-4">${curso.dirigido}</p>

      <h3 class="fw-bold mb-3">Objetivos</h3>
      <p class="mb-4">${curso.objetivos}</p>
    </div>
  `;
});
