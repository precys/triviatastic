const postDAO = require('../dao/postDAO');
const { logger } = require('../utils/logger');

// create a new post
async function createPost(userId, data) {
  if (!data.content || data.content.trim() === '') {
    throw new Error('Post content cannot be empty');
  }
  return await postDAO.createPost(userId, data);
}

// get all posts for a user
async function getUserPosts(userId) {
  return await postDAO.getUserPosts(userId);
}

// get a specific post by id
async function getPostById(userId, postId) {
  const post = await postDAO.getPostById(userId, postId);
  if (!post) throw new Error('Post not found');
  return post;
}

// update a post
async function updatePost(userId, postId, updateData) {
  const updated = await postDAO.updatePost(userId, postId, updateData);
  if (!updated) throw new Error('Post not found or not owned by user');
  return updated;
}

// delete a post
async function deletePost(userId, postId) {
  const deleted = await postDAO.deletePost(userId, postId);
  if (!deleted) throw new Error('Post not found or not owned by user');
  return deleted;
}

module.exports = { createPost, getUserPosts, getPostById, updatePost, deletePost, };