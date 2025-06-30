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
