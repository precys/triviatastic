
// Package imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, 
        GetCommand,
        PutCommand, 
        ScanCommand, 
        QueryCommand, 
        UpdateCommand,
        DeleteCommand } = require("@aws-sdk/lib-dynamodb");
// Util imports
const { logger } = require("../utils/logger");


const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Trivia_Table";

async function findUserById(user_id) {
    const command = new GetCommand({
        TableName,
        Key: {
            PK: `USER#${user_id}`,
            SK: "PROFILE"
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Item;
    }
    catch(error) {
        console.error(error);
        return null;
    }
}

async function updateUser(user) {
    const command = new PutCommand({
        TableName,
        Item: user
    });

    try {
        await documentClient.send(command);
        return user;
    }
    catch(error) {
        console.error(error);
    }
}


// Query function
// args: username
// return: data on success, null if not
async function getUserByUsername(username){
    const params = {
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username": username}
    };
    const command = new ScanCommand(params);

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command complete | userDAO | getUserByUsername | data: ${JSON.stringify(data.Items[0])}`);
        return data.Items[0];
    }catch(err){
        logger.error(`Error in userDAO | getUserByUsername | Error: ${err}`);
        return null;
    }
}
async function deleteUserById(user_id) {
    const command = new DeleteCommand({
        TableName,
        Key: {
            PK: `USER#${user_id}`,
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

async function registerNewUser(user) {  //userId: userId, username: username, passwordHash: passwordHash,
    console.log("in userDAO registration method");
    const command = new PutCommand ({
        TableName,
         Item: {
            PK: `USER#${user.userId}`,   // partition key
            SK: "PROFILE",              // Sort key 
            ...user                     // ...user : Spread the rest of the user data 
        }
    })

    try{
        const registrationData = await documentClient.send(command);
        logger.info(`Successful put command to db for user registration: ${JSON.stringify(registrationData)}`);
        return registrationData;

    }catch(err){
        logger.error(err);
    }
}

module.exports = {
    getUserByUsername,
    findUserById,
    updateUser,
    deleteUserById,
    registerNewUser
}