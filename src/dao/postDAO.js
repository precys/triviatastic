const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = 'Trivia_Table';
const logger = require('../utils/logger');

async function createPost(postItem) {
  await dynamoDb.put({ TableName: TABLE_NAME, Item: postItem }).promise();
  logger.info(`Post stored in DB: ${postItem.postId}`);
  return postItem;
}

async function getPostsByUser(userId) {
  const { Items } = await dynamoDb.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':skPrefix': 'POST#'
    }
  }).promise();
  return Items;
}

module.exports = { createPost, getPostsByUser };
