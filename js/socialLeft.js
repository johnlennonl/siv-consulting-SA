document.addEventListener("DOMContentLoaded", () => {
  const socialIcons = document.createElement("div");
  socialIcons.className = "social-fixed-left";
  socialIcons.innerHTML = `
    <a href="https://www.instagram.com/sivconsultingoil" target="_blank" title="Instagram">
      <i class="bi bi-instagram"></i>
    </a>
    <a href="https://www.facebook.com/sivconsulting" target="_blank" title="Facebook">
      <i class="bi bi-facebook"></i>
    </a>
    <a href="mailto:info@sivconsultingoil.com" title="Correo">
      <i class="bi bi-envelope-fill"></i>
    </a>
  `;
  document.body.appendChild(socialIcons);

  // En mobile: ocultar hasta que se pase el header (o cierto scroll)
  function toggleSocialMobile() {
    const isMobile = window.innerWidth < 992;
    const header = document.querySelector("header") || document.getElementById("header");
    const scrollY = window.scrollY;
    let headerHeight = header ? header.offsetHeight : 150;
    if (isMobile) {
      // Mostrar solo si se pasó el header (ajusta 40 si usas margen/padding extra)
      if (scrollY > headerHeight - 40) {
        socialIcons.style.display = "flex";
      } else {
        socialIcons.style.display = "none";
      }
    } else {
      socialIcons.style.display = "flex";
    }
  }

  window.addEventListener("scroll", toggleSocialMobile);
  window.addEventListener("resize", toggleSocialMobile);

  // Detectar apertura/cierre del menú mobile y ocultar icons sociales
  const navbar = document.getElementById('navbarNavDropdown');
  if (navbar) {
    const observer = new MutationObserver(() => {
      if (navbar.classList.contains('show')) {
        socialIcons.style.display = 'none';
      } else {
        toggleSocialMobile();
      }
    });
    observer.observe(navbar, { attributes: true, attributeFilter: ['class'] });
  }

  // Llama una vez al inicio para el estado inicial
  toggleSocialMobile();
});
