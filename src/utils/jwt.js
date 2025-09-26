
const jwt = require("jsonwebtoken");
const {logger} = require("./logger");

const secretKey = "my-secret-key";

async function authenticate(req, res, next){
    // Authorization: "Bearer tokenstring"

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        res.status(400).json({message: "forbidden access"});
    }else{
        const user = await decodeJWT(token);
        if(user){
            req.user = user; // You generally should not modify the incoming req
            req.token = token;
            logger.info(`Successful access protected route.`)
            next();
        }else{
            logger.error(`Invalid JWT Token.`)
            res.status(400).json({message: "Bad JWT"});
        }
    }
}

async function decodeJWT(token){
    try{
        const user = await jwt.verify(token, secretKey);
        return user;
    }catch(err){
        logger.error(`Error in decoding token: ${err}`);
        return null;
    }
}

module.exports = {
    authenticate,
    decodeJWT
}

