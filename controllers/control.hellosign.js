var hellosign = require('hellosign-sdk')({key: config.hellosignKey});
var entity = require('../models/model.entity');
var moment = require('moment');
var async = require('async');

module.exports = {

    getEmbeddedTemplateEdit: function(data, cb){

        if(!data.files){
            data.files=['resources/docs/mutual-nda-with-date.pdf'];
            data.filename='mutual-nda-with-date.pdf';
        }

        if(data.ccroles)
            data.ccroles = [].concat(data.ccroles);
        else
            data.ccroles = [];

        if(data.roles)
            data.roles = [].concat(data.roles);
        else
            data.roles = [];

        var newroles = [];

        data.roles.map(function(obj,i){
            newroles.push({name:obj,role:obj,order:i});
        });

        if(!data.message)
            data.message = 'Template default message';
        if(!data.subject)
            data.subject = 'Template default subject';
        if(!data.name)
            data.name = 'Template default title';

        var options = {
            test_mode: 1,
            clientId : data.client_id,
            files: data.files,
            title: data.name,
            subject: data.subject,
            message: data.message,
            signer_roles: newroles,
            cc_roles: data.ccroles
        };

        hellosign.template.createEmbeddedDraft(options)
            .then(function(response){
                if(response.statusMessage=='OK'){

                    entity.findOne({url:data.company}, function(err, doc){
                        if(err)
                            console.log(err);

                        if(doc){

                            if(!doc.templates)
                                doc.templates = [];

                            doc.templates.push({
                                templateId:response.template.template_id,
                                category:data.category,
                                name:data.name,
                                filename:data.filename,
                                createdat:moment().unix()
                            });

                            doc.save(function(err, ok){
                                if(err)
                                    console.log(err);
                                cb(response);
                            });

                        }
                    });
                }
            })
            .catch(function(err){
                console.log(err);
                cb(err);
            });
    },

    sendOneOff: function(data, cb){

        if(!data.files)
            data.files=['resources/docs/mutual-nda-with-date.pdf'];

        if(!data.ccroles)
            data.ccroles = [];

        var options = {
            test_mode: 1,
            clientId : data.client_id,
            files: data.files,
            title: data.name,
            subject: data.subject,
            message: data.message,
            signers: [{name:data.name,email_address:data.signer}],
            allow_decline:1
        };

        hellosign.signatureRequest.send(options)
            .then(function(response){
                if(response.statusMessage=='OK'){
                    return cb(response)
                }
                return cb(false)
            })
            .catch(function(err){
                console.log(err);
                cb(err);
            });
    },

    getTemplate: function(id, cb){

        hellosign.template.get(id)
            .then(function(response){
                cb(response);
            })
            .catch(function(err){
                console.log(err);
            });

    },

    getCustomTemplates: function(data,cb){

        entity.findOne({url:data.url}, function(err, doc){

            if(err)
                console.log(err);

            var response = [];

            doc.templates.map(function(obj){
                if(obj.templateId==data.id){
                    obj.finalized=true;
                    doc.save();
                    response.push(obj);
                }else{
                    if(obj.finalized==true)
                        response.push(obj)
                }
            });

            cb(response);
        })

    },

    sendRequestFromTemplate: function(data, cb){

        var options = {
            test_mode : 1,
            template_id : data.templateId,
            title : data.title,
            subject : data.subject,
            message : data.message,
            signers : data.signers,
            allow_decline:1
        };

        hellosign.signatureRequest.sendWithTemplate(options)
            .then(function(response){
                cb(response)
            })
            .catch(function(err){
                console.log(err);
                cb(err);
            });

    },

    recordRequest: function(data, response, cb){

        if(response.statusMessage=='OK'){

            var sq = response.signature_request;

            entity.findOne({url:data.company}, function(err, doc){
                if(err)
                    console.log(err);

                if(doc){

                    if(!doc.requests)
                        doc.requests = [];

                    var write = true;

                    doc.requests.map(function(rq){
                        if(rq.requestId == sq.signature_request_id)
                            write=false;
                    });

                    if(write){
                        doc.requests.push({
                            requestId: sq.signature_request_id,
                            category: data.category,
                            title: sq.title,
                            original_title: sq.original_title,
                            subject: sq.subject,
                            message: sq.message,
                            createdat:moment().unix()
                        });

                        doc.save(function(err, ok){
                            if(err)
                                console.log(err);
                            cb();
                        });
                    }else{
                        cb()
                    }
                }else{
                    cb()
                }
            });
        }else{
            cb()
        }

    },

    getAllStatuses: function(list, cb){

        var statuses = [];

        async.each(list, function(item, cb){
            hellosign.signatureRequest.get(item.requestId)
                .then(function(response){
                    statuses.push(response);
                    cb()
                })
                .catch(function(err){
                    console.log(err);
                    cb()
                });
        }, function(){
            cb(statuses);
        });

    },

    getEmbeddedSigning: function(data, cb){

        var options = {
            test_mode : 1,
            clientId : data.client_id,
            template_id : data.id,
            subject : 'Mutual NDA Embedded Signing ',
            message : 'This is our embedded signing demo.',
            signers : [
                {
                    email_address : 'joe@finsweet.com',
                    name : 'Signer',
                    role : 'Second Party'
                }
            ],
            allow_decline:1
        };

        hellosign.signatureRequest.createEmbeddedWithTemplate(options)
            .then(function(response){
                var sigId = response.signature_request.signatures[0].signature_id;
                return hellosign.embedded.getSignUrl(sigId)
            })
            .then(function(response){
                cb(response);

            })
            .catch(function(err){
                console.log(err);
            });


    },

    getEmbeddedReassign: function(data, cb){

        var options = {
            test_mode : 1,
            clientId : data.client_id,
            files:['resources/docs/mutual-nda-with-date.pdf'],
            title: 'Embedded Reassign',
            subject : 'Mutual NDA Embedded Signing ',
            message : 'This is our embedded signing demo.',
            signers : [
                {
                    email_address : 'joe@finsweet.com',
                    name : 'Signer',
                    order : 1
                }
            ],
            allow_reassign:1,
            allow_decline:1
        };

        hellosign.signatureRequest.createEmbedded(options)
            .then(function(response){

                var sigId = response.signature_request.signatures[0].signature_id;
                return hellosign.embedded.getSignUrl(sigId)

            })
            .then(function(response){
                cb(response);
            })
            .catch(function(err){
                console.log(err);
            });

    },

    getMergeFields: function(data, cb){

        var date = moment(data.start, 'DD/MM/YYYY');

        var options = {
            test_mode : 1,
            template_id:data.id,
            title: 'Merge Fields',
            subject : 'Updated Employee Agreement',
            message : 'This is our merge fields demo.',
            signers : [
                {
                    email_address : data.email,
                    name : 'Signer',
                    role: 'Employee',
                    order : 1
                }
            ],
            custom_fields:[
                {name:'day',value:moment().format('DD')},
                {name:'month',value:moment().format('MMMM')},
                {name:'year',value:moment().format('YY')},
                {name:'employee_name',value:data.name},
                {name:'position',value:data.position},
                {name:'day_start',value:date.format('DD')},
                {name:'month_start',value:date.format('MMMM')},
                {name:'year_start',value:date.format('YY')},
            ],
            allow_decline:1
        };

        hellosign.signatureRequest.sendWithTemplate(options)
            .then(function(response){
                cb(response);
            })
            .catch(function(err){
                console.log(err);
            });

    },

    previewMergeFields: function(data, cb){

        var date = moment(data.start, 'DD/MM/YYYY');

        var options = {
            test_mode : 1,
            template_id:data.id,
            clientId:data.client_id,
            title: 'Merge Fields',
            subject : 'Updated Employee Agreement',
            message : 'This is our merge fields demo.',
            requester_email_address: 'demo@hellosign.com',
            signers : [
                {
                    email_address : data.email,
                    name : 'Signer',
                    role: 'Employee',
                    order : 1
                }
            ],
            custom_fields:[
                {name:'day',value:moment().format('DD')},
                {name:'month',value:moment().format('MMMM')},
                {name:'year',value:moment().format('YY')},
                {name:'employee_name',value:data.name},
                {name:'position',value:data.position},
                {name:'day_start',value:date.format('DD')},
                {name:'month_start',value:date.format('MMMM')},
                {name:'year_start',value:date.format('YY')}
            ],
            allow_decline:1
        };

        hellosign.unclaimedDraft.createEmbeddedWithTemplate(options)
            .then(function(response){
                cb(response);
            })
            .catch(function(err){
                console.log(err);
            });
    }

};