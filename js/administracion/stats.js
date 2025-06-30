/* DASHBOARD */

const dashboardSection = document.getElementById('dashboard');

async function cargarEstadisticas() {
  try {
    // Obtener total de cursos
    const cursosSnap = await db.collection('cursos').get();
    const totalCursos = cursosSnap.size;

   // Obtener total de usuarios con rol "alumno"
const usuariosSnap = await db.collection('usuarios').where("rol", "==", "alumno").get();
const totalAlumnos = usuariosSnap.size;
    // Aquí simulamos docentes (puedes crear colección luego)
    // Total de docentes
const docentesSnap = await db.collection('usuarios').where("rol", "==", "docente").get();
const totalDocentes = docentesSnap.size;

    // HTML para estadísticas
    dashboardSection.innerHTML = `
      <div class="dashboard-card">
      <div>
      <img class="dashboard-icon" src="https://cdn-icons-png.freepik.com/256/12571/12571341.png?semt=ais_hybrid" alt="Dashboard Icon">
       </div>
        <h2>${totalCursos}</h2>
        <p>Cursos Activos</p>
      </div>
      <div class="dashboard-card ">
      <div>
      <img class="dashboard-icon" src="https://cdn-icons-png.flaticon.com/512/9972/9972270.png" alt="Dashboard Icon">
       </div>
        <h2>${totalAlumnos}</h2>
        <p>Alumnos Registrados</p>
      </div>
      <div class="dashboard-card">
      <div>
      <img class="dashboard-icon" src="https://cdn-icons-png.freepik.com/256/3750/3750020.png?semt=ais_hybrid" alt="Dashboard Icon">
       </div>
        <h2>${totalDocentes}</h2>
        <p>Docentes</p>
      </div>
      

</div>
    `;

    // Simulación de datos semanales para el gráfico
    const inscripcionesPorSemana = [4, 7, 10, 5, 12, 8]; // valores de ejemplo
    const etiquetas = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    new Chart(document.getElementById("graficoInscripciones"), {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [{
          label: "Inscripciones por día",
          data: inscripcionesPorSemana,
          borderWidth: 2,
          borderColor: "#4CAF50",
          backgroundColor: "#252836",
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

  } catch (error) {
    console.error("Error cargando estadísticas:", error);
  }
}


cargarEstadisticas();
