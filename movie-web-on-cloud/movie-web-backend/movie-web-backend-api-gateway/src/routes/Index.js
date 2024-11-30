'use strict'
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {
    createProxyMiddleware , fixRequestBody
} = require('http-proxy-middleware');
const httpProxy = require('express-http-proxy');
const { errors } = require('../ResponseStruct/ErrrorCode');
dotenv.config();


const server1 = `http://${process.env.SERVER_1_HOST}:${process.env.SERVER_1_PORT}`;
const server2 = `http://${process.env.SERVER_2_HOST}:${process.env.SERVER_2_PORT}`;
const server3 = `http://${process.env.SERVER_3_HOST}:${process.env.SERVER_3_PORT}`;

router.use('/service1', httpProxy(server1));
router.use('/service2', httpProxy(server2));
router.use('/service3', httpProxy(server3));

router.get('/', (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        message: 'This is my home'
    })
})

module.exports = router;