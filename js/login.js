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
          <button type="submit" id="login-btn" class="btn btn-custom w-100">
            <span id="login-text">Iniciar sesión</span>
            <span id="login-spinner" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
          </button>
        </form>
       <div class="login-footer">
          <a href="#" id="resetPwd" class="link-light">¿Olvidaste tu contraseña?</a>
          <a href="#" class="link-light">Necesito ayuda</a>
        </div>
      </div>
      <div class="login-image"></div>
    </div>
  `;

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
    document.getElementById("login-text").classList.add("d-none");
    document.getElementById("login-spinner").classList.remove("d-none");
    loginUser(email, password);
  });
});

function loginUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      firebase.firestore().collection("usuarios").doc(uid).get()
        .then((doc) => {
          const rol = doc.data()?.rol || "";
          if (rol === "admin") {
            window.location.href = "admin.html";
          } else if (rol === "alumno") {
            window.location.href = "alumno.html";
          } else {
            Swal.fire("Error", "Rol no autorizado.", "error");
            firebase.auth().signOut();
          }
        });
    })
    .catch((error) => {
      console.error("Firebase login error:", error);
      const serverErrors = [
        "auth/internal-error",
        "auth/network-request-failed",
        "auth/too-many-requests",
        "auth/user-disabled"
      ];

      if (serverErrors.includes(error.code)) {
        Swal.fire({
          icon: 'info',
          title: 'Servidor en mantenimiento',
          html: `
            <p>Estamos presentando fallas técnicas. Por favor intenta nuevamente en unos minutos.</p>
            <p>Si necesitas ayuda urgente, contáctanos vía:</p>
            <div style="font-size:15px;text-align:center;margin-top:10px;">
              <a href="https://wa.me/584141234567" target="_blank" style="color:#25D366;font-weight:bold;text-decoration:none;">
                <i class="fab fa-whatsapp"></i> WhatsApp
              </a>
              &nbsp;|&nbsp;
              <a href="mailto:soporte@sivconsulting.com" target="_blank" style="color:#007BFF;font-weight:bold;text-decoration:none;">
                <i class="fas fa-envelope"></i> Correo
              </a>
            </div>
          `,
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'swal2-border-radius-xl',
            title: 'swal2-title-custom'
          }
        });
      } else {
        Swal.fire({
          title: '<img src="../images/LOGO-SIN-FONDO-min.png" alt="Logo" style="width:80px;margin-bottom:10px;"><br>Credenciales incorrectas',
          html: `
            <div style="font-size:15px;text-align:left;">
              <p>Hola 👋🏻, parece que has ingresado alguna credencial incorrecta.</p>
              <p>Si aún no tienes usuario con nosotros, debes <strong>contactarnos vía WhatsApp</strong> para registrarte.</p>
              
            </div>
          `,
          
          confirmButtonText: 'Entendido',
          footer: `
            <div class="swal2-footer-custom" style="font-size:14px;">
              <a href="https://wa.me/584141234567" target="_blank" style="color:#25D366;text-decoration:none;font-weight:bold;">
                <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
              </a>
              &nbsp;|&nbsp;
              <a href="mailto:soporte@sivconsulting.com" target="_blank" style="color:#007BFF;text-decoration:none;font-weight:bold;">
                <i class="fas fa-envelope"></i> Enviar correo
              </a>
            </div>
          `,
          customClass: {
            popup: 'swal2-border-radius-xl',
            title: 'swal2-title-custom'
          }
        });
      }
    })
    .finally(() => {
      document.getElementById("login-text").classList.remove("d-none");
      document.getElementById("login-spinner").classList.add("d-none");
    });
}
