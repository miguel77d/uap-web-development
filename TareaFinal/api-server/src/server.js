// src/server.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { prisma } = require("./prisma");
require("dotenv").config();

// 👇 IMPORTS DE ROUTERS (OJO CON ESTO)
const { authRouter } = require("./routes/auth.routes");     // exporta { authRouter: router }
const boardsRouter = require("./routes/boards.routes");     // exporta router
const { tasksRouter } = require("./routes/tasks.routes");   // exporta { tasksRouter: router }

const app = express();

// Middlewares globales
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.json({ message: "API funcionando ✅" });
});

app.get("/health", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      status: "ok",
      database: "connected",
      userCount
    });
  } catch (error) {
    console.error("Error en /health:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

// RUTAS PRINCIPALES
app.use("/api/auth", authRouter);   
app.use("/api/boards", boardsRouter);
app.use("/api", tasksRouter);

module.exports = { app };
