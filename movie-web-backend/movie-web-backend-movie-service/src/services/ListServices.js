'use strict';
const dotenv = require('dotenv');
dotenv.config();
const {
    errors
} = require('../ResponseStruct/ErrorCode');
const ListModel = require('../models/ListModel');
var that = module.exports = {
    CreateListMovie: async({
        isAdmin = false,
        listMovie = null
    }) => {
        if(isAdmin) {
            try {
                const newList = new ListModel(listMovie);
                await newList.save();
                return 1;
            } catch(err) {
                throw errors.CREATE_NEW_LIST_FAILED.getError();
            }
        } else {
            throw errors.FORBIDDEN.getError();
        }
    },

    DeleteListMovie: async({
        isAdmin = false,
        id = null
    }) => {
        if(isAdmin) {
            try {
                await ListModel.findByIdAndDelete(id);
                return 1;
            } catch(err) {
                throw errors.DELETE_LIST_MOVIE_FAILED.getError();
            }
        } else {
            throw errors.FORBIDDEN.getError();
        }
    },

    GetListMovie: async({
        type = null,
        genre = null
    }) => {
        try {
            let list = [];
            if (type) {
                if (genre) {
                  list = await ListModel.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: type, genre: genre } },
                  ]);
                } else {
                  list = await ListModel.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: type } },
                  ]);
                }
              } else {
                list = await ListModel.aggregate([{ $sample: { size: 10 } }]);
              }
              
            return list;
        } catch(err) {
            throw errors.GET_LIST_MOVIE_FAILED.getError();
        }
    }
}