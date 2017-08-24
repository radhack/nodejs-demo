const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

var User = new Schema({
    company: String,
    firstname: String,
    lastname: String,
    position: String,
    email: String,
    url: {type:String, unique:true},
    primaryColor: String,
    darkColor: String,
    contentBackground: String,
    usage: [String],
    logo: String
});

module.exports = mongoose.model('User', User);
