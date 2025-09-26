const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { registerUser, loginUser, getStats, updateProfile, deleteAccount } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/stats', authenticate, getStats);
router.patch('/profile', authenticate, updateProfile);
router.delete('/', authenticate, deleteAccount);

module.exports = router;
