const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { createQuestion } = require('../controllers/questionController');
const { updateQuestionStatus } = require('../dao/questionDAO');

// Route middleware for every request to URLs past this point
router.use(authenticate)
// Route for question creation
router.post(`/questions`, createQuestion);
// Route for updating question
router.patch(`/questions/:question_id`, updateQuestionStatus);

module.exports = router;