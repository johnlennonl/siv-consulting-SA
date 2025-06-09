document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("footer").innerHTML = `
    <footer class="footer text-white pt-5">
      <div class="footer-top container">
        <div class="row">
          <!-- Contacto -->
          <div class="col-lg-6 mb-4" data-aos="fade-right">
            <h3 class="footer-title">CONTÁCTENOS</h3>
            <ul class="footer-contact list-unstyled">
              <li><i class="bi bi-geo-alt-fill me-2"></i> Bernardo Ortiz 201, Godoy Cruz, Mendoza - Argentina</li>
              <li><i class="bi bi-envelope-fill me-2"></i> info@sivconsultingoil.com</li>
              <li><i class="bi bi-telephone-fill me-2"></i> (+54) 9 261-7114721</li>
              <li><i class="bi bi-instagram me-2"></i> @sivconsultingoil</li>
              <li><i class="bi bi-facebook me-2"></i> @sivconsulting</li>
            </ul>
          </div>

          <!-- Mapa -->
          <div class="col-lg-6 mb-4" data-aos="fade-left">
            <div class="map-responsive">
              <iframe
                src="https://www.google.com/maps?q=Bernardo+Ortiz+201,+Godoy+Cruz,+Mendoza,+Argentina&output=embed"
                width="100%" height="250" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy">
              </iframe>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom text-center py-3">
        <div class="container">
          <img src="images/LOGO-SIN-FONDO-min.png" alt="Logo" height="60" class="mb-2">
          <p class="mb-0">&copy; 2025 <strong>SIV Consulting S.A.</strong> | Todos los derechos reservados. <a href="#">Política de Privacidad</a> | <a href="#">Términos y Condiciones</a></p>
        </div>
      </div>
    </footer>
  `;
});
