'use strict';

const dotenv = require('dotenv');
dotenv.config();

const Joi = require('joi');
const Schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email : Joi.string().email().optional()
})

module.exports = Schema