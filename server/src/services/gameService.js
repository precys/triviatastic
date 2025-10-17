const { logger } = require('../utils/logger');
const crypto = require('crypto');
const gameDAO = require("../dao/gameDAO");
const { findUserById, updateUser } = require("../dao/userDAO");

// difficulties and point structure
const difficultyPoints = { easy: 1, medium: 3, hard: 5 };
const difficulties = ['easy', 'medium', 'hard'];

// start a new game
async function startGame(userId, { category, questionDifficulty } = {}) {
  const gameId = crypto.randomUUID();
  const gameItem = {
    PK: `GAME#${gameId}`,
    SK: `USER#${userId}`,
    gameId,
    userId,
    category: category || 'any',
    currentQuestion: 0,
    score: 0,
    finished: false,
    createdAt: new Date().toISOString(),
    questionDifficulty: questionDifficulty === 'random'
      ? difficulties[Math.floor(Math.random() * difficulties.length)]
      : questionDifficulty || 'easy'
  };

  await gameDAO.createGame(gameItem);
  return gameItem;
}

// submit answer
async function submitAnswer(userId, gameId, { questionDifficulty, correct } = {}) {
  const game = await gameDAO.getGame(gameId, userId);
  if (!game || game.finished) throw new Error("invalid game");

  if (correct) game.score += difficultyPoints[questionDifficulty] || 0;
  game.currentQuestion += 1;

  await gameDAO.createGame(game);
  return game;
}

// finish game normally
async function finishGame(userId, gameId, answeredQuestions = []) {
  const user = await findUserById(userId);
  const game = await gameDAO.getGame(gameId, userId);
  if (!game) throw new Error("game not found");

  let easyCorrect = 0, medCorrect = 0, hardCorrect = 0, gameScore = 0, streak = 0, maxStreak = 0;

  answeredQuestions.forEach(q => {
    if (q.userAnsweredCorrectly) {
      const points = difficultyPoints[q.difficulty] || 0;
      gameScore += points;

      if (q.difficulty === "easy") easyCorrect++;
      if (q.difficulty === "medium") medCorrect++;
      if (q.difficulty === "hard") hardCorrect++;

      streak++;
      if(streak > maxStreak) maxStreak = streak;
    }
    else {
      streak = 0;
    }
  });
  // update user stats
  user.game_count += 1;
  user.easy_count += easyCorrect;
  user.med_count += medCorrect;
  user.hard_count += hardCorrect;

  if (gameScore > user.hi_score) user.hi_score = gameScore;
  if (maxStreak > user.streak) user.streak = maxStreak;

  const category = game.category || "any";
  if (!user.category_counts[category]) user.category_counts[category] = 0;
  user.category_counts[category] += 1;

  if (!user.category_scores[category] || gameScore > user.category_scores[category]) {
    user.category_scores[category] = gameScore;
  }

  await updateUser(user);
  await gameDAO.deleteGame(gameId, userId);

  logger.info(`game finished: ${gameId} by user: ${userId}`, { service: 'gameService' });
  return { gameScore, user };
}

// end game early
async function endGame(userId, gameId) {
  
  const command = await gameDAO.getGame(gameId, userId);
  
  if (!command) throw new Error("game not found");

  // delete the game
  await gameDAO.deleteGame(gameId, userId);

  logger.info(`game ended early: ${gameId} by user: ${userId}`, { service: 'gameService' });
}

module.exports = { startGame, submitAnswer, finishGame, endGame };
