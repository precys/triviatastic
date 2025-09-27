const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = 'Trivia_Table';
const logger = require('../utils/logger');

async function createPost(postItem) {
  try {
    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: postItem
    }).promise();

    logger.info(`Post stored in DB: ${postItem.postId}`);
    return postItem;
  } catch (err) {
    logger.error("DynamoDB put error: %o", err);
    throw err;
  }
}

async function getPostsByUser(userId) {
  try {
    const { Items } = await dynamoDb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':skPrefix': 'POST#'
      }
    }).promise();

    return Items;
  } catch (err) {
    logger.error("DynamoDB query error: %o", err);
    throw err;
  }
}

module.exports = { createPost, getPostsByUser };
