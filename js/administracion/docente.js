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
    if(!ud.exists || ud.data().rol!=="docente") return location.href="login.html";
    document.getElementById("bienvenida").textContent =
      `¡Bienvenido, ${ud.data().nombre||user.email}! 👋🏻`;

     
      //Docente Nombre 
     document.querySelectorAll(".docenteNombre").forEach(el => {
       el.textContent = ud.data().nombre || user.email;
     }) 
});

//logout 
document.getElementsByClassName("logout")[0].addEventListener("click", e => {
  firebase.auth().signOut();
})

// Cambiar contraseña
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