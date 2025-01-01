'use strict'

const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();

const PORT = 8800
const server = app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server`));
})