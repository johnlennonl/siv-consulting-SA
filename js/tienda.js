// Seleccionar elementos del DOM
const contenedorCursos = document.getElementById("contenedor-cursos");
const filtroCategoria  = document.getElementById("filtro-categoria");
const filtroModalidad  = document.getElementById("filtro-modalidad");
const filtroNombre     = document.getElementById("filtro-nombre");
const filtroPrecioMin  = document.getElementById("precio-min");
const filtroPrecioMax  = document.getElementById("precio-max");

// Renderiza la lista de cursos en pantalla
function renderCursos(lista) {
  contenedorCursos.innerHTML = "";
  if (lista.length === 0) {
    contenedorCursos.innerHTML = `<div class="alert alert-warning text-center my-5">No se encontraron cursos.</div>`;
    return;
  }
  lista.forEach(curso => {
    const fecha = new Date(curso.fecha)
      .toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    // CARD MEJORADA
    const card = document.createElement("div");
    card.className = "tienda-curso-card shadow-sm";
    card.innerHTML = `
      <div class="card-img-top-wrap">
        <img src="${curso.imagen}" alt="${curso.titulo}" class="tienda-img-curso">
        <span class="badge tienda-badge bg-warning text-dark">${curso.categoria}</span>
        <span class="badge tienda-badge bg-primary text-white">${curso.modalidad}</span>
      </div>
      <div class="contenido-curso p-3 d-flex flex-column justify-content-between">
        <h4 class="fw-bold mb-2">${curso.titulo}</h4>
        <p class="small mb-1"><i class="bi bi-person-circle me-1"></i> ${curso.profesor}</p>
        <p class="small mb-1"><i class="bi bi-calendar-event me-1"></i> ${fecha}</p>
        <span class="precio-curso my-2 fw-bold h5">$${curso.precio.toFixed(2)}</span>
        <a href="curso.html?id=${curso.id}" class="btn btn-custom btn-sm mt-2 align-self-center px-4">Inscribirse</a>
      </div>
    `;
    contenedorCursos.appendChild(card);
  });
}

// Aplica los filtros seleccionados
function aplicarFiltros() {
  let filtrados = window.cursos; // usamos la variable global
  const cat = filtroCategoria.value;
  const mod = filtroModalidad.value;
  const nom = filtroNombre.value.trim().toLowerCase();
  const min = parseFloat(filtroPrecioMin.value);
  const max = parseFloat(filtroPrecioMax.value);

  if (cat !== "todos") filtrados = filtrados.filter(c => c.categoria === cat);
  if (mod !== "todos") filtrados = filtrados.filter(c => c.modalidad === mod);
  if (nom) filtrados = filtrados.filter(c => c.titulo.toLowerCase().includes(nom));
  if (!isNaN(min)) filtrados = filtrados.filter(c => c.precio >= min);
  if (!isNaN(max)) filtrados = filtrados.filter(c => c.precio <= max);

  renderCursos(filtrados);
}

// Vincular eventos a los controles de filtro
[filtroCategoria, filtroModalidad, filtroNombre, filtroPrecioMin, filtroPrecioMax]
  .forEach(el => {
    el.addEventListener("change", aplicarFiltros);
    el.addEventListener("input", aplicarFiltros);
  });

// Cuando se carga la página, renderear todo
document.addEventListener("DOMContentLoaded", () => {
  renderCursos(window.cursos);
});
