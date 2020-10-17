const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nameSchema = new Schema({

    nameAll:{
        type: String
    },
    family:{
        type: String
    },
    title:{
        type: String
    },
    name:{
        type: String
    },
    homePhone:{
        type: String
    },
    homeMobile:{
        type: String
    },
    mobile:{
        type: String
    },
    Address:{
        type: String
    },
    father:{
        type: String
    },
    state:{
        type: String
    },
    type:{
        type: String
    },
    email:{
        type: String
    },
    note:{
        type: String
    },
});

const Name = mongoose.model('Name', nameSchema);

module.exports = Name;