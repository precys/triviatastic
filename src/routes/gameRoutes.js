const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { startGame, answerQuestion, finishGame, endGame } = require('../controllers/gameController');

router.post('/start', authenticate, startGame);
router.post('/:gameId/answer', authenticate, answerQuestion);
router.post('/:gameId/finish', authenticate, finishGame); // normal finish
router.post('/:gameId/end', authenticate, endGame);       // early quit

module.exports = router;
