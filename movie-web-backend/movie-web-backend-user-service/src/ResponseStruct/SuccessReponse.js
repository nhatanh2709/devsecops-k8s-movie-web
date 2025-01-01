'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const Message = {
    OK: 'Success',
    CREATED: 'Created!',
}

class SuccesResponse  {
    constructor({ statusCode = StatusCode.OK , code = 1000 , message = Message.OK , result = {}})
    {
        this.statusCode = statusCode;
        this.code = code ;
        this.message = message ;
        this.result = result
    }

    send(res, headers = {}) {
        return res.status(this.statusCode).json({
            code: this.code,
            message: this.message,
            result: this.result
        })
    }
}

class OK extends SuccesResponse {
    constructor({ message = Message.OK ,result = {}}) {
        super({message,result})
    }
}

class CREATED extends SuccesResponse {
    constructor({statusCode = StatusCode.CREATED,  message = Message.CREATED, result = {}}){
        super({statusCode, message,result});
    }
}

module.exports = {
    OK, CREATED
}