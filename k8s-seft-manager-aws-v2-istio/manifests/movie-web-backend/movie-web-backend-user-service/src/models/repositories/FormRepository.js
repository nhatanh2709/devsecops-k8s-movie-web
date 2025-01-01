'use strict';

const FormModel = require('../FormSchema');

var that = module.exports = {
    findFormByTitle : async({
        title = null
    }) => {
        return await FormModel.findOne({
            title: title
        })
    }
    
}