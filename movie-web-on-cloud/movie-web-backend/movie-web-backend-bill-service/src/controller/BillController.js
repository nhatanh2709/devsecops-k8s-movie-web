'use strict';

const {
    CREATED, OK
} = require('../ResponseStruct/SuccessResponse');

const {
    getAllBill,
    getPackageBill,
    newPayment
} = require('../services/BillServices');

var that = module.exports = {
    getAllBill: async(req, res, next) => {
        try {
            const response = await getAllBill();
            return new OK({
                message: 'Get all bill successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    getPackageBill: async(req, res, next) => {
        try {
            const response = await getPackageBill({
                PackageID: req.params.id
            });
            return new OK({
                message: 'Get Package Successfully', 
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    newPayment : async(req, res, next) => {
        try {
            const response = await newPayment({
                email: req.body.email,
                PackageID: req.body.PackageID,
                accessToken: req.headers.token
            });
            return new CREATED({
                message: 'Create new payment successfully', 
                result: response,
                
            }).send(res);
        } catch(err) {
            next(err);
        }
    }
}