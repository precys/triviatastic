const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { createQuestion } = require('../controllers/questionController');

// Route middleware for every request to URLs past this point
router.use(authenticate)
// Route for question creation
router.post(`/questions`, createQuestion);

module.exports = router;