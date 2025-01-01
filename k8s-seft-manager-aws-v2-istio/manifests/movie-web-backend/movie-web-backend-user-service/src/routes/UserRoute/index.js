'use strict';

const express = require('express');
const router = express.Router();

const {
    getAll ,
    findUser,
    ChangeUser,
    getInfoUser,
    getUserById,
    updatePackage
} = require('../../controller/UserController');

router.put('/change/:email', ChangeUser);
router.get('/find/:email', findUser);
router.get('/get/:id', getUserById);
router.post('/update', updatePackage);
router.get('/', getAll);
router.post('/info/:email', getInfoUser);

module.exports = router;