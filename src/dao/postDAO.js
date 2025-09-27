const { logger } = require('../utils/logger');

// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

// create document client
const client = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Trivia_Table";

// create new post
async function createPost(postItem) {
  const command = new PutCommand({ TableName: TABLE_NAME, Item: postItem });
  try {
    await documentClient.send(command);
    logger.info(`post stored in db: ${postItem.postId}`, { service: 'postDAO' });
    return postItem;
  } catch (err) {
    logger.error(`dynamodb put error: ${err.message}`, { service: 'postDAO' });
    throw err;
  }
}

// get posts by user
async function getPostsByUser(userId) {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}`,
      ":skPrefix": "POST#",
    },
  });

  try {
    const { Items } = await documentClient.send(command);
    return Items;
  } catch (err) {
    logger.error(`dynamodb query error: ${err.message}`, { service: 'postDAO' });
    throw err;
  }
}

module.exports = { createPost, getPostsByUser };
