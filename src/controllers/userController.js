const userService = require("../services/userService.js");

async function deleteAccount(req, res) {
    const authUser = req.user;
    const user = await userService.findUserById(authUser.userId);

    const delete_id = req.params.user_id;

    if(user.userId !== delete_id && user.role !== "admin" ) {
        res.status(403).json({message: "You may not delete this account."});
        return;
    }

    const result = await userService.deleteUserById(delete_id);
    if(!result) {
        res.status(400).json({message: "Failed to delete account."});
        return;
    }
    res.status(200).json({message: "Account deleted successfully."});
}
async function updateProfile(req, res) {
    const authUser = req.user;
    const user = await userService.findUserById(authUser.userId);

    const update_id = req.params.user_id;
    const update_user = await userService.findUserById(update_id);

    if(!update_user) {
        res.status(404).json({message: "User not found."});
        return;
    }

    if(user.userId !== update_id && user.role !== "admin" ) {
        res.status(403).json({message: "You may not update this account's information."});
        return;
    }

    const result = await userService.updateProfile(update_user, req.body.username);
    if(!result) {
        res.status(400).json({message: "Failed to update account information"});
        return;
    }
    res.status(200).json({message: "Account updated successfully."});
}

module.exports = {
    deleteAccount,
    updateProfile
}