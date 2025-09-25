const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "user";

async function findUserById(user_id) {
    const command = new GetCommand({
        TableName,
        Key: {
            PK: { S: `USER#${user_id}` },
            SK: { S: "PROFILE" }
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

async function deleteUserById(user_id) {s
    const command = new DeleteCommand({
        TableName,
        Key: {
            PK: { S: `USER#${user_id}` },
            SK: { S: "PROFILE" }
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