document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tendencias").innerHTML = `
    <section class="tendencias-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center fw-bold mb-5" data-aos="fade-up">TENDENCIAS DESTACADAS</h2>

        <!-- Tendencia 1 -->
        <div class="row align-items-center mb-5" data-aos="fade-right">
          <div class="col-md-6">
            <h3 class="fw-bold">De la Resiliencia a la Oportunidad: SIV Consulting Destacado por ACNUR</h3>
            <p><strong>CABA – Buenos Aires, Argentina – 05 de Junio de 2025</strong> – La Agencia de la ONU para los Refugiados (ACNUR) ha destacado la trayectoria del fundador Erik, y cómo logró convertir el desafío de emigrar en una poderosa fuerza para hacer crecer nuestra empresa.</p>
            
          </div>
          <div class="col-md-6 text-center">
            <img src="images/tendencia1.jpg"
            alt="SIV Consulting ACNUR" class="img-fluid rounded shadow">
            <p class="text-muted small mt-2">Erik García, emprendedor venezolano en Argentina, fundador de SIV Consulting. © ACNUR/Javier Di Benedictis</p>
          </div>
          
        </div>

        <!-- Tendencia 2 -->
        <div class="row align-items-center mb-5 flex-md-row-reverse" data-aos="fade-left">
          <div class="col-md-6">
            <h3 class="fw-bold">SIV Consulting une fuerzas con universidades para impulsar la formación en el Zulia</h3>
            <p>SIV Consulting firmó un convenio de cooperación con el Tecnológico Antonio José de Sucre y el Politécnico Santiago Mariño para fortalecer la formación en áreas estratégicas del Zulia.</p>
          </div>
          <div class="col-md-6 text-center">
           <img src="images/tendencia2.jpg"
            alt="SIV Consulting ACNUR" class="img-fluid rounded shadow">
          </div>
        </div>
      </div>
    </section>
  `;
});
