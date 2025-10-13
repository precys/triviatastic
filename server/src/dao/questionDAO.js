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


const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Trivia_Table";
const QUESTION_INDEX = "questionId-index"

// function to create a new custom question by user
// args: question item
// return: question data, success message
async function createQuestion(question) {
    const params = {
        TableName: TABLE_NAME,
        Item: question,
    };
    const command = new PutCommand(params);

    try {
        const data = await documentClient.send(command);
        return data;
    }
    catch (err) {
        logger.error(`Error in questionDAO | createQuestion | ${err}`);
        return null;
    }
}

// function to update a Question's status
// args: status, question
// return: question data
async function updateQuestionStatus(question, status){
    const params = {
        TableName: TABLE_NAME,
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
        TableName: TABLE_NAME,
        IndexName: QUESTION_INDEX,
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

        
        if (data.Items[0]){
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
async function deleteQuestion(question){
    const params = {
        TableName: TABLE_NAME,
        Key: {
            PK: question.PK,
            SK: question.SK,
        },
    }
    const command = new DeleteCommand(params);

    try {
        const data = await documentClient.send(command);
        
        if (data){
            logger.info(`Success Delete | deleteQuestion | ${JSON.stringify(data)}`);
            return {message: `Question ${question.questionId} deleted`};
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

// function to get all pending custom questions
// args: status
// return: list of questions filtered by status
async function getAllQuestionsByStatus(status){
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": status,
        }
    };
    const command = new ScanCommand(params);

    try{
        const data = await documentClient.send(command);

        if (data){
            logger.info(`Succesful SCAN | getQuestionsByStatus | ${JSON.stringify(data)}`);
            return data;
        }
        else {
            logger.error(`Failed SCAN | getQuestionsByStatus | ${data}`);
            return null;
        };

    }
    catch (err) {
        logger.error(`Error in questionDAO | getQuestionsByStatus | ${err} `);
        return null;
    };
}

// function to get all questions by category, that are approved
// changed functionality to include difficulty and type, type is always included. If not difficulty, do not append additional params.
// args: category
// return: list of questions
async function getAllQuestionsByCategory(category, difficulty, type){
    let filterExpression = "#status = :status AND #type = :type";
    let expressionAttributeNames = {
        "#status": "status",
        "#type": "type",
    };
    let expressionAttributeValues = {
        ":PK": `CATEGORY#${category.toLowerCase()}`,
        ":status": "approved",
        ":type": type,
    };

    if (difficulty){
        filterExpression += " AND #difficulty = :difficulty";
        expressionAttributeNames["#difficulty"] = "difficulty";
        expressionAttributeValues[":difficulty"] = difficulty;
    }

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :PK",
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
    const command = new QueryCommand(params);

    
    try{
        const data = await documentClient.send(command);

        if (data){
            logger.info(`Successful QUERY | getAllQuestionsByCategory | ${JSON.stringify(data.Items)}`);
            return data.Items;
        }
        else {
            logger.error(`Failed QUERY | getAllQuestionsByCategory | ${data}`);
            return null;
        };

    }
    catch (err) {
        logger.error(`Error in questionDAO | getQuestionsByStatus | ${err} `);
        return null;
    };
}

async function getAllQuestionsByCategoryNoType(category, difficulty){
    let filterExpression = "#status = :status";
    let expressionAttributeNames = {
        "#status": "status",
    };
    let expressionAttributeValues = {
        ":PK": `CATEGORY#${category.toLowerCase()}`,
        ":status": "approved"
    };

    if (difficulty){
        filterExpression += " AND #difficulty = :difficulty";
        expressionAttributeNames["#difficulty"] = "difficulty";
        expressionAttributeValues[":difficulty"] = difficulty;
    }

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :PK",
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
    const command = new QueryCommand(params);

    
    try{
        const data = await documentClient.send(command);

        if (data){
            logger.info(`Successful QUERY | getAllQuestionsByCategory | ${JSON.stringify(data.Items)}`);
            return data.Items;
        }
        else {
            logger.error(`Failed QUERY | getAllQuestionsByCategory | ${data}`);
            return null;
        };

    }
    catch (err) {
        logger.error(`Error in questionDAO | getQuestionsByStatus | ${err} `);
        return null;
    };
}

// function that gets all questions
// return: list of all questions that are approved
async function getAllQuestions(difficulty, type){
    let filterExpression = "begins_with(PK, :PKPrefix) AND #status = :status AND #type = :type";
    let expressionAttributeNames = {
        "#status": "status",
        "#type": "type",
    };
    let expressionAttributeValues = {
        ":PKPrefix": "CATEGORY#",
        ":status": "approved",
        ":type": type,
    };

    if (difficulty){
        filterExpression += " AND #difficulty = :difficulty";
        expressionAttributeNames["#difficulty"] = "difficulty";
        expressionAttributeValues[":difficulty"] = difficulty;
    }

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };
    const command = new ScanCommand(params)

    try {
        const data = await documentClient.send(command)

        if (data){
            logger.info(`Successful SCAN | getAllQuestions | ${JSON.stringify(data.Items)}`)
            return data.Items;
        }
        else {
            logger.error(`Failed SCAN | getAllQuestions`)
            return null;
        }
        

    }
    catch (err){
        logger.error(`Error in questionDAO | getAllQuestions | ${err}`);
        return null;
    }

}


async function getAllQuestionsNoType(difficulty){
    let filterExpression = "begins_with(PK, :PKPrefix) AND #status = :status";
    let expressionAttributeNames = {
        "#status": "status"
    };
    let expressionAttributeValues = {
        ":PKPrefix": "CATEGORY#",
        ":status": "approved"
    };

    if (difficulty){
        filterExpression += " AND #difficulty = :difficulty";
        expressionAttributeNames["#difficulty"] = "difficulty";
        expressionAttributeValues[":difficulty"] = difficulty;
    }

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };
    const command = new ScanCommand(params)

    try {
        const data = await documentClient.send(command)

        if (data){
            logger.info(`Successful SCAN | getAllQuestions | ${JSON.stringify(data.Items)}`)
            return data.Items;
        }
        else {
            logger.error(`Failed SCAN | getAllQuestions`)
            return null;
        }
        

    }
    catch (err){
        logger.error(`Error in questionDAO | getAllQuestions | ${err}`);
        return null;
    }

}

// function that returns all questions made by a user
// return: list of questions
async function getAllUsersQuestions(userId){
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: `begins_with(PK, :PKPrefix) AND begins_with(SK, :SKPrefix) AND #userId = :userId`,
        ExpressionAttributeNames: {
            "#userId": "userId",
        },
        ExpressionAttributeValues: {
            ":PKPrefix": "CATEGORY#",
            ":SKPrefix": "QUESTION#",
            ":userId": userId,
        }
    };
    const command = new ScanCommand(params)

    try {
        const data = await documentClient.send(command)

        if (data){
            logger.info(`Successful GET | getAllUsersQuestions`)
            return data.Items
        }
        else {
            logger.error(`Failed GET | getAllUsersQuestions`)
            return null
        }
    }
    catch (err){
        logger.error(`Error questionDAO | getAllUsersQuestions | ${err}`)
        return null
    }
}

module.exports = {
    createQuestion,
    getQuestionById,
    updateQuestionStatus,
    deleteQuestion,
    getAllQuestionsByStatus,
    getAllQuestionsByCategory,
    getAllQuestionsByCategoryNoType,
    getAllQuestions,
    getAllQuestionsNoType,
    getAllUsersQuestions,
}