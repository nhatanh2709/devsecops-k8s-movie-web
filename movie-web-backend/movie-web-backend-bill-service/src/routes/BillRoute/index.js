'use strict';

const express = require('express');
const router = express.Router();

const {
    getAllBill,
    getPackageBill,
    newPayment
} = require('../../controller/BillController');

router.get('/getAll', getAllBill);
router.get('/getPackage/:id',getPackageBill);
router.post('/payment', newPayment);
module.exports = router