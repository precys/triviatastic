const { logger } = require('../utils/logger');

// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// create document client
const client = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Trivia_Table";

// create new game
async function createGame(gameItem) {
  const command = new PutCommand({ TableName: TABLE_NAME, Item: gameItem });
  await documentClient.send(command);
  logger.info(`game stored in db: ${gameItem.gameId}`, { service: 'gameDAO' });
  return gameItem;
}

// get game by id
async function getGame(gameId, userId) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `GAME#${gameId}`, SK: `USER#${userId}` },
  });
  const { Item } = await documentClient.send(command);
  return Item;
}

// delete game
async function deleteGame(gameId, userId) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { PK: `GAME#${gameId}`, SK: `USER#${userId}` },
  });
  await documentClient.send(command);
  logger.info(`game deleted from db: ${gameId}`, { service: 'gameDAO' });
}

module.exports = { createGame, getGame, deleteGame };
