const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');
dotenv.config();
const {
    errors
} = require('../ResponseStruct/ErrorCode');

const {
    findUserByEmail
} = require('../models/repositories/UserRepository');

const {
    KafkaProducer
} = require('../services/KafkaProducer');

const {
    findFormByTitle
} = require('../models/repositories/FormRepository');

const Joi = require('../config/Requirement');


var that = module.exports = {
    Register : async({
        username = null,
        password = null,
        email = null
    }) => {

        const {
            error , value
        } = Joi.validate({
            username,
            password
        })

        if (error) {
            error.details.forEach(err => {
                if (err.context.key === 'username') {
                    throw errors.REQUIREMENT_USER.getError();
                } else if (err.context.key === 'password') {
                    throw errors.REQUIREMENT_PASSWORD.getError();
                }
            });
        }

        const existedUser = await findUserByEmail({
            email: email
        })

        if(existedUser) {
            throw errors.EMAIL_EXITED.getError();
        }
        
        const newUser = new UserModel({
            username: username,
            email: email,
            password: CryptoJS.AES.encrypt(
                password,
                process.env.SECRET_KEY
            ).toString()
        })

        try {
            const Form = await findFormByTitle({
                title: "Welcome"
            })
            
            await KafkaProducer({
                email: email,
                msg: `${Form.description}`
            })
        } catch(err){
            throw errors.SEND_MAIL_FAILED.getError();
        }
        newUser.verify = true;
        const User = await newUser.save();
        return 1;
    },

    Login: async({
        email = null,
        password = null
    }) => {
        const User = await findUserByEmail({
            email: email
        })
        if(!User) {
            throw errors.LOGIN_FAILED.getError();
        }
        
        const bytes = CryptoJS.AES.decrypt(User.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        
        if (originalPassword !== password) {
            throw errors.LOGIN_FAILED.getError();
        }

        const accessToken = jwt.sign(
            { id: User._id, isAdmin: User.isAdmin },
            process.env.SECRET_KEY,
            {
                expiresIn: "100d"
            }
        )

        const response = await UserModel.findOne({
            email: email
        }).select({
            _id: 0,
            password: 0,
            
        })
    
        //console.log(response);
        const responseDoc = response._doc;

        return {
            ...responseDoc,
            accessToken: accessToken
        }
    },

    ForgotPassowrd : async({
        email = null,
        password = null
    }) => {
        const User = await findUserByEmail({
            email: email
        })
        if(!User) {
            throw errors.UNAUTHETICATED.getError();
        }
        const newPassword = password;
        const encryptPassword = CryptoJS.AES.encrypt(
            newPassword,
            process.env.SECRET_KEY
        ).toString();
        await UserModel.findByIdAndUpdate(
            User._id,
            { 
                password: encryptPassword
            }
        ) 
        return 1;
    }
}