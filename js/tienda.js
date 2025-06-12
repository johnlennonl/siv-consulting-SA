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
    contenedorCursos.innerHTML = `<p class="mb-4 text-center">No se encontraron cursos.</p>`;
    return;
  }
  lista.forEach(curso => {
    const fecha = new Date(curso.fecha)
      .toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    const card = document.createElement("div");
    card.className = "card-curso";
    card.innerHTML = `
      <img src="${curso.imagen}" alt="${curso.titulo}" class="curso-img">
      <div class="contenido-curso">
        <h4>${curso.titulo}</h4>
        <p class="small mb-1"><strong>Profesor:</strong> ${curso.profesor}</p>
        <p class="small mb-1"><strong>Modalidad:</strong> ${curso.modalidad}</p>
        <p class="small mb-3"><strong>Fecha:</strong> ${fecha}</p>
        <span class="precio-curso mb-3 fw-bold">$${curso.precio.toFixed(2)}</span>
        <a href="curso.html?id=${curso.id}" class="btn btn-custom btn-sm">Inscribirse</a>
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