const express = require('express');
const app = express();
const cors = require('cors');

// logger and optional middleware
const { logger, loggerMiddleware } = require('./utils/logger');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors())
app.use(cors({
  origin: "http://localhost:5173",
}));

// middleware logging every incoming request
app.use(loggerMiddleware);

app.use((req, res, next) => {
  console.log("----- DEBUG REQUEST BODY -----");
  console.log("Headers:", req.headers["content-type"]);
  console.log("Raw Body:", req.body);
  console.log("-------------------------------");
  next();
});


// Base get request
app.get("/", (req, res) =>{
    res.send("Welcome to Triviatastic API!");
})

// route imports
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const postRoutes = require('./routes/postRoutes');
const questionRoutes = require("./routes/questionRoutes");

// route hooks
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/posts', postRoutes);
app.use("/questions", questionRoutes)

// server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
