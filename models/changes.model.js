const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const changeSchema = new Schema({

    oldData:{
        type: Object,
        required: false
    },
    newData:{
        type: Object,
        required: false
    },
    dateOfChange:{
        type: String,
    },
    timeOfChange:{
        type: String,
    },
    byUser:{
        type: Object,
    },
    type:{
        type: String
    }
});

const Change = mongoose.model('Change', changeSchema);

module.exports = Change;