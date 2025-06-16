// js/mantenimiento.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("servicios-container");

  // Define tus servicios y sus imágenes
  const servicios = [
    {
      title: "Mantenimiento Industrial",
      text: `Disponemos de equipos y talento humano especializados para la realización de los mantenimientos predictivos,
             preventivos y correctivos en áreas industriales como: petroquímica, civil e industrial vinculadas al sector petrolero y gasífero.`,
      img: "https://kaizen.com/wp-content/uploads/2024/06/ImagemMI-scaled.webp"
    },
    {
      title: "Gestión de Mantenimiento Integrada a Campos Digitales",
      text: "Implementamos plataformas IIoT para supervisión remota y análisis de datos en tiempo real.",
      img: "https://ab834610.delivery.rocketcdn.me/latam/wp-content/uploads/que-es-el-mantenimiento-preventivo.png"
    },
    {
      title: "Recorredores y Mantenimiento de Pump Off",
      text: "Suministramos y gestionamos recorridos de pozo (pump off) para optimizar tu producción.",
      img: "https://arlift.com.ec/wp-content/uploads/2019/09/lineas-negocio-pequeno-01.jpg"
    },
    {
      title: "Construcción y Mantenimiento de Locaciones",
      text: "Diseño, montaje y mantenimiento de locaciones terrestres y plataformas de producción.",
      img: "https://legnaconstrucciones.com/wp-content/uploads/2021/07/construction-engineers-discussion-with-architects-at-construction-site-scaled.jpg"
    },
    {
      title: "Servicios Especiales de Instrumentación y Control",
      text: "Calibración, instalación y puesta en marcha de sistemas de instrumentación industrial.",
      img: "https://www.fujielectric.fr/wp-content/uploads/2024/07/ingenierie-controle-commande-fr-en-500x312-c-default.jpg?x77148"
    },
    {
      title: "Mantenimiento de Tableros Eléctricos, Instrumentación y Sistemas de Control",
      text: "Revisión y reparación de tableros, PLCs y redes de comunicación industrial.",
      img: "https://www.cegid.com/ib/wp-content/uploads/sites/3/2023/01/CEG-VAL-Blog-plan-mantenimiento.jpg"
    }
  ];

  // Inyecta el banner y sección principal con animaciones AOS
  container.innerHTML = `
    <section class="py-5 text-white banner-servicios"
             data-aos="fade-down"
             style="background: url('https://www.intsurmex.com/images/002.png') no-repeat center center; background-size: cover;">
      <div class="overlay" style="background:rgba(0,0,0,0.5);padding:6rem 0;">
        <div class="container text-center">
          <h1 class="display-5 fw-bold" data-aos="fade-down" data-aos-delay="200">
            SERVICIOS DE MANTENIMIENTO INDUSTRIAL
          </h1>
          <p class="lead" data-aos="fade-up" data-aos-delay="400">
            Comprometidos en ofrecer excelencia y tecnología de vanguardia para nuestros clientes.
          </p>
          <a href="../pages/contacto.html"
             class="btn btn-custom btn-lg mt-3"
             data-aos="zoom-in"
             data-aos-delay="600">
            Solicitar Cotización
          </a>
        </div>
      </div>
    </section>

    <section id="cotizacion"
             class="py-5 bg-light"
             data-aos="fade-up"
             data-aos-delay="200">
      <div class="container">
        <h2 class="text-center fw-bold mb-5"
            data-aos="fade-up"
            data-aos-delay="300">
          Nuestros Servicios para el Mantenimiento Industrial
        </h2>
        <div class="row g-4">
          ${servicios.map((s, i) => `
            <div class="col-md-6"
                 data-aos="zoom-in"
                 data-aos-delay="${400 + i * 100}">
              <div class="card h-100 shadow-sm">
                <img src="${s.img}" class="card-img-top" alt="${s.title}">
                <div class="card-body">
                  <h5 class="card-title">${s.title}</h5>
                  <p class="card-text">${s.text}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
});
