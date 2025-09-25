const express = require('express');
const { logger } = require('./utils/logger');

const app = express();

const userController = require('./controllers/userController');

const PORT = 3000;

app.use(express.json());

app.use("/users", userController);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})