// js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("login-container");
  container.innerHTML = `
    <div class="login-wrapper">
      <div class="login-panel">
        <img src="../images/LOGO-SIN-FONDO-min.png" alt="SIV Consulting" class="login-logo">
        <h2 class="login-title">SIV Consulting S.A</h2>

        <div class="divider"><span>O</span></div>

        <form id="auth-form">
          <div class="form-group mb-3">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" class="form-control" placeholder="Ingresa tu correo">
          </div>
          <div class="form-group mb-3 position-relative">
            <label for="password">Contraseña</label>
            <input type="password" id="password" class="form-control" placeholder="••••••••">
            <span class="toggle-password" id="togglePwd">👁️</span>
          </div>
          <button type="submit" class="btn btn-custom w-100">Iniciar sesión</button>
        </form>

        <div class="login-footer">
          <a href="#" class="link-light">¿Olvidaste tu contraseña?</a>
          <a href="#" class="link-light">Necesito ayuda</a>
        </div>
      </div>
      <!-- Nueva columna de imagen -->
      <div class="login-image"></div>
    </div>
  `;

  // Toggle password visibility
  document.getElementById("togglePwd").addEventListener("click", () => {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
  });

  // Placeholder submit handler
  document.getElementById("auth-form").addEventListener("submit", e => {
    e.preventDefault();
    alert("Autenticando…");
  });
});
