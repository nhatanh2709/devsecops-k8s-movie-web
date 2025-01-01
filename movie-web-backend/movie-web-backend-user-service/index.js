'use strict';

const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();

const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log(`Server 1 is running at ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server`))
})