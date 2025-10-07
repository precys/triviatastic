const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const {
    createNewPost, getUserPosts, getSinglePost, updatePost, deletePost,
    likePost, unlikePost, addComment, getComments, 
    // getFeedPosts
} = require('../controllers/postController');

// Create & fetch posts
router.post('/users/:userId/posts', authenticate, createNewPost);
router.get('/users/:userId/posts', authenticate, getUserPosts);

// Single post operations
router.get('/users/:userId/posts/:postId', authenticate, getSinglePost);
router.patch('/users/:userId/posts/:postId', authenticate, updatePost);
router.delete('/users/:userId/posts/:postId', authenticate, deletePost);

// Extras
router.post('/users/:userId/posts/:postId/like', authenticate, likePost);
router.post('/users/:userId/posts/:postId/unlike', authenticate, unlikePost);
router.post('/users/:userId/posts/:postId/comments', authenticate, addComment);
router.get('/users/:userId/posts/:postId/comments', authenticate, getComments);

// // Feed
// router.get('/feed', authenticate, getFeedPosts);

module.exports = router;
