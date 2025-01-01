'use strict';

const express = require('express');
const router = express.Router();
const {
    Register , Login , ForgotPassowrd
} = require('../../controller/AuthController');

router.post('/register', Register);
router.post('/login', Login);
router.post('/forgotPassword', ForgotPassowrd);

module.exports = router;