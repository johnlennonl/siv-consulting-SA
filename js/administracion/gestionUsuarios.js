// gestionUsuarios.js

// 1️⃣ Inicializador
window.initGestionUsuarios = function(db) {
  // 1.1 Asegurarte de que existe la estructura de la tabla:
  if (typeof renderEstructuraAlumnos === "function") renderEstructuraAlumnos();

  // 1.2 Cargar datos de alumnos:
  if (typeof cargarListaAlumnos === "function") cargarListaAlumnos();

  // 1.3 Ahora ya existe <tbody id="tablaAlumnosBody">, así que sí podemos delegar:
  const tbody = document.getElementById("tablaAlumnosBody");
  if (!tbody) return;
  tbody.addEventListener("click", async e => {
  const tr = e.target.closest("tr[data-uid]");
  if (!tr) return;
  const uid = tr.dataset.uid; // ¡ahora será el ID real del usuario!


    // ✏️ EDITAR
    if (e.target.classList.contains("btn-edit")) {
      const doc = await db.collection("usuarios").doc(uid).get();
      const data = doc.data();
      document.getElementById("editUid").value   = uid;
      document.getElementById("editNombre").value = data.nombre;
      document.getElementById("editRol").value    = data.rol;
      new bootstrap.Modal(document.getElementById("modalEditarUsuario")).show();
    }

    // 🗑️ BORRAR
    if (e.target.classList.contains("btn-delete")) {
      const { isConfirmed } = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: `UID: ${uid}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, bórralo',
        cancelButtonText: 'Cancelar'
      });
      if (!isConfirmed) return;

      try {
        await db.collection("usuarios").doc(uid).delete();
        Swal.fire('Eliminado','Usuario eliminado','success');
        cargarListaAlumnos(); // refrescamos la lista
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  });

  // 2️⃣ También atachamos el submit del form de edición
  document
    .getElementById("formEditarUsuario")
    .addEventListener("submit", async e => {
      e.preventDefault();
      const uid    = document.getElementById("editUid").value;
      const nombre = document.getElementById("editNombre").value.trim();
      const rol    = document.getElementById("editRol").value;

      try {
        await db.collection("usuarios").doc(uid).update({ nombre, rol });
        Swal.fire('¡Listo!','Datos actualizados','success');
        bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario")).hide();
        cargarListaAlumnos();
      } catch(err) {
        Swal.fire('Error', err.message, 'error');
      }
    });
};
