// Mostrar/ocultar botón al hacer scroll
window.addEventListener("scroll", () => {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (window.scrollY > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

// Scroll suave hacia arriba
document.getElementById("scrollTopBtn").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
