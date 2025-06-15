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

  // Loader & reloj
  window.addEventListener("load", ()=>{
    const l = document.getElementById("loader-wrapper");
    l.style.opacity = "1";
    setTimeout(()=>{
      l.style.transition = "opacity .5s";
      l.style.opacity = "0";
      setTimeout(()=> l.style.display="none",500);
    },500);
  });
  function actualizarFechaHora(){
    const d = new Date();
    document.getElementById("fechaHora").textContent =
      d.toLocaleDateString("es-ES") + " " + d.toLocaleTimeString("es-ES",{second:"2-digit"});
  }
  setInterval(actualizarFechaHora, 1000);
  actualizarFechaHora();

  // Auth y bienvenida
  firebase.auth().onAuthStateChanged(async user=>{
    if(!user) return location.href="login.html";
    const ud = await db.collection("usuarios").doc(user.uid).get();
    if(!ud.exists || ud.data().rol!=="alumno") return location.href="login.html";
    document.getElementById("bienvenida").textContent =
      `¡Bienvenido, ${ud.data().nombre||user.email}! 👋🏻`;

    // Mostrar cursos
    const cursos = ud.data().cursosInscritos||[];
    const cont = document.getElementById("cursos-container");
    if(cursos.length===0){
      cont.innerHTML = "<p class='text-muted'>No tienes cursos asignados aún.</p>";
      return;
    }
    cursos.forEach(async id=>{
      const cdoc = await db.collection("cursos").doc(id).get();
      if(!cdoc.exists) return;
      const c = cdoc.data();
      // tarjeta
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 mb-4 d-flex";
      const card = document.createElement("div");
      card.className = "card flex-fill shadow-sm";
      card.innerHTML = `
        <div class="card-body">
          <h4><i class="fas fa-book"></i> ${c.titulo}</h4>
          <p><i class="fas fa-calendar-alt"></i> <strong>Inicio:</strong> ${c.fechaInicio}</p>
          <p><i class="fas fa-clock"></i> <strong>Hora:</strong> ${c.horaClase}</p>
          <p><i class="fas fa-calendar-day"></i> <strong>Días:</strong> ${c.diasClase.join(", ")}</p>
          <div class="my-3 text-center">
            <img src="../images/${c.fotoDocente}" alt="docente"
                 class="img-fluid rounded-circle"
                 style="width:120px;height:120px;object-fit:cover">
            <p class="mt-2"><i class="fas fa-chalkboard-teacher"></i> ${c.docente}</p>
          </div>
          <a class="btn btn-warning w-100 mb-3" href="${c.linkZoom}" target="_blank">
            <i class="fas fa-video"></i> Entrar a clase
          </a>
          <h5><i class="fas fa-folder-open"></i> Recursos</h5>
          <div class="d-flex flex-wrap justify-content-center mb-3">
            ${Array.isArray(c.recursos)
              ? c.recursos.map(r=>`<a class="btn btn-sm btn-outline-secondary m-1"
                                     href="${r.url}" target="_blank">${r.nombre}</a>`).join("")
              : `<p class="text-muted">No hay recursos.</p>`}
          </div>
          <h5><i class="fas fa-play-circle"></i> Video Tutorial</h5>
          <div class="ratio ratio-16x9 mb-4">
            <iframe src="https://www.youtube.com/embed/${c.videoTutorial}" allowfullscreen></iframe>
          </div>
          
        </div>`;
      col.appendChild(card);
      cont.appendChild(col);
    });
  });

  // Logout
  document.getElementById("logout").onclick = e=>{
    e.preventDefault();
    firebase.auth().signOut().then(()=> location.href="login.html");
  };

  // Cambiar contraseña (igual que antes)
  document.getElementById("changePwdBtn").addEventListener("click", ()=> {
    Swal.fire({
      title:'Confirma tu contraseña actual',
      input:'password', inputLabel:'Ingresar contraseña actual',
      showCancelButton:true, confirmButtonText:'Continuar'
    }).then(r=>{
      if(!r.isConfirmed||!r.value) return;
      const user = firebase.auth().currentUser,
            cred = firebase.auth.EmailAuthProvider.credential(user.email, r.value);
      user.reauthenticateWithCredential(cred)
        .then(()=> Swal.fire({
          title:'Nueva contraseña',
          input:'password', inputLabel:'Ingresa nueva contraseña',
          showCancelButton:true, confirmButtonText:'Actualizar'
        }).then(r2=>{
          if(r2.isConfirmed && r2.value){
            user.updatePassword(r2.value)
              .then(()=>Swal.fire('¡Éxito!','Contraseña cambiada','success'))
              .catch(e=>Swal.fire('Error',e.message,'error'));
          }
        }))
        .catch(()=> Swal.fire('Error','Contraseña incorrecta','error'));
    });
  });

