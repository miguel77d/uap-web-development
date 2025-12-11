// src/routes/tasks.routes.js

const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireBoardAccess } = require("../middlewares/boardAccess.middleware");
const {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks
} = require("../controllers/tasks.controller");

const router = express.Router();

// Todas requieren login
router.use(requireAuth);

// GET /api/boards/:boardId/tasks
router.get("/boards/:boardId/tasks", requireBoardAccess, listTasks);

// POST /api/boards/:boardId/tasks
router.post("/boards/:boardId/tasks", requireBoardAccess, createTask);

// PATCH /api/tasks/:id
router.patch("/tasks/:id", updateTask);

// DELETE /api/tasks/:id
router.delete("/tasks/:id", deleteTask);

// DELETE /api/boards/:boardId/tasks/completed
router.delete(
  "/boards/:boardId/tasks/completed",
  requireBoardAccess,
  deleteCompletedTasks
);

module.exports = {
  tasksRouter: router
};
