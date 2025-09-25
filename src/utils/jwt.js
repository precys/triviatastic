const jwt = require('jsonwebtoken');
const {logger} = require("./logger.js");

const secretKey = "my-secret-key";

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    logger.info("Authenticating Token");

    if(!token) {
        logger.warn("Forbidden Access");
        res.status(400).json({content: null, error: "Forbidden Access"});
        return;
    }

    const user = await decodeJWT(token);
    if(!user) {
        logger.warn("Invalid Token");
        res.status(400).json({content: null, error: "Invalid Token"});
    }
    else {
        logger.info("Login Successfully Authenticated");
        req.user = user;
        next();
    }

}

async function decodeJWT(token){
    try{
        const user = await jwt.verify(token, secretKey);
        return user;
    }catch(error){
        logger.error(error);
        return null;
    }
}

module.exports = {
    authenticateToken
}
