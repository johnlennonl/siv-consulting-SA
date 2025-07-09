// js/header.js
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('header').innerHTML = `
    <header class="container-fluid p-0 siv-header position-relative">
      <!-- SLIDER -->
      <div id="mainCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="images/slider1.png" class="d-block w-100 img-fluid" alt="slide1" />
          </div>
          <div class="carousel-item">
            <img src="images/slider2.png" class="d-block w-100 img-fluid" alt="slide2" />
          </div>
          <div class="carousel-item">
            <img src="images/slider3.png" class="d-block w-100 img-fluid" alt="slide3" />
          </div>
          <div class="carousel-item">
            <img src="images/slider4.png" class="d-block w-100 img-fluid" alt="slide4" />
          </div>
        </div>
        <!-- Controles -->
        <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>

      <!-- OVERLAY/HERO -->
      <div class="siv-header-overlay text-center text-white d-flex flex-column justify-content-center align-items-center">
        <h1 class="fw-bold mb-3" data-aos="fade-down" data-aos-delay="100">
          Impulsando el Talento.<br>Transformando la Industria.
        </h1>
        <p class="lead mb-4" data-aos="fade-up" data-aos-delay="300">
          Asesoría Técnica y Formación de Profesionales para un futuro más sólido.
        </p>
        <a href="pages/cursos-tecnicos.html" class="btn btn-lg btn-custom shadow-lg px-5" data-aos="zoom-in" data-aos-delay="500">
          Ver Cursos
          <i class="bi bi-arrow-right ms-2"></i>
        </a>
      </div>

      <!-- TENDENCIAS -->
      <div class="tendencias-container d-flex justify-content-center align-items-center text-white px-3">
      
        <div class="tendencias-marquee flex-grow-1">
          <span>
           📣📰 SIV Consulting y el Instituto Politécnico Santiago Mariño impulsan el debate sobre Fracturamiento Hidráulico en la Industria Petrolera.
          </span> 
        </div>
        
      </div>
    </header>
  `;
});
