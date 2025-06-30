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

// 4️⃣ Al enviar el formulario, asigna y refresca la tabla de docentes–cursos
const formAsig = document.getElementById("formAsignarDocente");
formAsig.addEventListener("submit", async e => {
  e.preventDefault();
  const cursoId   = document.getElementById("selectCursoAsignarDocente").value;
  const docenteId = document.getElementById("selectDocenteAsignar").value;
  if (!cursoId || !docenteId) return;

  try {
    await window.db.collection("cursos").doc(cursoId).update({ docenteId });
    Swal.fire({
      title: "¡Docente asignado! 🎉",
      icon: "success",
      background: "linear-gradient(139deg, rgba(36,40,50,1) 0%, rgba(37,28,40,1) 100%)",
      color: "#fff",
      confirmButtonColor: "#00c2a8"
    });
    bootstrap.Modal.getInstance(modalAsig).hide();
    formAsig.reset();
    // refresca la tabla de cursos-docentes
    if (typeof cargarCursosDocentes === "function") {
      cargarCursosDocentes(window.db);
    }
  } catch (err) {
    console.error("Error asignando docente:", err);
    Swal.fire("Error", err.message, "error");
  }
});
