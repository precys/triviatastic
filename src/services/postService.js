const postDAO = require('../dao/postDAO');
const { logger } = require('../utils/logger');



async function createPost({ userId, content }) {
  if (!userId || !content) throw new Error('userId and content are required');

  const postId = uuidv4();

  const postItem = {
    PK: `USER#${userId}`,
    SK: `POST#${postId}`,
    postId,
    userId,
    content,
    createdAt: new Date().toISOString()
  };

  return await postDAO.createPost(postItem);
}





async function getPosts(userId) {
  if (!userId) throw new Error('User ID is required to fetch posts');

  const posts = await postDAO.getPostsByUser(userId);
  logger.info(`Fetched ${posts.length} posts for user ${userId}`);
  return posts;
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
  deletePost
};
