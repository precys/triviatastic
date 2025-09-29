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

// function to updateQuestionStatus to the predetermined approved or denied
// normalized category and status to lowercase for consistency
// sample url: http://localhost:3000/questions/fdd12591-c0dd-4566-8872-4204dcea981c?category=art&status=approved
// query parameter can be change to approved or denied
async function updateQuestionStatus(req, res){
    try{
        const { category, status } = req.query;
        const questionId = req.params.question_id;
        const data = await questionService.updateQuestionStatus(questionId, category, status);

        if (data){
            logger.info(`Successful request | updateQuestionStatus | ${data}`);
            if (status.toLowerCase() == "approved"){
                res.status(201).json({message: `Successfully update ${questionId} to ${status}`});
            }
            else if (status.toLowerCase() == "denied"){
                res.status(201).json({message: `Deleted question ${questionId}`});
            }
        }
    }
    catch (err){
        logger.error(`Error in questionController | updateQuestionStatus | ${err}`);
        res.status(501).json({message:`Error on server-side`});
    }
}

module.exports = {
    createQuestion,
    updateQuestionStatus,
}