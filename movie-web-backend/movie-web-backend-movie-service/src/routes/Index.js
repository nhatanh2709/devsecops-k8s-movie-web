'use strict';
const express = require('express');
const router = express.Router();
const {
    OK
} = require('../ResponseStruct/SuccessReponse')

router.use("/api/movies", require('./MovieRoute/index'));
router.use("/api/lists", require('./ListRoute/index'));
router.use("/api/ratings", require('./RatingRoute/index'));

router.get('/', (req ,res, next) => {
    return new OK({
        message: 'This is server2',
        result: 1
    }).send(res);
})

module.exports = router;