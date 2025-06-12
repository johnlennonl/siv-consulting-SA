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
          <a href="#" id="resetPwd" class="link-light">¿Olvidaste tu contraseña?</a>
          <a href="#" class="link-light">Necesito ayuda</a>
        </div>
      </div>
      <div class="login-image"></div>
    </div>
  `;

  // Restablecer contraseña desde el login
document.getElementById("resetPwd").addEventListener("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Restablecer contraseña",
    input: "email",
    inputLabel: "Ingresa tu correo",
    inputPlaceholder: "correo@ejemplo.com",
    showCancelButton: true,
    confirmButtonText: "Enviar enlace",
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      firebase.auth().sendPasswordResetEmail(result.value)
        .then(() => {
          Swal.fire("¡Enviado!", "Revisa tu correo para cambiar tu contraseña.", "success");
        })
        .catch((error) => {
          Swal.fire("Error", error.message, "error");
        });
    }
  });
});



  document.getElementById("togglePwd").addEventListener("click", () => {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
  });

  document.getElementById("auth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    loginUser(email, password);
  });
});
