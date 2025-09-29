//require("dotenv").config();
// Service imports
const questionService = require("../services/questionService");
const { logger } = require("../utils/logger");

// createQuestion function handles the routing logic for creating a question
// args: req, res
// return: res
async function createQuestion(req, res) {
    try{
        const data = await questionService.createQuestion(req.body, req.user.userId);
        if (data){
            res.status(201).json({message: `Successfully created question.`})
        }
        else {
            res.status(403).json({message:"Invalid question parameters."})
        }
    }
    catch (err){
        logger.error(`Error in questionController | createQuestion | ${err}`);
        res.status(501).json({message:`Error on server-side`});
    }
}

module.exports = {
    createQuestion,
}