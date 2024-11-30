'use strict';

const BillModel = require('../models/BillModel');
const dotenv = require('dotenv');
const CryptoJS = require("crypto-js");
const moment = require("moment");
const axios = require('axios');
dotenv.config();
const {
    errors
} = require('../ResponseStruct/ErrorCode');

const config = {
    app_id : process.env.APP_ID,
    key1: process.env.KEY_1,
    key2: process.env.KEY_2,
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
}

async function updateUserPackage(userID, PackageID) {
    try {
        const Package = await BillModel.findById(PackageID);
        const expire = Package.expire;
        const promotion = Package.promotion;
        const user = await axios.get(
            `http://${process.env.USER_SERVER_HOST}:${process.env.USER_SERVER_PORT}/api/users/get/` + userID
        )
        const userBuyPackage = user.data.result._id;
        let info;
        let timestamp = new Date();
        timestamp.setMonth(timestamp.getMonth() + expire + promotion);
        if (userBuyPackage.BuyPackage) {
            const LastBuy = userBuyPackage.ExpireDate;
            const newExpire = new Date(LastBuy);
            newExpire.setMonth(newExpire.getMonth() + expire + promotion);

            if (timestamp < newExpire) {
                timestamp = newExpire;
            }
        }
        const response = await axios.post(
            `http://${process.env.USER_SERVER_HOST}:${process.env.USER_SERVER_PORT}/api/users/update`,
            {
                userID: userID,
                BuyPackage: true,
                ExpireDate: timestamp
            })
        return 1;

    } catch (err) {
        throw errors.UPDATE_PACKAGE_FAILE.getError();
    }
}

module.exports = {
    getAllBill: async() => {
        try {
            const allBills = await BillModel.find();
            return allBills
        } catch(err) {
            throw errors.FIND_ALL_BILL_FAILED.getError();
        } 
    },

    getPackageBill : async({
        PackageID = null
    }) => {
        try {
            const Package = await BillModel.findById(PackageID);
            return Package;
        } catch(err) {
            throw errors.GET_PACKAGE_FAILED.getError();
        }
    },

    newPayment: async({
        email = null,
        PackageID = null,
        accessToken = null
    }) => {
        try {
            const user = await axios.get(
                `http://${process.env.USER_SERVER_HOST}:${process.env.USER_SERVER_PORT}/api/users/find/` + email, {    
                    headers: {
                        token: accessToken
                    }
                }
            )
            const embed_data = {
                redirecturl: process.env.APP_URL
            };;
            const items = [{
                UserID: user.data.result._id,
                PackageID: PackageID,
            }];
            const Package = await BillModel.findById(PackageID);
            const amount = Package.price;
            const transID = Math.floor(Math.random() * 1000000);
            const order = {
                app_id: config.app_id,
                app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: "user123",
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: amount,
                description: `Movie Web Tranfer for the order #${transID}`,
                bank_code: "",
                callback_url: "https://jsserver-pi25.onrender.com/api/bills/callback"
            };
            const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
            order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
            const result = await axios.post(config.endpoint, null, { params: order });
            return result.data
        } catch(err) {
            throw errors.PAYMENT_FAILED.getError();
        }
    },
    callBackPayment : async({
        data = null,
        mac = null
    }) => {
        try {
            let dataStr = data;
            let reqMac = mac;
            let Mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            let result = {};
            if (reqMac !== Mac) {
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                let dataJson = JSON.parse(dataStr, config.key2);
                const data = JSON.parse(dataJson["item"]);
                result.return_data = data;
                updateUserPackage(data[0]["UserID"], data[0]["PackageID"])
            }
            return result;
        } catch(err) {
            throw errors.TRANSFER_MONEY_FAILED.getError();
        }
    }
}

