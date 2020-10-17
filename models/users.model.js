const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    administrator:{
        type: Boolean,
        default: false
    },
    entryPermit:{
        type: Boolean,
        default: false
    },
    allowedToEdit:{
        type: Boolean,
        default: false
    },
    allowedToDownload:{
        type: Boolean,
        default: false
    },
    rememberAccount:{
        type: Boolean,
        default: false
    },
    lastLoginDate:{
        type: String,
    },
    lastLoginTime:{
        type: String,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;