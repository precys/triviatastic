const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand, } = require("@aws-sdk/lib-dynamodb");

// create document client
const client = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Trivia_Table";

// create post
async function createPost(userId, data) {
  const postId = uuidv4();
  const item = {
    PK: `USER#${userId}`,
    SK: `POST#${postId}`,
    postId,
    userId,
    content: data.content,
    createdAt: new Date().toISOString(),
  };

  await documentClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return item;
}

// get user posts
async function getUserPosts(userId) {
  const result = await documentClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'POST#',
    },
    ScanIndexForward: false, // newest first
  }));

  return result.Items || [];
}

// get post by id
async function getPostById(userId, postId) {
  const result = await documentClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `POST#${postId}`,
    },
  }));

  return result.Item || null;
}

// update post
async function updatePost(userId, postId, updateData) {
  const result = await documentClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `POST#${postId}`,
    },
    UpdateExpression: 'SET content = :content',
    ExpressionAttributeValues: {
      ':content': updateData.content,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes || null;
}

// delete post
async function deletePost(userId, postId) {
  const result = await documentClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `POST#${postId}`,
    },
    ReturnValues: 'ALL_OLD',
  }));

  return result.Attributes || null;
}

// like
async function addLike(userId, postId) {
  const item = {
    PK: `POST#${postId}`,
    SK: `LIKE#${userId}`,
    userId,
    postId,
    createdAt: new Date().toISOString(),
  };

  await documentClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
    ConditionExpression: 'attribute_not_exists(SK)', // prevent duplicates
  }));

  return item;
}

// remove like
async function removeLike(userId, postId) {
  const result = await documentClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `POST#${postId}`,
      SK: `LIKE#${userId}`,
    },
    ReturnValues: 'ALL_OLD',
  }));

  return result.Attributes || null;
}

// has user liked
async function hasUserLiked(userId, postId) {
  const result = await documentClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `POST#${postId}`,
      SK: `LIKE#${userId}`,
    },
  }));
  return !!result.Item;
}


// unlike
async function addUnlike(userId, postId) {
  const item = {
    PK: `POST#${postId}`,
    SK: `UNLIKE#${userId}`,
    userId,
    postId,
    createdAt: new Date().toISOString(),
  };

  await documentClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
    ConditionExpression: 'attribute_not_exists(SK)',
  }));

  return item;
}

//remove unlike
async function removeUnlike(userId, postId) {
  const result = await documentClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `POST#${postId}`,
      SK: `UNLIKE#${userId}`,
    },
    ReturnValues: 'ALL_OLD',
  }));

  return result.Attributes || null;
}

// has user unliked
async function hasUserUnliked(userId, postId) {
  const result = await documentClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `POST#${postId}`,
      SK: `UNLIKE#${userId}`,
    },
  }));
  return !!result.Item;
}

// comment
async function addComment(userId, postId, text) {
  const commentId = uuidv4();
  const item = {
    PK: `POST#${postId}`,
    SK: `COMMENT#${commentId}`,
    commentId,
    userId,
    postId,
    text,
    createdAt: new Date().toISOString(),
  };

  await documentClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return item;
}

// get comments for a post
async function getComments(postId) {
  const result = await documentClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `POST#${postId}`,
      ':sk': 'COMMENT#',
    },
    ScanIndexForward: false,
  }));

  return result.Items || [];
}









module.exports = {
  createPost, getUserPosts, getPostById, updatePost, deletePost,
  addLike, removeLike, hasUserLiked, addUnlike, removeUnlike, hasUserUnliked,
  addComment, getComments
};
