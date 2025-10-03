const { logger } = require('../utils/logger');
// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// create document client
const client = new DynamoDBClient({ region: "us-east-1" }); // change region as necessary.
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

//send a friend request
async function sendFriendRequest (request){
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: request
    })

    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command complete | userDAO | sendFriendReq | data: ${JSON.stringify(data)}`);
        return data.item;

    }catch(err){
        logger.error(err.message);
        return null;
    }

}

//add a user
async function addFriend (userId, friendsList){
    const command = new UpdateCommand({
        TableName: TABLE_NAME, 
        Key: { 
            PK: `USER#${userId}`,
            SK: "PROFILE"
        },
        UpdateExpression: "SET friends = :friends",
        ExpressionAttributeValues: {
            ":friends" : friendsList || []
        },  ReturnValues: "ALL_NEW"
    })

    try{
        const data = await documentClient.send(command);
        logger.info(`UPDATE command complete | userDAO | addFriends | data: ${JSON.stringify(data)}`);
        return data.Attributes;
    }catch(err){
        logger.error(err);
        return null;
    }
}

//get a list of friend requests by status ("pending", "accepted", "denied" )
async function getFriendRequestsByStatus (userId, status){
    const command = new QueryCommand ({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        FilterExpression: "#status = :status", 
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
            ":pk": `FRIENDREQ#${userId}`,
            ":status": status
        }
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`Query command complete | userDAO | getFriendRequestsByStatus | data: ${JSON.stringify(data)}`);
        return data.Items || []

    }catch(err){
        logger.error(err.message);
        return null;
    }

}

//respond to a friend req
async function respondToFriendRequest (userFriendId, requestId, status){
  const command = new UpdateCommand ({
    TableName: TABLE_NAME, 
    Key: {
      PK: `FRIENDREQ#${userFriendId}`,
      SK: `REQUEST#${requestId}`
    },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames:{
      "#status": "status"
    },
    ExpressionAttributeValues:{
      ":status": status
    },
    ReturnValues: "ALL_NEW" 
  });

  try{
    const data = await documentClient.send(command);
    return data.Attributes;

  }catch(err){
      logger.error(err.message);
      return null;
  }

}

module.exports = {
  createUser, deleteUserById, getUserByUsername, updateUser, findUserById, getUsersFriendsByUserId, addFriend, sendFriendRequest, 
  getFriendRequestsByStatus, respondToFriendRequest
};

