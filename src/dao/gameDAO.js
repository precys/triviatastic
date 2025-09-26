const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = 'Trivia_Table';
const logger = require('../utils/logger');

async function createGame(gameItem) {
  await dynamoDb.put({ TableName: TABLE_NAME, Item: gameItem }).promise();
  logger.info(`Game stored in DB: ${gameItem.gameId}`);
  return gameItem;
}

async function getGame(gameId, userId) {
  const { Item } = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: { PK: `GAME#${gameId}`, SK: `USER#${userId}` }
  }).promise();
  return Item;
}

async function deleteGame(gameId, userId) {
  await dynamoDb.delete({
    TableName: TABLE_NAME,
    Key: { PK: `GAME#${gameId}`, SK: `USER#${userId}` }
  }).promise();
  logger.info(`Game deleted from DB: ${gameId}`);
}

module.exports = { createGame, getGame, deleteGame };
