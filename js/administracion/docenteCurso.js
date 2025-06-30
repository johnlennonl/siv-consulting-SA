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
        </tr>`;
    }
  } catch (err) {
    console.error("Error cargando tabla cursos–docentes:", err);
    tbody.innerHTML = `<tr><td colspan="4">Error al cargar datos.</td></tr>`;
  }
}

