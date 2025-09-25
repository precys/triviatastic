// Package imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, 
        GetCommand,
        PutCommand, 
        ScanCommand, 
        QueryCommand, 
        UpdateCommand } = require("@aws-sdk/lib-dynamodb");
// Util imports
const { logger } = require("../utils/logger");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "trivia_table";


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


module.exports = {
    getUserByUsername,
}