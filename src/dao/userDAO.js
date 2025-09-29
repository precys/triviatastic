const { logger } = require('../utils/logger');
// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

// create document client
const client = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

// variables
const TABLE_NAME = "Trivia_Table";
const USERNAME_INDEX = "username-index"; // gsi name for username lookup







// create a new user
async function createUser(user) {
  const item = {
    PK: `USER#${user.userId}`,
    SK: "PROFILE",
    ...user, // ...user : Spread the rest of the user data 
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  try {
    await documentClient.send(command);
    logger.info(`User stored in DB: ${user.userId}`);
    return item;
  } catch (err) {
    logger.error(`Error registering user ${user.userId}: ${err.message}`);
    throw err; // rethrow so service layer knows registration failed
  }
}





// find user by id
async function findUserById(userId) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            PK: `USER#${userId}`,
            SK: "PROFILE"
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Item;
    }
    catch(error) {
        logger.error(`Error fetching user ${userId}: ${error.message}`);
        throw error;
    }
}




// delete user by id
async function deleteUserById(userId) {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
            PK: `USER#${userId}`,
            SK: "PROFILE"
        }
    });

    try {
        await documentClient.send(command);
        return true;
    }
    catch(error) {
        console.error(error);
        return false;
    }
}





// update a user
async function updateUser(userItem) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: userItem
  });

  try {
    await documentClient.send(command);
    logger.info(`User updated in DB: ${userItem.userId}`);
    return userItem;
  }
  catch(error) {
    console.error(error);
  }
}




// get user by username using gsi for query
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







// get user's friends
async function getUsersFriendsByUserId(userId) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { 
            PK: `USER#${userId}`,
            SK: "PROFILE"
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Item?.friends || [];
    } catch (error) {
        logger.error(`Error fetching friends for user ${userId}: ${error.message}`);
        throw error;
    }
}









module.exports = { createUser, deleteUserById, getUserByUsername, updateUser, findUserById, getUsersFriendsByUserId };

