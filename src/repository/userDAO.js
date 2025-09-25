const { DynamoDBClient } = require ("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");
const { logger } = require ("../util/logger");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

//table name
const TableName = "trivia_users_table";

//user attributes
//  PK: `USER#${userId}`, 
//  SK: `PROFILE`, 
//  userId: userId,
//  username: username,
//  passwordHash: passwordHash,
//  role: role,
//  game_count: 0,
//  streak: 0,

//register a new user
async function registerNewUser(user) {  //userId: userId, username: username, passwordHash: passwordHash,
    console.log("in userDAO registration method");
    const command = new PutCommand ({
        TableName,
         Item: {
            User: `${user.userId}`,   // partition key
            Profile: "Profile",              // Sort key Map of user data
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

//registerNewUser({userId: "133ca64a-ab9e-489d-b328-869712fc42ff", username: "testDAO1", passwordHash: "testDAO1", role: "player"});

module.exports = {
    registerNewUser
}