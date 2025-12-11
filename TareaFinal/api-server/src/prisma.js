// src/prisma.js

const { PrismaClient } = require("@prisma/client");

// PrismaClient es la clase que sabe hablar con la base de datos
const prisma = new PrismaClient();

// Exportamos la instancia para reutilizarla en rutas, servicios, etc.
module.exports = { prisma };
