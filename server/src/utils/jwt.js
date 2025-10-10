const { logger } = require('./logger');
const jwt = require('jsonwebtoken');


const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

function generateToken(user) {
  return jwt.sign(
    { userId: user.userId, role: user.role, username: user.username },
    SECRET_KEY,
    { expiresIn: '12h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn('Missing token');
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Invalid token');
    res.status(401).json({ message: 'Invalid token' });
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      logger.warn(`Forbidden access for role: ${req.user?.role}`);
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { generateToken, verifyToken, authenticate, authorizeRole };


