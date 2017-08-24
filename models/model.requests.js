const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

var Request = new Schema({
    requestId: String,
    company: String,
    createdat: Number,
    url: String
});

module.exports = mongoose.model('Request', Request);
