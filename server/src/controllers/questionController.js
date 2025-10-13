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
// normalized status to lowercase for consistency
// sample url: http://localhost:3000/questions/4f4b7bbd-8bbe-46ea-9dc9-73ccaa85cb5f?status=denied
// query parameter can be change to approved or denied
async function updateQuestionStatus(req, res){
    if (!(await isAdmin(req.user.userId))){
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
            return res.status(404).json({message: `Invalid question id, question is not pending, or invalid status to change.`})
        }
    }
    catch (err){
        logger.error(`Error in questionController | updateQuestionStatus | ${err}`);
        return res.status(501).json({message:`Error on server-side`});
    }
}

// route function to handle request for all pending questions
// User must be ADMIN
async function getQuestionsByStatus(req, res){
    if (!(await isAdmin(req.user.userId))){
        return res.status(403).json({message: "Forbidden access for user."});
    }

    try {
        const { status } = req.query;
        let data;

        if (status == "pending"){
            data = await questionService.getAllPendingQuestions();
        }

        if (data){
            logger.info(`Success | getQuestionByStatus | ${JSON.stringify(data)}`);
            return res.status(201).json({message:`[${data.length}] ${status} questions: `, questions: data})
        }

    }
    catch (err) {
        logger.error(`Error in questionController | getQuestionsByStatus | ${err}`)
        return res.status(501).json({message:`Server-side error.`})
    }
}

// route function to handle requests for custom questions
// sample url: http://localhost:3000/questions/category?category=art&n=4&difficulty=medium&type=multiple
// URL CAN NOW TAKE TYPE AND DIFFICULTY QUERY PARAMETERS, the only NECESSARY parameters the url needs is n, and category, and type.
// no difficulty defined means that it will not filter for difficult i.e questions will be of all difficulties.
async function getQuestionsByCategory(req, res){
    if ((await isAdmin(req.user.userId))){
        return res.status(403).json({message: "Forbidden access for user."});
    }

    try {
        const { category, n, difficulty, type } = req.query;

        if (!category){
            return res.status(404).json({message:`Please enter a category`});
        }
        if (!type){
            return res.status(404).json({message:`Please enter a type`});
        }
        if (!n){
            return res.status(404).json({message:`Please enter a number`});
        }
        
        const data = await questionService.getQuestionsByCategory(category, n, difficulty, type)

        if (!data){
            logger.error(`Client requested number of questions greater than what is stored.`)
            res.status(404).json({message:`Please request a valid number of questions.`})
        }
        else {
            logger.info(`Success | getQuestionByCategory | ${JSON.stringify(data.Items)}`);
            return res.status(201).json({message:`Custom questions in ${category}:`, questions: data})
        }

    }
    catch (err) {
        logger.error(`Error in questionController | getQuestionsByCategory | ${err}`)
        return res.status(501).json({message:`Server-side error.`})
    }
}

// route function to handle get requests for all questions made by user
async function getAllUsersQuestions(req, res){
    const { userId } = req.params
    if (!userId) return res.status(405).json({message:`Invalid userId`})
    
    try {
        const data = await questionService.getAllUsersQuestions(userId)

        if (data){
            return res.status(201).json({message:`User's Questions ${data.length}: `, questions: data})
        }
        else {
            return res.status(405).json({message:`Request failed.`})
        }
    }
    catch (err){
        logger.error(`Error questionController | getAllUsersQuestions | ${err}`)
        return res.status(404).json({message:`Server-side error.`})
    }

}

// handler function to check to user currently logged is of ADMIN role
// args: userId
// return: boolean
async function isAdmin(userId){
    const user = await userService.findUserById(userId);
    // return true if user is ADMIN, false if not.
    return user.role === "ADMIN"
}

module.exports = {
    createQuestion,
    updateQuestionStatus,
    getQuestionsByStatus,
    getQuestionsByCategory,
    getAllUsersQuestions,
}