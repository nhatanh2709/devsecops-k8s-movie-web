'use strict';
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const {
    errors
} = require('../ResponseStruct/ErrorCode');
const RatingModel = require('../models/RatingModel');

var that = module.exports = {
    UpdateRating: async({
        accessToken = null,
        rating = []
    }) => {
        try {
            const user = await axios.get(
                `http://${process.env.USER_SERVER_HOST}:${process.env.USER_SERVER_PORT}/api/users/find/` + rating.email, {    
                    headers: {
                        token: accessToken
                    }
                }
            )
            const oldRating = await RatingModel.findOne({
                userId: user.data.result._id,
                movieId: rating.movieId
            });
            if(oldRating) {
                await RatingModel.findByIdAndDelete(oldRating._id);
            }
            const data = [];
            data.userId = user.data.result._id;
            data.movieId = rating.movieId;
            data.ratings = rating.ratings;
            const newRating = new RatingModel(data);
            await newRating.save();
            return 1;
        } catch(err) {
            throw errors.UPDATE_RATING_FAILED.getError();
        }
        
    },
    GetAllRating: async() => {
        try {
            const ratings = await RatingModel.aggregate([
                {
                    $project: {
                        userId: "$userId",
                        movieId : "$movieId",
                        rating: "$ratings",
                    }
                }
            ])
            return ratings;
        } catch(err) {
            throw errors.GET_ALL_RATING_FAILED.getError();
        }
    },
    GetRating: async({
        email = null,
        movieId = null,
        accessToken = null
    }) => {
        try {
            const user = await axios.get(
                `http://${process.env.USER_SERVER_HOST}:${process.env.USER_SERVER_PORT}/api/users/find/` + email, {    
                    headers: {
                        token: accessToken
                    }
                }
            )
            const rating = await RatingModel.findOne({
                userId: user.data.result._id,
                movieId: movieId,
            })
            return rating
        } catch(err) {
            throw errors.GET_RATING_FAILED.getError();
        }
    }
}