// Service imports
const questionService = require("../services/questionService");
const userService = require("../services/userService");
const { logger } = require("../utils/logger");

// createQuestion function handles the routing logic for creating a question
// args: req, res
// return: res
async function createQuestion(req, res) {
    try{
        const data = await questionService.createQuestion(req.body, req.user.userId);
        if (data){
            return res.status(201).json({message: `Successfully created question.`})
        }
        else {
            return res.status(403).json({message:"Invalid question parameters."})
        }
    }
    catch (err){
        logger.error(`Error in questionController | createQuestion | ${err}`);
        return res.status(501).json({message:`Error on server-side`});
    }
}

// function to updateQuestionStatus to the predetermined approved or denied
// normalized category and status to lowercase for consistency
// sample url: http://localhost:3000/questions/fdd12591-c0dd-4566-8872-4204dcea981c?category=art&status=approved
// query parameter can be change to approved or denied
async function updateQuestionStatus(req, res){
    // Following Hunter's admin conditional, can be a handler function due to multiple use.
    const user = await userService.findUserById(req.user.userId);
    if (user.role !== "ADMIN"){
        return res.status(403).json({message: "Forbidden access for user."});
    }

    try{
        const { status } = req.query;
        const questionId = req.params.question_id;
        const data = await questionService.updateQuestionStatus(questionId, status);

        if (data){
            logger.info(`Successful request | updateQuestionStatus | ${data}`);
            if (status.toLowerCase() == "approved"){
                return res.status(201).json({message: `Successfully update ${questionId} to ${status}`});
            }
            else if (status.toLowerCase() == "denied"){
                return res.status(201).json({message: `Deleted question ${questionId}`});
            }
        }
        else {
            return res.status(401).json({message: `Invalid question id or question is not pending.`})
        }
    }
    catch (err){
        logger.error(`Error in questionController | updateQuestionStatus | ${err}`);
        return res.status(501).json({message:`Error on server-side`});
    }
}

module.exports = {
    createQuestion,
    updateQuestionStatus,
}