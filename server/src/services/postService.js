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

// toggle like on a post
async function toggleLike(userId, postId) {
  if (!userId || !postId) throw new Error("userId and postId required");

  // toggle the LIKE item for the user
  const toggleResult = await postDAO.toggleLikeItem(userId, postId);

  // get current total likes
  const likesCount = await postDAO.getLikesCount(postId);

  return { likes: likesCount, liked: !!toggleResult.liked };
}

// comment
async function addComment(userId, postId, content) {
  if (!content || content.trim() === '') {
    throw new Error('Comment cannot be empty');
  }
  return await postDAO.addComment(userId, postId, content);
}

//get comments for a post
async function getComments(postId) {
  return await postDAO.getComments(postId);
}

// get global feed posts
async function getGlobalFeed() {
  return await postDAO.getGlobalFeedPosts();
}




module.exports = {
  createPost, getUserPosts, getPostById, updatePost, deletePost,
  toggleLike, addComment, getComments, getGlobalFeed,
};