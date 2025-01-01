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
    SEND_MAIL_FAILED: new ErrorCode(1001, "Send mail failed", 400),
    TOKEN_UNVALID: new ErrorCode(1002, "Fobbiden", 403),
    UNAUTHETICATED: new ErrorCode(1003, "Unauthenticated", 401),
    INTERNAL_SERVER_ERROR: new ErrorCode(1004, "Internal Server Error", 500),
    KAFKA_CONSUMER_ERROR: new ErrorCode(1005, "Kafka Consummer Error", 500),
    KAFKA_PRODUCER_ERROR: new ErrorCode(1006, "Kafka Producer Error", 500),
    EMAIL_EXITED: new ErrorCode(1007, "This email has been existed", 400),
    SEND_MAIL_FAILED: new ErrorCode(1008, "Send Mail Failed", 400),
    LOGIN_FAILED: new ErrorCode(1009, "Email or Passsord not correct", 400),
    FOBBIDEN: new ErrorCode(1010, "Forbidden", 403),
    REQUIREMENT_USER: new ErrorCode(1011, "Username must have at least 3 character and no special character"),
    REQUIREMENT_PASSWORD: new ErrorCode(1012, "Password must have at least 3 character and no special character"),
    USER_NOT_FOUND: new ErrorCode(1013, "User not found", 401),
    GET_INFO_USER_FAILED : new ErrorCode(1014, "Get User Info Failed", 400),
    FIND_USER_BY_ID_FAILED: new ErrorCode(1015, "Find User By ID Failed", 400),
    
};  

module.exports = {
    errors,
    ErrorCode
}
