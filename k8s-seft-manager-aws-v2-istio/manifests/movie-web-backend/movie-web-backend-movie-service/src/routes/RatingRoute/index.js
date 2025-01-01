'use strict';

const express = require('express');
const router = express.Router();
const {
    UpdateRating,
    GetAllRating,
    GetRating
} = require('../../controller/RatingController');

router.post('/', UpdateRating);
router.get('/getAll', GetAllRating);
router.get('/', GetRating);
module.exports = router;