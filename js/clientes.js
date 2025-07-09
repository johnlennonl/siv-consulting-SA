document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("clientes").innerHTML = `
    <section class="testimonios siv-testimonios py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-5" data-aos="fade-up">¿QUÉ DICEN NUESTROS USUARIOS?</h2>
        <div class="row g-5 justify-content-center">
          <!-- Testimonio 1 -->
          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="0">
            <div class="card testimonial-card-pro border-0 shadow-sm text-center p-4 h-100">
              <div class="testimonial-avatar mx-auto mb-3">
                <img src="images/TAMARA.jpg" class="rounded-circle border border-3 border-warning-subtle" alt="Tamara" loading="lazy">
              </div>
              <blockquote class="testimonial-quote mb-3">
                <i class="bi bi-quote mb-2 text-warning" style="font-size:2.5rem;"></i>
                <p class="testimonial-text">
                  Mi paso por Siv Consulting fue extraordinario, me llevo una experiencia muy buena en relación a los conocimientos que adquirí y por las buena predisposición de cada uno de los profesionales pertenecientes a la misma que siempre estuvieron para cada uno de los alumnos que asistimos.
                </p>
              </blockquote>
              <h6 class="fw-bold mt-2 mb-0 text-dark">Tamara Vilchez</h6>
            </div>
          </div>
          <!-- Testimonio 2 -->
          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="100">
            <div class="card testimonial-card-pro border-0 shadow-sm text-center p-4 h-100">
              <div class="testimonial-avatar mx-auto mb-3">
                <img src="images/william.jpg" class="rounded-circle border border-3 border-warning-subtle" alt="William" loading="lazy">
              </div>
              <blockquote class="testimonial-quote mb-3">
                <i class="bi bi-quote mb-2 text-warning" style="font-size:2.5rem;"></i>
                <p class="testimonial-text">
                  Consultora con excelentes cursos y con excelente profesionales, te brindan toda la ayuda que necesites y además se encargan de que queden bien claro todos los conceptos referidos al curso. Hoy en día me abrió grandes puertas y me sumo muchos puntos en la selección de personal en vaca muerta.
                </p>
              </blockquote>
              <h6 class="fw-bold mt-2 mb-0 text-dark">William Bontempi</h6>
            </div>
          </div>
          <!-- Testimonio 3 -->
          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="200">
            <div class="card testimonial-card-pro border-0 shadow-sm text-center p-4 h-100">
              <div class="testimonial-avatar mx-auto mb-3">
                <img src="images/micaela.jpg" class="rounded-circle border border-3 border-warning-subtle" alt="Micaela" loading="lazy">
              </div>
              <blockquote class="testimonial-quote mb-3">
                <i class="bi bi-quote mb-2 text-warning" style="font-size:2.5rem;"></i>
                <p class="testimonial-text">
                  Excelente consultora, confiable con excelentes profesionales y personas, que están dispuestas a enseñar y compartir sus conocimientos y sus experiencias con profesionalismo y vocación.
                </p>
              </blockquote>
              <h6 class="fw-bold mt-2 mb-0 text-dark">Micaela Daniele</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
});
