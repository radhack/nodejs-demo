const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

var Request = new Schema({
    requestId: String,
    title: String,
    original_title: String,
    subject: String,
    message: String,
    category: String,
    createdat:Number
});

var Template = new Schema({
    templateId:String,
    category:String,
    name:String,
    createdat:Number,
    filename: String,
    finalized:{type:Boolean, default:false}
}, {_id:false, strict:false});

var Entity = new Schema({
    company: String,
    firstname: String,
    lastname: String,
    position: String,
    email: String,
    client_id:String,
    url: {type:String, unique:true},
    primaryColor: String,
    darkColor: String,
    contentBackground: String,
    usage: [String],
    logo: String,
    templates:[Template],
    requests:[Request]
});

module.exports = mongoose.model('Entity', Entity);
