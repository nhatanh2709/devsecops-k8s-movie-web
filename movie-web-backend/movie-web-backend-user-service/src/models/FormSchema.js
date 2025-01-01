'use strict';

const { model , Schema } = require('mongoose');
const FORM_COLLECTION_NAME = "form";
const FORM_DOCUMENT_NAME = "Form";

const FormSchema = new Schema({
    title: {
        type: String, required: true, unique: true
    },
    description: {
        type: String, required: true
    }
}, {
    timestamps: true,
    collection: FORM_COLLECTION_NAME
})

module.exports = model(FORM_DOCUMENT_NAME, FormSchema);
