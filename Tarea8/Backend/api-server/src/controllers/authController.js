// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRACION = '7d'; // 7 días de sesión

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Ya existe ese email' });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.usuario.create({
      data: { nombre, email, password: hashed },
    });

    res.status(201).json({ msg: 'Usuario creado' });
  } catch (error) {
    console.error(error); // para ver detalles si falla algo más
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: EXPIRACION,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ msg: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Logout exitoso' });
};
