const { logger } = require('../utils/logger');
// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

// create document client
const client = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Trivia_Table";
const USERNAME_INDEX = "username-index"; // gsi name for username lookup

// create a new user
async function createUser(userItem) {
  const command = new PutCommand({ TableName: TABLE_NAME, Item: userItem });
  await documentClient.send(command);
  logger.info(`User stored in DB: ${userItem.userId}`);
  return userItem;
}

// get user by id
async function getUserById(userId) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: 'PROFILE' }
  });
  const { Item } = await documentClient.send(command);
  return Item;
}

// get user by username using gsi
async function getUserByUsername(username) {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: USERNAME_INDEX, // gsi name for username lookup
    KeyConditionExpression: "username = :u",
    ExpressionAttributeValues: {
      ":u": username
    },
    Limit: 1
  });

  const { Items } = await documentClient.send(command);
  return Items?.[0];
}

// update a user
async function updateUser(userItem) {
  const command = new PutCommand({ TableName: TABLE_NAME, Item: userItem });
  await documentClient.send(command);
  logger.info(`User updated in DB: ${userItem.userId}`);
  return userItem;
}

// delete a user
async function deleteUser(userId) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: 'PROFILE' }
  });
  await documentClient.send(command);
  logger.info(`User deleted from DB: ${userId}`);
}

module.exports = { createUser, getUserById, getUserByUsername, updateUser, deleteUser };
