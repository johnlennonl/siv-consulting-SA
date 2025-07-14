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


    /// 3. Actividades y notas
async function renderActividadesNotas(idCurso, alumnoId) {
  const db = firebase.firestore();
  const tabContenido = document.getElementById("contenidoTabAlumno");
  tabContenido.innerHTML = `<div class="text-center text-muted">Cargando actividades...</div>`;

  // Traer actividades (ordenar por fecha descendente)
  const actsSnap = await db.collection("cursos").doc(idCurso)
    .collection("actividades").orderBy("fecha", "desc").get();

  if (actsSnap.empty) {
    tabContenido.innerHTML = `<div class="alert alert-warning">No hay actividades asignadas aún.</div>`;
    return;
  }

  // Armar tabs
 // 1. Trae actividades y respuestas (ordenadas)
const actsArr = actsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
let actividadRespuestas = {};

// Trae si el alumno ya respondió cada actividad (promesas en paralelo)
await Promise.all(
  actsArr.map(async (act) => {
    const respSnap = await db.collection("cursos").doc(idCurso)
      .collection("actividades").doc(act.id)
      .collection("notas").doc(alumnoId).get();
    actividadRespuestas[act.id] = respSnap.exists ? respSnap.data() : null;
  })
);

// 2. Render select numerado con estado
let selectHTML = `
<div class="actividad-selector-container">
  <label for="actividadSelect" class="actividad-label">
    <i class="fas fa-tasks me-2"></i>Selecciona una actividad:
  </label>
  <select id="actividadSelect" class="actividad-select">
      ${actsArr.map((act, idx) => {
        const resp = actividadRespuestas[act.id];
        const yaRespondio = !!resp?.respuesta;
        return `
       <option value="${act.id}" ${idx === 0 ? 'selected' : ''}>
  Actividad ${actsArr.length - idx} - ${(act.titulo || "Sin título").substring(0, 32)}
  ${yaRespondio ? " (realizada)" : ""}
</option>
      `;
      }).join('')}
    </select>
  </div>
`;

// 3. Renderiza el contenido de actividades (solo muestra una, la seleccionada)
let actividadContenidos = {};

for (let idx = 0; idx < actsArr.length; idx++) {
  const act = actsArr[idx];
  const actId = act.id;
  const respuesta = actividadRespuestas[actId];
  const yaRespondio = !!respuesta?.respuesta;
  const nota = respuesta?.nota ?? null;
  const retro = respuesta?.retroalimentacion ?? null;

  // Fecha de entrega (igual)
  let fechaEntrega = "No definida";
  if (act.fecha) {
    if (typeof act.fecha === "object" && act.fecha.seconds) {
      const date = new Date(act.fecha.seconds * 1000);
      fechaEntrega = date.toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });
    } else if (typeof act.fecha === "string") {
      fechaEntrega = new Date(act.fecha).toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });
    }
  }

  // Video (igual, con contenedor)
  let videoHTML = '';
  if (act.videoUrl) {
    const url = act.videoUrl;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
      else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      if (videoId) videoHTML = `<div class="actividad-video-contenedor"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
    } else if (url.includes('vimeo.com')) {
      let videoId = url.split('vimeo.com/')[1];
      videoHTML = `<div class="actividad-video-contenedor"><iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="320" frameborder="0" allowfullscreen></iframe></div>`;
    } else if (url.match(/\.(mp4|webm|ogg)($|\?)/)) {
      let videoSrc = url;
      if (videoSrc.includes('dropbox.com')) {
        const mp4Index = videoSrc.indexOf('.mp4');
        if (mp4Index !== -1) videoSrc = videoSrc.substring(0, mp4Index + 4) + '?raw=1';
      }
      videoHTML = `<div class="actividad-video-contenedor"><video controls><source src="${videoSrc}" type="video/mp4">Tu navegador no soporta la reproducción de video.</video></div>`;
    } else if (url.includes('drive.google.com')) {
      let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      let fileId = match ? match[1] : null;
      if (fileId) {
        let embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        videoHTML = `<div class="actividad-video-contenedor"><iframe src="${embedUrl}" width="100%" height="320" allow="autoplay"></iframe></div>`;
      } else {
        videoHTML = `<a href="${url}" target="_blank" style="color:#1fa37a;font-weight:bold;display:block;margin-bottom:13px;"><i class="fas fa-video"></i> Ver video</a>`;
      }
    } else {
      videoHTML = `<a href="${url}" target="_blank" style="color:#1fa37a;font-weight:bold;display:block;margin-bottom:13px;"><i class="fas fa-video"></i> Ver video</a>`;
    }
  }

  // Contenido de la actividad (igual que antes)
  actividadContenidos[actId] = `
    <div class="actividad-alumno-detalle">
      <h5 class="fw-bold mb-2"><i class="fas fa-file-alt me-2"></i>${(act.titulo || "Sin título").toUpperCase()}</h5>
      <p class="mb-2">${act.descripcion || "Sin descripción"}</p>
      ${videoHTML}
      <div class="d-flex flex-wrap align-items-center mb-1" style="gap:1.2em;">
        <small class="text-info" style="font-size:1.07em">Fecha de entrega: ${fechaEntrega}</small>
        ${nota !== null 
          ? `<span class="badge border-0" style="background:#d7fbe9;color:#169151;padding:8px 20px;font-size:1.15em;font-weight:600;border-radius:10px;box-shadow:0 1px 9px #1fa37a22;margin-left:7px;letter-spacing:0.2px;vertical-align:middle;">
              <i class="fas fa-medal me-1 text-warning"></i> Nota: <span style="font-size:1.19em">${nota}</span>
            </span>` 
          : ''
        }
      </div>
      ${
        retro 
          ? `<div style="background:#2d2d39;padding:10px 15px;border-radius:9px;margin-bottom:6px;margin-top:3px;color:#ffc107;font-size:1.06em;display:flex;align-items:center;gap:6px;">
              <i class="fas fa-comment-dots"></i>
              <span><b>Observación:</b> ${retro}</span>
            </div>`
          : ''
      }
      <div class="mt-3">
        <label for="respuesta_${actId}" class="form-label fw-bold">Tu respuesta:</label>
        <textarea id="respuesta_${actId}" rows="4" class="form-control bg-light" placeholder="Escribe tu respuesta aquí..." ${yaRespondio ? "disabled" : ""}>${respuesta?.respuesta || ""}</textarea>
        <div class="d-flex flex-wrap align-items-center gap-2 mt-2 justify-content-between">
          <div>
            <button class="btn btn-warning fw-bold enviar-respuesta-btn" data-actid="${actId}" ${yaRespondio ? "disabled" : ""}>
              ${yaRespondio ? "Respuesta enviada" : "Enviar respuesta"}
            </button>
            <!-- Botón Adjuntar archivo -->
<input type="file" id="fileInput_${actId}" style="display:none" />

<button class="btn btn-secondary ms-2 btn-adjuntar-archivo" type="button" onclick="Swal.fire('Función próximamente disponible', 'Esta función estará disponible en breve. Actualiza tu plataforma para ver las novedades.', 'info'; 
)
">
  <i class="fas fa-paperclip"></i> Adjuntar archivo <span style="font-size:0.85em;">(Próximamente)</span>
</button>


<span class="archivo-nombre" id="archivoNombre_${actId}" style="font-size:0.93em; margin-left:7px;color:#fee084;"></span>

          </div>
        </div>
      </div>
    </div>
  `;
}

// 4. Renderiza el select y el primer contenido
tabContenido.innerHTML = selectHTML + `<div id="actividadContenido">${actividadContenidos[actsArr[0].id]}</div>`;

// 5. Listener para cambiar contenido según el select
document.getElementById('actividadSelect').onchange = function () {
  const actId = this.value;
  document.getElementById('actividadContenido').innerHTML = actividadContenidos[actId];
  // Aquí puedes volver a activar listeners para el botón enviar respuesta (si fuera necesario)
  // O haz delegation por id/clase
};

// ...El resto de tu código (listeners de botón enviar, función archivo pendiente, etc) va igual


  // Activar tab Bootstrap (si usas Bootstrap 5)
  if (window.bootstrap) {
    var triggerTabList = [].slice.call(tabContenido.querySelectorAll('.nav-link'));
    triggerTabList.forEach(function (triggerEl) {
      var tabTrigger = new bootstrap.Tab(triggerEl);
      triggerEl.addEventListener('click', function (event) {
        event.preventDefault();
        tabTrigger.show();
      });
    });
  }

  // Listener a los botones de enviar respuesta
  tabContenido.querySelectorAll(".enviar-respuesta-btn").forEach(btn => {
    btn.onclick = async function () {
      const actId = this.dataset.actid;
      const textarea = document.getElementById(`respuesta_${actId}`);
      const value = textarea.value.trim();
      if (!value) {
        Swal.fire("Responde la actividad antes de enviar");
        return;
      }
      this.disabled = true;
      textarea.disabled = true;

      // GUARDAR la respuesta del alumno
      await db.collection("cursos").doc(idCurso)
        .collection("actividades").doc(actId)
        .collection("notas").doc(alumnoId)
        .set({
          respuesta: value,
          fechaEnvio: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

      // --- NOTIFICAR AL DOCENTE ---
      try {
        const cursoDoc = await db.collection("cursos").doc(idCurso).get();
        const docenteId = cursoDoc.data().docenteId;
        if (docenteId) {
          const alumnoDoc = await db.collection("usuarios").doc(alumnoId).get();
          const alumnoNombre = alumnoDoc.data().nombre || alumnoDoc.data().email;
          const actDoc = await db.collection("cursos").doc(idCurso)
              .collection("actividades").doc(actId).get();
          const actTitulo = actDoc.data().titulo || "Actividad";
          await db.collection("usuarios").doc(docenteId)
            .collection("notificaciones").add({
              tipo: "respuesta_actividad",
              mensaje: `El alumno <b>${alumnoNombre}</b> respondió la actividad <b>${actTitulo}</b>.`,
              alumnoId,
              alumnoNombre,
              cursoId: idCurso,
              actividadId: actId,
              actividadTitulo: actTitulo,
              fecha: firebase.firestore.Timestamp.now(),
              leido: false
            });
        }
      } catch (err) {
        console.error("Error enviando notificación a docente:", err);
      }

      Swal.fire({
        icon: "success",
        title: "¡Respuesta enviada!",
        text: "Tu respuesta fue enviada correctamente.",
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#25242f",
        color: "#fee084"
      });
      this.textContent = "Respuesta enviada";
    };
  });

  // Función de archivo pendiente (solo placeholder)
window.subirArchivoPendiente = function(actId, idCurso, alumnoId) {
  const input = document.getElementById(`fileInput_${actId}`);
  if (!input) return;

  input.click();

  input.onchange = async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileNameSpan = document.getElementById(`archivoNombre_${actId}`);
    if (fileNameSpan) {
      fileNameSpan.innerHTML = `<span class="archivo-loader"></span> Subiendo archivo...`;
      fileNameSpan.classList.remove('success', 'error');
    }

    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`cursos/${idCurso}/actividades/${actId}/alumnos/${alumnoId}/${file.name}`);

    try {
      await fileRef.put(file);
      const url = await fileRef.getDownloadURL();

      if (fileNameSpan) {
        fileNameSpan.innerHTML = `<i class="fas fa-check-circle" style="color:#34b352"></i> <b>${file.name}</b>`;
        fileNameSpan.classList.add('success');
        // Opcional: nombre clickable para descargarlo
        // fileNameSpan.innerHTML = `<i class="fas fa-check-circle" style="color:#34b352"></i> <a href="${url}" target="_blank" style="color:#34b352"><b>${file.name}</b></a>`;
      }

      Swal.fire({
        icon: "success",
        title: "Archivo subido",
        text: "El archivo fue subido correctamente.",
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#25242f",
        color: "#fee084"
      });

      // (opcional) guardar la url en Firestore si no lo haces al enviar respuesta:
      // await db.collection("cursos").doc(idCurso)
      //   .collection("actividades").doc(actId)
      //   .collection("notas").doc(alumnoId)
      //   .set({ archivoURL: url }, { merge: true });

    } catch (err) {
      console.error("Error subiendo archivo:", err);
      if (fileNameSpan) {
        fileNameSpan.textContent = "❌ Error al subir archivo";
        fileNameSpan.classList.add('error');
      }
      Swal.fire("Error", "No se pudo subir el archivo. Intenta de nuevo.", "error");
    }
  };
};


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
    // 5. Certificado
async function renderCertificado(idCurso, alumnoId) {
  const db = firebase.firestore();
  const tabContenido = document.getElementById("contenidoTabAlumno");
  tabContenido.innerHTML = `<div class="text-center text-muted">Cargando información del certificado...</div>`;

  // --- Aquí revisa si el alumno ha terminado el curso ---
  // Ejemplo: buscamos un campo 'finalizado: true' en la colección de alumnos inscritos
  // Puedes cambiar esta lógica según tu modelo de datos

  // Suponiendo que guardas en el doc del usuario, o tienes una subcolección de 'inscripciones' o algo similar.
  let puedeDescargar = false;
  let urlCertificado = null;

  // OPCIÓN 1: Si el estado está en el doc del usuario
  // const alumnoDoc = await db.collection("usuarios").doc(alumnoId).get();
  // const inscripcion = (alumnoDoc.data().inscripciones || {})[idCurso];
  // if (inscripcion && inscripcion.finalizado && inscripcion.certificadoUrl) {
  //   puedeDescargar = true;
  //   urlCertificado = inscripcion.certificadoUrl;
  // }

  // OPCIÓN 2: Si tienes una subcolección de "alumnos" dentro del curso:
  const alumnoCursoDoc = await db
    .collection("cursos").doc(idCurso)
    .collection("alumnos").doc(alumnoId)
    .get();

  if (alumnoCursoDoc.exists) {
    const datos = alumnoCursoDoc.data();
    if (datos.finalizado && datos.certificadoUrl) {
      puedeDescargar = true;
      urlCertificado = datos.certificadoUrl;
    }
  }

  if (puedeDescargar && urlCertificado) {
    tabContenido.innerHTML = `
      <div class="card bg-dark text-white p-4 rounded-4 mb-4 text-center" style="max-width:440px;margin:2em auto">
        <h3 style="color:#fee084;margin-bottom:15px"><i class="fas fa-certificate me-2"></i>¡Certificado disponible!</h3>
        <p class="mb-4 fs-5">¡Felicidades! Has finalizado el curso y ahora puedes descargar tu certificado de culminación.</p>
        <a href="${urlCertificado}" target="_blank" class="btn btn-success btn-lg px-4 py-3 fw-bold shadow" style="font-size:1.19em;border-radius:11px">
          <i class="fas fa-download me-2"></i>Descargar certificado
        </a>
        <div class="mt-4">
          <img src="https://cdn-icons-png.flaticon.com/512/3271/3271393.png" alt="Certificado" style="height:90px;opacity:.92">
        </div>
      </div>
    `;
  } else {
    tabContenido.innerHTML = `
      <div class="card bg-dark text-white p-4 rounded-4 mb-4 text-center" style="max-width:430px;margin:2em auto">
        <h3 style="color:#bbb"><i class="fas fa-award me-2"></i>Certificado no disponible aún</h3>
        <p class="fs-5 mb-3">Completa todas las actividades y espera la revisión de tu docente para poder descargar tu certificado de culminación.</p>
        <div class="d-flex justify-content-center"> 
          <img src="https://cdn-icons-png.flaticon.com/512/3271/3271393.png" alt="Certificado" style="height:90px;opacity:.92">
        </div>
      </div>
    `;
  }
}






    //6 TAB DE ASISTENCIAS 

    // Función para cambiar de tab
    // Función para cambiar de tab
async function cargarTab(tab) {
  const tabContenido = document.getElementById("contenidoTabAlumno");

  if (tab === "resumen") {
    await renderInfoCurso(cursoActual);
  } else if (tab === "temario") {
    await renderTemario(cursoActual);
  } else if (tab === "actividades") {
    await renderActividadesNotas(cursoActual, user.uid);
  } else if (tab === "recursos") {
    await renderTabRecursos(cursoActual);
  } else if (tab === "asistencias") {
    // IMPORTANTE: Agrega este div antes de llamar la función de asistencias
    tabContenido.innerHTML = `<div id="tabAsistenciasAlumno"></div>`;
    await cargarTabAsistenciasAlumno(cursoActual, user.uid);
  } else if (tab === "certificados") {
    await renderCertificado(cursoActual, user.uid);
  } else {
    tabContenido.innerHTML = `<div class="alert alert-info">Tab en construcción: ${tab}</div>`;
  }
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


async function cargarTabAsistenciasAlumno(idCurso, alumnoId) {
  const db = firebase.firestore();
  const contenedor = document.getElementById("tabAsistenciasAlumno");
  contenedor.innerHTML = `<div class="text-center text-muted">Cargando asistencias...</div>`;

  // Traer registros de asistencias para este curso
  const asistSnap = await db
    .collection("cursos").doc(idCurso)
    .collection("asistencias")
    .orderBy("fecha", "desc")
    .get();

  if (asistSnap.empty) {
    contenedor.innerHTML = `<div class="alert alert-info mt-4 mb-0">No hay asistencias registradas aún.</div>`;
    return;
  }

  const asistencias = asistSnap.docs.map(d => d.data());
  let total = asistencias.length;
  let asistio = 0;

  let rows = asistencias.map(asist => {
    const fecha = new Date(asist.fecha).toLocaleDateString('es-VE', { year: "numeric", month: "long", day: "numeric" });
    const estado = asist.asistencias && asist.asistencias[alumnoId] === true;
    if (estado) asistio++;
    return `
      <tr>
        <td>${fecha}</td>
        <td class="fw-bold" style="color:${estado ? "#2ecc40" : "#ff5252"}">
          ${estado ? '<i class="fas fa-check-circle"></i> Asistió' : '<i class="fas fa-times-circle"></i> Ausente'}
        </td>
      </tr>
    `;
  }).join('');

  let porcentaje = total ? ((asistio / total) * 100).toFixed(1) : 0;

  contenedor.innerHTML = `
    <div class="card mb-3 shadow-sm" style="border-radius:16px; background:#20212b;">
      <div class="card-body">
        <h4 class="mb-3" style="color:#fee084"><i class="fas fa-calendar-check me-2"></i>Mis Asistencias</h4>
        <div class="mb-3">
          <span class="badge bg-success" style="font-size:1.1em;padding:10px 22px;border-radius:13px;">
            Asistencia acumulada: <b>${porcentaje}%</b>
          </span>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover text-white mb-0" style="background:#232029;border-radius:9px;overflow:hidden;">
            <thead style="background:#232029;">
              <tr>
                <th style="color:#fee084">Fecha</th>
                <th style="color:#fee084">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
