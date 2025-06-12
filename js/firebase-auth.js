function loginUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const db = firebase.firestore();

      // Buscar el rol en Firestore
      db.collection("usuarios").doc(user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const rol = doc.data().rol;
            sessionStorage.setItem("userEmail", user.email);
            sessionStorage.setItem("userRol", rol);

            if (rol === "admin") {
              window.location.href = "admin.html";
            } else if (rol === "alumno") {
              window.location.href = "alumno.html";
            } else {
              Swal.fire("Error", "Rol no reconocido", "error");
            }
          } else {
            Swal.fire("Error", "No se encontró información del usuario en Firestore", "error");
          }
        })
        .catch((error) => {
          Swal.fire("Error", "Fallo al obtener datos de rol: " + error.message, "error");
        });
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    });
}
