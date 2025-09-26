const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { register, login, getStats, updateProfile, deleteAccount } = require('../controllers/userController');

// Route for registration
router.post('/register', register);
// Route for user to login
router.post('/login', login);
//router.get('/stats', authenticate, getStats);
router.patch('/:user_id/profile', authenticate, updateProfile);
router.delete('/:user_id', authenticate, deleteAccount);

module.exports = router;

