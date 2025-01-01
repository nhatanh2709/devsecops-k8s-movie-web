'use strict';

const { castObject } = require('../models/UserModel');
const {
    CREATED, OK
} = require('../ResponseStruct/SuccessReponse');

const {
    getAll,
    ChangeUser,
    findUser,
    getInfoUser,
    getUserById,
    updatePackage
} = require('../services/UserServices')

var that = module.exports = {
    ChangeUser : async(req, res, next) => {
        try {
            const data = {};;
            data.email = req.params.email;
            data.password = req.body.password ;
            data.age = req.body.age;
            data.city = req.body.city;
            data.profilePic = req.body.profilePic;
            console.log(req);
            const response = await ChangeUser(data);
            console.log(response);
            return new OK({
                message: 'Update User Successfully',
                result: response
            }).send(res);
        } catch(err) {
            console.log(err);
            next(err);
        }
        
    },
    findUser : async(req, res, next) => {
        try {
            const response = await findUser({
                email: req.params.email
            })
            return new OK({
                message: 'Find User Successfully',
                result: response
            }).send(res)
        } catch(err){
            console.log(err);
            next(err);
        }
    },
    updatePackage: async(req, res, next) => {
        try {
            const response = await updatePackage({
                UserID: req.body.userID,
                BuyPackage: req.body.BuyPackage,
                timestamp: req.body.timestamp
            })
            return new OK({
                message: 'Update Package Successfully',
                result: response
            }).send(res)
        } catch(err){
            console.log(err);
            next(err);
        }
    },
    getUserById: async(req, res, next) => {
        try {
            const response = await getUserById({
                id: req.params.id
            })
            return new OK({
                message: 'Find User Successfully',
                result: response
            }).send(res)
        } catch(err){
            console.log(err);
            next(err);
        }
    },

    getAll: async(req, res, next) => {
        try {
            const response = await getAll({
                isAdmin: req.user.isAdmin
            })
            return new OK({
                message: 'Find All User Successfully',
                result: response
            }).send(res)
        } catch(err){
            console.log(err);
            next(err);
        }
    },
    
    getInfoUser: async(req, res, next) => {
        try {

            const response = await getInfoUser({
                MovieID: req.body.MovieID,
                email: req.params.email,
                accessToken : req.headers.token
            });
            
            return new OK({
                message: 'Find Info User Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        } 
    }
}