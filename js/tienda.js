// cursos.js
// Array con los datos de los 16 cursos (ejemplo con 6, completa con tus 16)
const cursos = [
  {
    id: 1,
    titulo: "CONFERENCIA SOBRE FRACTURAMIENTO HIDRÁULICO",
    descripcion: "Aprende optimización de sistemas de bombeo mecánico.",
    imagen: "https://sivconsultingoil.com/wp-content/uploads/2024/11/FRACKING-PAGINA-WEB-420x420.jpg",
    fecha: "2025-05-31",
    profesor: "Ing. Carlos Martínez",
    modalidad: "online",
    categoria: "Petrolero",
    precio: 61
  },
  {
    id: 2,
    titulo: "Curso de Estaciones de Flujo (Baterias)",
    descripcion: "Medidas de seguridad y prevención de riesgos laborales.",
    imagen: "https://sivconsultingoil.com/wp-content/uploads/2024/11/SIV-CONSULTING-POST-BATERIAS-PTA-Y-PTC-WEB-420x420.jpg",
    fecha: "2025-06-19",
    profesor: "Lic. Ana Rivas",
    modalidad: "presencial",
    categoria: "Seguridad",
    precio: 100
  },
  {
    id: 3,
    titulo: "Optimización de Sistemas de Bombeo Electrosumergible",
    descripcion: "Curso integral de sistemas BES, teoría hidráulica y fundamentos eléctricos.",
    imagen: "https://sivconsultingoil.com/wp-content/uploads/2025/04/BOMBEO-420x420.jpg",
    fecha: "2025-06-14",
    profesor: "Ing. Javier Gómez",
    modalidad: "online",
    categoria: "Ingeniería",
    precio: 100
  },
  {
    id: 4,
    titulo: "CURSO DE RECORREDOR",
    descripcion: "Capacitar operadores de producción de campo integrales, con alto desempeño en las áreas de producción y tratamiento de Hidrocarburos.",
    imagen: "https://sivconsultingoil.com/wp-content/uploads/2020/09/pagina-web-recorredor-420x420.jpg",
    fecha: "2025-04-19",
    profesor: "Ing. Laura Fernández",
    modalidad: "presencial",
    categoria: "Seguridad",
    precio: 100
  },
  {
    id: 5,
    titulo: "CURSO INTEGRAL DE SISTEMAS DE BOMBEO ELECTROSUMERGIBLE",
    descripcion: "Capacitar operadores de producción de campo integrales, con alto desempeño en las áreas de producción y tratamiento de Hidrocarburos.",
    imagen: "https://sivconsultingoil.com/wp-content/uploads/2025/05/curso-de-esp-420x420.png",
    fecha: "2025-04-19",
    profesor: "Ing. Laura Fernández",
    modalidad: "presencial",
    categoria: "Seguridad",
    precio: 100
  },
  {
    id: 6,
    titulo: "SEMINARIO DE MONITOREO DURANTE LA PERFORACIÓN DE POZOS DIRECCIONALES",
    descripcion: "Capacitar a los participantes sobre el conocimiento básico de perforación direccional y monitoreo de parámetros durante la perforación.",
    imagen: "https://sivconsultingoil.com/wp-content/uploads/2020/08/perforacion-direccional-min-830x830.jpg",
    fecha: "2025-04-19",
    profesor: "Ing. Laura Fernández",
    modalidad: "presencial",
    categoria: "Seguridad",
    precio: 100
  }
  // ... añade el resto hasta 16 cursos
];

// tienda.js
// Seleccionar elementos del DOM
const contenedorCursos    = document.getElementById("contenedor-cursos");
const filtroCategoria     = document.getElementById("filtro-categoria");
const filtroModalidad     = document.getElementById("filtro-modalidad");
const filtroNombre        = document.getElementById("filtro-nombre");
const filtroPrecioMin     = document.getElementById("precio-min");
const filtroPrecioMax     = document.getElementById("precio-max");

// Función para renderizar las tarjetas de los cursos
function renderCursos(lista) {
  contenedorCursos.innerHTML = '';
  if (lista.length === 0) {
    contenedorCursos.innerHTML = `<p class="mb-4">No se encontraron cursos.</p>`;
    return;
  }
  lista.forEach(curso => {
    const fecha = new Date(curso.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    const card = document.createElement('div');
    card.className = 'card-curso';
    card.innerHTML = `
      <img src="${curso.imagen}" alt="${curso.titulo}" class="curso-img">
      <div class="contenido-curso">
        <h4>${curso.titulo}</h4>
        <p class="small mb-1"><strong>Profesor:</strong> ${curso.profesor}</p>
        <p class="small mb-1"><strong>Modalidad:</strong> ${curso.modalidad}</p>
        <p class="small mb-3"><strong>Fecha:</strong> ${fecha}</p>
        <span class="precio-curso mb-3 fw-bold">$${curso.precio.toFixed(2)}</span>
        <a href="curso.html?id=${curso.id}" class="btn btn-custom btn-sm">Información</a>
      </div>
    `;
    contenedorCursos.appendChild(card);
  });
}

// Función para filtrar
function aplicarFiltros() {
  let filtrados = cursos;
  const cat   = filtroCategoria.value;
  const mod   = filtroModalidad.value;
  const nom   = filtroNombre.value.trim().toLowerCase();
  const min   = parseFloat(filtroPrecioMin.value);
  const max   = parseFloat(filtroPrecioMax.value);

  // Filtrar por categoría
  if (cat !== 'todos') {
    filtrados = filtrados.filter(c => c.categoria === cat);
  }
  // Filtrar por modalidad
  if (mod !== 'todos') {
    filtrados = filtrados.filter(c => c.modalidad === mod);
  }
  // Filtrar por nombre
  if (nom !== '') {
    filtrados = filtrados.filter(c => c.titulo.toLowerCase().includes(nom));
  }
  // Filtrar por precio mínimo
  if (!isNaN(min)) {
    filtrados = filtrados.filter(c => c.precio >= min);
  }
  // Filtrar por precio máximo
  if (!isNaN(max)) {
    filtrados = filtrados.filter(c => c.precio <= max);
  }

  renderCursos(filtrados);
}

// Eventos de cambio/input en los filtros
[filtroCategoria, filtroModalidad, filtroNombre, filtroPrecioMin, filtroPrecioMax]
  .forEach(el => el.addEventListener('change', aplicarFiltros) || el.addEventListener('input', aplicarFiltros));

// Render inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  renderCursos(cursos);
});
