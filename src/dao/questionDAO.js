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

// function to create a new custom question by user
// args: question item
// return: question data, success message
async function createQuestion(question) {
    const params = {
        TableName,
        Item: question,
    };
    const command = new PutCommand(params);

    try {
        const data = await documentClient.send(command);
        return data;
    }
    catch (err) {
        logger.error(`Error in questionDAO | createQuestion | ${err}`);
    }
}

// function to update a Question's status
// args: status, question
// return: question data
async function updateQuestionStatus(status, question){
    const params = {
        TableName,

    }
}

// function to get a question by Id
// args: questionId, category
// return: question data
async function getQuestionById(questionId, category){
    const params = {
        TableName,
        Key: {
            PK: `CATEGORY#${category}`,
            SK: `QUESTION#${questionId}`,
        }
    };
    const command = new GetCommand(params);

    try {
        const data = await documentClient.send(command);
        
        if (data){
            logger.info(`Success GET command | getQuestionById | ${data}`);
            return data;
        }
        else {
            logger.err(`Data is empty | getQuestionById | ${data}`);
            return null;
        }

    }
    catch (err) {
        logger.error(`Error in questionDAO | getQuestionById | ${err}`);
        return null;
    }
}

module.exports = {
    createQuestion,
    getQuestionById,
}