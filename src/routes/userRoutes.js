const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { registerUser, loginUser, getStats, updateProfile, deleteAccount, getUsersFriends } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/:userId', authenticate, deleteAccount);
router.get('/:userId/stats', authenticate, getStats);
router.patch('/:userId/profile', authenticate, updateProfile);
router.get('/:userId/friends', authenticate, getUsersFriends);

module.exports = router;
