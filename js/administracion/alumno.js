// Configuración Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCHrHjd6GaJDHk23cvW8oTl496Zaw-wmYM",
    authDomain: "siv-consulting.firebaseapp.com",
    projectId: "siv-consulting",
    storageBucket: "siv-consulting.appspot.com",
    messagingSenderId: "851037351245",
    appId: "1:851037351245:web:c7cd6ad46c5ab891251b04"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  
// Loader y reloj
window.addEventListener("load", () => {
  const l = document.getElementById("loader-wrapper");
  l.style.opacity = "1";
  setTimeout(() => {
    l.style.transition = "opacity .5s";
    l.style.opacity = "0";
    setTimeout(() => l.style.display = "none", 500);
  }, 500);
  // Reloj
  const fh = document.getElementById("fechaHora");
  const tick = () => {
    const d = new Date();
    const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = d.toLocaleDateString('es-ES', opcionesFecha).replace(" de ", " de ").replace(" de ", " del ");
    fh.textContent = fechaFormateada + " | " + d.toLocaleTimeString('es-ES');
  };
  tick();
  setInterval(tick, 1000);
});

// Auth, bienvenida y notificaciones
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return location.href = "login.html";
  const ud = await db.collection("usuarios").doc(user.uid).get();
  if (!ud.exists || ud.data().rol !== "alumno") return location.href = "login.html";
  document.getElementById("bienvenida").textContent =
    `¡Bienvenido, ${ud.data().nombre || user.email}! 👋🏻`;

  // Autocompletar el nombre en el modal de contacto
  document.getElementById("nombreContacto").value = ud.data().nombre || user.email;
  document.getElementById("emailContacto").value = user.email;

  // Si tienes .alumnoNombre en algún sitio
  document.querySelectorAll(".alumnoNombre").forEach(el => {
    el.textContent = ud.data().nombre || user.email;
  });

  // 🔔 Notificaciones
  const btnNotif = document.getElementById("btnNotif");
  const notifList = document.getElementById("notifList");
  const notifCount = document.getElementById("notifCount");

  btnNotif.addEventListener("click", e => {
    e.stopPropagation();
    notifList.classList.toggle("show");
  });

  document.addEventListener("click", e => {
    if (!notifList.contains(e.target) && !btnNotif.contains(e.target)) {
      notifList.classList.remove("show");
    }
  });

  const notifsSnap = await db
    .collection("usuarios")
    .doc(user.uid)
    .collection("notificaciones")
    .orderBy("fecha", "desc")
    .limit(10)
    .get();

  notifList.innerHTML = "";

  if (notifsSnap.empty) {
    notifList.innerHTML = `<div class="text-center text-muted p-3">Sin notificaciones</div>`;
  } else {
    let unread = 0;
    notifsSnap.forEach(doc => {
      const n = doc.data();
      if (!n.leido) unread++;
      notifList.innerHTML += `
        <div class="notificacion-item${!n.leido ? ' fw-bold' : ''}">
          ${n.mensaje}
          <small>${n.fecha?.toDate().toLocaleString("es-VE") || ''}</small>
        </div>`;
    });

    if (unread > 0) {
      notifCount.textContent = unread;
      notifCount.style.display = "inline-block";
    }
  }

  btnNotif.addEventListener("click", async () => {
    const notifs = await db.collection("usuarios")
      .doc(user.uid)
      .collection("notificaciones")
      .where("leido", "==", false)
      .get();

    notifs.forEach(async doc => {
      await doc.ref.update({ leido: true });
    });

    notifCount.style.display = "none";
  });
});

// Logout
document.querySelectorAll(".logout").forEach(btn => {
  btn.addEventListener("click", () => {
    firebase.auth().signOut();
  });
});

// Cambiar contraseña
document.querySelectorAll(".changePwdBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    Swal.fire({
      title: 'Confirma tu contraseña actual',
      input: 'password', inputLabel: 'Ingresar contraseña actual',
      showCancelButton: true, confirmButtonText: 'Continuar'
    }).then(r => {
      if (!r.isConfirmed || !r.value) return;
      const user = firebase.auth().currentUser,
        cred = firebase.auth.EmailAuthProvider.credential(user.email, r.value);
      user.reauthenticateWithCredential(cred)
        .then(() => Swal.fire({
          title: 'Nueva contraseña',
          input: 'password', inputLabel: 'Ingresa nueva contraseña',
          showCancelButton: true, confirmButtonText: 'Actualizar'
        }).then(r2 => {
          if (r2.isConfirmed && r2.value) {
            user.updatePassword(r2.value)
              .then(() => Swal.fire('¡Éxito!', 'Contraseña cambiada', 'success'))
              .catch(e => Swal.fire('Error', e.message, 'error'));
          }
        }))
        .catch(() => Swal.fire('Error', 'Contraseña incorrecta', 'error'));
    });
  });
});