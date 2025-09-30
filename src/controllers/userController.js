const { logger } = require('../utils/logger');
const userService = require('../services/userService');

// register user
async function registerUser(req, res) {
  try {
    const { username, password, } = req.body;
    const result = await userService.registerUser({ username, password });
    logger.info(`User registered: ${result.userId}`, { service: 'userController' });
    res.json(result);
  } catch (err) {
    logger.error(`Register error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error registering user' });
  }
}

// login user
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const result = await userService.loginUser({ username, password });
    logger.info(`User logged in: ${username}`, { service: 'userController' });
    res.json(result);
  } catch (err) {
    logger.error(`Login error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error logging in' });
  }
}

// get user stats
async function getStats(req, res) {
  try {
    const stats = await userService.getStats(req.user.userId);
    res.json(stats);
  } catch (err) {
    logger.error(`Get stats error: ${err.message}`, { service: 'userController' });
    res.status(500).json({ message: 'Error fetching stats' });
  }
}

// update user profile
async function updateProfile(req, res) {
  const authUser = req.user; // from JWT
  const updateId = req.params.userId;

  // Only allow if same user or ADMIN
  if (authUser.userId !== updateId && authUser.role !== "ADMIN") {
    return res.status(403).json({ message: "You may not update this account's information." });
  }

  // Fetch target user from DB to update
  const updateUser = await userService.findUserById(updateId);
  if (!updateUser) {
    return res.status(404).json({ message: "User not found." });
  }

  let result;
  if (authUser.role === "ADMIN") {
    result = await userService.updateAccount(updateUser, req.body);
  } else {
    result = await userService.updateProfile(updateUser, req.body.password);
  }

  if (!result) {
    return res.status(400).json({ message: "Failed to update account information." });
  }

  res.status(200).json({ message: "Account updated successfully." });
}

// delete user account
async function deleteAccount(req, res) {
    const authUser = req.user;
    const user = await userService.findUserById(authUser.userId);

    const delete_id = req.params.userId;

    if(user.userId !== delete_id && user.role !== "ADMIN" ) {
        res.status(403).json({message: "You may not delete this account."});
        return;
    }

    const result = await userService.deleteUserById(delete_id);
    if(!result) {
        res.status(400).json({message: "Failed to delete account."});
        return;
    }
    res.status(200).json({message: "Account deleted successfully."});
}

// get user's friends
async function getUsersFriends(req, res) {
    try {
        const userId = req.params.userId;

        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const friendData = await userService.getUsersFriends(user);
        const friendCount = friendData?.["Friend Count"] ?? 0;

        const message = friendCount === 0 
            ? "You have no friends yet" 
            : "Friends retrieved successfully";

        return res.status(200).json({
            message,
            "Friend Count": friendCount,
            friends: friendData.friends || []
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to retrieve friends" });
    }
}

module.exports = { registerUser, loginUser, getStats, updateProfile, deleteAccount, getUsersFriends };

