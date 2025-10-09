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
  for(let friendUsername of friends) {
    await removeFriend(friendUsername, user.username);
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

async function getAllUsers (){
  const users = await userDAO.getAllUsers();

  return users.map(user => ({
    userId: user.userId,
    username:user.username
  }));

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

//send friend request
async function sendFriendRequest(senderId, friendUsername){
    const sender = await userDAO.findUserById(senderId);
    const receiver = await userDAO.getUserByUsername(friendUsername);

    if (!sender || !receiver){
        throw new Error ("User or friend does not exist")
    }

    if (sender.userId === receiver.userId) {
        throw new Error("You cannot send a friend request to yourself");
    }

    if(sender.friends.includes(receiver.username)){
        throw new Error(`${receiver.username} is already your friend`);
    }

    const requestId = crypto.randomUUID();

    const requestItem = {
        PK: `FRIENDREQ#${receiver.userId}`, //receiver of the friend request
        SK: `REQUEST#${requestId}`, // identifier for each request
        requestId, // identifier for each request
        userId: sender.userId,
        userFriendId: receiver.userId,
        senderUsername: sender.username,
        receiverUsername: receiver.username,
        status: "pending", //may change attribute name
        createdAt: new Date().toISOString()
    };

    await userDAO.sendFriendRequest(requestItem);
    
    return {
        message: `Friend request to ${receiver.username} sent!`,
        friendId: receiver.userId
    }

}

//add a friend 
//adding both ways
async function addFriend(userId, friendId){ 
    const user = await userDAO.findUserById(userId);
    const userFriend = await userDAO.findUserById(friendId);

    if (!user || !userFriend){
        throw new Error ("User or friend does not exist");
    }

    if (user.username === userFriend.username) {
        throw new Error("You cannot add yourself as a friend");
    }

    if (!user.friends.includes(userFriend.username)){
        user.friends.push(userFriend.username);
        await userDAO.updateFriendsList(user.userId, user.friends);
    }

    if(!userFriend.friends.includes(user.username)){
        userFriend.friends.push(user.username);
        await userDAO.updateFriendsList(userFriend.userId, userFriend.friends);
    }

    return{
        message: `${userFriend.username} accepted ${user.username}'s friend request!` 
        //friends: user.friends
    };
}

//deny a friend req
async function denyRequest (userId, friendId){
  const user = await userDAO.findUserById(userId);
  const userFriend = await userDAO.findUserById(friendId);

   if (!user || !userFriend){
        throw new Error ("User or friend does not exist");
    }

    if (user.username === userFriend.username) {
        throw new Error("You cannot deny yourself as a friend");
    }

    if (user.friends.includes(userFriend.username)){
        throw new Error("You cannot deny an existing friend in your list but you can delete them.");
    }

    return{
        message: `${userFriend.username} denied ${user.username}'s friend request.` 
        //friends: user.friends
    };
}

//get a list of friend requests by status ("pending", "accepted", "denied" )
async function getFriendRequestsByStatus (userId, status){
    let validStatuses = ["pending", "accepted", "denied"];
    if (!validStatuses.includes(status)){
        throw new Error ("Invalid Status");
    }

    const requestData = await userDAO.getFriendRequestsByStatus(userId, status);

    const requestsToDisplay = requestData.map(r => ({
        username: r.senderUsername,
        status: r.status
    }))

    return {
        message: `You have ${requestData.length} ${status} friend request(s)`,
        requests: requestsToDisplay
    }
}

//respond to friend req
async function respondToFriendRequest (userFriendId, requestId, status){
  let validStatuses = ["accepted", "denied"];
  if (!validStatuses.includes(status)){
    throw new Error("Invalid status");
  }

  const response = await userDAO.respondToFriendRequest(userFriendId, requestId, status);
  if(!response){
    throw new Error ("Response to Friend Request Not Found");
  }

  if (status == "accepted"){
    const { userId: userId, userFriendId: userFriendId } = response;
    const acceptedResult = await addFriend(userId, userFriendId);

    return{
      // message: `Friend request ${status}`,
      message: acceptedResult.message,
      requestId,
      status,
      // message: acceptedResult.message,
      // friends: acceptedResult.friends
    };
  }else{
    if(status == "denied"){
      const { userId: userId, userFriendId: userFriendId } = response;
      const denyResult = await denyRequest(userId, userFriendId);

      return{
        // message: `Friend request ${status}`,
        message: denyResult.message,
        requestId,
        status,
        // message: acceptedResult.message,
        // friends: acceptedResult.friends
      };
    }else{
      throw new Error ("Response to Friend Request Not Found");
    }
  }
}

//delete a friend request
async function deleteFriendRequest (userId, requestId) {
  if (!userId || !requestId){
    throw new Error ("User or Friend Request Does Not Exist");
  }else{
    if (await userDAO.deleteFriendRequest(userId, requestId)){
      return{
        message: `${requestId} was successfully deleted!`
      };
    }else{
      throw new Error ("Unable to delete Friend Request");
    } 
  }

}

async function removeFriend(usernameToRemoveFrom, friendUsername) {
  const userToUpdate = await userDAO.getUserByUsername(usernameToRemoveFrom);
  if(!userToUpdate) {
    throw new Error("User not found.");
  }
  userToUpdate.friends = userToUpdate.friends.filter((element) => element != friendUsername);
  if(!await userDAO.updateUser(userToUpdate)) {
    return false;
  }
  return true;
}


module.exports = {
  registerUser, loginUser, getStats, updateProfile, deleteUserById, findUserById, getUsersFriends, removeFriend, updateAccount, addFriend, sendFriendRequest,
  getFriendRequestsByStatus, respondToFriendRequest, deleteFriendRequest, getAllUsers
};

