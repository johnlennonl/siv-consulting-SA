document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya aceptó términos antes
  if (!localStorage.getItem('aceptoTerminos')) {
    Swal.fire({
      title: '<strong>¡Bienvenido a <span style="color:#d5af49;">SIV Consulting</span>!</strong>',
      html: `
        <img src="images/LOGO-SIN-FONDO-min.png" alt="Logo" style="width:120px; margin-bottom: 10px;">
        <p style="margin-top:10px;">
          Nos alegra tenerte aquí. Antes de comenzar, por favor revisa y acepta nuestros 
          <a href="pages/terminos.html" target="_blank" style="color:#d5af49;">términos y condiciones</a>.
        </p>
      `,
      showCancelButton: true,
      confirmButtonColor: '#d5af49',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Acepto',
      cancelButtonText: 'No, gracias',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('aceptoTerminos', 'true');
        Swal.fire({
          icon: 'success',
          title: 'Gracias por aceptar',
          text: '¡Disfruta tu visita en SIV Consulting!',
          confirmButtonColor: '#d5af49'
        });
      } else {
        window.location.href = 'https://google.com'; // Redirige si no acepta (puedes quitar esto)
      }
    });
  }
});
