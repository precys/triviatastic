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
            PK: `${question.category}`,
            SK: `${question.questionId}`,
        },
        UpdateExpress: "SET #status = :status",
        ExpressionAttribueNames: {
            "#status": "status",
        },
        ExpressionAttribueValues: {
            ":status": status,
        },
    }
    const command = new UpdateCommand(params)

    try {
        const data = await documentClient.send(command);
        if (data) {
            logger.info(`Successful UPDATE | updateQuestionStatus | ${data}`);
            return data;
        }
        else {
            logger.error(`Data is empty | updateQuestionStatus | ${data}`);
            return null;
        }

    }
    catch (err){
        logger.error(`Error in questionDAO | updateQuestionStatus | ${err}`);
        return null;
    }
}

// function to get a question by Id
// args: questionId, category
// return: question data
// Should create a GSI for questionId
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
            logger.info(`Success GET command | getQuestionById | ${data.Item}`);
            return data.Item;
        }
        else {
            logger.error(`Data is empty | getQuestionById | ${data}`);
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
            logger.info(`Success Delete | deleteQuestion | ${data}`);
            return {message: `Question ${questionId} deleted`};
        }
        else {
            logger.error(`Data is empty | deleteQuestion | ${data}`);
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