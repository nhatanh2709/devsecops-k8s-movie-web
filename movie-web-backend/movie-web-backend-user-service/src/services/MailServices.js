'use strict'

const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { errors } = require('../ResponseStruct/ErrorCode');

const CLIENT_ID = process.env.CLIENT_ID ;
const CLIENT_SECRET = process.env.CLIENT_SECRET ;
const REDIRECT_URL = process.env.REDIRECT_URI ;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN ;

let oauth2Client ;
try {
    oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
} catch(err) {
    console.log(err);
}

const sendMail = async({
    email = null,
    msg = null
}) => {
    try {
        console.log(email);
        const accessToken = await oauth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.ADMIN_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                acceessToken : accessToken
            }
        })
        const info = await transporter.sendMail({
            from: process.env.ADMIN_MAIL,
            to: email,
            subject: "Email Verification Success Register",
            html: msg,
        });
        return 1;

    } catch(err){
        console.log(err);
        throw errors.SEND_MAIL_FAILED.getError();
    }
}

module.exports = {
    sendMail
}

