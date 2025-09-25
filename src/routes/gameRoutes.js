const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { startGame, answerQuestion, finishGame } = require('../controllers/gameController');

router.post('/start', authenticate, startGame);
router.post('/:gameId/answer', authenticate, answerQuestion);
router.post('/:gameId/finish/:category', authenticate, finishGame);

module.exports = router;
