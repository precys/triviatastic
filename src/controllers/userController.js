// Package Imports
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Service imports
const userService = require("../services/userService");


const secretKey = process.env.SECRET_KEY;

// Given a POST request for /login, log in User.
const login = async (req, res) => {
    if (userService.validateUserCredentials(req.body)){
        const { username, password } = req.body;
        const data = await userService.validateUserLogin(username, password)

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
            res.status(201).json({message:"You have logged in.", token})
        }
        else {
            res.status(403).json({message:"Invalid username or password."})
        }
    }
    else {
        res.status(403).json({message:`Username or Password cannot be blank.`});  
    }
}

module.exports = {
    login,
}