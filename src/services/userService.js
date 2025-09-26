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
    const passwordBool = user.password.length > 0;
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

module.exports = {
    validateUserCredentials,
    validateUserLogin,
    findUserById,
    updateProfile,
    deleteUserById
}