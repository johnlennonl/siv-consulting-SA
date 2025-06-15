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
      fh.textContent = d.toLocaleDateString("es-ES")+" | "+d.toLocaleTimeString("es-ES");
    };
    tick(); setInterval(tick,1000);
  });
 // Auth & bienvenida
    firebase.auth().onAuthStateChanged(async user => {
      if(!user) return location.href="login.html";
      const ud = await db.collection('usuarios').doc(user.uid).get();
      if(!ud.exists || ud.data().rol !== 'admin') return location.href="login.html";
      document.getElementById('bienvenida').textContent = `¡Bienvenido, ${ud.data().nombre||user.email}! 👋🏻`;
      // después de validar, cargamos destinatarios
      loadDestinatarios();
    });
// Función para cargar destinatarios (alumnos)
    async function loadDestinatarios() {
  const sel = document.getElementById('selectDestinatario');
  sel.innerHTML = '<option value="" disabled selected>Selecciona alumno</option>';
  const users = await db.collection('usuarios').where('rol','==','alumno').get();
  users.forEach(doc => {
    const o = document.createElement('option');
    o.value     = doc.id;
    o.textContent = doc.data().nombre;
    sel.appendChild(o);
  });
}
    // Auth & bienvenida
    firebase.auth().onAuthStateChanged(async user => {
      if(!user) return location.href="login.html";
      const ud = await db.collection('usuarios').doc(user.uid).get();
      if(!ud.exists || ud.data().rol !== 'admin') return location.href="login.html";
      document.getElementById('bienvenida').textContent = `¡Bienvenido, ${ud.data().nombre||user.email}! 👋🏻`;
      // después de validar, cargamos destinatarios
      loadDestinatarios();
    });


  // Logout
  document.getElementById("logout").onclick = e=>{
    e.preventDefault();
    firebase.auth().signOut().then(()=>location.href="login.html");
  };

  // Cambiar contraseña
  document.getElementById("changePwdBtn").addEventListener("click", ()=>{
    Swal.fire({
      title:'Confirma tu contraseña actual',
      input:'password', inputLabel:'Por seguridad ingresa tu contraseña actual',
      showCancelButton:true, confirmButtonText:'Continuar'
    }).then(r=>{
      if(!r.isConfirmed || !r.value) return;
      const user=firebase.auth().currentUser,
            cred=firebase.auth.EmailAuthProvider.credential(user.email,r.value);
      user.reauthenticateWithCredential(cred)
        .then(()=> Swal.fire({
          title:'Nueva contraseña',
          input:'password', inputLabel:'Ingresa tu nueva contraseña',
          showCancelButton:true, confirmButtonText:'Actualizar'
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

    let allCourses = [];
  db.collection("cursos").get().then(snap=>{
    snap.forEach(doc=>{
      allCourses.push({ id: doc.id, titulo: doc.data().titulo });
    });
  });



    // Crear curso
    document.getElementById("formCrearCurso").addEventListener("submit", async e => {
  e.preventDefault();

  // recogemos recursos dinámicos
  const recursos = Array.from(document.querySelectorAll(".recurso-pair"))
    .map(div => ({
      nombre: div.querySelector(".rc-nombre").value,
      url:    div.querySelector(".rc-url").value
    }));

  const nuevo = {
    titulo:       document.getElementById("tituloCurso").value,
    descripcion:  document.getElementById("descripcionCurso").value,
    fechaInicio:  document.getElementById("fechaInicio").value,
    horaClase:    document.getElementById("horaClase").value,
    diasClase:    Array.from(document.getElementById("diasClase").selectedOptions).map(o=>o.value),
    docente:      document.getElementById("docenteCurso").value,
    fotoDocente:  document.getElementById("fotoDocente").value,
    linkZoom:     document.getElementById("linkZoomCurso").value,
    notaFinal:    Number(document.getElementById("notaFinalCurso").value),
    recursos,
    videoTutorial:document.getElementById("videoTutorialCurso").value,
    activo:       document.getElementById("activoCurso").checked
  };

  await db.collection("cursos").add(nuevo);
  Swal.fire("¡Éxito!","Curso creado correctamente","success");
  bootstrap.Modal.getInstance(document.getElementById("modalCrearCurso")).hide();
});

    // Editar curso (enlace)
    const modalEd = document.getElementById("modalEditarCurso");
    modalEd.addEventListener("show.bs.modal", async ()=>{
      const sel = document.getElementById("cursoSelectEditar");
      sel.innerHTML="";
      (await db.collection("cursos").get()).forEach(d=>{
        const o=document.createElement("option");
        o.value=d.id; o.textContent=d.data().titulo;
        sel.appendChild(o);
      });
    });
    document.getElementById("formEditarCurso").addEventListener("submit", async e=>{
      e.preventDefault();
      const id=document.getElementById("cursoSelectEditar").value;
      const link=document.getElementById("linkZoomEditar").value;
      await db.collection("cursos").doc(id).update({linkZoom:link});
      Swal.fire('Actualizado','Link de Zoom guardado','success');
      bootstrap.Modal.getInstance(modalEd).hide();
    });

    // Eliminar curso
    document.getElementById("btnEliminarCurso").addEventListener("click", async ()=>{
      const { value:id } = await Swal.fire({
        title:'ID del curso a eliminar',
        input:'text', inputLabel:'Introduce el ID',
        showCancelButton:true
      });
      if(!id) return;
      await db.collection("cursos").doc(id).delete();
      Swal.fire('Eliminado','Curso borrado','success');
    });

     // Gestión de inscripciones
  const modalIns = document.getElementById("modalGestionInscripciones");
  modalIns.addEventListener("show.bs.modal", async ()=>{
    const selAlumnoAsig = document.getElementById("selectAlumnoAsig"),
          selAlumnoDes  = document.getElementById("selectAlumnoDes"),
          selCursoAsig  = document.getElementById("selectCursoAsig"),
          selCursoDes   = document.getElementById("selectCursoDes");

    // limpiamos
    [selAlumnoAsig, selAlumnoDes, selCursoAsig, selCursoDes].forEach(s=> s.innerHTML="");

    // llenamos alumnos
    const users = await db.collection("usuarios").where("rol","==","alumno").get();
    users.forEach(d=>{
      const opt1 = document.createElement("option");
      opt1.value = opt1.textContent = `${d.id}`;
      opt1.textContent = `${d.data().nombre} (${d.data().email})`;
      const opt2 = opt1.cloneNode(true);
      selAlumnoAsig.appendChild(opt1);
      selAlumnoDes.appendChild(opt2);
    });

    // al cambiar alumno en "Asignar"
    selAlumnoAsig.onchange = async ()=>{
      selCursoAsig.innerHTML = "";
      const uid = selAlumnoAsig.value;
      const uDoc = await db.collection("usuarios").doc(uid).get();
      const inscritos = uDoc.data().cursosInscritos||[];
      allCourses
        .filter(c=> !inscritos.includes(c.id))
        .forEach(c=>{
          const o=document.createElement("option");
          o.value=c.id; o.textContent=c.titulo;
          selCursoAsig.appendChild(o);
        });
    };

    // al cambiar alumno en "Quitar"
    selAlumnoDes.onchange = async ()=>{
      selCursoDes.innerHTML = "";
      const uid = selAlumnoDes.value;
      const uDoc = await db.collection("usuarios").doc(uid).get();
      const inscritos = uDoc.data().cursosInscritos||[];
      allCourses
        .filter(c=> inscritos.includes(c.id))
        .forEach(c=>{
          const o=document.createElement("option");
          o.value=c.id; o.textContent=c.titulo;
          selCursoDes.appendChild(o);
        });
    };

    // disparamos por primera vez
    selAlumnoAsig.dispatchEvent(new Event("change"));
    selAlumnoDes.dispatchEvent(new Event("change"));
  });

  // Asignar curso
  document.getElementById("formAsignarEst").addEventListener("submit", async e=>{
    e.preventDefault();
    const uid = document.getElementById("selectAlumnoAsig").value,
          cid = document.getElementById("selectCursoAsig").value;
    const uDoc = await db.collection("usuarios").doc(uid).get();
    const arr = uDoc.data().cursosInscritos||[];
    if(arr.includes(cid)) return Swal.fire('Info','Ya está inscrito','info');
    arr.push(cid);
    await db.collection("usuarios").doc(uid).update({ cursosInscritos:arr });
    Swal.fire('Asignado','Curso asignado al alumno','success');
  });

  // Quitar curso
  document.getElementById("formDesasignarEst").addEventListener("submit", async e=>{
    e.preventDefault();
    const uid = document.getElementById("selectAlumnoDes").value,
          cid = document.getElementById("selectCursoDes").value;
    const uDoc = await db.collection("usuarios").doc(uid).get();
    let arr = uDoc.data().cursosInscritos||[];
    if(!arr.includes(cid)) return Swal.fire('Info','El alumno no tiene ese curso','info');
    arr = arr.filter(x=> x!==cid);
    await db.collection("usuarios").doc(uid).update({ cursosInscritos:arr });
    Swal.fire('Quitar','Curso removido del alumno','success');
  });

  


     // Modo claro/oscuro
    document.getElementById('toggleModeBtn').onclick = () => {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      localStorage.setItem('admin-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      document.getElementById('toggleModeBtn').innerHTML = 
        document.body.classList.contains('dark-mode')
        ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    // Auto-aplicar preferencia
    window.addEventListener('DOMContentLoaded', () => {
      const pref = localStorage.getItem('admin-theme');
      if (pref && !document.body.classList.contains(pref+'-mode')) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(pref+'-mode');
        document.getElementById('toggleModeBtn').innerHTML = 
          pref === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      }
    });


    // Hamburguesa menú
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

// Abrir sidebar
menuToggle.addEventListener('click', e => {
  sidebar.classList.add('open');
  document.body.classList.add('sidebar-open');
  e.stopPropagation();
});
// Cerrar con X
sidebarCloseBtn.addEventListener('click', e => {
  sidebar.classList.remove('open');
  document.body.classList.remove('sidebar-open');
  e.stopPropagation();
});
// Cerrar tocando fuera del sidebar
document.addEventListener('click', function(e) {
  if (
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }
});
// Cerrar con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }
});



document.getElementById("formRegistrarAlumno").addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = document.getElementById("nombreAlumno").value.trim();
  const email = document.getElementById("emailAlumno").value.trim();
  const clave = document.getElementById("claveAlumno").value;

  if (!nombre || !email || !clave) {
    return Swal.fire("Error", "Todos los campos son obligatorios", "error");
  }

  try {
    const res = await fetch("http://localhost:3000/crear-alumno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, email, clave })
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("¡Éxito!", "Alumno registrado correctamente", "success");
      bootstrap.Modal.getInstance(document.getElementById("modalRegistrarAlumno")).hide();
      document.getElementById("formRegistrarAlumno").reset();

      // Recargar lista de alumnos, si tienes función
      loadDestinatarios?.();
    } else {
      throw new Error(data.error || "Error desconocido");
    }

  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.message, "error");
  }
});
