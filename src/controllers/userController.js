
// Package Imports
const jwt = require("jsonwebtoken");
//require("dotenv").config();
// Service imports
const userService = require("../services/userService");
const { logger } = require("../utils/logger");


//const secretKey = process.env.SECRET_KEY;
const secretKey = "secret-key";

// Given a POST request for /login, log in User.
const login = async (req, res) => {
    if (userService.validateUserCredentials(req.body)){
        const { username, password } = req.body;

        try {
            const data = await userService.validateUserLogin(username, password);

            if (data){
                const token = jwt.sign(
                    {
                        id: data.user_id,
                        username
                    },
                    secretKey,
                    {
                        expiresIn: "20m"
                    }
                );
                res.status(201).json({message:"You have logged in.", token});
            }
            else {
                res.status(403).json({message:"Invalid username or password."});
            }
        }
        catch (err) {
            logger.error(`Login error | userController | Error: ${err}`);
            res.status(501).json({message:"Server error."});
        };


    }
    else {
        res.status(403).json({message:`Username or Password cannot be blank.`});  
    };
}

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
    login,
    deleteAccount,
    updateProfile
}

// const express = require('express')
// const router = express.Router();
// const userService = require("../services/userService");

// router.post("/register", async (req, res) => { //register/post a new user
//     const userData = await userService.registerNewUser(req.body);
//     if(userData){
//         res.status(201).json({message: `New user registered successfully${JSON.stringify(userData)}`});
//     } else{
//         res.status(400).json({message: "User registration failed", userData: req.body});
//     }
// })

// module.exports = router;

