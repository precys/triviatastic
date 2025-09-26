const postDAO = require('../dao/postDAO');
const { v4: uuidv4 } = require('uuid');

async function createPost(userId, post_content) {
  const postId = uuidv4();
  const postItem = {
    PK: `USER#${userId}`,
    SK: `POST#${postId}`,
    postId,
    post_content,
    post_date: new Date().toISOString()
  };

  await postDAO.createPost(postItem);
  return postItem;
}

async function getPosts(userId) {
  return await postDAO.getPostsByUser(userId);
}

module.exports = { createPost, getPosts };
