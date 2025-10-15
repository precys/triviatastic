const { logger } = require('../utils/logger');

// aws sdk v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { get } = require('http');

// create document client
const client = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Trivia_Table";

// create post
async function createPost(userId, data) {
  const postId = crypto.randomUUID();

  // determine the profileId (where the post is being made)
  const profileId = data.profileId || userId; // fallback to userId if posting on own profile

  // fetch username of the creator
  const profileResult = await documentClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: "PROFILE",
      },
    })
  );

  const username = profileResult.Item?.username || "Unknown";

  const item = {
    PK: `USER#${profileId}`,
    SK: `POST#${postId}`,
    postId,
    userId,
    profileId,
    username,
    content: data.content,
    createdAt: new Date().toISOString(),
    GlobalFeedPK: "POST", // for global feed query
    GlobalFeedSK: new Date().toISOString(), // for global feed query
  };

  await documentClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return item;
}



// get user posts
async function getUserPosts(profileUserId, currentUserId) {
  // profileUserId: whose profile posts we are fetching
  // currentUserId: logged-in user

  const result = await documentClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${profileUserId}`,
        ':sk': 'POST#',
      },
      ScanIndexForward: false, // newest first
    })
  );

  const posts = result.Items || [];

  // likes count and whether current user has liked each post
  for (const post of posts) {
    // count likes
    const likeQuery = await documentClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `POST#${post.postId}`,
          ':sk': 'LIKE#',
        },
        Select: "ALL_ATTRIBUTES",
      })
    );

    const likeCount = likeQuery.Count || (likeQuery.Items?.length || 0);

    // check if the current viewer has liked it
    const liked = !!(currentUserId && likeQuery.Items?.find((i) => i.SK === `LIKE#${currentUserId}`));

    post.likes = likeCount;
    post.liked = liked;
  }

  return posts;
}


// get post by id
async function getPostById(userId, postId) {
  const result = await documentClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `POST#${postId}`,
    },
  }));

  return result.Item || null;
}

// update post
async function updatePost(userId, postId, updateData) {
  const result = await documentClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `POST#${postId}`,
    },
    UpdateExpression: 'SET content = :content',
    ExpressionAttributeValues: {
      ':content': updateData.content,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes || null;
}

// delete post
async function deletePost(userId, postId) {
  const result = await documentClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `POST#${postId}`,
    },
    ReturnValues: 'ALL_OLD',
  }));

  return result.Attributes || null;
}


// toggle like item
async function toggleLikeItem(userId, postId) {
  if (!userId || !postId) throw new Error("toggleLikeItem requires userId and postId");

  const key = {
    PK: `POST#${postId}`,
    SK: `LIKE#${userId}`,
  };

  // check whether this user's LIKE item exists
  const getCmd = new GetCommand({
    TableName: TABLE_NAME,
    Key: key,
  });

  const getRes = await documentClient.send(getCmd);

  if (getRes.Item) {
    // user already liked, delete only this user's like item
    const delCmd = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: key,
    });
    await documentClient.send(delCmd);
    return { liked: false };
  } else {
    // user has not liked, create like item
    const putCmd = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...key,
        userId,
        postId,
        createdAt: new Date().toISOString(),
      },
      
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    });

    try {
      await documentClient.send(putCmd);
    } catch (err) {
      
      if (err.name !== "ConditionalCheckFailedException") throw err;
    }

    return { liked: true };
  }
}

// count likes for a post
async function getLikesCount(postId) {
  if (!postId) return 0;

  const q = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `POST#${postId}`,
      ":sk": "LIKE#",
    },
    Select: "COUNT",
  });

  const res = await documentClient.send(q);
  return res.Count || 0;
}



// comment
async function addComment(userId, postId, content) {
  const commentId = crypto.randomUUID();
  const item = {
    PK: `POST#${postId}`,
    SK: `COMMENT#${commentId}`,
    commentId,
    userId,
    postId,
    content,
    createdAt: new Date().toISOString(),
  };

  await documentClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return item;
}

// get comments for a post
async function getComments(postId) {
  const result = await documentClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `POST#${postId}`,
      ':sk': 'COMMENT#',
    },
    ScanIndexForward: false,
  }));

  return result.Items || [];
}




// get all posts across all users (global feed)
async function getGlobalFeedPosts() {
  // query all posts via gsi
  const result = await documentClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GlobalFeed-index",
      KeyConditionExpression: "GlobalFeedPK = :pk",
      ExpressionAttributeValues: {
        ":pk": "POST",
      },
      ScanIndexForward: false, // newest first
    })
  );

  const posts = result.Items || [];

  // count likes for each post
  for (const post of posts) {
    const likeQuery = await documentClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `POST#${post.postId}`,
          ":sk": "LIKE#",
        },
        Select: "COUNT",
      })
    );
    post.likes = likeQuery.Count || 0;
  }

  return posts;
}











module.exports = {
  createPost, getUserPosts, getPostById, updatePost, deletePost,
  toggleLikeItem, getLikesCount, getLikesCount,
  addComment, getComments, getGlobalFeedPosts,
};
