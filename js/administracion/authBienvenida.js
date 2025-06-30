// 📦 authBienvenida.js

// 1️⃣ Inicializa Firebase y devuelve la referencia a Firestore
function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCHrHjd6GaJDHk23cvW8oTl496Zaw-wmYM",
    authDomain: "siv-consulting.firebaseapp.com",
    projectId: "siv-consulting",
    storageBucket: "siv-consulting.appspot.com",
    messagingSenderId: "851037351245",
    appId: "1:851037351245:web:c7cd6ad46c5ab891251b04"
  };
  firebase.initializeApp(firebaseConfig);
  return firebase.firestore(); // ✅ Retornamos la referencia a Firestore
}

// 2️⃣ Loader
function initLoader() {
  const l = document.getElementById("loader-wrapper");
  window.addEventListener("load", () => {
    l.style.opacity = "1";
    setTimeout(() => {
      l.style.transition = "opacity .5s";
      l.style.opacity = "0";
      setTimeout(() => (l.style.display = "none"), 500);
    }, 500);
  });
}

// 3️⃣ Reloj
function initClock() {
  const fh = document.getElementById("fechaHora");
  function tick() {
    const d = new Date();
    const opts = { day: "numeric", month: "long", year: "numeric" };
    const fecha = d
      .toLocaleDateString("es-ES", opts)
      .replace(" de ", " de ")
      .replace(" de ", " del ");
    fh.textContent = `${fecha} | ${d.toLocaleTimeString("es-ES")}`;
  }
  tick();
  setInterval(tick, 1000);
}

// 4️⃣ Mensaje de bienvenida
function showWelcome(texto) {
  const el = document.getElementById("bienvenida");
  if (el) el.textContent = `¡Bienvenido, ${texto}! 👋🏻`;
}

// 5️⃣ Verifica el login y el rol del usuario
async function checkAuth(db) {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) return (location.href = "login.html");

    const ud = await db.collection("usuarios").doc(user.uid).get();
    const data = ud.exists ? ud.data() : {};

    if (data.rol !== "admin") {
      return (location.href = "login.html");
    }

    showWelcome(data.nombre || user.email);
    if (typeof loadDestinatarios === "function") {
      loadDestinatarios();
    }
  });
}

// 6️⃣ Inicialización principal
document.addEventListener("DOMContentLoaded", () => {
  window.db = initFirebase(); // 📌 hacemos db global para usar en otros scripts
  initLoader();
  initClock();
  checkAuth(window.db);
});

// 7️⃣ Logout
document.getElementById("logout").onclick = (e) => {
  e.preventDefault();
  firebase.auth().signOut().then(() => (location.href = "login.html"));
};
