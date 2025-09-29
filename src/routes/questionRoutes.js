const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/jwt');
const { createQuestion } = require('../controllers/questionController');

// Route for question creation
router.post(`/questions`, authenticate, createQuestion);

module.exports = router;