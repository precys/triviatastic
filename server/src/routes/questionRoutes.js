const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { createQuestion, updateQuestionStatus, getQuestionsByStatus, getQuestionsByCategory, getAllUsersQuestions } = require('../controllers/questionController');


// Route middleware for every request to URLs past this point
router.use(authenticate)
// Route for question creation
router.post(`/`, createQuestion);
// Route for updating question
router.patch(`/:question_id`, updateQuestionStatus);
// Route to get all pending questions
router.get(`/status`, getQuestionsByStatus)
// Route to get questions by category
router.get('/category', getQuestionsByCategory)
// Route to get all questions made by user
router.get(`/:userId`, getAllUsersQuestions)

module.exports = router;