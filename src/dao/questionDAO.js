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
async function updateQuestionStatus(question, status){
    const params = {
        TableName,
        Key: {
            PK: question.PK,
            SK: question.SK,
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": status,
        },
        ReturnValues: "ALL_NEW",
    }
    const command = new UpdateCommand(params)

    try {
        const data = await documentClient.send(command);
        if (data) {
            logger.info(`Successful UPDATE | updateQuestionStatus | ${JSON.stringify(data)}`);
            return data;
        }
        else {
            logger.error(`Data is empty | updateQuestionStatus | ${JSON.stringify(data)}`);
            return null;
        }

    }
    catch (err){
        logger.error(`Error in questionDAO | updateQuestionStatus | ${err}`);
        return null;
    }
}

// function to get a question by Id
// args: questionId
// return: question data
async function getQuestionById(questionId){
    const params = {
        TableName,
        IndexName: "questionId-index",
        KeyConditionExpression: "#questionId = :questionId",
        ExpressionAttributeNames: {
            "#questionId": "questionId"
        },
        ExpressionAttributeValues: {
            ":questionId": questionId
        },
    };
    const command = new QueryCommand(params)

    try {
        const data = await documentClient.send(command);
        
        if (data){
            logger.info(`Success GET command | getQuestionById | ${JSON.stringify(data.Items[0])}`);
            return data.Items[0];
        }
        else {
            logger.error(`Data is empty | getQuestionById | ${JSON.stringify(data)}`);
            return null;
        }

    }
    catch (err) {
        logger.error(`Error in questionDAO | getQuestionById | ${err}`);
        return null;
    }
}

// function to delete question
// args: question
// return: message for deletion
async function deleteQuestion(questionId, category){
    const params = {
        TableName,
        Key: {
            PK: `CATEGORY#${category}`,
            SK: `QUESTION#${questionId}`,
        },
    }
    const command = new DeleteCommand(params);

    try {
        const data = await documentClient.send(command);
        
        if (data){
            logger.info(`Success Delete | deleteQuestion | ${JSON.stringify(data)}`);
            return {message: `Question ${questionId} deleted`};
        }
        else {
            logger.error(`Data is empty | deleteQuestion | ${JSON.stringify(data)}`);
            return null;
        }

    }
    catch (err) {
        logger.error(`Error in questionDAO | deleteQuestion | ${err}`);
        return null;
    }
}

module.exports = {
    createQuestion,
    getQuestionById,
    updateQuestionStatus,
    deleteQuestion,
}