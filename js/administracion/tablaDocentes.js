// 📦 tablaDocentes.js

async function cargarTablaDocentes(db) {
  const tbody = document.getElementById("tablaDocentesBody");
  tbody.innerHTML = "";

  try {
    const snap = await db.collection("usuarios")
      .where("rol", "==", "docente")
      .orderBy("fechaRegistro", "desc")
      .get();

    if (snap.empty) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No hay docentes registrados.</td></tr>`;
      return;
    }

    snap.forEach(doc => {
      const d = doc.data();
      const fecha = d.fechaRegistro
        ? d.fechaRegistro.toDate().toLocaleDateString("es-ES")
        : "—";
      tbody.innerHTML += `
        <tr>
          <td>${d.nombre}</td>
          <td>${d.email}</td>
          <td>${fecha}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error cargando docentes:", err);
    tbody.innerHTML = `<tr><td colspan="3">Error al cargar docentes.</td></tr>`;
  }
}

// Exponer globalmente
window.cargarTablaDocentes = cargarTablaDocentes;
