// Package imports
const uuid = require("uuid");
// Util imports
const { logger } = require("../utils/logger");
const questionDAO = require("../dao/questionDAO");

// function that parses through the request.body as questionItem
// args: questionItem (resp.body), userId
// return: question, success message
async function createQuestion(questionItem, userId){
    try{
        if (!questionItem){
            logger.error(`Error in questionService | createQuestion | questionItem is undefined`);
            throw new Error(`Sent Question: ${questionItem} does not exist`);
        }
        else {
            // Might need to add an if-conditional to check of edge cases on blank fields.
            const {
                type,
                difficulty, 
                category, 
                question, 
                correct_answer, 
                incorrect_answers
            } = questionItem;

            const questionId = crypto.randomUUID();

            const newQuestion = {
                PK: `CATEGORY#${category}`,
                SK: `QUESTION#${questionId}`,
                questionId,
                userId,
                type,
                difficulty,
                question,
                correct_answer,
                incorrect_answers,
                status: "pending",
                createdAt: new Date().toISOString(),
            }

            const data = await questionDAO.createQuestion(newQuestion);
            logger.info(`Created new question: ${JSON.stringify(data)}`);
            return data;
        }
    }
    catch (err){
        logger.error(`Error in questionService | createQuestion | ${err}`);
        return null;
    }
}

// function that updates a pending Question
// if approved, update status
// if denied, delete question element
// args: questionId, category
// returns: question data
async function updateQuestionStatus(questionId, status){
    try{
        const question = await questionDAO.getQuestionById(questionId);
        console.log(question)
        if (question.status != "pending"){
            console.log(status)
            logger.error(`Question is not pending`)
            return null;
        }

        console.log(status)

        if (status.toLowerCase() == "approved"){
            if (question){
                const data = await questionDAO.updateQuestionStatus(question, status.toLowerCase());
                return data;
            }
            else{
                logger.error(`Question does not exist`);
                return null;
            }

        }
        else if (status.toLowerCase() == "denied"){
            console.log("HERE");
            const data = await questionDAO.deleteQuestion(question);
            return data;
        }
        else {
            logger.error("Invalid status to update.");
            return null;
        }

    }
    catch (err){
        logger.error(`Error in questionService | updateQuestionStatus | ${err}`);
        return null;
    }

}

module.exports = {
    createQuestion,
    updateQuestionStatus,
}