const bcrypt = require("bcrypt");
const userDAO = require("../dao/userDAO");
const { generateToken } = require("../utils/jwt");

// register a new user
async function registerUser({ username, password }) {

  // check if username already exists
  const existingUser = await userDAO.getUserByUsername(username);
  if (existingUser) {
    throw new Error("Username already taken");
  }
  
  // create user
  const userId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  const userItem = {
    PK: `USER#${userId}`,
    SK: "PROFILE",
    userId,
    username,
    passwordHash,
    role: "USER",
    friends: [],
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
  
  const createdUser = await userDAO.createUser(userItem);
  return { userId: createdUser.userId, username: createdUser.username };
}

// login
async function loginUser({ username, password }) {
  if (!username || !password) {
    throw new Error("Username and password cannot be blank");
  }

  const user = await userDAO.getUserByUsername(username);
    console.log("HERE")
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, userId: user.userId, username: user.username };
}

// ADMINS: update user accounts
async function updateAccount(user, newUser) {
  const saltRounds = 10;

  if (newUser.password) {
    user.passwordHash = await bcrypt.hash(newUser.password, saltRounds);
  }
  if (typeof newUser.game_count === "number" && newUser.game_count >= 0) {
    user.game_count = newUser.game_count;
  }
  if (typeof newUser.streak === "number" && newUser.streak >= 0) {
    user.streak = newUser.streak;
  }
  if (newUser.category_counts && typeof newUser.category_counts === "object") {
    user.category_counts = newUser.category_counts;
  }
  if (newUser.category_scores && typeof newUser.category_scores === "object") {
    user.category_scores = newUser.category_scores;
  }
  if (typeof newUser.hi_score === "number" && newUser.hi_score >= 0) {
    user.hi_score = newUser.hi_score;
  }
  if (typeof newUser.easy_count === "number" && newUser.easy_count >= 0) {
    user.easy_count = newUser.easy_count;
  }
  if (typeof newUser.med_count === "number" && newUser.med_count >= 0) {
    user.med_count = newUser.med_count;
  }
  if (typeof newUser.hard_count === "number" && newUser.hard_count >= 0) {
    user.hard_count = newUser.hard_count;
  }

  return await userDAO.updateUser(user);
}

// update profile/password for user
async function updateProfile(user, password) {
  if (!password || typeof password !== "string" || password.length === 0) return null;

  const saltRounds = 10;
  user.passwordHash = await bcrypt.hash(password, saltRounds);

  return await userDAO.updateUser(user);
}

// delete user by id
async function deleteUserById(userId) {
  const user = await userDAO.findUserById(userId);
  if(!user) return false;

  const friends = user.friends;
  for(let friendId of friends) {
    await removeFriend(friendId, userId);
  }

  if(await userDAO.deleteUserById(userId)) {
    return true;
  }
  return false;
}

// find user by id
async function findUserById(userId) {
    const user = await userDAO.findUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }
    return user;
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

// get user's friends
async function getUsersFriends(user) {
    if (!user) {
        throw new Error("User does not exist");
    }

    const friends = await userDAO.getUsersFriendsByUserId(user.userId) || [];

    return {
        "Friend Count": friends.length,
        friends
    };
}

async function removeFriend(userIdToRemoveFrom, friendId) {
  const userToUpdate = await userDAO.findUserById(userIdToRemoveFrom);
  userToUpdate.friends = userToUpdate.friends.filter((element) => element != friendId);
  if(!await userDAO.updateUser(userToUpdate)) {
    return false;
  }
  return true;
}


module.exports = {
  registerUser, loginUser, getStats, updateProfile, deleteUserById, findUserById, getUsersFriends, removeFriend, updateAccount
};

