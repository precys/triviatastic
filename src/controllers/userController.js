
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
        const { username, passwordHash } = req.body;

        try {
            const data = await userService.validateUserLogin(username, passwordHash);

            if (data){
                const token = jwt.sign(
                    {
                        userId: data.userId,
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

// 
async function deleteAccount(req, res) {
    const authUser = req.user;
    const user = await userService.findUserById(authUser.userId);

    const delete_id = req.params.user_id;

    if(user.userId !== delete_id && user.role !== "ADMIN" ) {
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

// 
async function updateProfile(req, res) {
    const authUser = req.user;
    console.log(authUser)
    const user = await userService.findUserById(authUser.userId);
    console.log(user);

    const update_id = req.params.user_id;
    const update_user = await userService.findUserById(update_id);

    if(!update_user) {
        res.status(404).json({message: "User not found."});
        return;
    }

    if(user.userId !== update_id && user.role !== "ADMIN" ) {
        res.status(403).json({message: "You may not update this account's information."});
        return;
    }

    let result;
    if(user.role === "ADMIN") {
        result = await userService.updateAccount(update_user, req.body);
    }
    else {
        result = await userService.updateProfile(update_user, req.body.username);
    }
    if(!result) {
        res.status(400).json({message: "Failed to update account information"});
        return;
    }
    res.status(200).json({message: "Account updated successfully."});
}

async function register(req, res) { 
    const userData = await userService.registerNewUser(req.body);
    
    if(userData){
        res.status(201).json({message: `New user registered successfully${JSON.stringify(userData)}`});
    } else{
        res.status(400).json({message: "User registration failed", userData: req.body});
    }
 }



module.exports = {
    login,
    deleteAccount,
    updateProfile,
    register
}