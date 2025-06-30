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
  if (!sel) return; // <- Esto evita el error si no existe

  sel.innerHTML = '<option value="" disabled selected>Selecciona alumno</option>';
  const users = await db.collection('usuarios').where('rol', '==', 'alumno').get();
  users.forEach(doc => {
    const o = document.createElement('option');
    o.value = doc.id;
    o.textContent = doc.data().nombre;
    sel.appendChild(o);
  });
}

  
  // Logout
  document.getElementById("logout").onclick = e=>{
    e.preventDefault();
    firebase.auth().signOut().then(()=>location.href="login.html");
  };


    let allCourses = [];
  db.collection("cursos").get().then(snap=>{
    snap.forEach(doc=>{
      allCourses.push({ id: doc.id, titulo: doc.data().titulo });
    });
  });


// Función global para recargar los cursos
async function cargarCursos() {
  allCourses = [];
  const snapshot = await db.collection("cursos").get();
  snapshot.forEach(doc => {
    allCourses.push({ id: doc.id, titulo: doc.data().titulo });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore(); // o tu initFirebase() personalizado
  initCrearCurso(db);
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

  // 🔔 Agregar notificación
  const curso = allCourses.find(c => c.id === cid);
  const nombreCurso = curso ? curso.titulo : "Curso desconocido";

  await db.collection("usuarios").doc(uid).collection("notificaciones").add({
    mensaje: `Te has inscrito en el curso: ${nombreCurso}`,
    fecha: firebase.firestore.FieldValue.serverTimestamp(),
    leido: false
  });

  Swal.fire({
    title: '¡Éxito!',
    text: 'Curso Asignado satisfactoriamente',
    icon: 'success',
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
  });
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
   Swal.fire({title: '¡Éxito!',
  text: 'Curso removido satisfactoriamente',
  icon: 'success',
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
});
  });

  


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



// Registrar alumno (con SweetAlert mejorado)
document.getElementById("formRegistrarAlumno").addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = document.getElementById("nombreAlumno").value.trim();
  const email = document.getElementById("emailAlumno").value.trim();
  const clave = document.getElementById("claveAlumno").value;

  if (!nombre || !email || !clave) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Todos los campos son obligatorios.',
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }

  Swal.fire({
    title: 'Creando alumno...',
    background: '#252836',
    color: '#f1f1f1',
    iconColor: '#00ffcc',
    didOpen: () => Swal.showLoading(),
    allowOutsideClick: false
  });

  try {
    const res = await fetch("https://siv-backend.onrender.com/crear-alumno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, clave })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al crear alumno");

    Swal.fire({
  title: '¡Éxito!',
  text: 'Alumno registrado correctamente',
  icon: 'success',
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
});

    bootstrap.Modal.getInstance(document.getElementById("modalRegistrarAlumno")).hide();
    document.getElementById("formRegistrarAlumno").reset();

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: '¡Error inesperado!',
      text: err.message,
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }
});




let listaAlumnos = []; // global

// Renderiza solo una vez la estructura HTML de la sección
function renderEstructuraAlumnos() {
  const contenedor = document.getElementById('seccionAlumnos');
  if (document.getElementById("tablaAlumnosBody")) return; // ya existe, no lo vuelvas a pintar

  contenedor.innerHTML = `
  <div class="table-responsive">
    <table class="table table-striped table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Fecha Registro</th>
        </tr>
      </thead>
      <tbody id="tablaAlumnosBody"></tbody>
    </table>
  </div>
`;

  // Evento de búsqueda
  document.getElementById("filtroAlumno").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtrados = listaAlumnos.filter(a =>
      a.nombre.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    );
    renderTablaAlumnos(filtrados);
  });

  // Botón refrescar
  document.getElementById("btnRefrescarAlumnos").onclick = cargarListaAlumnos;
}

// Solo rellena la tabla
function renderTablaAlumnos(lista) {
  const tbody = document.getElementById("tablaAlumnosBody");
  if (!tbody) return;

  const y = window.scrollY; // ⏬ capturamos posición actual del scroll

  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No se encontraron alumnos.</td></tr>`;
  } else {
    lista.forEach(a => {
      tbody.innerHTML += `
        <tr>
          <td>${a.nombre}</td>
          <td>${a.email}</td>
          <td>${a.fecha}</td>
        </tr>
      `;
    });
  }

  // ⏫ restauramos scroll donde estaba
  setTimeout(() => window.scrollTo({ top: y }), 0);
}


// Carga desde Firestore y actualiza tabla
async function cargarListaAlumnos() {
  try {
    const snapshot = await db.collection('usuarios').where('rol', '==', 'alumno').get();
    listaAlumnos = [];

    snapshot.forEach(doc => {
      const alumno = doc.data();
      listaAlumnos.push({
        nombre: alumno.nombre || "Sin nombre",
        email: alumno.email || "—",
        fecha: alumno.fechaRegistro?.toDate().toLocaleDateString("es-ES") || "—"
      });
    });

    renderTablaAlumnos(listaAlumnos); // Actualiza solo la tabla

  } catch (error) {
    console.error("Error al cargar alumnos:", error);
  }
}

// EJECUCIÓN INICIAL
renderEstructuraAlumnos();
cargarListaAlumnos();
