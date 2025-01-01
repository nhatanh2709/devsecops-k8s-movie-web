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
    FIND_ALL_BILL_FAILED: new ErrorCode(1001, "Find all bill errors failed", 400),
    UNAUTHENTICAED: new ErrorCode(1002, "Unauthenticated", 402),
    FORBIDDEN : new ErrorCode(1003, "Forbiddeen", 403),
    GET_PACKAGE_FAILED: new ErrorCode(1004, "Get Package Bill Failed", 400),
    PAYMENT_FAILED: new ErrorCode(1005, "Payment for product failed", 400),
    TRANSFER_MONEY_FAILED: new ErrorCode(1006, "Transfer Money Failed", 400),
    UPDATE_PACKAGE_FAILE: new ErrorCode(1007, "Update Package Failed", 400)
};  

module.exports = {
    errors,
    ErrorCode
}
