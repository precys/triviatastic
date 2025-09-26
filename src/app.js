const express = require('express');
const app = express();
const userRouter = require("./routes/userRoutes.js");

const PORT = 3000;

app.use(express.json());
app.use("/user", userRouter);

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
})