// Package imports
const uuid = require("uuid");
const bcrypt = require("bcrypt");
// Util imports
const { logger } = require("../utils/logger");
const userDAO = require("../dao/userDAO");


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


    if (user && (await bcrypt.compare(password, user.password))){
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
    validateUserLogin
}