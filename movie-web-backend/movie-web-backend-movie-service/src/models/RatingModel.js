'use strict';

const {
    model, Schema
} = require('mongoose');


const RATING_COLLECION_NAME = 'ratings';
const RATING_DOCUMENT_NAME = 'Rating';
const RatingSchema = new Schema({
    userId: {
        type: String , required: true
    },
    movieId: {
        type: String, required: true
    },
    ratings: { type: Number }
}, {
    collection: RATING_COLLECION_NAME,
    timestamps: true
})

module.exports = model(RATING_DOCUMENT_NAME, RatingSchema)