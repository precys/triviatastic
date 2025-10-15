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
    res.status(201).json(result);
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

// get all users stats
async function getUsersStats(req, res) {
  try {
    const stats = await userService.getUsersStats();
    res.status(201).json(stats);
  } catch (err) {
    logger.error(`Get users stats error: ${err.message}`, { service: 'userController' });
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

//get a user by id
async function findUserById(req, res){
  const userId = req.params.userId;
  const user = await userService.findUserById(userId);

  if (!user){
    res.status(404).json({message: "User Not Found"});
  } else{
    res.status(200).json({
      username: user.username,
    });
  }
}

//retrieve all users no admins included
async function getAllUsers (req, res){
  const users = await userService.getAllUsers();

  try{
    if(!users){
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json(users);

  }catch(error){
    res.status(404).json({ message: "Failed to retrieve users" });
  }
}

// route function to get all Users score for a category
async function getUsersScoreByCategory(req, res){
  try {
    const { category } = req.query
    const usersScore = await userService.getUsersScoreByCategory(category)

    if (usersScore){
      logger.info(`Successful GET | getUsersScoreByCategory`)
      return res.status(201).json({message:`All users top score in ${category}: `, users_score: usersScore})
    }
    else {
      logger.error(`Failed GET | getUsersScoreByCategory`)
      return res.status(501).json({message:`Server failed to handle request.`})
    }

  }
  catch (err){
    logger.error(`Error in userController | getUsersScoreByCategory | ${err}`)
    return res.status(501).json({message:`Server error: ${err}`})
  }
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

//send friend request
async function sendFriendRequest (req, res){
  const { userId } = req.params;
  const { friendUsername } = req.body;
  console.log(' Controller received:', { userId: req.params.userId, friendUsername: req.body.friendUsername });

  const result = await userService.sendFriendRequest(userId, friendUsername);
  
  if(!result){
    res.status(400).json({ message: "Unable to send friend request"})
  } else{
    res.status(200).json(result)
  }
}

//get a list of friend requests by status ("pending", "accepted", "denied" )
async function getFriendRequestsByStatus (req, res){
  const { userId } = req.params;
  const { status = "pending", sent } = req.query;
  //console.log("REQ QUERY STATUS:", req.query.status);
  const sentFlag = sent === "true";
  
  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  const result = await userService.getFriendRequestsByStatus(userId, status, sentFlag);

  if (!result){
    res.status(400).json({ message: "Unable to retrive friend requests"});
  }else{
    res.status(200).json(result.requests);
  }
}


//respond to friend req
async function respondToFriendRequest(req, res){
  const { userFriendId, requestId } = req.params;
  const { status } = req.body; 

  const result = await userService.respondToFriendRequest(userFriendId, requestId, status);

  if(!result){
    res.status(400).json({ message: "Unable to respond to friend request"});
  }else{
    res.status(200).json(result);
  }
}

//delete a friend request
async function deleteFriendRequest (req, res){
  const { userId, requestId } = req.params;
  const sent = req.query.sent === "true";

  const result = await userService.deleteFriendRequest(userId, requestId, sent);

   if(!result){
    res.status(400).json({ message: "Unable to delete friend request"})
  } else{
    res.status(200).json(result)
  }
}

async function deleteFriend (req, res){
  const { username, friendUsername } = req.params;
  console.log("DELETE FRIEND:", { username, friendUsername });

  const result = await userService.removeFriend(username, friendUsername);

   if(!result){
    console.error("Error in deleteFriend:", error.message);
    res.status(400).json({ message: "Unable to remove friend"})
  } else{
    // res.status(200).json(result)
    res.status(200).json({ message: `${friendUsername} removed from ${username}'s friends list.` });
  }
}

module.exports = { registerUser, loginUser, getStats, updateProfile, deleteAccount, getUsersFriends, sendFriendRequest, 
  getFriendRequestsByStatus, respondToFriendRequest, deleteFriendRequest, deleteFriend, findUserById, getAllUsers, getUsersScoreByCategory,
  getUsersStats };

