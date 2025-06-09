document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("clientes").innerHTML = `
    <section class="testimonios py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-5" data-aos="fade-up">¿QUÉ DICEN NUESTROS USUARIOS?</h2>

        <div class="row g-4">
          <!-- Cliente 1 -->
          <div class="col-md-6 col-lg-4" data-aos="fade-up">
            <div class="card h-100 shadow-lg p-4 text-center testimonial-card">
              <div class="testimonial-img mb-3">
                <img src="images/TAMARA.jpg" class="rounded-circle" alt="Tamara">
              </div>
              <p class="testimonial-text">
                <i class="bi bi-quote" style="font-size: 2rem; color: #d5af49;"></i><br>
                Mi paso por Siv Consulting fue extraordinario, me llevo una experiencia muy buena en relación a los conocimientos que adquirí y por las buena predisposición de cada uno de los profesionales pertenecientes a la misma que siempre estuvieron para cada uno de los alumnos que asistimos.
              </p>
              <h6 class="fw-bold mt-3">Tamara Vilchez</h6>
            </div>
          </div>

          <!-- Cliente 2 -->
          <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card h-100 shadow-lg p-4 text-center testimonial-card">
              <div class="testimonial-img mb-3">
                <img src="images/william.jpg" class="rounded-circle" alt="William">
              </div>
              <p class="testimonial-text">
                <i class="bi bi-quote" style="font-size: 2rem; color: #d5af49;"></i><br>
                Consultora con excelentes cursos y con excelente profesionales, te brindan toda la ayuda que necesites y además se encargan de que queden bien claro todos los conceptos referidos al curso. Hoy en día me abrió grandes puertas y me sumo muchos puntos en la selección de personal en vaca muerta
              </p>
              <h6 class="fw-bold mt-3">William Bontempi</h6>
            </div>
          </div>

          <!-- Cliente 3 -->
          <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div class="card h-100 shadow-lg p-4 text-center testimonial-card">
              <div class="testimonial-img mb-3">
                <img src="images/micaela.jpg" class="rounded-circle" alt="Micaela">
              </div>
              <p class="testimonial-text">
                <i class="bi bi-quote" style="font-size: 2rem; color: #d5af49;"></i><br>
               Excelente consultora, confiable con excelentes profesionales y personas, que están dispuestas a enseñar y compartir sus conocimientos y sus experiencias con profesionalismo y vocación.
              </p>
              <h6 class="fw-bold mt-3">Micaela Daniele</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
});
