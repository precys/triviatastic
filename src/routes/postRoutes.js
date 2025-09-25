const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { createNewPost, getUserPosts } = require('../controllers/postController');

router.post('/', authenticate, createNewPost);
router.get('/', authenticate, getUserPosts);

module.exports = router;
