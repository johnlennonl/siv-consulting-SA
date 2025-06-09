document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('header').innerHTML = `
    <header class="container-fluid" >
      <div id="mainCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="images/slider1.png" class="d-block w-100" alt="slide1">
          </div>
          <div class="carousel-item">
            <img src="images/slider2.png" class="d-block w-100" alt="slide2">
          </div>
          <div class="carousel-item">
            <img src="images/slider3.png" class="d-block w-100" alt="slide3">
          </div>
          <div class="carousel-item">
            <img src="images/slider4.png" class="d-block w-100" alt="slide4">
          </div>
        </div>
      </div>

      <div class="header-overlay text-center text-white">
        <h1 data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
    Impulsando el Talento. Transformando la Industria.
  </h1>
  <p data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
    Asesoría Técnica y Formación de Profesionales para un futuro más sólido.
  </p>

      </div>

      
      <div class="tendencias-container d-flex justify-content-center align-items-center text-white px-3">
        <span class="badge bg-warning text-dark me-2">Tendencias hoy</span>
        <marquee behavior="scroll" direction="left" scrollamount="5">
          SIV Consulting y el Instituto Politécnico Santiago Mariño Impulsan el debate sobre Fracturamiento Hidráulico en la Industria Petrolera , 
        </marquee>
      </div>
    </header>
  `;
});
