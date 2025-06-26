require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes'); // rutas de autenticación
const authMiddleware = require('./middlewares/authMiddleware'); // ✔️ Importado arriba

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Rutas públicas
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// ✔️ Rutas protegidas deben ir ANTES del listen
app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({
    msg: 'Ruta protegida',
    usuario: req.user
  });
});
const tablerosRoutes = require('./routes/tablerosRoutes');
app.use('/api/tableros', tablerosRoutes);

const configuracionRoutes = require('./routes/configuracionRoutes');
app.use('/api/configuracion', configuracionRoutes);

const tareasRoutes = require('./routes/tareasRoutes');
app.use('/api/tareas', tareasRoutes);

const permisosRoutes = require('./routes/permisosRoutes');
app.use('/api/permisos', permisosRoutes);

// 🚨 Este debe ser lo ÚLTIMO
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
