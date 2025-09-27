const postDAO = require('../dao/postDAO');
const { logger } = require('../utils/logger');

async function createPost({ userId, content }) {
  const post = await postDAO.createPost({ userId, content });
  logger.info(`Post created by user ${userId}, postId=${post.postId}`);
  return post;
}

async function getPosts() {
  const posts = await postDAO.getAllPosts();
  logger.info(`Fetched ${posts.length} posts`);
  return posts;
}

async function getPostById(postId) {
  const post = await postDAO.getPostById(postId);
  if (!post) {
    logger.warn(`Post not found: ${postId}`);
    throw new Error('Post not found');
  }
  return post;
}

async function deletePost(postId, userId) {
  const post = await postDAO.getPostById(postId);
  if (!post) {
    logger.warn(`Delete failed: post ${postId} not found`);
    throw new Error('Post not found');
  }
  if (post.userId !== userId) {
    logger.warn(`Unauthorized delete attempt by ${userId} on post ${postId}`);
    throw new Error('Not authorized');
  }

  await postDAO.deletePost(postId);
  logger.info(`Post deleted: ${postId} by user ${userId}`);
  return { message: 'Post deleted' };
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost
};
