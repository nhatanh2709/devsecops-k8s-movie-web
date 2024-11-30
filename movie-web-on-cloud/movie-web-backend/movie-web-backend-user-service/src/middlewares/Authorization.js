const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { errors } = require('../ResponseStruct/ErrorCode');
const publicRoutes = [
    '/api/auth/register', 
    '/api/auth/login',
    '/api/auth/forgotPassword' ,         
];

const verifyToken =  (req, res , next) => {
    const authHeader = req.headers.token;
    try {
        if(publicRoutes.includes(req.originalUrl) || req.originalUrl.startsWith('/api/users/get') || req.originalUrl.startsWith('/api/users/update')) {
            console.log(1);
            return next();
        }
        if(authHeader) {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
                if(err) {
                    throw errors.TOKEN_UNVALID.getError();
                }
                req.user = user;
                return next();
            })
        } else {
            throw errors.UNAUTHETICATED.getError();
        }
    } catch(err) {
        next(err);
    }
}

module.exports = verifyToken;