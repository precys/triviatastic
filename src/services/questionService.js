c// Package imports
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
            throw new Error(`Question: ${questionItem} does not exist`);
        }
        else {
            const { type, difficulty, category, question, correct_answer, incorrect_answers} = questionItem
            const newQuestion = {
                PK: `CATEGORY${category}`,
                SK: `CUSTOM`,
                userId,
                type,
                difficulty,
                question,
                correct_answer,
                incorrect_answers,
                createdAt: new DataTransfer().toISOString(),
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

module.exports = {
    createQuestion,
}