 document.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const id = parseInt(params.get('id'), 10);
      const curso = cursos.find(c => c.id === id);
      const container = document.getElementById('curso-detail');

      if (!curso) {
        container.innerHTML = '<p class="text-center text-danger">Curso no encontrado.</p>';
        return;
      }

      const fecha = new Date(curso.fecha).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      container.innerHTML = `
        <div class="row g-4">
          <div class="col-md-5">
            <img src="${curso.imagen}" alt="${curso.titulo}" class="img-fluid rounded">
          </div>
          <div class="col-md-7">
            <h1 class="fw-bold mb-3">${curso.titulo}</h1>
            <p class="text-muted mb-2"><i class="bi bi-person-fill me-1"></i><strong>Profesor:</strong> ${curso.profesor}</p>
            <p class="text-muted mb-2"><i class="bi bi-laptop me-1"></i><strong>Modalidad:</strong> ${curso.modalidad}</p>
            <p class="text-muted mb-2"><i class="bi bi-tags-fill me-1"></i><strong>Categoría:</strong> ${curso.categoria}</p>
            <p class="text-muted mb-2"><i class="bi bi-calendar-event-fill me-1"></i><strong>Fecha:</strong> ${fecha}</p>
            <p class="text-muted mb-4"><i class="bi bi-currency-dollar me-1"></i><strong>Precio:</strong> $${curso.precio.toFixed(2)}</p>
            <p class="mb-4">${curso.descripcion}</p>
            <a href="contacto.html" class="btn btn-custom me-2 mb-2">Inscribirse Ahora</a>
            <a href="tienda.html" class="btn btn-outline-light mb-2">Volver a Tienda</a>
          </div>
        </div>
      `;
    });