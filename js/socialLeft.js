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

  // Detectar apertura/cierre del menú mobile
  const navbar = document.getElementById('navbarNavDropdown');

  if (navbar) {
    const observer = new MutationObserver(() => {
      if (navbar.classList.contains('show')) {
        socialIcons.style.display = 'none';
      } else {
        socialIcons.style.display = 'flex'; // o block
      }
    });

    observer.observe(navbar, { attributes: true, attributeFilter: ['class'] });
  }
});
