'use strict';
const { model, Schema } = require('mongoose');
const LIST_COLLECTION_NAME = 'lists'
const LIST_DOCUMENT_NAME = "List"


const ListModel = new Schema(
    {
        title: { 
            type: String , required: true, unique: true
        },
        type: { type: String },
        genre: { type: String },
        contet: { type: Array }
    }, {
        collection: LIST_COLLECTION_NAME,
        timestamps: true
    } 
)

module.exports = model(LIST_DOCUMENT_NAME, ListModel);