// Package imports
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

            if (type == null || difficulty == null || category == null || question == null || correct_answer == null || incorrect_answers == null){
                throw new Error(`type, difficulty, category, question, correct_answer, and incorrect_answers cannot be blank`)
            }

            const questionId = crypto.randomUUID();

            const newQuestion = {
                PK: `CATEGORY#${category}`,
                SK: `QUESTION#${questionId}`,
                category,
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
// args: questionId
// returns: question data
async function updateQuestionStatus(questionId, status){
    try{
        const question = await questionDAO.getQuestionById(questionId);

        if (question.status != "pending"){
            logger.error(`Question is not pending`)
            return null;
        }

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

// function that handles requests for number of custom questions by category
// args: category, n (number of questions)
// return: list of questions of n amount
async function getQuestionsByCategory(category, n){
    const questions = await questionDAO.getAllQuestionsByCategory(category);

    if (n > questions.length){
        return data = {error:`Number of questions requested is greater than questions stored. Currently, only ${questions.length} in the ${category} category exists.`}
    }

    // Fischer-Yates shuffle according to the internet
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions.slice(0, n);
}

// function that handles request for all pending questions
// returns: all pending questions
async function getAllPendingQuestions(){
    return await questionDAO.getAllQuestionsByStatus("pending");
}

// function that handles request for all approved questions
// returns: all approved questions
async function getAllApprovedQuestions(){
    return await questionDAO.getAllQuestionsByStatus("approved");
}

module.exports = {
    createQuestion,
    updateQuestionStatus,
    getAllPendingQuestions,
    getQuestionsByCategory,
}