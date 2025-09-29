// Package imports
const uuid = require("uuid");
const bcrypt = require("bcrypt");
// Util imports
const { logger } = require("../utils/logger");
const userDAO = require("../dao/userDAO");

async function findUserById(user_id) {
    return await userDAO.findUserById(user_id);
}
async function updateProfile(user, username) {
    if(!username) {
        return null;
    }
    user.username = username;
    return await userDAO.updateUser(user);
}

async function deleteUserById(user_id) {
    if(await userDAO.deleteUserById(user_id)) {
        return true;
    }
    return false;
}



// Validates user credentials
//      - Username must not be blank
//      - Password must not be blank
// args: user
// return: bool if username and password length are greater than 0
function validateUserCredentials(user){
    const usernameBool = user.username.length > 0;
    const passwordBool = user.passwordHash.length > 0;
    return (usernameBool && passwordBool);
}

// Validates user login information
// args: username, password
// return: user login, null if not
async function validateUserLogin(username, password) {
    const user = await userDAO.getUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.passwordHash))){
        logger.info(`User ${user.username} successfully logged in.`);
        return user;
    }
    else {
        logger.info(`Invalid username or password`);
        return null;
    }
}


async function registerNewUser(user){
    const saltRounds = 10;
    try{
        if(!user){ //if user doesnt exist
            logger.error(`User does not exist`);
            throw new Error ("User does not exist");
        }else{
            const passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
            const userId = uuid.v4();

            const userItem = {
                PK: `USER#${userId}`,
                SK: "PROFILE",
                userId,
                username: user.username,
                passwordHash,
                role: user.role || "USER",
                game_count: 0,
                streak: 0,
                category_counts: { art: 0, history: 0, mythology: 0, sports: 0, any: 0 },
                category_scores: { art: 0, history: 0, mythology: 0, sports: 0, any: 0 },
                hi_score: 0,
                easy_count: 0,
                med_count: 0,
                hard_count: 0,
                createdAt: new Date().toISOString()
            };

            const newUserData = await userDAO.registerNewUser(userItem)
            logger.info(`New user ${JSON.stringify(newUserData)} created`);
            return newUserData;
        }
    }catch(err){
        logger.error(err);
    }
}



module.exports = {
    validateUserCredentials,
    validateUserLogin,
    findUserById,
    updateProfile,
    deleteUserById,
    registerNewUser
}


