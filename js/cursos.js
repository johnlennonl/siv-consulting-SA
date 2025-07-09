let mostrarTodos = false;

// Plantilla de card PRO
function renderCursoCard(c) {
  return `
    <div class="col-md-6 col-lg-4" data-aos="zoom-in">
      <div class="card curso-card-pro border-0 shadow-sm h-100">
        <div class="curso-img-wrapper">
          <img src="${c.imagen}" class="card-img-top img-curso-pro" alt="${c.titulo}">
        </div>
        <div class="card-body">
          <h5 class="card-title fw-bold mb-2">${c.titulo}</h5>
          <p class="card-text small mb-2">${c.descripcion || ''}</p>
          <ul class="list-unstyled mb-3">
            <li><i class="bi bi-person-circle text-info me-1"></i> <span class="fw-semibold">${c.profesor || 'Equipo SIV'}</span></li>
            <li><i class="bi bi-calendar-event text-warning me-1"></i> ${c.fecha || 'Fecha a confirmar'}</li>
            <li><i class="bi bi-laptop text-primary me-1"></i> ${c.modalidad || ''}</li>
            <li><i class="bi bi-award text-success me-1"></i> ${c.certificacion || 'Certificado oficial'}</li>
          </ul>
          <a href="curso.html?id=${c.id}" class="btn btn-custom btn-sm px-4 py-2 mt-2">Ver más</a>
        </div>
      </div>
    </div>
  `;
}

function renderCursos() {
  const cont = document.getElementById('lista-cursos');
  const filtro = document.getElementById('search-input').value.toLowerCase();

  // Filtra y muestra solo los primeros 6 o todos si mostrarTodos
  const list = window.cursos
    .filter(c =>
      c.titulo.toLowerCase().includes(filtro) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(filtro)) ||
      (c.profesor && c.profesor.toLowerCase().includes(filtro))
    )
    .slice(0, mostrarTodos ? window.cursos.length : 6);

  cont.innerHTML = list.length
    ? list.map(renderCursoCard).join('')
    : `<div class="col-12"><div class="alert alert-warning text-center my-5">No se encontraron cursos con ese criterio.</div></div>`;

  document.getElementById('btn-ver-mas').textContent =
    mostrarTodos ? 'Mostrar menos' : 'Ver más cursos';
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
  renderCursos();

  document.getElementById('search-input').addEventListener('input', renderCursos);

  document.getElementById('btn-ver-mas').addEventListener('click', () => {
    mostrarTodos = !mostrarTodos;
    renderCursos();
    window.scrollTo({ top: document.getElementById('lista-cursos').offsetTop - 120, behavior: 'smooth' });
  });
});
