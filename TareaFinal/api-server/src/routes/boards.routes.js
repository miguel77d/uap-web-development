// src/routes/boards.routes.js
const express = require("express");
const { listBoards, createBoard } = require("../controllers/boards.controller");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// Todas las rutas de boards requieren estar logueado
router.use(requireAuth);

// GET /api/boards
router.get("/", listBoards);

// POST /api/boards
router.post("/", createBoard);

module.exports = router;  
