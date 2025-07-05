// 📦 docentesCursos.js

// Carga todos los cursos, busca su docente y cuenta alumnos inscritos
async function cargarCursosDocentes(db) {
  const tbody = document.getElementById("tablaDocentesCursos");
  tbody.innerHTML = "";

  try {
    const snap = await db.collection("cursos").get();
    const cursos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    let idx = 1;
    for (const curso of cursos) {
      // nombre del docente o "No asignado"
      let nombreDoc = "No asignado";
      if (curso.docenteId) {
        const ds = await db.collection("usuarios").doc(curso.docenteId).get();
        if (ds.exists) nombreDoc = ds.data().nombre;
      }

      // cuantos alumnos tienen este curso en su array
      const alumSnap = await db
        .collection("usuarios")
        .where("rol", "==", "alumno")
        .where("cursosInscritos", "array-contains", curso.id)
        .get();

      tbody.innerHTML += `
  <tr>
    <td>${idx++}</td>
    <td>${curso.titulo}</td>
    <td>${nombreDoc}</td>
    <td>${alumSnap.size}</td>
    <td>
      ${curso.docenteId ? `
        <button 
          class="btn btn-sm btn-danger btnQuitarDocente 
          " 
          data-id="${curso.id}" 
          data-titulo="${curso.titulo}" 
          data-docente="${nombreDoc}">
          Quitar
        </button>
      ` : ''}
    </td>
  </tr>`;

    }
  } catch (err) {
    console.error("Error cargando tabla cursos–docentes:", err);
    tbody.innerHTML = `<tr><td colspan="4">Error al cargar datos.</td></tr>`;
  }
}


document.addEventListener("click", async function(e){
  if(e.target.classList.contains("btnQuitarDocente")){
    const cursoId = e.target.getAttribute("data-id");
    const titulo = e.target.getAttribute("data-titulo");
    const docente = e.target.getAttribute("data-docente");
    const confirma = await Swal.fire({
      title: '¿Quitar docente?',
      html: `<div style="font-size:1.12em">
        <span style="font-weight:600;color:#171717">${docente}</span> será removido de<br>
        <span style="color:#005cbf;font-weight:600">${titulo}</span>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#e0e0e0",
      background: "#fff",
      color: "#171717",
      customClass: {
        popup: 'rounded-3 border-0 shadow-sm',
        confirmButton: 'fw-bold px-4 py-2',
        cancelButton: 'fw-bold px-4 py-2'
      }
    });
    if(confirma.isConfirmed){
      try{
        await db.collection("cursos").doc(cursoId).update({
          docenteId: firebase.firestore.FieldValue.delete()
        });
        Swal.fire({
          title: "Docente removido",
          icon: "success",
          timer: 1300,
          showConfirmButton: false,
          background: "#fff",
          color: "#171717"
        });
        cargarCursosDocentes(db);
      }catch(err){
        Swal.fire({
          title: "Error",
          text: err.message,
          icon: "error",
          background: "#fff",
          color: "#171717"
        });
      }
    }
  }
});
