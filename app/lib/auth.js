const jwt = require('jsonwebtoken');
const { query } = require('./db');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function getUserFromToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const results = await query('SELECT * FROM users WHERE id = ?', [decoded.id]);
  return results.length > 0 ? results[0] : null;
}

async function authenticateUser(req) {
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  if (!token) return null;
  return getUserFromToken(token);
}

function requireRole(...roles) {
  return async (req, res, next) => {
    const user = await authenticateUser(req);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }
    req.user = user;
    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  getUserFromToken,
  authenticateUser,
  requireRole,
};
