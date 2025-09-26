const { v4: uuidv4 } = require('uuid');
const gameDAO = require('../dao/gameDAO');
const { getUserById, updateUser } = require('../dao/userDAO');
const logger = require('../utils/logger');















// difficulty points
const difficultyPoints = { easy: 1, medium: 3, hard: 5 };













// Start a new game
async function startGame(userId, { category }) {
  const gameId = uuidv4();
  const gameItem = {
    PK: `GAME#${gameId}`,
    SK: `USER#${userId}`,
    gameId,
    userId,
    category: category || "any",
    currentQuestion: 0,
    score: 0,
    finished: false,
    createdAt: new Date().toISOString()
  };
  await gameDAO.createGame(gameItem);
  return gameItem;
}

// Submit answer for a question
async function submitAnswer(userId, gameId, { questionDifficulty, correct }) {
  const game = await gameDAO.getGame(gameId, userId);
  if (!game || game.finished) throw new Error('Invalid game');

  if (correct) game.score += difficultyPoints[questionDifficulty] || 0;
  game.currentQuestion += 1;

  await gameDAO.createGame(game);
  return game;
}

// Finish game normally
async function finishGame(userId, gameId, answeredQuestions = []) {
  const user = await getUserById(userId);
  const game = await gameDAO.getGame(gameId, userId);
  if (!game) throw new Error('Game not found');

  let easyCorrect = 0, medCorrect = 0, hardCorrect = 0, gameScore = 0;

  answeredQuestions.forEach(q => {
    if (q.userAnsweredCorrectly) {
      const points = difficultyPoints[q.question_difficulty] || 0;
      gameScore += points;

      if (q.question_difficulty === "easy") easyCorrect++;
      if (q.question_difficulty === "medium") medCorrect++;
      if (q.question_difficulty === "hard") hardCorrect++;
    }
  });

  // Update user stats
  user.game_count += 1;
  user.easy_count += easyCorrect;
  user.med_count += medCorrect;
  user.hard_count += hardCorrect;

  if (gameScore > user.hi_score) user.hi_score = gameScore;

  const category = game.category || "any";
  if (!user.category_counts[category]) user.category_counts[category] = 0;
  user.category_counts[category] += 1;

  if (!user.category_scores[category] || gameScore > user.category_scores[category]) {
    user.category_scores[category] = gameScore;
  }

  await updateUser(user);
  await gameDAO.deleteGame(gameId, userId);

  logger.info(`Game finished: ${gameId} by user: ${userId}`);
  return { gameScore, user };
}

// End game early
async function endGame(userId, gameId) {
  const game = await gameDAO.getGame(gameId, userId);
  if (!game) throw new Error('Game not found');
  await gameDAO.deleteGame(gameId, userId);
  logger.info(`Game ended early: ${gameId} by user: ${userId}`);
}

module.exports = { startGame, submitAnswer, finishGame, endGame };
