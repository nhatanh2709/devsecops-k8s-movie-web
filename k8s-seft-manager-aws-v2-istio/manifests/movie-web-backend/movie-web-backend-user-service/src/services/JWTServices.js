'use strict';

const jwt = require('jsonwebtoken');
var that = module.exports = {
    signToken : async(data) => {
        const accessToken = jwt.sign(
            data,
            process.env.SECRET_KEY,
            {
                expiresIn: "100d"
            }
        )
        console.log(accessToken);
        return accessToken;
    }
}