'use strict';

const {
    model, Schema,
} = require('mongoose');

const BILL_COLLECTION_NAME = "bills";
const BILL_DOCUMENT_NAME = "Bill";

const BillSchema = new Schema({
    name: {
        type: String, required : true, unique : true
    },
    expire: {
        type: Number, required: true,
    },
    promotion: {
        type: Number, default: 0,
    },
    desc: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    }
}, {
    collection: BILL_COLLECTION_NAME,
    timestamps: true
})

module.exports = model(BILL_DOCUMENT_NAME, BillSchema);
