const postService = require('../services/postService');
const logger = require('../utils/logger');

async function createNewPost(req, res) {
  try {
    const userId = req.user.userId;
    const { post_content } = req.body;

    const post = await postService.createPost(userId, post_content);
    res.status(201).json(post);
    logger.info(`Post created: ${post.postId} by user: ${userId}`);
  } catch (err) {
    logger.error('Create post error: %o', err);
    res.status(500).json({ message: 'Error creating post' });
  }
}

async function getUserPosts(req, res) {
  try {
    const userId = req.user.userId;
    const posts = await postService.getPosts(userId);
    res.json(posts);
  } catch (err) {
    logger.error('Get posts error: %o', err);
    res.status(500).json({ message: 'Error fetching posts' });
  }
}

module.exports = { createNewPost, getUserPosts };
