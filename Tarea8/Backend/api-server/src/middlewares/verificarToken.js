const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'No estás autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ..., email: ... }
    next();
  } catch (error) {
    console.error('Token inválido:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { verificarToken };
