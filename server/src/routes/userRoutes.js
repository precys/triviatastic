const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { registerUser, loginUser, getStats, updateProfile, deleteAccount, getUsersFriends, sendFriendRequest, getFriendRequestsByStatus, respondToFriendRequest, deleteFriendRequest, deleteFriend, getAllUsers , getUsersScoreByCategory,
     getUsersStats, findUserById} = require('../controllers/userController');

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
router.get('/:userId', authenticate, findUserById);
router.get('/:userId/friends', authenticate, getUsersFriends); // get a user's friend list
router.delete('/:username/friends/:friendUsername', authenticate, deleteFriend); //delete friend
router.post('/:userId/friend-requests', authenticate, sendFriendRequest); //send a friend request
router.delete('/:userId/friend-requests/:requestId', authenticate, deleteFriendRequest);//delete a friend request
router.put('/:userFriendId/friend-requests/:requestId', authenticate, respondToFriendRequest); //responding to a friend request PUT
router.get('/:userId/friend-requests', authenticate, getFriendRequestsByStatus); //view status of friend requests GET ex: pending, accepted, denied


module.exports = router;
