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

module.exports = {
  createPost, getUserPosts, getPostById, updatePost, deletePost,
  // addLike, removeLike, hasUserLiked, addComment, getComments
};
