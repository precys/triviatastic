// Package imports
const express = require("express");
const app = express();
// Util imports
const { loggerMiddleware } = require("./utils/logger");
const { logger } = require('./utils/logger');
// Route imports
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");


const PORT = 3000;

app.use(express.json());


// Use Logger to log request
app.use(loggerMiddleware);

// Base get request
app.get("/", (req, res) =>{
    res.send("Please enter an username and password.");
})

// We hook the userRoutes to "/users"
app.use("/users", userRoutes);

// Hook questionRouts to "/"
app.use("/", questionRoutes)

// Server listening on port
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})