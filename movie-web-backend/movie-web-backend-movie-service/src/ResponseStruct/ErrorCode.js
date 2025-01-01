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
    CREATE_MOVIE_FAILED: new ErrorCode(1001, "Create movie Failed", 400),
    UNAUTHENTICATED: new ErrorCode(1002, "Unauthenticated", 401),
    FORBIDDEN: new ErrorCode(1003, "Forbidden", 403),
    UPDATE_MOVIE_FAILED: new ErrorCode(1004, "Update Movie Failed", 400),
    MOVIE_NOT_FOUND: new ErrorCode(1005, "This movie not found", 400),
    TYPE_MOVIE_NOT_FOUND: new ErrorCode(1006 , "This type of movie not found", 400),
    RANDOM_MOVIE_FAILED: new ErrorCode(1007, "Random movie failed", 400),
    GET_ALL_MOVIE_FAILED: new ErrorCode(1008, "Get all movie failed", 400),
    GET_CATALOG_MOVIE_FAILED: new ErrorCode(1009, "Get Catalog of movie failed", 400),
    GET_POPULAR_MOVIE_FAILED: new ErrorCode(1010, "Get Popular Movie Failed", 400),
    GET_MOVIES_INGO_FAILED: new ErrorCode(1011, "Get movies info failed", 400),
    GET_MOST_VIEW_MOVIE_FAILED: new ErrorCode(1012, "Get most view movie failed", 400),
    POST_COMMENT_FAILED: new ErrorCode(1013, "Post New Comment Failed", 400),
    GET_COMMENT_FAILED: new ErrorCode(1014, "Get Comment Failed", 400),
    CREATE_NEW_LIST_FAILED: new ErrorCode(1015, "Create new list movie failed", 400),
    DELETE_LIST_MOVIE_FAILED: new ErrorCode(1016, "Delete List Movie Failed", 400),
    GET_LIST_MOVIE_FAILED: new ErrorCode(1017, "Get list movie failed", 400),
    UPDATE_RATING_FAILED: new ErrorCode(1018, "Update Rating failed for movie", 400),
    GET_ALL_RATING_FAILED: new ErrorCode(1019, "Get All Rating Failed", 400),
    GET_RATING_FAILED: new ErrorCode(1020, "Get Rating Errors Failed", 400),
    ELASTIC_SEARCH_CONNECTION_FAILED: new ErrorCode(1021, "Elastic Search Conneciton Failed", 400),
    ELASTIC_SEARCH_FIND_FAILED: new ErrorCode(1022, "Elastic search search text failed", 400)

};  

module.exports = {
    errors,
    ErrorCode
}
