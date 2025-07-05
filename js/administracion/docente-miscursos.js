// docente-miscursos.js

async function cargarMisCursos(uid) {
  // Buscar los cursos donde el docenteId == uid
  const snap = await db.collection("cursos").where("docenteId", "==", uid).get();
  const cursos = [];
  for (const doc of snap.docs) {
    const data = doc.data();
    // Contar alumnos inscritos (opcional)
    const alumnosSnap = await db.collection("usuarios")
      .where("rol", "==", "alumno")
      .where("cursosInscritos", "array-contains", doc.id)
      .get();
    cursos.push({
      id: doc.id,
      nombre: data.titulo,
      descripcion: data.descripcion,
      fechaInicio: data.fechaInicio || "",
      numAlumnos: alumnosSnap.size || 0
    });
  }
  renderMisCursos(cursos);
}

function renderMisCursos(cursos) {
  const cont = document.getElementById('contenidoPanel');
  if (!cont) return;

  let html = `
    <div class="container-lg px-0">
      <div class="seccion-mis-cursos">
        <h2 class="mb-4"> 📚 Mis Cursos Asignados</h2>
        <div class="row gy-4 justify-content-center">
  `;
  if (!cursos.length) {
    html += `<div class="col-12"><div class="alert alert-info">No tienes cursos asignados actualmente.</div></div>`;
  } else {
    cursos.forEach(curso => {
      html += `
        <div class="col-md-12 col-lg-6">
          <div class="card card-curso-pro shadow h-100">
            <div class="card-body cardCursoContenido d-flex flex-column align-items-start">
              <h5 class="card-title estilosH5MisCursos mb-3" ">
                📚 ${curso.nombre}
              </h5>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success text-light px-2 py-1" style="font-size:0.98em;">
                  <i class="fas fa-users me-1"></i> ${curso.numAlumnos||0}
                </span>
                <span class="badge bg-dark text-light px-2 py-1" style="font-size:0.95em;">
                  📅 ${curso.fechaInicio || '—'}
                </span>
              </div>
              <button class="btn btnVerDetalles btn-outline-warning mt-auto w-100" data-id="${curso.id}" style="font-weight:600;">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }
  html += `</div></div></div>`;
  cont.innerHTML = html;
}



document.getElementById("linkMisCursos").addEventListener("click", async (e) => {
  e.preventDefault();
  // Cierra el sidebar en mobile si quieres
  document.getElementById("sidebar").classList.remove("open");
  document.body.classList.remove("sidebar-open");
  
  const user = firebase.auth().currentUser;
  if (user) {
    await cargarMisCursos(user.uid);
  }
});




// Evento: Click en cualquier "Ver detalles"
document.addEventListener('click', async function(e) {
  if (e.target.matches('.btnVerDetalles')) {
    const cursoId = e.target.getAttribute('data-id');
    if (!cursoId) return;

    // Loader opcional aquí (puedes poner un spinner o similar si quieres)

    // Buscar detalles del curso
    const cursoDoc = await db.collection('cursos').doc(cursoId).get();
    const curso = cursoDoc.data();
    curso.id = cursoDoc.id; // <--- añade esto

    // Buscar estudiantes inscritos
    const alumnosSnap = await db.collection('usuarios')
      .where('rol', '==', 'alumno')
      .where('cursosInscritos', 'array-contains', cursoId)
      .get();

    // Imagen destacada (si tienes en tu Firestore un campo tipo fotoCurso, si no omite esta línea)
    const imagenCurso = curso.fotoCurso 
      ? `<img src="${curso.fotoCurso}" class="img-fluid rounded mb-3 shadow" style="max-height:170px;object-fit:cover;width:100%">`
      : "";

    // Lista de alumnos (con icono)
    let alumnosHTML = '';
    if (alumnosSnap.empty) {
      alumnosHTML = `<p class="text-muted mb-1">No hay estudiantes inscritos en este curso.</p>`;
    } else {
      alumnosHTML = `<ul class="list-group list-group-flush mt-2 bg-transparent" style="background:rgba(255,255,255,0.02);">` +
        alumnosSnap.docs.map(doc => {
          const alumno = doc.data();
          return `<li class="list-group-item bg-transparent border-0 text-light d-flex align-items-center" style="border-bottom:1px solid #fff2;">
            <i class="fas fa-user-circle me-2 text-warning"></i> ${alumno.nombre || alumno.email}
            ${alumno.email ? `<span class="ms-auto badge bg-dark">${alumno.email}</span>` : ""}
          </li>`;
        }).join('') +
        `</ul>`;
    }

    // Enlace Zoom con copiar
    let zoomHtml = '';
    if (curso.linkZoom) {
      zoomHtml = `
        <div class="mb-2">
          <span class="badge bg-success"><i class="fas fa-video me-1"></i> Zoom:</span>
          <a href="${curso.linkZoom}" target="_blank" class="ms-2 fw-bold text-warning">Ir a Zoom</a>
          <button class="btn btn-outline-light btn-sm ms-2" style="padding:2px 8px;font-size:.98em;" onclick="navigator.clipboard.writeText('${curso.linkZoom}')">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      `;
    }

    // Construir el HTML principal
    // Fragmento para datos principales (fecha, alumnos, horario, zoom)
const datosCursoHtml = `
  <div class="info-row mb-2">
    <div><i class="fas fa-calendar-alt text-info me-2"></i><b>Fecha inicio:</b></div>
    <div class="info-value">${curso.fechaInicio || '—'}</div>
  </div>
  <div class="info-row mb-2">
    <div><i class="fas fa-users text-primary me-2"></i><b>Alumnos:</b></div>
    <div class="info-value">${alumnosSnap.size || 0}</div>
  </div>
  <div class="info-row mb-2">
    <div><i class="fas fa-clock text-warning me-2"></i><b>Horario:</b></div>
    <div class="info-value">${curso.horaClase || '—'}</div>
  </div>
  <div class="info-row mb-2">
    <div><i class="fas fa-video text-success me-2"></i><b>Zoom:</b></div>
    <div class="info-value">
      ${curso.linkZoom ? `
        <a href="${curso.linkZoom}" target="_blank" class="btn btn-sm btn-warning fw-bold me-2">Ir a Zoom</a>
        <button class="btn btn-outline-light btn-sm" style="padding:2px 8px;font-size:.98em;" onclick="navigator.clipboard.writeText('${curso.linkZoom}')">
          <i class="fas fa-copy"></i>
        </button>
      ` : '—'}
    </div>
  </div>
`;

// Y en el modalBody:
const modalBody = `
  <div class="detalle-curso-content">
    <h3 class="fw-bold mb-3"><i class="fas fa-chalkboard-teacher me-2 text-warning"></i>${curso.titulo}</h3>
    <p class="mb-2">${curso.descripcion || 'Sin descripción.'}</p>
    ${datosCursoHtml}
    <hr class="bg-light opacity-50">
    <h5 class="mt-2"><i class="fas fa-user-graduate me-1 text-warning"></i> Estudiantes Inscritos</h5>
    ${alumnosHTML}
    <div class=" d-flex justify-content-between   mt-4 text-end">
      <button class="btn btn-warning btnIrAlCurso mt-2 w-100" data-id="${curso.id}">
  <i class="fas fa-arrow-right"></i> Ir al curso
</button
    </div>
  </div>
`;


    // Lanzar el modal con SweetAlert2
    Swal.fire({
      title: '📚 Detalles del Curso',
      html: modalBody,
      width: 650,
      background: 'linear-gradient(139deg, #242832 0%, #2d2134 100%)',
      color: '#f1f1f1',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-4 shadow-lg curso-modal-pro'
      }
    });
  }
});




