// 📦 registrarDocente.js

document.getElementById("formRegistrarDocente")
  .addEventListener("submit", async e => {
    e.preventDefault();

    const nombre = document.getElementById("nombreDocente").value.trim();
    const email  = document.getElementById("emailDocente").value.trim();
    const clave  = document.getElementById("claveDocente").value;

    if (!nombre || !email || !clave) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.'
      });
    }

    // Mensaje de carga
    Swal.fire({ title: 'Creando docente...', didOpen: ()=>Swal.showLoading(), allowOutsideClick:false });

    try {
      const res = await fetch('https://siv-backend.onrender.com/crear-docente', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ nombre, email, clave })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      Swal.fire('¡Éxito!','Docente registrado correctamente.','success');
      // cerrar modal, reset, recargar tabla...
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  });