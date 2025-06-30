// 📦 crearCurso.js

// Función para cargar docentes (opcional)
async function cargarDocentesCrearCurso(db) {
  const selectDocentes = document.getElementById('docenteCurso');
selectDocentes.innerHTML = `<option value="" disabled selected>Selecciona un docente (opcional)</option>`;

  try {
    const snap = await db.collection("usuarios").where("rol", "==", "docente").get();

    if (snap.empty) {
      selectDocentes.innerHTML += `<option disabled>No hay docentes disponibles</option>`;
      return;
    }

    snap.forEach(doc => {
      const docente = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = docente.nombre || docente.email;
      selectDocentes.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar docentes:", error);
    selectDocentes.innerHTML = `<option value="" disabled>Error al cargar docentes</option>`;
  }
}


// Función para crear curso
async function crearCurso(db) {
  const titulo = document.getElementById("tituloCurso").value.trim();
  const descripcion = document.getElementById("descripcionCurso").value.trim();
  
  // Docente ahora opcional
  const docenteSelect = document.getElementById("docenteCurso");
  const docenteId = docenteSelect.value || null;
  const docenteNombre = docenteSelect.selectedOptions[0]?.textContent || "Sin docente asignado";
  
  const fotoDocente = document.getElementById("fotoDocente").value.trim() || null;
  const linkRecursos = document.getElementById("linkRecursosCurso").value.trim();

  const fechaInicio = document.getElementById("fechaInicio").value;
  const horaClase = document.getElementById("horaClase").value;
  const diasClase = Array.from(document.getElementById("diasClase")?.selectedOptions || []).map(o => o.value);

  if (!titulo || !descripcion || !linkRecursos || !fechaInicio || !horaClase || diasClase.length === 0) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos obligatorios',
      text: 'Por favor, completa todos los campos requeridos.',
      confirmButtonColor: '#111111'
    });
  }

  let videoURL = document.getElementById("videoTutorialCurso").value.trim();
  if (videoURL.includes("youtube.com") || videoURL.includes("youtu.be")) {
    const match = videoURL.match(/[?&]v=([^&#]+)/) || videoURL.match(/youtu\.be\/([^&#]+)/);
    videoURL = match ? match[1] : videoURL;
  }

  const nuevoCurso = {
    titulo,
    descripcion,
    fechaInicio,
    horaClase,
    diasClase,
    docente: docenteNombre,
    docenteId, // null si no se asignó
    fotoDocente,
    linkZoom: document.getElementById("linkZoomCurso")?.value || null,
    recursosLink: linkRecursos,
    videoTutorial: videoURL || null,
    activo: document.getElementById("activoCurso").checked
  };

  try {
    await db.collection("cursos").add(nuevoCurso);
    await cargarCursos(); // función global que recarga cursos

    Swal.fire({
      title: 'Curso creado exitosamente 🎉',
      html: `
        <p><strong>${nuevoCurso.titulo}</strong> fue registrado correctamente.</p>
        <ul style="text-align: left">
          <li><b>Docente:</b> ${nuevoCurso.docente}</li>
          <li><b>Fecha Inicio:</b> ${nuevoCurso.fechaInicio}</li>
          <li><b>Días de clase:</b> ${nuevoCurso.diasClase.join(", ")}</li>
          <li><b>Link Zoom:</b> ${nuevoCurso.linkZoom || 'No asignado'}</li>
          <li><b>Recursos:</b> <a href="${linkRecursos}" target="_blank">Ver recursos</a></li>
        </ul> 
      `,
      icon: 'success',
      background: 'linear-gradient(139deg, rgba(36,40,50,1) 0%, rgba(37,28,40,1) 100%)',
      color: '#ffffff',
      iconColor: '#00ffcc',
      confirmButtonColor: '#00c2a8',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'rounded-4 montserrat-font shadow-lg',
        confirmButton: 'btn-success px-4 fw-bold'
      },
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    bootstrap.Modal.getInstance(document.getElementById("modalCrearCurso")).hide();
    document.getElementById("formCrearCurso").reset();

  } catch (error) {
    console.error("Error al crear curso:", error);
    Swal.fire('Error', error.message, 'error');
  }
}

// Inicialización
function initCrearCurso(db) {
  cargarDocentesCrearCurso(db); // Opcional, pero lo cargamos por comodidad

  document.getElementById("formCrearCurso").addEventListener("submit", e => {
    e.preventDefault();
    crearCurso(db);
  });
}

// ⚡ Cada vez que se abre el modal, se vuelve a cargar la lista de docentes
document.getElementById("modalCrearCurso").addEventListener("show.bs.modal", () => {
  if (window.db) {
    cargarDocentesCrearCurso(window.db);
;
  }
});

// Exponer globalmente
window.initCrearCurso = initCrearCurso;

