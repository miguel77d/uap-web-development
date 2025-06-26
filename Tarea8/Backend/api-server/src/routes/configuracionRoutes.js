const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const configuracionController = require('../controllers/configuracionController');

// Ruta GET para obtener config del usuario logueado
router.get('/', authMiddleware, configuracionController.obtenerConfiguracion);

// Ruta PATCH para actualizar config
router.patch('/', authMiddleware, configuracionController.actualizarConfiguracion);

module.exports = router;
