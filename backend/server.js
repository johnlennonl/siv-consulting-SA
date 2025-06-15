import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Credenciales del servicio desde variable de entorno
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ✅ Endpoint de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend SIV operativo correctamente 🚀');
});

// 📩 Endpoint para crear alumno
app.post('/crear-alumno', async (req, res) => {
  const { nombre, email, clave } = req.body;

  if (!nombre || !email || !clave) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password: clave,
      displayName: nombre,
    });

    // Guardar en Firestore
    await db.collection('usuarios').doc(userRecord.uid).set({
      nombre,
      email,
      rol: 'alumno',
      cursosInscritos: [],
    });

    res.json({ success: true, uid: userRecord.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
