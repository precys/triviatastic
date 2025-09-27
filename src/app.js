const express = require('express');
const app = express();

// logger and optional middleware
const { logger, loggerMiddleware } = require('./utils/logger');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware logging every incoming request
app.use(loggerMiddleware);

// route imports
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const postRoutes = require('./routes/postRoutes');

// route hooks
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/posts', postRoutes);

// server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
