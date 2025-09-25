const express = require('express')
const router = express.Router();
const userService = require("../services/userService");

router.post("/register", async (req, res) => { //register/post a new user
    const userData = await userService.registerNewUser(req.body);
    if(userData){
        res.status(201).json({message: `New user registered successfully${JSON.stringify(userData)}`});
    } else{
        res.status(400).json({message: "User registration failed", userData: req.body});
    }
})

module.exports = router;
