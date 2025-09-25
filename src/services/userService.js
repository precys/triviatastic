const userDAO = require("../dao/userDAO.js");

function findUserById(user_id) {
    return userDAO.findUserById(user_id);
}
function updateProfile(user, profile) {
    if(!profile) {
        return null;
    }
    // UPDATE THE USER OBJECT
    // WHAT IS THE "PROFILE", the current table has no personal info.
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