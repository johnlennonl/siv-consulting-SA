
// Botón flotante de soporte: abre el modal
document.getElementById("btnAbrirContacto").addEventListener("click", () => {
  const modalContacto = new bootstrap.Modal(document.getElementById("modalContacto"));
  modalContacto.show();
});

// Envío de formulario de soporte vía EmailJS
document.getElementById("formContacto").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreContacto").value.trim();
  const email = document.getElementById("emailContacto").value.trim();
  const mensaje = document.getElementById("mensajeContacto").value.trim();

  if (!nombre || !email || !mensaje) {
    return Swal.fire("Campos incompletos", "Por favor completa todos los campos.", "warning");
  }

  emailjs.send("service_jh78qgm", "template_osicwee", {
    name: nombre,
    email: email,
    message: mensaje
  })
  .then(() => {
    Swal.fire("¡Enviado!", "Tu mensaje fue enviado al soporte.", "success");
    bootstrap.Modal.getInstance(document.getElementById("modalContacto")).hide();
    this.reset();
  })
  .catch((err) => {
    console.error(err);
    Swal.fire("Error", "No se pudo enviar el mensaje. Intenta más tarde.", "error");
  });
});
