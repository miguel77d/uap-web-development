// src/routes/auth.routes.js

const express = require("express");
const { register, login, logout, me } = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me (requiere estar autenticado)
router.get("/me", requireAuth, me);

// 👇 ESTA LÍNEA ES CLAVE
module.exports = {
  authRouter: router
};
