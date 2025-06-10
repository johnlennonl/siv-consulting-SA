// js/contacto.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("contacto-container");
  container.innerHTML = `
    <div class="contact-wrapper">
      <div class="contact-panel">
        <h2 class="contact-title">Contáctanos</h2>
        <form id="contact-form" class="px-3">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre completo</label>
            <input type="text" id="nombre" class="form-control" placeholder="Tu nombre completo" required>
          </div>
          <div class="mb-3">
            <label for="telefono" class="form-label">Teléfono (incluye código de país)</label>
            <input type="tel" id="telefono" class="form-control" placeholder="+58 1234-567890" required>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input type="email" id="email" class="form-control" placeholder="tu@ejemplo.com" required>
          </div>
          <div class="mb-3">
            <label for="asunto" class="form-label">Asunto</label>
            <input type="text" id="asunto" class="form-control" placeholder="Asunto de tu mensaje" required>
          </div>
          <div class="mb-4">
            <label for="mensaje" class="form-label">Mensaje</label>
            <textarea id="mensaje" class="form-control" rows="4" placeholder="Escribe tu mensaje..." required></textarea>
          </div>
          <button type="submit" class="btn btn-custom w-100">Enviar</button>
        </form>
      </div>
      <div class="contact-image"></div>
    </div>
  `;

  document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nombre:   e.target.nombre.value,
      telefono: e.target.telefono.value,
      email:    e.target.email.value,
      asunto:   e.target.asunto.value,
      mensaje:  e.target.mensaje.value
    };

    // Confirmación
    const { isConfirmed } = await Swal.fire({
      title: "¿Confirmar tus datos?",
      html: `
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Asunto:</strong> ${data.asunto}</p>
        <p><strong>Mensaje:</strong><br>${data.mensaje}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Contactar",
      cancelButtonText: "Revisar",
      confirmButtonColor: "#d5af49"
    });

    if (!isConfirmed) return;

    try {
      // Aquí enviamos realmente el email
      await emailjs.send("service_a9qaclf", "template_45rlxfj", data);
      await Swal.fire({
        title: "¡Mensaje enviado!",
        text: "Gracias por contactarnos. Te responderemos pronto.",
        icon: "success",
        confirmButtonColor: "#d5af49"
      });
      e.target.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      await Swal.fire({
        title: "Error",
        text: "Ocurrió un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#d5af49"
      });
    }
  });
});
