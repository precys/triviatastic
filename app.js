const express = require('express');
const { logger } = require('./src/util/logger');

const app = express();

const userController = require('./src/controller/userController');

const PORT = 3001;//change to 3000 later

app.use(express.json());

app.use("/users", userController);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})