'use strict';
const {
  model, Schema
} = require('mongoose');

const MOVIE_COLLECTION_NAME = "movies";
const MOVIE_DOCUMENT_NAME = "Movie"

const MovieSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String },
        img: { type: String },
        imgTitle: { type: String },
        imgSm: { type: String },
        trailer: { type: String },
        video: { type: String },
        year: { type: String },
        limit: { type: Number },
        genre: { type: String },
        isSeries: { type: Boolean, default: false },
        View : {type: Number, default: 0},
        Comment: {type: Array},
        Slug : {type: String},
        isFree: {type:Boolean, default: false}
      },
      { 
        timestamps: true ,
        collection: MOVIE_COLLECTION_NAME
      }
)
module.exports = model(MOVIE_DOCUMENT_NAME , MovieSchema)