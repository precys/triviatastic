const userService = require("../userService.js");

function deleteAccount(req, res) {
    const authUser = res.locals.user;
    const user = userService.findUserById(authUser.userId);

    const delete_id = req.params.user_id;

    if(user.userId !== delete_id && user.role !== "admin" ) {
        res.status(403).body({message: "You may not delete this account."});
        return;
    }

    const result = userService.deleteUserById(delete_id);
    if(!result) {
        res.status(400).body({message: "Failed to delete account."});
        return;
    }
    res.status(200).body({message: "Account deleted successfully."});
}
function updateProfile(req, res) {
    const authUser = res.locals.user;
    const user = userService.findUserById(authUser.userId);

    const update_id = req.params.user_id;
    const update_user = userService.findUserById(update_id);

    if(!update_user) {
        res.status(404).body({message: "User not found."});
        return;
    }

    if(user.userId !== update_id && user.role !== "admin" ) {
        res.status(403).body({message: "You may not update this account's information."});
        return;
    }

    const result = userService.updateProfile(update_user, req.body);
    if(!result) {
        res.status(400).body({message: "Failed to update account information"});
        return;
    }
    res.status(200).body({content: result, message: "Account updated successfully."});
}

module.exports = {
    deleteAccount,
    updateProfile
}