const express = require('express');
const app = express();
const logger = require('./utils/logger');

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
