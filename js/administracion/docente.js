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
window.addEventListener("load", ()=> {
  const l = document.getElementById("loader-wrapper");
  l.style.opacity="1";
  setTimeout(()=>{
    l.style.transition="opacity .5s";
    l.style.opacity="0";
    setTimeout(()=>l.style.display="none",500);
  },500);
  // Reloj
  const fh = document.getElementById("fechaHora");
  const tick = ()=>{
    const d=new Date();
    const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = d.toLocaleDateString('es-ES', opcionesFecha).replace(" de ", " de ").replace(" de ", " del ");
    fh.textContent = fechaFormateada + " | " + d.toLocaleTimeString('es-ES');
  };
  tick(); setInterval(tick,1000);
});

// Badge en tiempo real (Escuchar cambios de notificaciones NO leídas)
function escucharBadgeNotificaciones(uid) {
  db.collection('usuarios').doc(uid)
    .collection('notificaciones')
    .where('leida', '==', false)
    .onSnapshot(snap => {
      const badge = document.getElementById('notifCountSidebar');
      if (badge) {
        badge.textContent = snap.size > 0 ? snap.size : '';
        badge.style.display = snap.size > 0 ? 'inline-flex' : 'none';
        badge.style.minWidth = '22px';
        badge.style.height = '22px';
        badge.style.justifyContent = 'center';
        badge.style.alignItems = 'center';
        badge.style.fontSize = '1.08em';
        badge.style.fontWeight = '700';
        badge.style.boxShadow = '0 1px 8px #d32f2f55';
        badge.style.padding = '0 7px';
        badge.style.position = 'relative';
        badge.style.top = '-3px';
        badge.style.left = '2px';
        badge.style.letterSpacing = '.5px';
      }
    });
}

// Al iniciar el panel, tras auth:
firebase.auth().onAuthStateChanged(async user => {
  if(!user) return location.href="login.html";
  const ud = await db.collection("usuarios").doc(user.uid).get();
  if(!ud.exists || ud.data().rol!=="docente") return location.href="login.html";

  document.getElementById("bienvenida").textContent =
    `¡Bienvenido, ${ud.data().nombre||user.email}! 👋🏻`;

  await cargarMisCursos(user.uid);

  // Escuchar badge en tiempo real
  escucharBadgeNotificaciones(user.uid);
});

// Logout con limpieza de badge
document.getElementsByClassName("logout")[0].addEventListener("click", e => {
  firebase.auth().signOut().then(() => {
    const badge = document.getElementById('notifCountSidebar');
    if (badge) {
      badge.textContent = '';
      badge.style.display = 'none';
    }
  });
});

// Cambiar contraseña (igual que antes)
document.getElementById("changePwdBtn").addEventListener("click", ()=>{
  Swal.fire({
    title:'Confirma tu contraseña actual',
    input:'password', inputLabel:'Por seguridad ingresa tu contraseña actual',
    background: '#252836',
    color: '#f1f1f1',
    iconColor: '#00ffcc',
    confirmButtonColor: '#00c2a8',
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'rounded-4 montserrat-font',
      confirmButton: ' btn-success px-4 fw-bold'
    },
    showClass: { popup: 'animate__animated animate__fadeInDown' },
    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
  }).then(r=>{
    if(!r.isConfirmed || !r.value) return;
    const user=firebase.auth().currentUser,
          cred=firebase.auth.EmailAuthProvider.credential(user.email,r.value);
    user.reauthenticateWithCredential(cred)
      .then(()=> Swal.fire({
        title:'Nueva contraseña',
        input:'password', inputLabel:'Ingresa tu nueva contraseña',
        background: '#252836',
        color: '#f1f1f1',
        iconColor: '#00ffcc',
        confirmButtonColor: '#00c2a8',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-4 montserrat-font',
          confirmButton: ' btn-success px-4 fw-bold'
        },
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      }).then(r2=>{
        if(r2.isConfirmed && r2.value){
          user.updatePassword(r2.value)
            .then(()=>Swal.fire('¡Éxito!','Contraseña cambiada.','success'))
            .catch(e=>Swal.fire('Error',e.message,'error'));
        }
      }))
      .catch(()=>Swal.fire('Error','Contraseña incorrecta','error'));
  });
});

// --- Listener del botón de notificaciones ---
document.getElementById("linkNotificaciones").addEventListener("click", async e => {
  e.preventDefault();
  const user = firebase.auth().currentUser;
  if (!user) return;

  // Traer notificaciones (últimas 20, ordenadas)
  const snap = await db
    .collection('usuarios')
    .doc(user.uid)
    .collection('notificaciones')
    .orderBy('fecha', 'desc')
    .limit(20)
    .get();

  let html = '';
  if (snap.empty) {
    html = `<li class="text-center text-muted py-3 fs-5">No tienes notificaciones.</li>`;
  } else {
    html = Array.from(snap.docs).map(doc => {
      const d = doc.data();
      const leida = d.leida ? 'opacity:0.65;' : '';
      const fecha = d.fecha?.toDate().toLocaleString('es-ES') || '';
      return `
        <li class="notificacion-item d-flex justify-content-between align-items-start py-3 px-3 mb-2 rounded-3"
          style="${leida}; background:#232029; font-size:1.09em; min-height:64px; box-shadow: 0 2px 12px #0002;"
          data-id="${doc.id}">
          <div style="flex:1 1 0%;overflow-wrap:anywhere;">
            <span style="font-weight:600; font-size:1.13em;">${d.mensaje}</span>
            <br>
            <small style="color:#ffc107">${fecha}</small>
            ${!d.leida ? '<span style="color:#1fa37a;font-size:1em;font-weight:700;margin-left:8px;">● Nuevo</span>' : ''}
          </div>
          <button class="btn btn-sm  btnEliminarNotif ms-3" data-id="${doc.id}" title="Eliminar" style="padding:5px 11px; font-size:1.18em;border-radius:7px;">
            <i class="fas fa-trash"></i>
          </button>
        </li>
      `;
    }).join('');
  }

  Swal.fire({
    title: `<span style="font-size:2.1rem; color:#d5af49; font-weight:900;"><i class="fas fa-envelope-open-text me-2"></i>Notificaciones</span>`,
    html: `<ul class="notif-scroll-container list-unstyled custom-scrollbar" style="max-height:390px;overflow-y:auto;margin-bottom:0;padding:0;">${html}</ul>`,
    width: 480,
    background: '#232029',
    color: '#fff',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-4 shadow-lg'
    }
  });

  // --- Custom scrollbar ---
  setTimeout(() => {
    const el = document.querySelector('.custom-scrollbar');
    if (el) {
      el.style.scrollbarWidth = "thin";
      el.style.scrollbarColor = "#fee084 #232029";
    }
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 7px;
        background: #232029;
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #d5af49;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  }, 50);

  // --- Eliminar notificación individual y marcar como leída al hacer clic ---
  setTimeout(() => {
    // Eliminar notificación
    document.querySelectorAll('.btnEliminarNotif').forEach(btn => {
      btn.onclick = async function(e) {
        e.stopPropagation();
        const notifId = btn.getAttribute('data-id');
        await db.collection('usuarios').doc(user.uid).collection('notificaciones').doc(notifId).delete();
        btn.closest('li').remove();
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Notificación eliminada',
          position: 'top-end',
          timer: 900,
          showConfirmButton: false,
          background: "#252836",
          color: "#f1f1f1"
        });
      };
    });
    // Marcar como leída al hacer clic en el item
    document.querySelectorAll('.notificacion-item').forEach(li => {
      li.onclick = async function() {
        const notifId = this.dataset.id;
        if (!this.classList.contains('leida')) {
          await db.collection('usuarios').doc(user.uid)
            .collection('notificaciones').doc(notifId)
            .update({ leida: true });
          this.classList.add('leida');
          this.style.opacity = '0.6';
        }
      };
    });
  }, 200);
});
