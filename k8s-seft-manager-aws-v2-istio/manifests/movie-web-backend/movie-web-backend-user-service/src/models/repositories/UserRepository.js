'use strict'

const UserModel = require('../UserModel');



var that = module.exports = {
    findUserByEmail : async({
        email = null
    }) => {
        return await UserModel.findOne({
            email: email
        })
        
    },

    findAllUser : async({
        
    }) => {
        return await UserModel.find();
    }
}