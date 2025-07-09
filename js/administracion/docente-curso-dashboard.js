// Evento global: click en "Ir al curso"
document.addEventListener('click', async function(e) {
  if (e.target.closest('.btnIrAlCurso')) {
    const btn = e.target.closest('.btnIrAlCurso');
    const cursoId = btn.getAttribute('data-id');
    if (!cursoId) return;

    // Cierra SweetAlert2 si está abierto
    if (typeof Swal !== "undefined" && Swal.isVisible()) Swal.close();

    // Cierra modal Bootstrap si está abierto
    const modalEl = document.getElementById('modalDetallesCurso');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    mostrarDashboardCurso(cursoId);
  }
});


// NUEVA versión de mostrarDashboardCurso con TABS (dashboard pro)
async function mostrarDashboardCurso(cursoId) {
  const db = firebase.firestore();
  const cursoDoc = await db.collection('cursos').doc(cursoId).get();
  const curso = cursoDoc.data();
  if (!curso) {
    return Swal.fire('Error', 'Curso no encontrado', 'error');
  }

  // Renderiza la estructura principal con tabs
  document.getElementById('contenidoPanel').innerHTML = `
    <div class=" curso-dashboard-container animate__animated animate__fadeIn">
      <div class="d-flex justify-content-between align-items-center mb-3 gap-2 m-3">
        <h2><i class="fas fa-chalkboard-teacher me-2"></i>${curso.titulo}</h2>
        ${curso.linkZoom ? `<a href="${curso.linkZoom}" target="_blank" class="btn btn-warning btn-sm"><i class="fas fa-video"></i> Zoom</a>` : ''}
      </div>
      <ul class="nav nav-tabs mb-3 m-3" id="cursoTabs">
        <li class="nav-item"><a class="nav-link active" data-tab="estudiantes" href="#">Estudiantes</a></li>
        <li class="nav-item"><a class="nav-link" data-tab="recursos" href="#">Recursos</a></li>
        <li class="nav-item"><a class="nav-link" data-tab="temario" href="#">Temario</a></li>
        <li class="nav-item"><a class="nav-link" data-tab="calificaciones" href="#">Calificaciones</a></li>
        <li class="nav-item"><a class="nav-link" data-tab="estadisticas" href="#">Estadísticas</a></li>
      </ul>
      <div id="tabContenido"></div>
    </div>
  `;

  // Cargar la pestaña por defecto (Estudiantes)
  cargarTabEstudiantes(cursoId);

  // Listeners de tabs
  document.querySelectorAll('#cursoTabs .nav-link').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('#cursoTabs .nav-link').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      if (tabName === 'estudiantes') cargarTabEstudiantes(cursoId);
      else if (tabName === 'recursos') cargarTabRecursos(cursoId);
      else if (tabName === 'temario') cargarTabTemario(cursoId);
      else if (tabName === 'calificaciones') cargarTabCalificaciones(cursoId);
      else if (tabName === 'estadisticas') cargarTabEstadisticas(cursoId);
    });
  });
}

// Tab 1: Estudiantes
async function cargarTabEstudiantes(cursoId) {
  const db = firebase.firestore();
  const alumnosSnap = await db.collection('usuarios')
    .where('rol', '==', 'alumno')
    .where('cursosInscritos', 'array-contains', cursoId)
    .get();

  let html = `
    <h4>👨🏼‍🎓 Estudiantes Inscritos</h4>
    <ul class="lista-estudiantes">
      ${alumnosSnap.docs.length === 0 
        ? `<div class="alert alert-warning">No hay estudiantes inscritos en este curso.</div>`
        : alumnosSnap.docs.map(doc => {
            const al = doc.data();
            return `<li>
              <span class="nombre-estudiante"><i class="fas fa-user me-2"></i> ${al.nombre || al.email}</span>
              <span class="correo-estudiante">${al.email}</span>
              <!-- Aquí podrás agregar más acciones, como calificar -->
            </li>`;
          }).join('')}
    </ul>
  `;
  document.getElementById('tabContenido').innerHTML = html;
}

// Tab 2: Recursos
async function cargarTabRecursos(cursoId) {
  // Traer recursos de Firestore (colección 'cursos/{cursoId}/recursos')
  const recursosSnap = await firebase.firestore()
    .collection('cursos').doc(cursoId)
    .collection('recursos')
    .orderBy('fecha', 'desc')
    .get();

  let recursosHTML = '';
  if (recursosSnap.empty) {
    recursosHTML = `<div class="text-muted py-2">Aún no hay recursos para este curso.</div>`;
  } else {
    recursosHTML = '<ul class="list-group mb-3">';
    recursosSnap.forEach(doc => {
      const r = doc.data();
      recursosHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center" style="background:#2a2835;color:#fff;">
          <div>
            <b>🔗</b>
            <span style="margin-left:5px">${r.nombre || r.url}</span>
            <a href="${r.url}" target="_blank" style="margin-left:10px;color:#00c2a8;">Abrir</a>
          </div>
          <button class="btn btn-danger btn-sm btnEliminarRecurso" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
        </li>
      `;
    });
    recursosHTML += '</ul>';
  }

  document.getElementById('tabContenido').innerHTML = `
    <div class="mb-3">
      <h4><i class="fas fa-folder-plus me-2 text-warning"></i>Gestión de Recursos (Solo Enlaces)</h4>
      <form id="formAgregarRecurso" class="row g-2 align-items-end mb-3" autocomplete="off">
        <div class="col-12 col-md-5">
          <label class="form-label">Nombre o Descripción</label>
          <input type="text" class="form-control" id="nombreRecurso" placeholder="Ej: Manual Unidad 1" required>
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label">URL del recurso</label>
          <input type="url" class="form-control" id="linkRecurso" placeholder="https://..." required>
        </div>
        <div class="col-12 col-md-2">
          <button class="btn btn-success w-100" type="submit"><i class="fas fa-plus"></i> Agregar</button>
        </div>
      </form>
    </div>
    <div id="listaRecursos">
      ${recursosHTML}
    </div>
  `;

  // Agregar recurso (solo enlace)
  document.getElementById('formAgregarRecurso').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreRecurso').value.trim();
    const url = document.getElementById('linkRecurso').value.trim();

    if (!nombre || !url) {
      Swal.fire("Faltan datos", "Debes ingresar el nombre y el enlace.", "warning");
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      Swal.fire("Enlace inválido", "Debe empezar con http:// o https://", "warning");
      return;
    }

    await firebase.firestore().collection('cursos').doc(cursoId).collection('recursos').add({
      tipo: 'link',
      nombre,
      url,
      fecha: firebase.firestore.Timestamp.now()
    });
    Swal.fire("¡Recurso agregado!", "", "success");
    cargarTabRecursos(cursoId);
  });

  // Eliminar recurso
  document.querySelectorAll('.btnEliminarRecurso').forEach(btn => {
    btn.addEventListener('click', async function() {
      const recursoId = this.getAttribute('data-id');
      const confirm = await Swal.fire({
        title: '¿Eliminar recurso?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (confirm.isConfirmed) {
        await firebase.firestore().collection('cursos').doc(cursoId).collection('recursos').doc(recursoId).delete();
        Swal.fire("Eliminado", "", "success");
        cargarTabRecursos(cursoId);
      }
    });
  });
}



// Tab 3: Temario
async function cargarTabTemario(cursoId) {
  const db = firebase.firestore();
  const temarioSnap = await db
    .collection('cursos').doc(cursoId)
    .collection('temario')
    .orderBy('orden')
    .get();

  // Mostrar unidades existentes
  let temarioHTML = '';
  temarioSnap.forEach(doc => {
    const t = doc.data();
    temarioHTML += `
      <div class="unidad-temario mb-4 p-3 rounded shadow-sm" style="background:#24232e;">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <h5 class="mb-1" style="color:#fee084">${t.tituloUnidad}</h5>
          <div>
            <button class="btn btn-sm btn-warning btnEditarUnidad" data-id="${doc.id}" title="Editar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger btnEliminarUnidad" data-id="${doc.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <ol class="mb-1">
          ${(t.temas||[]).map(tema=>`<li>${tema}</li>`).join('')}
        </ol>
      </div>
    `;
  });

  // Formulario para agregar nueva unidad
  temarioHTML += `
    <form id="formNuevaUnidad" class="bg-dark p-3 rounded mb-4">
      <h5 class="mb-2" style="color:#fee084"><i class="fas fa-plus me-2"></i>Agregar Unidad</h5>
      <div class="mb-2">
        <label>Título de la unidad:</label>
        <input type="text" class="form-control" id="tituloNuevaUnidad" placeholder="Ej: UNIDAD III: ..." required>
      </div>
      <div class="mb-2">
        <label>Temas (uno por línea):</label>
        <textarea class="form-control" id="temasNuevaUnidad" rows="4" placeholder="Tema 1&#10;Tema 2&#10;Tema 3" required></textarea>
      </div>
      <button class="btn btn-success" type="submit"><i class="fas fa-plus"></i> Agregar Unidad</button>
    </form>
  `;

  document.getElementById('tabContenido').innerHTML = temarioHTML;

  // Agregar nueva unidad
  document.getElementById('formNuevaUnidad').onsubmit = async function(e) {
    e.preventDefault();
    const titulo = document.getElementById('tituloNuevaUnidad').value.trim();
    const temas = document.getElementById('temasNuevaUnidad').value
      .split('\n')
      .map(t => t.trim()).filter(Boolean);

    // Orden: el siguiente
    const orden = temarioSnap.size + 1;

    await db.collection('cursos').doc(cursoId).collection('temario').add({
      orden,
      tituloUnidad: titulo,
      temas,
      fecha: firebase.firestore.Timestamp.now()
    });

    Swal.fire("Unidad agregada", "", "success");
    cargarTabTemario(cursoId);
  };

  // Eliminar unidad
  document.querySelectorAll('.btnEliminarUnidad').forEach(btn => {
    btn.onclick = async function() {
      const id = this.getAttribute('data-id');
      const ok = await Swal.fire({
        title: "¿Eliminar unidad?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
      if (ok.isConfirmed) {
        await db.collection('cursos').doc(cursoId).collection('temario').doc(id).delete();
        Swal.fire("Eliminada", "", "success");
        cargarTabTemario(cursoId);
      }
    }
  });

  // Editar unidad (simple: vuelve a llenar el form)
  document.querySelectorAll('.btnEditarUnidad').forEach(btn => {
    btn.onclick = async function() {
      const id = this.getAttribute('data-id');
      const doc = await db.collection('cursos').doc(cursoId).collection('temario').doc(id).get();
      const data = doc.data();
      const { value: formValues } = await Swal.fire({
        title: 'Editar unidad',
        html:
          `<input id="swalTitulo" class="swal2-input" value="${data.tituloUnidad}">` +
          `<textarea id="swalTemas" class="swal2-textarea" rows="5" style="min-height:90px;">${(data.temas||[]).join('\n')}</textarea>`,
        focusConfirm: false,
        preConfirm: () => [
          document.getElementById('swalTitulo').value,
          document.getElementById('swalTemas').value
        ]
      });
      if (formValues) {
        await db.collection('cursos').doc(cursoId).collection('temario').doc(id).update({
          tituloUnidad: formValues[0],
          temas: formValues[1].split('\n').map(x=>x.trim()).filter(Boolean)
        });
        Swal.fire("Editado", "", "success");
        cargarTabTemario(cursoId);
      }
    }
  });
}

// Tab 4: Calificaciones y Resumen
async function cargarTabCalificaciones(cursoId) {
  const db = window.db || firebase.firestore();

  // 1. Traer actividades (evaluaciones)
  const actsSnap = await db
    .collection('cursos').doc(cursoId)
    .collection('actividades')
    .orderBy('fecha')
    .get();
  const actividades = actsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // 2. Renderizar cards de actividades
  let actsHTML = '';
  if (!actividades.length) {
    actsHTML = `<div class="alert alert-info">Aún no hay actividades registradas. Crea la primera.</div>`;
  } else {
    actsHTML = actividades.map(act => `
      <div class="actividad-card mb-3 p-3 rounded-3 shadow-sm" style="background:#232029; border-left: 4px solid #fee084;">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <b style="font-size:1.16rem; color:#fee084;">${act.titulo}</b>
            <p class="mb-1" style="color:#e1e1e1">${act.descripcion || ''}</p>
          </div>
          <div>
            <button class="btn btn-sm btnCalificarActividad" 
                    style="background:#1fa37a;color:#fff;font-weight:600;box-shadow:0 1px 8px #2222"
                    data-id="${act.id}" data-titulo="${act.titulo}">
              <i class="fas fa-pen"></i> Calificar
            </button>
            <button class="btn btn-sm btn-danger btnEliminarActividad" 
                    style="margin-left:6px;" data-id="${act.id}" data-titulo="${act.titulo}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');actsHTML = actividades.map(act => `
  <div class="actividad-card mb-3 p-3 rounded-3 shadow-sm" style="background:#232029; border-left: 4px solid #fee084;">
    <div>
      <b style="font-size:1.15rem; color:#fee084; display:block; margin-bottom:2px;">${act.titulo}</b>
      <div style="color:#e1e1e1; margin-bottom:8px; font-size:1.03rem;">${act.descripcion || ''}</div>
      <div class="d-flex gap-2 flex-wrap mt-2" style="justify-content: flex-start;">
        <button class="btn btn-outline-warning btn-sm btnEditarActividad" 
          data-id="${act.id}" data-titulo="${act.titulo}" style="font-weight:600;">
          <i class="fas fa-edit"></i> Editar ejercicio
        </button>
        <button class="btn btn-success btn-sm btnCalificarActividad"
          data-id="${act.id}" data-titulo="${act.titulo}" style="font-weight:600;">
          <i class="fas fa-user-graduate"></i> Calificar estudiantes
        </button>
        <button class="btn btn-danger btn-sm btnEliminarActividad"
          data-id="${act.id}" data-titulo="${act.titulo}" style="font-weight:600;">
          <i class="fas fa-trash"></i> Eliminar ejercicio
        </button>
      </div>
    </div>
  </div>
`).join('');

  }

  // 3. Render general del tab (¡Agregamos el resumen aquí!)
  document.getElementById('tabContenido').innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h4><i class="fas fa-clipboard-list me-2 text-warning"></i>Gestión de Calificaciones</h4>
      <button class="btn btn-success btn-sm" id="btnAgregarActividad"><i class="fas fa-plus"></i> Nueva Actividad</button>
    </div>
    <div id="actividadesLista">${actsHTML}</div>
    <div id="resumenNotas"></div>
  `;

 document.getElementById('btnAgregarActividad').onclick = async () => {
  const { value: formValues } = await Swal.fire({
    title: '<span style="color:#e8bb3f;font-size:1.1em;font-weight:800"><i class="fas fa-file-alt me-2"></i>Nueva Actividad</span>',
    html: `
      <div style="text-align:left;">
        
        <input id="tituloActividad" class="swal2-input " placeholder="Ej: Ejercicio de bombas" style=" margin-bottom:17px;border-radius:10px;border:1.5px solid #1fa37a;background:#232029;color:#fff;font-size:1.08em;">

        
        <textarea id="descActividad" class="swal2-textarea" placeholder="Describe la actividad (opcional)" rows="3" style=";border-radius:10px;border:1.5px solid #1fa37a;background:#232029;color:#fff;font-size:1.07em;"></textarea>
      </div>
    `,
    background: "#191927",
    color: "#f1f1f1",
    confirmButtonText: "<i class='fas fa-plus'></i> Agregar",
    cancelButtonText: "<i class='fas fa-times'></i> Cancelar",
    showCancelButton: true,
    focusConfirm: false,
    customClass: {
      popup: 'rounded-4 montserrat-font',
      confirmButton: 'btn btn-success fw-bold px-4 py-2 rounded-3',
      cancelButton: 'btn btn-secondary fw-bold px-4 py-2 rounded-3'
    },
    preConfirm: () => {
      const titulo = document.getElementById('tituloActividad').value.trim();
      const descripcion = document.getElementById('descActividad').value.trim();
      if (!titulo) {
        Swal.showValidationMessage('El título es obligatorio');
        return false;
      }
      return [titulo, descripcion];
    }
  });

  if (formValues && formValues[0]) {
    await db.collection('cursos').doc(cursoId).collection('actividades').add({
      titulo: formValues[0],
      descripcion: formValues[1],
      fecha: firebase.firestore.Timestamp.now()
    });
    Swal.fire({
      icon: 'success',
      title: '¡Actividad agregada!',
      background: "#232029",
      color: "#fff",
      timer: 1200,
      toast: true,
      position: "top-end",
      showConfirmButton: false
    });
    cargarTabCalificaciones(cursoId);
  }
};


  // Eliminar actividad (¡Elimina actividad y TODAS sus notas!)
  document.querySelectorAll('.btnEliminarActividad').forEach(btn => {
    btn.onclick = async function () {
      const actId = btn.getAttribute('data-id');
      const titulo = btn.getAttribute('data-titulo');
      const confirm = await Swal.fire({
        title: '¿Eliminar actividad?',
        html: `<b>${titulo}</b><br><small>Se eliminarán también todas las notas asociadas.</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: "#191927",
        color: "#fee084"
      });
      if (confirm.isConfirmed) {
        // Borra las notas de la actividad
        const notasSnap = await db.collection('cursos').doc(cursoId)
          .collection('actividades').doc(actId)
          .collection('notas').get();
        const batch = db.batch();
        notasSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        // Borra la actividad
        await db.collection('cursos').doc(cursoId)
          .collection('actividades').doc(actId).delete();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Actividad eliminada',
          showConfirmButton: false,
          timer: 1000,
          background: "#fee084",
          color: "#191927"
        });
        cargarTabCalificaciones(cursoId);
      }
    };
  });

  // Calificar actividad (por alumno)
  document.querySelectorAll('.btnCalificarActividad').forEach(btn => {
  btn.onclick = async function () {
    const actId = this.getAttribute('data-id');
    const tituloAct = this.getAttribute('data-titulo');
    const db = window.db || firebase.firestore();

    // Traer alumnos
    const alumnosSnap = await db
      .collection('usuarios')
      .where('rol', '==', 'alumno')
      .where('cursosInscritos', 'array-contains', cursoId)
      .get();
    const alumnos = alumnosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Traer notas y respuestas
    const notasSnap = await db
      .collection('cursos').doc(cursoId)
      .collection('actividades').doc(actId)
      .collection('notas').get();
    const notas = {};
    const respuestas = {};
    notasSnap.forEach(n => {
      notas[n.id] = n.data().nota;
      respuestas[n.id] = n.data().respuesta || '';
    });

    // Tabla HTML
    let html = `
      <div class="swal-tabla-calif" style="max-height:400px;overflow-y:auto">
        <table style="width:100%;">
          <thead>
            <tr style="border-bottom:1px solid #333">
              <th style="color:#fee084;text-align:left;">Alumno</th>
              <th style="color:#fee084;">Respuesta</th>
              <th style="color:#fee084;">Nota</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
    `;
    for (const alumno of alumnos) {
      let tieneRespuesta = !!respuestas[alumno.id];
      const respuestaTexto = respuestas[alumno.id] || "";
      html += `
        <tr>
          <td style="color:#fff;font-weight:500;min-width:120px">${alumno.nombre || alumno.email}</td>
          <td style="font-size:0.97rem;max-width:220px;word-break:break-word;color:#fee084;">
            <div style="background:#191927;border-radius:7px;padding:5px 8px;text-align:center;">
              ${
                tieneRespuesta
                  ? `<button class="btn btn-link btn-sm verRespuestaBtn" data-respuesta="${encodeURIComponent(respuestaTexto)}" data-alumno="${alumno.nombre || alumno.email}" style="color:#fee084;padding:0 6px;font-weight:bold;text-decoration:underline"><i class="fas fa-eye"></i> Ver</button>`
                  : '<span style="color:#888">No enviado</span>'
              }
            </div>
          </td>
          <td>
            <input type="number" min="0" max="20" step="0.1"
              class="nota-alumno-input"
              style="width:70px;background:#181927;color:#fee084;border:1px solid #444;border-radius:7px;text-align:center"
              value="${notas[alumno.id] !== undefined ? notas[alumno.id] : ''}"
              data-alum="${alumno.id}">
          </td>
          <td class="d-flex align-items-center gap-2">
            <button class="btn btn-primary btn-sm btnDescargarRespuesta d-flex align-items-center"
                    title="Descargar" data-respuesta="${encodeURIComponent(respuestaTexto)}" data-alumno="${alumno.nombre || alumno.email}">
              <i class="fas fa-download me-1"></i> Descargar
            </button>
            <button class="btn btn-warning btn-sm btnGuardarNota d-flex align-items-center"
                    title="Guardar nota" data-alum="${alumno.id}">
              <i class="fas fa-save me-1"></i>
            </button>
            <button class="btn btn-danger btn-sm btnEliminarNota d-flex align-items-center"
                    title="Eliminar nota" data-alum="${alumno.id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }
    html += `</tbody></table></div>`;

    // Modal de SweetAlert
    Swal.fire({
      title: `<div class="swal-titulo-actividad" style="color:#fee084;font-weight:900;font-size:2rem;">${tituloAct.toUpperCase()}</div>`,
      html: html,
      width: 700,
      background: "#191927",
      color: "#fee084",
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: 'swal-popup-notas' }
    });

    // Espera que el HTML esté en el DOM para los listeners:
    setTimeout(() => {
      // Ver respuesta
      document.querySelectorAll('.verRespuestaBtn').forEach(btn => {
        btn.onclick = function() {
          const texto = decodeURIComponent(this.dataset.respuesta);
          const alumno = this.dataset.alumno;
          Swal.fire({
            title: `Respuesta de ${alumno}`,
            html: `<div style="text-align:left;max-height:350px;overflow:auto;padding:8px 2px;">
              <pre style="white-space:pre-wrap;font-size:1rem;color:#fee084;">${texto}</pre>
            </div>`,
            background: "#191927",
            color: "#fee084",
            confirmButtonText: "Cerrar",
            width: 600,
          });
        }
      });

      // Descargar respuesta
      document.querySelectorAll('.btnDescargarRespuesta').forEach(btn => {
        btn.onclick = function() {
          const respuesta = decodeURIComponent(this.dataset.respuesta);
          const alumno = (this.dataset.alumno || "alumno").replace(/\s+/g, "_");
          Swal.fire({
            title: 'Descargar respuesta',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Descargar TXT',
            denyButtonText: 'Descargar Word',
            background: "#191927",
            color: "#fee084"
          }).then((result) => {
            let nombreArchivo = `respuesta_${alumno}.`;
            if (result.isConfirmed) {
              const blob = new Blob([respuesta], { type: "text/plain" });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = nombreArchivo + "txt";
              link.click();
            } else if (result.isDenied) {
              const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>`;
              const footer = "</body></html>";
              const sourceHTML = header + "<pre>" + respuesta + "</pre>" + footer;
              const blob = new Blob(['\ufeff', sourceHTML], { type: "application/msword" });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = nombreArchivo + "doc";
              link.click();
            }
          });
        }
      });

      // Guardar nota
      document.querySelectorAll('.btnGuardarNota').forEach(btnNota => {
        btnNota.onclick = async function () {
          const alumId = btnNota.getAttribute('data-alum');
          const notaVal = document.querySelector(`.nota-alumno-input[data-alum="${alumId}"]`).value;
          let nota = notaVal ? parseFloat(notaVal) : null;
          if (nota < 0) nota = 0;
          if (nota > 20) nota = 20;
          try {
            await db
              .collection('cursos').doc(cursoId)
              .collection('actividades').doc(actId)
              .collection('notas').doc(alumId)
              .set({ nota, respuesta: respuestas[alumId] }, { merge: true });
            // Notifica al alumno (opcional)
            await db.collection('usuarios').doc(alumId)
              .collection('notificaciones').add({
                mensaje: `Se ha calificado tu actividad <b>${tituloAct}</b> con <b>${nota}</b>.`,
                fecha: firebase.firestore.Timestamp.now(),
                leido: false,
                cursoId,
                actividadId: actId
              });
            btnNota.innerHTML = '<i class="fas fa-check"></i>';
            btnNota.style.background = "#fee084";
            btnNota.style.color = "#191927";
            btnNota.disabled = true;
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Nota actualizada',
              showConfirmButton: false,
              timer: 900,
              background: "#fee084",
              color: "#191927"
            });
            setTimeout(() => {
              btnNota.innerHTML = '<i class="fas fa-save"></i>';
              btnNota.style.background = "#1fa37a";
              btnNota.style.color = "#fff";
              btnNota.disabled = false;
            }, 1000);
            if (typeof cargarResumenNotas === 'function') cargarResumenNotas(cursoId);
          } catch (err) {
            Swal.fire("Error", err.message, "error");
            console.error('Error guardando nota:', err);
          }
        }
      });

      // ELIMINAR NOTA
document.querySelectorAll('.btnEliminarNota').forEach(btnDel => {
  btnDel.onclick = async function () {
    const alumId = btnDel.getAttribute('data-alum');
    const confirm = await Swal.fire({
      title: '¿Eliminar nota?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: "#191927",
      color: "#fee084"
    });
    if (confirm.isConfirmed) {
      await db
        .collection('cursos').doc(cursoId)
        .collection('actividades').doc(actId)
        .collection('notas').doc(alumId)
        .update({ nota: firebase.firestore.FieldValue.delete() });

      // <--- Solución aquí
      const inputNota = document.querySelector(`.nota-alumno-input[data-alum="${alumId}"]`);
      if (inputNota) inputNota.value = '';

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Nota eliminada',
        showConfirmButton: false,
        timer: 900,
        background: "#fee084",
        color: "#191927"
      });
      if (typeof cargarResumenNotas === 'function') cargarResumenNotas(cursoId);
    }
  }
});


    }, 350);
    // FIN setTimeout

  } // END onclick
});

// --- Resumen de notas de estudiantes ---
async function cargarResumenNotas(cursoId) {
  const db = window.db || firebase.firestore();
  // Trae alumnos
  const alumnosSnap = await db
    .collection('usuarios')
    .where('rol', '==', 'alumno')
    .where('cursosInscritos', 'array-contains', cursoId)
    .get();
  const alumnos = alumnosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Trae actividades
  const actsSnap = await db
    .collection('cursos').doc(cursoId)
    .collection('actividades')
    .orderBy('fecha')
    .get();
  const actividades = actsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Trae todas las notas de todas las actividades (en paralelo)
  let notasPorAlumno = {};
  for (const act of actividades) {
    const notasSnap = await db
      .collection('cursos').doc(cursoId)
      .collection('actividades').doc(act.id)
      .collection('notas')
      .get();
    notasSnap.forEach(n => {
      if (!notasPorAlumno[n.id]) notasPorAlumno[n.id] = {};
      notasPorAlumno[n.id][act.id] = n.data().nota;
    });
  }

  // Render tabla
  let resumenHTML = `
    <div class="mt-4">
      <h5 style="color:#fee084"><i class="fas fa-list-ol me-2"></i>Resumen de Notas</h5>
      <div style="overflow-x:auto;">
      <table class="table table-bordered table-hover table-sm resumen-notas-table" style="background:#1f1f2e;color:#fff;border-radius:15px;min-width:440px">
        <thead>
          <tr>
            <th>Estudiante</th>
            ${actividades.map(a => `<th style="min-width:95px">${a.titulo}</th>`).join('')}
            <th style="min-width:70px">Promedio</th>
          </tr>
        </thead>
        <tbody>
  `;
  for (const alumno of alumnos) {
    let suma = 0, count = 0;
    resumenHTML += `<tr>
      <td style="font-weight:500">${alumno.nombre || alumno.email}</td>`;
    for (const act of actividades) {
      const nota = notasPorAlumno[alumno.id]?.[act.id];
      if (nota !== undefined) {
        resumenHTML += `<td style="text-align:center">${nota}</td>`;
        suma += nota; count++;
      } else {
        resumenHTML += `<td style="color:#888;text-align:center">–</td>`;
      }
    }
    let prom = count ? (suma / count).toFixed(2) : '-';
    resumenHTML += `<td style="color:#fee084;font-weight:600;text-align:center">${prom}</td></tr>`;
  }
  resumenHTML += `
        </tbody>
      </table>
      </div>
    </div>
  `;
  document.getElementById('resumenNotas').innerHTML = resumenHTML;
}


}

// Tab 4: Estadísticas (Asistencias)
async function cargarTabEstadisticas(cursoId) {
  const db = window.db || firebase.firestore();

  // Traer alumnos inscritos
  const alumnosSnap = await db
    .collection('usuarios')
    .where('rol', '==', 'alumno')
    .where('cursosInscritos', 'array-contains', cursoId)
    .get();
  const alumnos = alumnosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Traer asistencias del curso
  const asistSnap = await db
    .collection('cursos').doc(cursoId)
    .collection('asistencias')
    .orderBy('fecha', 'desc')
    .get();
  const asistencias = asistSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // 1. Bloque de registrar asistencia
  let formHTML = `
    <div class="mb-3">
      <h4><i class="fas fa-calendar-check me-2 text-warning"></i>Registrar Asistencia</h4>
      <div class="row g-2 align-items-end">
        <div class="col-auto">
          <label>Fecha</label>
          <input type="date" class="form-control" id="asistFecha" value="${(new Date()).toISOString().split('T')[0]}">
        </div>
        <div class="col-auto">
          <button class="btn btn-success" id="btnMarcarAsistencia"><i class="fas fa-check"></i> Registrar</button>
        </div>
      </div>
      <div id="asistAlumnosLista" class="mt-3"></div>
    </div>
  `;

  // 2. Resumen de asistencias
  let resumenHTML = `
    <div class="mt-4">
      <h5 style="color:#fee084"><i class="fas fa-user-check me-2"></i>Resumen de Asistencias</h5>
      <div class="table-responsive" style="background:#1f1f2e; border-radius:15px;">
        <table class="table table-bordered table-hover table-sm resumen-notas-table mb-0" style="color:#fff;min-width:500px;">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Asistencias</th>
              <th>Ausencias</th>
              <th>% Asistencia</th>
              <th>Última asistencia</th>
            </tr>
          </thead>
          <tbody>
  `;
  // Preprocesar asistencias por alumno
  const totalClases = asistencias.length;
  for (const alumno of alumnos) {
    let asis = 0, aus = 0, ultima = '-';
    for (const registro of asistencias) {
      if (registro.asistencias && registro.asistencias[alumno.id]) {
        asis++;
        ultima = registro.fecha;
      } else if (registro.asistencias && registro.asistencias[alumno.id] === false) {
        aus++;
      }
    }
    const percent = totalClases ? ((asis / totalClases) * 100).toFixed(1) + '%' : '-';
    resumenHTML += `
      <tr>
        <td>${alumno.nombre || alumno.email}</td>
        <td style="text-align:center">${asis}</td>
        <td style="text-align:center">${aus}</td>
        <td style="color:#fee084;font-weight:600;text-align:center">${percent}</td>
        <td style="text-align:center">${ultima !== '-' ? new Date(ultima).toLocaleDateString() : '-'}</td>
      </tr>
    `;
  }
  resumenHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Renderiza todo el tab
  document.getElementById('tabContenido').innerHTML = `
    <div class="mb-4">${formHTML}</div>
    <div id="asistResumen">${resumenHTML}</div>
  `;

  // --- Lista de asistencias para eliminar ---
  if (asistencias.length) {
    let listaHTML = `
      <div class="mt-4">
        <h6 style="color:#fee084"><i class="fas fa-trash-alt me-2"></i>Eliminar registro de asistencia</h6>
        <div class="row g-2">`;
    for (const registro of asistencias) {
      listaHTML += `
        <div class="col-12 col-sm-4 mb-2">
          <div class="d-flex align-items-center" style="background:#25242f;border-radius:8px;padding:8px 12px;">
            <span style="flex:1">${new Date(registro.fecha).toLocaleDateString()}</span>
            <button class="btn btn-danger btn-sm btnEliminarAsistencia" data-fecha="${registro.fecha}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
    }
    listaHTML += `</div></div>`;
    document.getElementById('asistResumen').insertAdjacentHTML('beforeend', listaHTML);

    // Evento eliminar asistencia
    document.querySelectorAll('.btnEliminarAsistencia').forEach(btn => {
      btn.onclick = async function () {
        const fecha = btn.getAttribute('data-fecha');
        const confirm = await Swal.fire({
          title: '¿Eliminar asistencia?',
          text: `Esta acción eliminará el registro de asistencia del ${new Date(fecha).toLocaleDateString()}.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          background: "#25242f",
          color: "#fff",
        });
        if (confirm.isConfirmed) {
          await db.collection('cursos').doc(cursoId)
            .collection('asistencias').doc(fecha).delete();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Asistencia eliminada",
            showConfirmButton: false,
            timer: 1200,
            background: "#25242f",
            color: "#191927"
          });
          // Recarga el tab para actualizar la vista
          cargarTabEstadisticas(cursoId);
        }
      }
    });
  }

  // --- Botón para marcar asistencia con SweetAlert, buscador y checkboxes modernos ---
  document.getElementById('btnMarcarAsistencia').onclick = async function (e) {
    e.preventDefault();
    const fecha = document.getElementById('asistFecha').value;
    if (!fecha) return Swal.fire("Selecciona una fecha válida");

    // Traer asistencia existente para esa fecha (si existe)
    const asistDoc = asistencias.find(a => a.fecha === fecha);
    let asistMap = asistDoc?.asistencias || {};

    // HTML: Buscador + checkboxes custom
    let html = `
      <style>
        .checklist-alumno {display:flex;align-items:center;margin-bottom:9px;}
        .checklist-alumno input[type="checkbox"] {display:none;}
        .checklist-alumno label {
          background:#232029;color:#fee084; 
          border-radius: 7px; padding:7px 18px; 
          cursor:pointer; margin-left:7px; font-weight:500; font-size:1.1rem; 
          border:2px solid #fee084; transition:.12s;
          min-width:165px;
          user-select: none;
        }
        .checklist-alumno input[type="checkbox"]:checked + label {
          background:#1fa37a;color:#fff;border:2px solid #1fa37a;
          box-shadow:0 2px 14px #2223;
          font-weight:600;
          letter-spacing: 0.2px;
        }
        .swal2-input { margin-bottom:16px !important; }
      </style>
      <input type="text" id="swal-buscar-alumno" class="swal2-input" placeholder="Buscar estudiante...">
      <div id="swal-lista-alumnos" style="max-height:330px;overflow-y:auto;text-align:left">
        ${alumnos.map(alumno => {
          const checked = asistMap[alumno.id] ? 'checked' : '';
          return `
            <div class="checklist-alumno">
              <input type="checkbox" id="swal_asist_${alumno.id}" value="${alumno.id}" ${checked}>
              <label for="swal_asist_${alumno.id}">${alumno.nombre || alumno.email}</label>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // SweetAlert para marcar presentes
    const { isConfirmed } = await Swal.fire({
      title: '<span style="color:#fee084;font-size:2rem;font-weight:800">Marcar Asistencia</span>',
      html: html,
      confirmButtonText: 'Guardar asistencia',
      showCancelButton: true,
      background: "#191927",
      color: "#fee084",
      width: 550,
      customClass: { popup: 'swal-popup-notas' },
      didOpen: () => {
        // Buscador en tiempo real
        const input = document.getElementById('swal-buscar-alumno');
        input.addEventListener('input', function() {
          const q = input.value.trim().toLowerCase();
          document.querySelectorAll('#swal-lista-alumnos .checklist-alumno').forEach(div => {
            const label = div.querySelector('label').innerText.toLowerCase();
            div.style.display = label.includes(q) ? '' : 'none';
          });
        });
      }
    });

    if (isConfirmed) {
      // Saca los IDs seleccionados
      let asistencia = {};
      alumnos.forEach(al => {
        asistencia[al.id] = document.getElementById(`swal_asist_${al.id}`).checked;
      });

      // Guarda en Firestore
      await db.collection('cursos').doc(cursoId)
        .collection('asistencias').doc(fecha)
        .set({ fecha, asistencias: asistencia });

      Swal.fire({
        icon: "success",
        title: "¡Asistencia guardada!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1200,
        background: "#fee084",
        color: "#191927"
      });

      cargarTabEstadisticas(cursoId); // Recarga asistencias y resumen
    }
  };
}
// ¡Listo para usar!