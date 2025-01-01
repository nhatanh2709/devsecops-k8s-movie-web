'use strict';

const {model, Schema} = require('mongoose');
const USER_COLLECTION_NAME = "users";
const USER_DOCUMENT_NAME = "User";


const UserSchema = new Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      profilePic: { type: String, defaut: "" },
      isAdmin: { type: Boolean, default: false },
      verify: { type: Boolean, default: false },
      FavouriteMovie: {type : Array},
      age: {type: String},
      city: { type: String },
      BuyPackage: {type: Boolean, default: false},
      ExpireDate: {type: String},
    },
    { 
        timestamps: true,
        collection: USER_COLLECTION_NAME
    }
);

module.exports =  model(USER_DOCUMENT_NAME, UserSchema)
