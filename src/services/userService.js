const userDAO = require("../dao/userDAO.js");

function findUserById(user_id) {
    return userDAO.findUserById(user_id);
}
function updateProfile(user, username) {
    if(!profile) {
        return null;
    }
    user.username = username;
    return userDAO.updateUser(user);
}

function deleteUserById(user_id) {
    if(userDAO.deleteUserById(user_id)) {
        return true;
    }
    return false;
}

module.exports = {
    findUserById,
    updateProfile,
    deleteUserById
}