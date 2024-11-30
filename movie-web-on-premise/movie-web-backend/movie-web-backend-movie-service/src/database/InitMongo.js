const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const ConnectionData = mongoose.connect(MONGO_URL, {

}).then(() => {
    console.log("MongoDB Connection Success");
}).catch(() => {
    console.log("MongoDB Connection Error");
})

module.exports = ConnectionData;