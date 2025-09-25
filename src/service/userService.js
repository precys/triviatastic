const userDAO = require('../repository/userDAO');
const bcrypt = require('bcrypt');
const { logger }  = require("../util/logger");

async function registerNewUser(user){
    const saltRounds = 10;
    try{
        if(!user){ //if user doesnt exist
            logger.error(`User does not exist`);
            throw new Error ("User does not exist");
        }else{
            const passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
            const newUserData = await userDAO.registerNewUser({
                userId: crypto.randomUUID(),
                username: user.username,
                passwordHash,
                role: "Player" //default to player for now
            })
            logger.info(`New user ${JSON.stringify(newUserData)} created`);
            return newUserData;
        }
    }catch(err){
        logger.error(err);
    }

}
//registerNewUser({userId: null, username:"testService1", passwordHash:"testService1Pass", role: null});

module.exports = {
    registerNewUser
}