const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { register, login, getStats, updateProfile, deleteAccount } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/stats', authenticate, getStats);
router.patch('/:user_id/profile', authenticate, updateProfile);
router.delete('/:user_id', authenticate, deleteAccount);

module.exports = router;
