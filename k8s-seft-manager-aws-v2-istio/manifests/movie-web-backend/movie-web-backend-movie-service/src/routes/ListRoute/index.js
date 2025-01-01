'use strict';

const express = require('express');
const router = express.Router();

const {
    CreateListMovie,
    DeleteListMovie,
    GetListMovie
} = require('../../controller/ListController');

router.post('/', CreateListMovie);
router.delete('/:id', DeleteListMovie);
router.get('/', GetListMovie);

module.exports = router;
