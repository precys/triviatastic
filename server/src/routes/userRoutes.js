const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { registerUser, loginUser, getStats, updateProfile, deleteAccount, getUsersFriends,
     addFriend, sendFriendRequest, getFriendRequestsByStatus, respondToFriendRequest, deleteFriendRequest, deleteFriend, getAllUsers , getUsersScoreByCategory,
     getUsersStats} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authenticate, getAllUsers);
router.delete('/:userId', authenticate, deleteAccount);
router.get(`/stats`, authenticate, getUsersStats)
router.get('/:userId/stats', authenticate, getStats);
router.patch('/:userId/profile', authenticate, updateProfile);
router.get(`/leaderboard`, authenticate, getUsersScoreByCategory)
//router.get('/:userId/friends', authenticate, getUsersFriends); // uncomment later


// for testing purposes
 // add authentication later 
router.get('/:userId/friends', getUsersFriends); // get a user's friend list
router.delete('/:userId/friends/:userFriendId', deleteFriend); //delete friend
router.post('/:userId/friend-requests', sendFriendRequest); //send a friend request
router.delete('/:userId/friends-requests/:requestId', deleteFriendRequest);//delete a friend request
router.put('/:userFriendId/friend-requests/:requestId', respondToFriendRequest); //responding to a friend request PUT
router.get('/:userId/friend-requests', getFriendRequestsByStatus); //view status of friend requests GET ex: pending, accepted, denied


module.exports = router;
