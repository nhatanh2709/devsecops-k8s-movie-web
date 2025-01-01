'use strict';

const {
    CREATED, OK
} = require('../ResponseStruct/SuccessReponse');

const {
    UpdateRating,
    GetAllRating,
    GetRating
} = require('../services/RatingServices');

var that = module.exports = {
    UpdateRating: async(req, res, next) => {
        try {
            const response = await UpdateRating({
                accessToken : req.headers.token,
                rating: req.body
            })
            return new OK({
                message: 'Update Rating Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    GetAllRating: async(req, res, next) => {
        try {
            const response =await GetAllRating();
            return new OK({
                message: 'Get all ratings successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    GetRating : async(req, res, next) => {
        try {
            console.log(req.query);
            const response = await GetRating({
                email: req.query.email,
                movieId: req.query.movieId,
                accessToken: req.headers.token,

            });
            return new OK({
                message: 'Get rating movie successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    }
}