// js/quienes-somos.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("qs-container");

  container.innerHTML = `
    <section class="container text-center mb-5" data-aos="fade-down">
      <!-- Logo centrado -->
      <img src="../images/LOGO-SIN-FONDO-min.png"
           alt="SIV Consulting Logo"
           class="mx-auto d-block mb-4"
           style="max-width:200px;">
      <!-- Título -->
      <h1 class="fw-bold mb-3">Quiénes Somos</h1>
      <!-- Subtítulo / Línea descriptiva -->
      <p class="lead mb-5">Asesoría técnica y formación de talento humano para la industria petrolera.</p>
    </section>

    <section class="container" data-aos="fade-up">
      <!-- Aquí pones tu texto corporativo: historia, misión, visión, valores… -->
      <div class="row justify-content-center">
        <div class="col-lg-8 text-justify">
          <!-- Sustituye este párrafo con el contenido que tú proveas -->
          <p>
            En <strong>SIV Consulting</strong> somos un un equipo de profesionales especializados en la capacitación técnica y servicios industriales en áreas como: petroquímica, civil e industrial vinculadas al sector petrolero y gasífero. Somos una empresa preocupada por brindar conocimientos y herramientas necesarias para toda aquella persona que busque ingresar al campo laboral, además, comprometidos en ofrecer excelencia y tecnología de vanguardia suministrando las mejores soluciones a los requerimientos de nuestros clientes.
          </p>
          <p>
            <strong>Misión:</strong>Proveer servicios industriales, asistencia y capacitación técnica de calidad en las áreas petrolera, mecánica, eléctrica, petroquímica, civil e industrial dentro de las diversas organizaciones empresariales, empleando para ello procesos de mejora continua, personal altamente calificado, especializado, comprometido en la búsqueda de la excelencia y con tecnología de vanguardia que nos permite brindar un servicio de alto nivel 
          </p>
          <p>
            <strong>Visión:</strong>Ser una empresa líder, reconocida por nuestros clientes por principios enmarcados en la responsabilidad, lealtad, transparencia y ética profesional como estandarte de nuestro equipo. 

SIV Consulting tiene como visión proyectarse y mantenerse como la organización líder y confiable en la presentación de servicios industriales y capacitación técnica especializada, ser reconocido en el mercado nacional e internacional por la excelencia de nuestros servicios. Ser pioneros por ofrecer servicios y soluciones innovadoras, eficientes y exclusivas para cada cliente, mejorar continuamente la preparación del talento humano y las tecnologías de nuestros equipos dejando huella con nuestro desempeño y calidad de primer nivel.  
          </p>
          <p>
            <strong>Valores:</strong> Compromiso, Transparencia, Innovación, Trabajo en equipo
            y Seguridad.
          </p>
        </div>
      </div>
    </section>
  `;
});
