'use strict'

const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const responseTime = require('response-time');
const createError = require('http-errors');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/Index');
const {
    HelmetLog,
    ErrorLog
} = require('./config/Log');
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(responseTime());
app.use(express.urlencoded({
    extended: true
}))
app.use(morgan('dev'));
app.use(morgan('combined', {stream: HelmetLog}))
app.use('/', routes);


app.use((req, res, next) => {
    const error = new createError.NotFound();
    error.code = 404
    next(error);
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const resMessage = `${statusCode} - ${Date.now() - err.now} ms`
    ErrorLog.write(resMessage);
    return res.status(statusCode).json({
        code: err.code,
        message: err.message || new createError.InternalServerError.name.toString()
    })
})

module.exports = app;

