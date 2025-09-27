const { logger } = require('../utils/logger');
const gameService = require('../services/gameService');

// Start game
async function startGame(req, res) {
  try {
    const { category, questionDifficulty } = req.body || {};
    const userId = req.user.userId;
    const game = await gameService.startGame(userId, { category, questionDifficulty });
    res.json(game);
    logger.info(`Game started: ${game.gameId} by user: ${userId}`, { service: 'gameController' });
  } catch (err) {
    logger.error(`Start game error: ${err.message}`, { service: 'gameController' });
    res.status(500).json({ message: 'Error starting game' });
  }
}

// Answer question
async function answerQuestion(req, res) {
  try {
    const { gameId } = req.params;
    const { questionDifficulty, correct } = req.body || {};
    const userId = req.user.userId;
    const game = await gameService.submitAnswer(userId, gameId, { questionDifficulty, correct });
    res.json(game);
  } catch (err) {
    logger.error(`Answer question error: ${err.message}`, { service: 'gameController' });
    res.status(500).json({ message: 'Error answering question' });
  }
}

// Finish game
async function finishGame(req, res) {
  try {
    const { gameId } = req.params;
    const { answeredQuestions } = req.body || {};
    const userId = req.user.userId;
    const result = await gameService.finishGame(userId, gameId, answeredQuestions);
    res.json(result);
  } catch (err) {
    logger.error(`Finish game error: ${err.message}`, { service: 'gameController' });
    res.status(500).json({ message: 'Error finishing game' });
  }
}

// End game early
async function endGame(req, res) {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    await gameService.endGame(userId, gameId);
    res.json({ message: "Game ended and removed" });
    logger.info(`Game ended early: ${gameId} by user: ${userId}`, { service: 'gameController' });
  } catch (err) {
    logger.error(`End game error: ${err.message}`, { service: 'gameController' });
    res.status(500).json({ message: "Error ending game" });
  }
}

module.exports = { startGame, answerQuestion, finishGame, endGame };
