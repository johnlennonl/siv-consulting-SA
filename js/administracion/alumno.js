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

  // Auth y bienvenida
  firebase.auth().onAuthStateChanged(async user=>{
    if(!user) return location.href="login.html";
    const ud = await db.collection("usuarios").doc(user.uid).get();
    if(!ud.exists || ud.data().rol!=="alumno") return location.href="login.html";
    document.getElementById("bienvenida").textContent =
      `¡Bienvenido, ${ud.data().nombre||user.email}! 👋🏻`;

      // Autocompletar el nombre en el modal de contacto
document.getElementById("nombreContacto").value = ud.data().nombre || user.email;
document.getElementById("emailContacto").value = user.email;





      //Alumno Nombre 
     document.querySelectorAll(".alumnoNombre").forEach(el => {
       el.textContent = ud.data().nombre || user.email;
     })

   // 🔔 Mostrar notificaciones
const btnNotif = document.getElementById("btnNotif");
const notifList = document.getElementById("notifList");
const notifCount = document.getElementById("notifCount");

// Mostrar/Ocultar al hacer click
btnNotif.addEventListener("click", e => {
  e.stopPropagation();
  notifList.classList.toggle("show");
});

// Ocultar al hacer click fuera
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

document.getElementById("btnNotif").addEventListener("click", async () => {
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


  

    // Mostrar cursos
    // Mostrar cursos en formato moderno tipo panel
const cursos = ud.data().cursosInscritos || [];
const contenedor = document.getElementById("cursos-container");
contenedor.innerHTML = "";

if (cursos.length === 0) {
  contenedor.innerHTML = "<p class='text-muted'>No tienes cursos asignados aún.</p>";
  return;
}



// Grupo de input y select
const inputGroup = document.createElement("div");
inputGroup.className = "input-group mb-4";

inputGroup.innerHTML = `
  <span class="input-group-text bg-dark text-warning border-0 rounded-start">
    <i class="fas fa-book-reader"></i>
  </span>
`;



// select con clase personalizada
const select = document.createElement("select");
select.className = "form-select inputElegirCurso border-0 rounded-end";
select.innerHTML = cursos.map((id, idx) => `<option value="${id}">Curso ${idx + 1}</option>`).join("");

// insertar el select dentro del grupo
inputGroup.appendChild(select);
contenedor.appendChild(inputGroup);
// Función para renderizar la tarjeta de curso
const renderCurso = async (idCurso) => {
  const cdoc = await db.collection("cursos").doc(idCurso).get();
  if (!cdoc.exists) return;
  const c = cdoc.data();

  const card = document.createElement("div");
  card.className = "card bg-dark text-white p-4 rounded-4 mb-4 cardCurso";

  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="badge bg-secondary">100% En Vivo</span>
      <small class="text-muted">ID: ${cdoc.id}</small>
    </div>
    <h3 class="mb-2"><i class="fas fa-book-open me-2"></i>${c.titulo}</h3>
    <p class="mb-1"><i class="fas fa-calendar-alt me-2 text-info"></i><strong>Inicio:</strong> ${c.fechaInicio}</p>
    <p class="mb-1"><i class="fas fa-clock me-2 text-warning"></i><strong>Hora:</strong> ${c.horaClase}</p>
    <p class="mb-1"><i class="fas fa-calendar-day me-2 text-primary"></i><strong>Días:</strong> ${c.diasClase.join(", ")}</p>
    <p class="mt-3"><i class="fas fa-align-left me-2 text-secondary"></i><strong>Descripción:</strong> ${c.descripcion || "Sin descripción."}</p>

    <div class="d-flex align-items-center gap-3 my-3">
      <img src="../images/${c.fotoDocente}" class="rounded-circle border border-2 shadow" style="width:60px;height:60px;object-fit:cover">
      <span class="fw-bold"><i class="fas fa-chalkboard-teacher me-2"></i>${c.docente}</span>
    </div>

    <a href="${c.linkZoom}" target="_blank" class="btn btn-outline-warning fw-bold mb-2">
      <i class="fas fa-video me-2"></i>Entrar a clase en vivo
    </a>

    <div>
      <h5 class="mt-4"><i class="fas fa-folder-open me-2"></i>Recursos</h5>
      <div class="d-flex flex-wrap">
        ${Array.isArray(c.recursos) && c.recursos.length
          ? c.recursos.map(r => `
            <a href="${r.url}" target="_blank" class="btn btn-sm btn-outline-light m-1">${r.nombre}</a>`).join("")
          : `<p class="text-muted">No hay recursos disponibles.</p>`}
      </div>
    </div>

    <div class="mt-4">
      <h5><i class="fas fa-play-circle me-2"></i>Video Tutorial</h5>
      <div class="ratio ratio-16x9 " style="max-width: 500px; display:">
        <iframe src="https://www.youtube.com/embed/${c.videoTutorial}" allowfullscreen></iframe>
      </div>
    </div>
  `;

  const prevCard = document.querySelector(".card.bg-dark");
  if (prevCard) prevCard.remove();

  contenedor.appendChild(card);
};

// Evento: cambiar curso desde el selector
select.addEventListener("change", e => renderCurso(e.target.value));

// Mostrar el primer curso al cargar
renderCurso(select.value);

  });

  // Logout
  document.querySelectorAll(".logout").forEach(btn => {
    btn.addEventListener("click", () => {
      firebase.auth().signOut();
    });
  });

 
  // Cambiar contraseña (igual que antes)
  document.querySelectorAll(".changePwdBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    Swal.fire({
      title:'Confirma tu contraseña actual',
      input:'password', inputLabel:'Ingresar contraseña actual',
      showCancelButton:true, confirmButtonText:'Continuar'
    }).then(r => {
      if (!r.isConfirmed || !r.value) return;
      const user = firebase.auth().currentUser,
            cred = firebase.auth.EmailAuthProvider.credential(user.email, r.value);
      user.reauthenticateWithCredential(cred)
        .then(() => Swal.fire({
          title:'Nueva contraseña',
          input:'password', inputLabel:'Ingresa nueva contraseña',
          showCancelButton:true, confirmButtonText:'Actualizar'
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



