'use strict';

const {
    CREATED , OK
} = require('../ResponseStruct/SuccessReponse');

const {
    CreateListMovie,
    DeleteListMovie,
    GetListMovie
} = require('../services/ListServices');

var that = module.exports = {
    CreateListMovie: async(req, res, next) => {
        try {
            const response = await CreateListMovie({
                isAdmin: req.user.isAdmin,
                listMovie: req.body
            });
            return new CREATED({
                message: 'Created new list successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    DeleteListMovie: async(req, res, next) => {
        try {
            const response = await DeleteListMovie({
                isAdmin: req.user.isAdmin,
                id: req.params.id
            })
            return new OK({
                message: 'Delete list movie successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    GetListMovie: async(req, res , next) => {
        try {
            const response = await GetListMovie({
                type: req.query.type,
                genre : req.query.genre
            })
            return new OK({
                message: 'Get List Movie successully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    }
}