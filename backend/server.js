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
    await db
      .collection('usuarios')
      .doc(userRecord.uid)
      .set({
        nombre,
        email,
        rol: 'alumno',
        cursosInscritos: [],
        fechaRegistro: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({ success: true, uid: userRecord.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 📩 Endpoint para crear docente
app.post('/crear-docente', async (req, res) => {
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
    await db
      .collection('usuarios')
      .doc(userRecord.uid)
      .set({
        nombre,
        email,
        rol: 'docente',
        cursosInscritos: [],
        fechaRegistro: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({ success: true, uid: userRecord.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

