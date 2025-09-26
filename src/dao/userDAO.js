const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = 'Trivia_Table';
const logger = require('../utils/logger');

async function createUser(userItem) {
  await dynamoDb.put({ TableName: TABLE_NAME, Item: userItem }).promise();
  logger.info(`User stored in DB: ${userItem.userId}`);
  return userItem;
}

async function getUserById(userId) {
  const { Item } = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: 'PROFILE' }
  }).promise();
  return Item;
}

async function updateUser(userItem) {
  await dynamoDb.put({ TableName: TABLE_NAME, Item: userItem }).promise();
  logger.info(`User updated in DB: ${userItem.userId}`);
  return userItem;
}

async function deleteUser(userId) {
  await dynamoDb.delete({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: 'PROFILE' }
  }).promise();
  logger.info(`User deleted from DB: ${userId}`);
}

module.exports = { createUser, getUserById, updateUser, deleteUser };
