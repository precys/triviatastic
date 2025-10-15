const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const {
    createNewPost, getUserPosts, getSinglePost, updatePost, deletePost,
    likePost, addComment, getComments, 
    getFeedPosts,
} = require('../controllers/postController');

// Create & fetch posts
router.post('/:userId/posts', authenticate, createNewPost);
router.get('/:userId/posts', authenticate, getUserPosts);

// Single post operations
router.get('/:userId/posts/:postId', authenticate, getSinglePost);
router.patch('/:userId/posts/:postId', authenticate, updatePost);
router.delete('/:userId/posts/:postId', authenticate, deletePost);

// Extras
router.post('/:userId/posts/:postId/like', authenticate, likePost);
router.post('/:userId/posts/:postId/comments', authenticate, addComment);
router.get('/:userId/posts/:postId/comments', authenticate, getComments);

// Feed
router.get('/feed', authenticate, getFeedPosts);

module.exports = router;
