// js/cursos.js
let mostrarTodos = false;

function renderCursos() {
  const cont = document.getElementById('lista-cursos');
  const filtro = document.getElementById('search-input').value.toLowerCase();
  const list = window.cursos
    .filter(c => c.titulo.toLowerCase().includes(filtro))
    .slice(0, mostrarTodos ? window.cursos.length : 6);

  cont.innerHTML = list.map(c => `
    <div class="col-md-4" data-aos="zoom-in">
      <div class="card h-100 shadow-sm">
        <img src="${c.imagen}" class="card-img-top" alt="${c.titulo}">
        <div class="card-body">
          <h5 class="card-title">${c.titulo}</h5>
          <p class="card-text"><small>${c.profesor} • ${c.modalidad}</small></p>
          <a href="curso.html?id=${c.id}" class="btn btn-outline-primary">Ver más</a>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('btn-ver-mas').textContent =
    mostrarTodos ? 'Mostrar menos' : 'Ver más cursos';
}

document.getElementById('search-input')
  .addEventListener('input', renderCursos);

document.getElementById('btn-ver-mas')
  .addEventListener('click', () => {
    mostrarTodos = !mostrarTodos;
    renderCursos();
  });

document.addEventListener('DOMContentLoaded', () => {
  renderCursos();
});
