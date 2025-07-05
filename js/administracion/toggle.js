document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar    = document.getElementById("sidebar");

  if (!menuToggle || !sidebar) return;

  // 1) Al pulsar hamburguesa
  menuToggle.addEventListener("click", e => {
    sidebar.classList.toggle("open");
    document.body.classList.toggle("sidebar-open");
    e.stopPropagation();
  });

  // 2) Cerrar al pulsar fuera
  document.addEventListener("click", e => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
    }
  });

  // 3) Cerrar con Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
    }
  });
});


// Cierra el sidebar al hacer click en cualquier link del menú (opcional)
document.querySelectorAll('#sidebar .nav-list a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById("sidebar").classList.remove("open");
    document.body.classList.remove("sidebar-open");
  });
});
