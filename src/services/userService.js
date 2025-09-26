const userDAO = require("../dao/userDAO.js");

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

module.exports = {
    findUserById,
    updateProfile,
    deleteUserById
}