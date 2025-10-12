const { logger } = require('../utils/logger');
const postService = require('../services/postService');

// create a new post for a user
async function createNewPost(req, res) {
  try {
    const { userId } = req.params;
    const post = await postService.createPost(userId, req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// get all posts for a user
async function getUserPosts(req, res) {
  try {
    const { userId } = req.params;
    const posts = await postService.getUserPosts(userId);
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// get a single post by id for a user
async function getSinglePost(req, res) {
  try {
    const { userId, postId } = req.params;
    const post = await postService.getPostById(userId, postId);
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

//  update a post by id for a user
async function updatePost(req, res) {
  try {
    const { userId, postId } = req.params;
    const updated = await postService.updatePost(userId, postId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// delete a post by id for a user
async function deletePost(req, res) {
  try {
    const { userId, postId } = req.params;
    await postService.deletePost(userId, postId);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// toggle like
async function likePost(req, res) {
  try {
    const { userId, postId } = req.params;
    const result = await postService.toggleLike(userId, postId);

    res.status(200).json({
      message: result.toggled === 'on' ? 'Post liked' : 'Like removed',
      like: result.like || null,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// toggle unlike
async function unlikePost(req, res) {
  try {
    const { userId, postId } = req.params;
    const result = await postService.toggleUnlike(userId, postId);

    res.status(200).json({
      message: result.toggled === 'on' ? 'Post unliked' : 'Unlike removed',
      unlike: result.unlike || null,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// add comment to post
async function addComment(req, res) {
  try {
    const { userId, postId } = req.params;
    const { content } = req.body;
    const comment = await postService.addComment(userId, postId, content);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// get comments for a single post
async function getComments(req, res) {
  try {
    const { postId } = req.params;
    const comments = await postService.getComments(postId);
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}








module.exports = {
  createNewPost, getUserPosts, getSinglePost, updatePost, deletePost,
  likePost, unlikePost, addComment, getComments
};