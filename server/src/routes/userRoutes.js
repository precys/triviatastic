const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { registerUser, loginUser, getStats, updateProfile, deleteAccount, getUsersFriends,
     addFriend, sendFriendRequest, getFriendRequestsByStatus, respondToFriendRequest} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/:userId', authenticate, deleteAccount);
router.get('/:userId/stats', authenticate, getStats);
router.patch('/:userId/profile', authenticate, updateProfile);
//router.get('/:userId/friends', authenticate, getUsersFriends); // uncomment later

router.get('/:userId/friends', getUsersFriends); // for testing purposes


router.post('/:userId/friend-requests', sendFriendRequest); //send a friend request POST
//add and delete 
// will become send req endpoint 
// router.post('/:userId/friends-requests', addFriend); // add authentication later // add/accept a friend request //may add req id

//deny request 

// router.delete('/:userId/friends-requests/:requestId', deleteFriendRequest);//delete a friend request after denying DELETE
// router.delete('/:userId/friend-requests/:userFriendId'); // alt delete friend Reqs
// router.delete('/:userId/friends/:userFriendId'); //delete friend

router.put('/:userFriendId/friend-requests/:requestId', respondToFriendRequest); //responding to a friend request PUT
router.get('/:userId/friend-requests', getFriendRequestsByStatus);//view status of friend requests GET ex: pending, accepted, denied


module.exports = router;
