const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());

// App routes
app.use('/api/v1/github', require('./controllers/github'));
app.use('/api/v1/cohorts', require('./controllers/cohorts'));
app.use('/api/v1/zoomrooms', require('./controllers/zoomrooms'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
