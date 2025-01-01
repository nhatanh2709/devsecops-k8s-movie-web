'use strict';

const UserModel = require('../models/UserModel');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const CryptoJS = require('crypto-js');
const {
    errors
} = require('../ResponseStruct/ErrorCode');

const {
    findUserByEmail,
    findAllUser
} = require('../models/repositories/UserRepository')

var that = module.exports = {
    ChangeUser : async({
        email = null,
        password = null,
        profilePic = null,
        age = null,
        city = null,
        
    }) => {
        const User = await findUserByEmail({
            email: email
        })

        let pass = User.password;
        if(password) {
            pass = CryptoJS.AES.encrypt(
                password,
                process.env.SECRET_KEY
            )
        }

        await UserModel.findByIdAndUpdate(
            User._id, 
            {
                password : password || User.password,
                profilePic: profilePic || User.profilePic,
                city: city || User.city,
                age: age || User.age
            }
        )
        return 1;
    },

    findUser : async({
        email = null
    }) => {
        try {
            const response = UserModel.findOne({
                email: email
            }).select({
                password : 0
            })
            return response
        } catch(err) {
            throw errors.USER_NOT_FOUND.getError();
        }
    },
    
    getUserById : async({
        id = null
    }) => {
        try {   
            const response = await UserModel.findById(id);
            return response;
        } catch(err) {
            throw errors.FIND_USER_BY_ID_FAILED.getError();
        }
    },

    updatePackage: async({
        UserID = null,
        BuyPackage = null,
        timestamp = null
    }) => {
        const response = await UserModel.findByIdAndUpdate(
            UserID, {
            $set: {
                BuyPackage: BuyPackage,
                ExpireDate: timestamp
            }
        })
        return response;
    },

    getAll: async({
        isAdmin = false
    }) => {
        if(isAdmin) {
            const Users = findAllUser();
            return Users;
        } else {
            throw errors.FOBBIDEN.getError();
        }
        
    },

    getInfoUser: async({
        MovieID = null,
        email = null,
        accessToken
    }) => {
            try {
                const User = await findUserByEmail({
                    email: email
                });
                console.log(email);
                const res = await axios.get(
                    `http://${process.env.MOVIE_SERVER_HOST}:${process.env.MOVIE_SERVER_PORT}/api/movies/find/` + MovieID, {
                        headers: {
                            token:  accessToken
                        }
                    }    
                )
                const Movie = res.data.result;
                if(Movie.isFree) return true;
                if(!User.BuyPackage) {
                    return false;
                }
                const timestamp = new Date();
                if(User.ExpireDate === undefined || User.ExpireDate === null) {
                    return false
                }
    
                const lastBuy = new Date(User.ExpireDate);
                
                if(timestamp < lastBuy) {
                    return true;
                }
                else return false;
            } catch(err) {
                throw errors.GET_INFO_USER_FAILED.getError();
            }
    }
}



