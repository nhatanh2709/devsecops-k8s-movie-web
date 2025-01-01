'use strict';

const {
    CREATED, OK
} = require('../ResponseStruct/SuccessReponse');

const {
    Register, Login , ForgotPassowrd
} = require('../services/AuthServices');
var that = module.exports = {
    Register : async(req, res, next) => {
        try {
            const response = await Register(req.body);
            return new CREATED({
                message: 'Create User Success',
                result: response
            }).send(res);
        } catch(err) {
            console.log(err);
            next(err);
        }
    },

    Login: async(req, res, next) => {
        try {
            const response = await Login(req.body);
            return new OK({
                message: 'Login Success',
                result: response
            }).send(res);
        } catch(err) {
            console.error(err);
            next(err);
        }
    },

    ForgotPassowrd: async(req, res, next) => {
        try {
            const response = await ForgotPassowrd(req.body);
            return new OK({
                message: 'Change Password Success',
                result: response
            }).send(res)
        } catch(err) {
            console.error(err);
            next(err);
        }
    }
}
