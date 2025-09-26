
const express = require('express');
const router = express.Router();

//const { authenticate } = require('../utils/jwt');

function authenticate(req, res, next) {
    req.user = {userId: "b4870ab9-42e3-482a-b897-2eada30340ee"};
    next();
}


const { register, login, getStats, updateProfile, deleteAccount } = require('../controllers/userController');

// router.post('/register', register);
// Route for user to login
router.post('/login', login);
//router.get('/stats', authenticate, getStats);
router.patch('/:user_id/profile', authenticate, updateProfile);
router.delete('/:user_id', authenticate, deleteAccount);

module.exports = router;

