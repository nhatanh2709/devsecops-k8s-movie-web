'use strict';
const express = require('express');
const router = express.Router();
const {
    OK
} = require('../ResponseStruct/SuccessReponse');
router.use("/api/auth", require('./AuthRoute/index'));
router.use("/api/users", require('./UserRoute/index'));

router.get('/', (req, res, next) => {
    return new OK({
        message: 'This is server1',
        result: 1
    }).send(res);
}) 

module.exports = router;