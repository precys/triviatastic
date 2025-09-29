const { logger } = require('../utils/logger');
const postService = require('../services/postService');







async function createNewPost(req, res) {
  try {
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);

    const userId = req.user.userId;

    
    const { post_content } = req.body || {};

    if (!post_content) {
      return res.status(400).json({ message: 'post_content is required' });
    }

   
    const post = await postService.createPost({ userId, content: post_content });

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Error creating post' });
  }
}








async function getUserPosts(req, res) {
  try {
    const userId = req.user.userId;

    const posts = await postService.getPosts(userId);

    res.json(posts);
  } catch (err) {
    logger.error(`Get posts error: ${err.message}`, { service: 'postController' });
    res.status(500).json({ message: 'Error fetching posts' });
  }
}





module.exports = { createNewPost, getUserPosts };