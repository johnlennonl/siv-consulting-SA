// panelAlumno.js
document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) return;
    const db = firebase.firestore();
    const ud = await db.collection("usuarios").doc(user.uid).get();
    if (!ud.exists || ud.data().rol !== "alumno") return;

    const cursos = ud.data().cursosInscritos || [];
    if (!cursos.length) {
      document.getElementById("panelAlumnoTabs").innerHTML = "<p class='text-muted'>No tienes cursos asignados aún.</p>";
      return;
    }

    // Selector de cursos si tiene más de uno
    let selectHtml = "";
    if (cursos.length > 1) {
      selectHtml = `
        <div class="mb-3">
          <select class="form-select" id="selectCursoAlumno">
            ${cursos.map((id, i) => `<option value="${id}">Curso ${i + 1}</option>`).join("")}
          </select>
        </div>
      `;
      document.getElementById("cursos-container").insertAdjacentHTML("afterbegin", selectHtml);
    }

    // Variables globales
    let cursoActual = cursos[0];
    const tabContenido = document.getElementById("contenidoTabAlumno");

    // 1. Info del Curso
    async function renderInfoCurso(idCurso) {
      const cdoc = await db.collection("cursos").doc(idCurso).get();
      if (!cdoc.exists) {
        tabContenido.innerHTML = `<div class="alert alert-danger">No se encontró el curso.</div>`;
        return;
      }
      const c = cdoc.data();
      tabContenido.innerHTML = `
        <div class="card bg-dark text-white p-4 rounded-4 mb-4 cardCurso">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-secondary">100% En Vivo</span>
            <small class="text-muted">ID: ${cdoc.id}</small>
          </div>
          <h3 class="mb-2"><i class="fas fa-book-open me-2"></i>${c.titulo}</h3>
          <p class="mb-1"><i class="fas fa-calendar-alt me-2 text-info"></i><strong>Inicio:</strong> ${c.fechaInicio}</p>
          <p class="mb-1"><i class="fas fa-clock me-2 text-warning"></i><strong>Hora:</strong> ${c.horaClase}</p>
          <p class="mb-1"><i class="fas fa-calendar-day me-2 text-primary"></i><strong>Días:</strong> ${c.diasClase.join(", ")}</p>
          <p class="mt-3"><i class="fas fa-align-left me-2 text-secondary"></i><strong>Descripción:</strong> ${c.descripcion || "Sin descripción."}</p>
          <div class="d-flex align-items-center gap-3 my-3">
            <span class="fw-bold"><i class="fas fa-chalkboard-teacher me-2"></i>${c.docente}</span>
          </div>
          <a href="${c.linkZoom}" target="_blank" class="btn btn-outline-warning fw-bold mb-2 btnVerClase">
            <i class="fas fa-video me-2"></i>Entrar a clase en vivo
          </a>
          <div class="mt-4">
            <h5><i class="fas fa-play-circle me-2"></i>Video Tutorial</h5>
            <div class="ratio ratio-16x9 " style="max-width: 500px;">
              <iframe src="https://www.youtube.com/embed/${c.videoTutorial}" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Temario
    // --- Tab Temario ---
async function renderTemario(idCurso) {
  const db = firebase.firestore();
  const tabContenido = document.getElementById("contenidoTabAlumno");
  tabContenido.innerHTML = `<div class="text-center text-muted">Cargando temario...</div>`;

  // Traer todos los documentos del temario (puede ser más de una unidad)
  const temarioSnap = await db.collection("cursos").doc(idCurso).collection("temario").orderBy("orden").get();

  if (temarioSnap.empty) {
    tabContenido.innerHTML = `<div class="alert alert-warning">No hay temario cargado para este curso.</div>`;
    return;
  }

  let temarioHTML = `
    <div class="card bg-dark text-white p-4 rounded-4 mb-4">
      <h4 style="color:#fee084;"><i class="fas fa-list me-2"></i>Temario del Curso</h4>
      <div class="mt-3">
  `;
let unidadCount = 1;
temarioSnap.forEach((doc) => {
  const t = doc.data();
  temarioHTML += `
    <div class="mb-3">
      <div style="font-weight: bold; color: #fee084; font-size: 1.1rem;">
        ${unidadCount++}. ${t.tituloUnidad ? t.tituloUnidad.toUpperCase() : 'SIN TÍTULO'}
      </div>
      <ol class="mt-2" style="color: #fff;">
        ${
          Array.isArray(t.temas) && t.temas.length
            ? t.temas.map(tm => `<li style="margin-bottom:4px;">${tm}</li>`).join("")
            : '<li class="text-muted">Sin temas en esta unidad</li>'
        }
      </ol>
    </div>
  `;
});


  temarioHTML += `</div></div>`;
  tabContenido.innerHTML = temarioHTML;
}


    // 3. Actividades y notas
    async function renderActividadesNotas(idCurso, alumnoId) {
      tabContenido.innerHTML = `<div class="alert alert-info">Actividades y notas en construcción.</div>`;
    }

    // 4. Recursos
    // --- Tab Recursos (Diseño: Título + Botón al lado) ---
// --- Tab Recursos (Título en mayúsculas + botón al lado) ---
async function renderTabRecursos(idCurso) {
  const db = firebase.firestore();
  const tabContenido = document.getElementById("contenidoTabAlumno");
  tabContenido.innerHTML = `<div class="text-center text-muted">Cargando recursos...</div>`;

  // Traer recursos desde la subcolección
  const recursosSnap = await db.collection("cursos").doc(idCurso).collection("recursos").get();

  let recursosHTML = "";
  if (recursosSnap.empty) {
    recursosHTML = `<p class="text-muted">No hay recursos disponibles.</p>`;
  } else {
    recursosHTML = Array.from(recursosSnap.docs).map(doc => {
      const r = doc.data();
      return `
        <div class="d-flex align-items-center justify-content-between bg-dark rounded-3 p-2 mb-2" style="border: 1px solid #222;">
          <span class="fw-semibold" style="color:#fee084; letter-spacing:1px">${(r.nombre || '').toUpperCase()}</span>
          <a href="${r.url}" target="_blank" class="btn btn-outline-info btn-sm ms-3">
            <i class="fas fa-download me-1"></i>Ver/Descargar
          </a>
        </div>
      `;
    }).join("");
  }

  tabContenido.innerHTML = `
    <div class="card bg-dark text-white p-4 rounded-4 mb-4">
      <h4 style="color:#fee084"><i class="fas fa-folder-open me-2"></i>Recursos del Curso</h4>
      <div class="mt-3">${recursosHTML}</div>
    </div>
  `;
}



    // 5. Certificado
    async function renderCertificado(idCurso, alumnoId) {
      tabContenido.innerHTML = `<div class="alert alert-info">Certificado en construcción.</div>`;
    }

    // Función para cambiar de tab
    async function cargarTab(tab) {
      if (tab === "resumen") await renderInfoCurso(cursoActual);
      else if (tab === "temario") await renderTemario(cursoActual);
      else if (tab === "actividades") await renderActividadesNotas(cursoActual, user.uid);
      else if (tab === "recursos") await renderTabRecursos(cursoActual);
      else if (tab === "certificados") await renderCertificado(cursoActual, user.uid);
      else tabContenido.innerHTML = `<div class="alert alert-info">Tab en construcción: ${tab}</div>`;
    }

    // Listeners de tabs
    document.querySelectorAll("#tabsAlumno .nav-link").forEach(tab => {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll("#tabsAlumno .nav-link").forEach(x => x.classList.remove("active"));
        this.classList.add("active");
        cargarTab(this.dataset.tab);
      });
    });

    // Cambio de curso (si hay más de uno)
    const selectCurso = document.getElementById("selectCursoAlumno");
    if (selectCurso) {
      selectCurso.addEventListener("change", function () {
        cursoActual = this.value;
        cargarTab(document.querySelector("#tabsAlumno .nav-link.active").dataset.tab);
      });
    }

    // Mostrar el primer tab al cargar
    cargarTab("resumen");
  });
});
