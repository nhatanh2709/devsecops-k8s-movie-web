'use strict'

class ErrorCode {
    constructor(code, message, statusCode) {
        
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.now = Date.now();
        
    }
    
    getError(){
        return ({
            code : this.code,
            message: this.message,
            statusCode: this.statusCode,
            now: this.now
        }); 
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }

    getStatusCode() {
        return this.getStatusCode;
    }
}



const errors = {
   FAILED_CONNECTION_SERVER_1: new ErrorCode(1001, "Connection to Server 1 Failed", 500),
   FAILED_CONNECTION_SERVER_2: new ErrorCode(1002, "Connection to Server 2 Failed", 500),
   FAILED_CONNECTION_SERVER_3: new ErrorCode(1003, "Connection to Server 3 Failed", 500),
   FAILED_CONNECTION_SERVER_4: new ErrorCode(1004, "Connection to Server 4 Failed", 500),
   FAILED_CONNECTION_SERVER_5: new ErrorCode(1005, "Connection to Server 5 Failed", 500)
};  

module.exports = {
    errors,
    ErrorCode
}
