// Package imports
// Util imports
const { logger } = require("../utils/logger");
const questionDAO = require("../dao/questionDAO");
const userDAO = require("../dao/userDAO")

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
async function getQuestionsByCategory(category, n, difficulty, type){
    let customQuestions = [];
    // Separate handler function to get questions from our API
    const apiQuestions= await getAPIQuestions(category, n, difficulty, type);

    // If any, get all questions from all categories, dp
    if (category == "any"){
        if(type == "any") {
            customQuestions = await questionDAO.getAllQuestionsNoType(difficulty);
        }
        else {
            customQuestions = await questionDAO.getAllQuestions(difficulty, type);
        }
    }
    else {
        if(type == "any"){
            customQuestions = await questionDAO.getAllQuestionsByCategoryNoType(category, difficulty);
        }
        else {
            customQuestions = await questionDAO.getAllQuestionsByCategory(category, difficulty, type);
        }
    }

    logger.info(apiQuestions);
    const allQuestions = [...customQuestions, ...apiQuestions];
    const allQuestionsLen = allQuestions.length

    if (n > allQuestionsLen){
        return null;
    }

    // Fischer-Yates shuffle according to the internet
    for (let i = allQuestionsLen - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions.slice(0, n);
}

// function that handles request for all pending questions
// returns: all pending questions
async function getAllPendingQuestions(){
    const questions = await questionDAO.getAllQuestionsByStatus("pending")

    // Run all user lookups concurrently
    const enrichedQuestions = await Promise.all(
        questions.Items.map(async (q) => {
        const user = await userDAO.findUserById(q.userId);
        return {
            ...q,
            username: user?.username || "Unknown",
        };
        })
    );

    return enrichedQuestions;
}

// function that handles request for all approved questions
// returns: all approved questions
async function getAllApprovedQuestions(){
    return await questionDAO.getAllQuestionsByStatus("approved");
}

// function that handles request to get all questions made by user
async function getAllUsersQuestions(userId){
    const data = await questionDAO.getAllUsersQuestions(userId)
    
    if (data)
        return data;
    else
        return null;
}

// handler function to get category id from API
async function getAPICategoryId(category){
    // Apparently category needs to be an id from there database
    const url = `https://opentdb.com/api_category.php`
    let categoryId;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Parse through the entire list of categery, id key pairs, save the id of the category name
        for (const apiCategory of data.trivia_categories){
            if (apiCategory.name.toLowerCase() == category){
                categoryId = apiCategory.id;
                break;
            }
        }
    }
    catch (err){
        logger.error(`API Request Error ${err}`)
        throw err;
    }

    return categoryId;
}

// handler function to get questions by category, type, and difficulty from API
async function getAPIQuestions(category, n, difficulty, type){
    // Build the url, given the variables
    let url = `https://opentdb.com/api.php?amount=${n}`;
    if (category !== "any"){
        url += `&category=${await getAPICategoryId(category)}`
    }
    if (difficulty !== "any"){
        url += `&difficulty=${difficulty}`
    }
    if(type !== "any") {
        url += `&type=${type}`
    }

    try {
        // fetch
        const response = await fetch(url);
        // unpack
        const data = await response.json()
        
        if (data){
            logger.info(`Successful API request | getAPIQuestions`)
            // we only want the results in this body, which holds the questions from the APi
            return data.results
        }
        else {
            logger.error(`Failed API request | getAPIQuestions`)
            return null;
        }
    }
    catch (err){
        logger.error(`API Request Error ${err}`);
        throw err;
    }

}

module.exports = {
    createQuestion,
    updateQuestionStatus,
    getAllPendingQuestions,
    getQuestionsByCategory,
    getAllUsersQuestions,
}