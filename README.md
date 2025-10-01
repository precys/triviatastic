# Triviatastic

## Description

Triviatastics is a web-based platform that leverages the Open Trivia Database API to deliver interactive trivia games. Users will be able to create single-player trivia sessions, track performance statistics, and customize their experience. The platform will feature user profiles, leaderboards, and multiple game modes to ensure replayability and engagement. Administrators will have the ability to manage users and oversee platform activity.

## Tech Stack

DynamoDB  
ReactJS  
Express.js  
Node.js  

## Packages

@aws-sdk/client-dynamodb (^3.896.0)  
@aws-sdk/lib-dynamodb: ^3.896.0  
bcrypt (^6.0.0)  
bcryptjs (^3.0.2)  
express (^5.1.0)  
jsonwebtoken (^9.0.2)  
uuid (^13.0.0)  
winston "(3.17.0)  

## Environmental Variables

SECRET_KEY in jwt.js needs to be set or will be defaulted to "supersecretkey"  
PORT in app.js to be desired port number, defaults to 3000  
region in DAO layer, respository directory, for AWS database communication, please set to desired region.  

## Installation

Create a copy of the repository via "git clone" inside a local directory via the terminal  
Use "npm i" or "npm install" to install all packages in package.json  
Then setup AWS DynamoDB database and change the region in respository DAO files to desired region  
Use an front-end client such as Postman to use endpoints  

## API Endpoints

### USER

- `POST /users/register` - Creates a new User given an unique username and any password  
- `POST /users/login` - Logins User given valid username and password  
- `DELETE /users/:userId` - Deletes User given userId  
- `GET /users/:userId/stats` - Gets all User's stats  
- `PATCH /users/:userId/profle` - Updates User's information  
- `GET /users/:userId/friends` - Gets all User's friends  

### QUESTIONS

- `POST /questions/` - Creates a new custom question  
- `PATCH /questions/:question_id` - Updates question's status  
- `GET /questions/` - Gets question's by status  

### GAMES

- `POST /games/start` - Creates a new game  
- `POST /games/:gameId/answer` - Answers a question by game object  
- `POST /games/:gameId/finish` - Finishes game object, user ends early
- `POST /games/:gameId/end` - Game ends, all questions answered  

### POSTS

- `POST /posts/users/:userId/posts` - Creates new post by User  
- `GET /posts/users/:userId/posts` - Gets all posts by a User  
- `GET /posts/users/:userId/posts/:postId` - Gets post by postId  
- `PATCH /posts/users/:userId/posts/:postId` - Updates post by postId  
- `DELETE /posts/users/:userId/posts/:postId` - Deletes post by postId  

## License

All rights reserved. This project is intended for personal use and demonstration purposes only.  
