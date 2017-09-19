const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

var Template = new Schema({
    templateId:String,
    category:[String],
    name:String,
    filename:String,
    createdat:Number,
    finalized:{type:Boolean, default:false}
}, {_id:false, strict:false});

var Default = new Schema({
    _id: String,
    embeddedTemplate:Template,
    mergeTemplate:Template,
    templates: [Template]
});

var defaults = mongoose.model('Default', Default);

defaults.findOne({_id:'defaultSettings'}, function(err, doc){
    if(err)
        console.log(err);
    if(!doc){

        var initTemplates = new defaults({
            _id:'defaultSettings',
            mergeTemplate:{
                templateId:'d89b39bd48d91a493286c961aafe69323b86a0d2',
                //templateId:'467a06a019637c331ca609a7763ff826674da496',
                category:[],
                name:'Updated Employee Agreement',
                filename:'employment-agreement-updated.pdf',
                finalized:true
            },
            embeddedTemplate:{
                templateId:'61176360f7b40a5d019478ca7bb9cfa5fccf718e',
                category:[],
                name:'Embedded Mutual NDA',
                filename:'mutual-nda-with-date.pdf',
                finalized:true
            },
            templates:[
                {
                    templateId:'9479d44d23f653e105bc52c98560ed46aff9d216',
                    category:['hr','legal'],
                    name:'Vendor Agreement',
                    filename:'vendor_agreement.pdf',
                    finalized:true
                },
                {
                    templateId:'1e750f957431c310a4439acfbbe6831c1408d26f',
                    category:['realestate'],
                    name:'Commercial Lease',
                    filename:"commercial-lease.pdf",
                    finalized:true
                },
                {
                    templateId:'185d012a12b5351efb7d176f4f3db5ae36e96c11',
                    category:['realestate'],
                    name:'Purchase Agreement',
                    filename:"purchase-agreement.pdf",
                    finalized:true
                },
                {
                    templateId:'fef256fc72fc9e174d72c521819c0aa53c1c1014',
                    category:['legal'],
                    name:'Stock Option Agreement',
                    filename:"stock_option_agreement.pdf",
                    finalized:true
                },
                {
                    templateId:'95f85e828cc1b48208eb4a72f8870ca1aeab80c0',
                    category:['hr'],
                    name:'Form W-4',
                    filename:'w4.pdf',
                    finalized:true
                },
                {
                    templateId:'85ce83ba46920f9d8114397744926cef9065f07b',
                    category:['hr'],
                    name:'Form W-9',
                    filename:'w9.pdf',
                    finalized:true
                },
                {
                    templateId:'8f8da155b8a229b83e5bc7faf2c8f77d669d6c58',
                    category:['hr','legal'],
                    name:'Subcontractor Agreement',
                    filename:'sub_contractor.pdf',
                    finalized:true
                },
                {
                    templateId:'c5961859652155b952d0479d5a083bb9acae2e6d',
                    category:['hr','legal'],
                    name:'Mutual NDA',
                    filename:"mutual-nda-with-date.pdf",
                    finalized:true
                }
            ]
        });

        initTemplates.save();

    }
});

module.exports = defaults;