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

// toggle like
async function toggleLike(userId, postId) {
  const alreadyLiked = await postDAO.hasUserLiked(userId, postId);
  const alreadyUnliked = await postDAO.hasUserUnliked(userId, postId);

  if (alreadyLiked) {
    await postDAO.removeLike(userId, postId);
    return { toggled: 'off' }; // removed like
  }

  if (alreadyUnliked) {
    await postDAO.removeUnlike(userId, postId); // mutually exclusive
  }

  const newLike = await postDAO.addLike(userId, postId);
  return { toggled: 'on', like: newLike };
}

// toggle unlike
async function toggleUnlike(userId, postId) {
  const alreadyUnliked = await postDAO.hasUserUnliked(userId, postId);
  const alreadyLiked = await postDAO.hasUserLiked(userId, postId);

  if (alreadyUnliked) {
    await postDAO.removeUnlike(userId, postId);
    return { toggled: 'off' }; // removed unlike
  }

  if (alreadyLiked) {
    await postDAO.removeLike(userId, postId);
  }

  const newUnlike = await postDAO.addUnlike(userId, postId);
  return { toggled: 'on', unlike: newUnlike };
}

// comment
async function addComment(userId, postId, text) {
  if (!text || text.trim() === '') {
    throw new Error('Comment cannot be empty');
  }
  return await postDAO.addComment(userId, postId, text);
}

//get comments for a post
async function getComments(postId) {
  return await postDAO.getComments(postId);
}







module.exports = {
  createPost, getUserPosts, getPostById, updatePost, deletePost,
  toggleLike, toggleUnlike, addComment, getComments
};