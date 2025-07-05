// 📦 asignarDocente.js

// 1️⃣ Trae todos los cursos SIN docente y los muestra en el select
async function cargarCursosSinDocente(db) {
  const selectCurso = document.getElementById("selectCursoAsignarDocente");
  selectCurso.innerHTML = `<option value="" disabled selected>Cargando cursos...</option>`;

  try {
    const snap = await db.collection("cursos").get();
    const todos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const sinDoc = todos.filter(c => !c.docenteId);

    if (sinDoc.length === 0) {
      selectCurso.innerHTML = `<option disabled>No hay cursos sin docente</option>`;
    } else {
      selectCurso.innerHTML = "";
      sinDoc.forEach(curso => {
        const op = document.createElement("option");
        op.value = curso.id;
        op.textContent = curso.titulo;
        selectCurso.appendChild(op);
      });
    }
  } catch (err) {
    console.error("Error cargando cursos sin docente:", err);
    selectCurso.innerHTML = `<option disabled>Error cargando cursos</option>`;
  }
}

// 2️⃣ Trae todos los usuarios con rol "docente"
async function cargarDocentes(db) {
  const selectDoc = document.getElementById("selectDocenteAsignar");
  selectDoc.innerHTML = `<option value="" disabled selected>Cargando docentes...</option>`;

  try {
    const snap = await db.collection("usuarios").where("rol", "==", "docente").get();
    if (snap.empty) {
      selectDoc.innerHTML = `<option disabled>No hay docentes</option>`;
    } else {
      selectDoc.innerHTML = "";
      snap.forEach(d => {
        const data = d.data();
        const op = document.createElement("option");
        op.value = d.id;
        op.textContent = data.nombre || data.email;
        selectDoc.appendChild(op);
      });
    }
  } catch (err) {
    console.error("Error cargando docentes:", err);
    selectDoc.innerHTML = `<option disabled>Error cargando docentes</option>`;
  }
}

// 3️⃣ Cada vez que abras el modal, refresca selects
const modalAsig = document.getElementById("modalAsignarDocente");
modalAsig.addEventListener("show.bs.modal", () => {
  if (!window.db) return;
  cargarCursosSinDocente(window.db);
  cargarDocentes(window.db);
});
const formAsig = document.getElementById("formAsignarDocente");
formAsig.addEventListener("submit", async e => {
  e.preventDefault();
  const cursoId   = document.getElementById("selectCursoAsignarDocente").value;
  const docenteId = document.getElementById("selectDocenteAsignar").value;
  if (!cursoId || !docenteId) return;

  try {
    // Asigna el docente al curso
    await window.db.collection("cursos").doc(cursoId).update({ docenteId });

    // 🔔 Crea la notificación para el docente asignado
    const cursoDoc = await window.db.collection('cursos').doc(cursoId).get();
    const cursoTitulo = cursoDoc.data().titulo || 'un curso nuevo';
    const noti = {
      mensaje: `¡Tienes un nuevo curso asignado: <b>${cursoTitulo}</b>!`,
      fecha: firebase.firestore.Timestamp.now(),
      leida: false
    };
    console.log("Voy a notificar al docente", docenteId, "por curso", cursoId, noti);

    await window.db.collection('usuarios')
      .doc(docenteId)
      .collection('notificaciones')
      .add(noti)
      .then(() => console.log("Notificación creada!"))
      .catch(err => console.error("Error guardando notificación:", err));

    // SweetAlert de éxito
    Swal.fire({
      title: "¡Docente asignado! 🎉",
      icon: "success",
      background: "linear-gradient(139deg, rgba(36,40,50,1) 0%, rgba(37,28,40,1) 100%)",
      color: "#fff",
      confirmButtonColor: "#00c2a8"
    });

    // Cierra el modal y resetea el form
    bootstrap.Modal.getInstance(modalAsig).hide();
    formAsig.reset();

    // Refresca la tabla de cursos-docentes si existe
    if (typeof cargarCursosDocentes === "function") {
      cargarCursosDocentes(window.db);
    }
  } catch (err) {
    console.error("Error asignando docente:", err);
    Swal.fire("Error", err.message, "error");
  }
});
