const { logger } = require('../utils/logger');
const userService = require('../services/userService');

async function registerUser(req, res) {
  try {
    const { username, password, role } = req.body;
    const result = await userService.registerUser({ username, password, role });
    logger.info(`User registered: ${result.userId}`, { service: 'userController' });
    res.json(result);
  } catch (err) {
    logger.error(`Register error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error registering user' });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body; // <-- use username instead of userId
    const result = await userService.loginUser({ username, password });
    logger.info(`User logged in: ${username}`, { service: 'userController' });
    res.json(result);
  } catch (err) {
    logger.error(`Login error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error logging in' });
  }
}

async function getStats(req, res) {
  try {
    const stats = await userService.getStats(req.user.userId);
    res.json(stats);
  } catch (err) {
    logger.error(`Get stats error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error fetching stats' });
  }
}

async function updateProfile(req, res) {
  try {
    const updated = await userService.updateProfile(req.user.userId, req.body);
    res.json(updated);
  } catch (err) {
    logger.error(`Update profile error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error updating profile' });
  }
}

async function deleteAccount(req, res) {
  try {
    const result = await userService.deleteAccount(req.user.userId);
    logger.info(`User deleted: ${req.user.userId}`, { service: 'userController' });
    res.json(result);
  } catch (err) {
    logger.error(`Delete account error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error deleting account' });
  }
}

module.exports = { registerUser, loginUser, getStats, updateProfile, deleteAccount };
