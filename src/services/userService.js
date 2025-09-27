const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const userDAO = require("../dao/userDAO");
const { generateToken } = require("../utils/jwt");

// register a new user
async function registerUser({ username, password, role }) {
  // check if username already exists
  const existingUser = await userDAO.getUserByUsername(username);
  if (existingUser) {
    throw new Error("Username already taken");
  }

  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  const userItem = {
    PK: `USER#${userId}`,
    SK: "PROFILE",
    userId,
    username,
    passwordHash,
    role: role || "USER",
    game_count: 0,
    streak: 0,
    category_counts: { art: 0, history: 0, mythology: 0, sports: 0, any: 0 },
    category_scores: { art: 0, history: 0, mythology: 0, sports: 0, any: 0 },
    hi_score: 0,
    easy_count: 0,
    med_count: 0,
    hard_count: 0,
    createdAt: new Date().toISOString()
  };

  await userDAO.createUser(userItem);

  const token = generateToken(userItem);
  return { token, userId, username };
}

// login
async function loginUser({ username, password }) {
  // find username using gsi
  const user = await userDAO.getUserByUsername(username);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, userId: user.userId, username: user.username };
}

// get user stats
async function getStats(userId) {
  const user = await userDAO.getUserById(userId);
  if (!user) throw new Error("User not found");

  return {
    hi_score: user.hi_score,
    game_count: user.game_count,
    streak: user.streak,
    easy_count: user.easy_count,
    med_count: user.med_count,
    hard_count: user.hard_count,
    category_counts: user.category_counts,
    category_scores: user.category_scores
  };
}

// update profile
async function updateProfile(userId, updates) {
  const user = await userDAO.getUserById(userId);
  if (!user) throw new Error("User not found");

  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(updates.password, 10);
    delete updates.password; // remove uncrypted password so it’s not saved
  }

  Object.assign(user, updates);
  await userDAO.updateUser(user);

  return user;
}

// delete account
async function deleteAccount(userId) {
  await userDAO.deleteUser(userId);
  return { message: `User ${userId} deleted` };
}

module.exports = { registerUser, loginUser, getStats, updateProfile, deleteAccount };
