const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { createNewPost, getUserPosts } = require('../controllers/postController');

// POST /posts
router.post('/', authenticate, createNewPost);

// GET /posts
router.get('/', authenticate, getUserPosts);

module.exports = router;
