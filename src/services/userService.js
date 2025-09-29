
// Package imports
//const uuid = require("uuid");
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
    if(!(typeof username === "string" && username.length > 0)) {
        return null;
    }
    user.username = username;
    return await userDAO.updateUser(user);
}

async function updateAccount(user, newUser) {
    const saltRounds = 10;
    if(newUser.username) {
        if(typeof newUser.username === "string" && newUser.username.length > 0) {
            user.username = newUser.username;
        }
        else return null;
    }
    if(newUser.passwordHash) {
        if(typeof newUser.passwordHash === "string" && newUser.passwordHash.length > 0) {
            user.passwordHash = await bcrypt.hash(newUser.passwordHash, saltRounds);
        }
        else return null;
    }
    if(newUser.game_count) {
        if(typeof newUser.game_count === "number" && newUser.game_count >= 0) {
            user.game_count = newUser.game_count;
        }
        else return null;
    }
    if(newUser.streak) {
        if(typeof newUser.streak === "number" && newUser.streak >= 0) {
            user.streak = newUser.streak;
        }
        else return null;
    }
    if(newUser.category_counts) {
        if (Array.isArray(newUser.category_counts) 
            && newUser.category_counts.every(element => typeof element === "number" && element >= 0)) {
            user.category_counts = newUser.category_counts;
        }
        else return null;
    }
    if(newUser.category_scores) {
        if (Array.isArray(newUser.category_scores)
            && newUser.category_scores.every(element => typeof element === "number" && element >= 0)) {
            user.category_scores = newUser.category_scores;
        }
        else return null;
    }
    if(newUser.hi_score) {
        if(typeof newUser.hi_score === "number" && newUser.hi_score >= 0) {
            user.hi_score = newUser.hi_score;
        }
        else return null;
    }
    if(newUser.easy_count) {
        if(typeof newUser.easy_count === "number" && newUser.easy_count >= 0) {
            user.easy_count = newUser.easy_count;
        }
        else return null;
    }
    if(newUser.med_count) {
        if(typeof newUser.med_count === "number" && newUser.med_count >= 0) {
            user.med_count = newUser.med_count;
        }
        else return null;
    }
    if(newUser.hard_count) {
        if(typeof newUser.hard_count === "number" && newUser.hard_count >= 0) {
            user.hard_count = newUser.hard_count;
        }
        else return null;
    }
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
            const userId = crypto.randomUUID();

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
    updateAccount,
    deleteUserById,
    registerNewUser
}


