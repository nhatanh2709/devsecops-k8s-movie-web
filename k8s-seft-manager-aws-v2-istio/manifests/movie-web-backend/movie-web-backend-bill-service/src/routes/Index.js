'use strict';
const express = require('express');
const router = express.Router();
const {
    OK
} = require('../ResponseStruct/SuccessResponse');

router.use('/api/bills', require('./BillRoute/index'))

router.get('/', (req, res, next) => {
    return new OK({
        message: 'This is server3',
        result: 1
    }).send(res);
})

module.exports = router;