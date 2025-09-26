const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");

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

module.exports = {
    findUserById,
    updateUser,
    deleteUserById
}