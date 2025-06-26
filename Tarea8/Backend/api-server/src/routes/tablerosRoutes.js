const express = require('express');
const router = express.Router();
const tablerosController = require('../controllers/tablerosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, tablerosController.crearTablero);
router.get('/', authMiddleware, tablerosController.obtenerTableros);
router.post('/:id/compartir', authMiddleware, tablerosController.compartirTablero);
router.delete('/:id', authMiddleware, tablerosController.eliminarTablero);

module.exports = router;
