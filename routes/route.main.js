var hellosign = require('../controllers/control.hellosign');
var form = require('../controllers/control.form');
var entity = require('../models/model.entity');
var defaults = require('../models/model.default');
var path = require('path');
var multer = require('multer');
var moment = require('moment');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });
var callback = multer();

module.exports = function(router){

    router.route('/')
        .get(function(req, res){
            res.render('index');
        });

    router.route('/submit')
        .post(upload.single('logo'), function(req, res){

            console.log(req.body);

            var data = req.body;
            if(req.file){
                data.logo = req.file.path;
                var colors = form.getColors(data.logo);
                data.primaryColor = colors.primary;
                data.darkColor = colors.dark;
            }else{
                data.logo = 'img/hs-logo.png';
                data.primaryColor = '#00b3e6';
                data.darkColor = '#FFF'
            }

            data.contentBackground = form.getContentBackground(data.primaryColor);

            data.url = encodeURI(req.body.company).replace(/%20/g,'-').replace('.','').toLowerCase();

            form.createNewApp(data, function(response){

                if(!response.api_app){
                    return res.send({status:'exists',link:data.url});
                }else{
                    data.client_id = response.api_app.client_id;

                    var comp = new entity(data);

                    comp.save(function(err){
                        if(err){
                            console.log(err);
                            return res.send({status:'exists',link:data.url});
                        }
                        res.send({status:'ok',link:data.url});
                    });
                }

            });

        });

    router.route('/:company/:page')
        .get(function(req, res){

            var company = req.params.company;
            var page = req.params.page;

            entity.findOne({url:company}, function(err, profile){
                if(err){
                    console.log(err);
                    res.render('notFound');
                }

                if(profile){

                    defaults.findOne({_id:'defaultSettings'}, function(err, defs) {

                        profile = profile.toJSON();

                        profile.hr = [];
                        profile.realestate = [];
                        profile.legal = [];

                        profile.hr_requests = [];
                        profile.realestate_requests = [];
                        profile.legal_requests = [];
                        profile.custom_requests = [];

                        if (profile.templates.length)
                            profile.custom = true;

                        console.log(profile);

                        profile.tabs = 12 / profile.usage.length;

                        profile.usage.map(function (use) {
                            defs.templates.map(function (tmp) {
                                tmp.category.map(function (cat) {
                                    if (use == cat)
                                        profile[use].push(tmp);
                                })
                            })
                        });

                        var data = {
                            profile: profile
                        };

                        data[page] = true;

                        if (page == 'welcome')
                            data.profile.headerMoreInfo = 'Learn about Embedded Requesting';
                        if (page == 'non-embedded-requests')
                            data.profile.headerMoreInfo = '•	Learn about Non-Embedded Requests';
                        if(page == 'from-template')
                            data.profile.headerMoreInfo = '•	Learn about requests from templates';
                        if(page == 'status')
                            data.profile.headerMoreInfo = 'Learn about request statuses';
                        if (page == 'merge-fields')
                            data.profile.headerMoreInfo = '•	Learn about merge fields';
                        if(page == 'embedded-signing')
                            data.profile.headerMoreInfo = 'Learn more about embedded signing';
                        if(page == 'signer-reassignment')
                            data.profile.headerMoreInfo = 'Learn about signer reassignment';
                        if(page == 'embedded-templates')
                            data.profile.headerMoreInfo = 'Learn about Embedded Templates';

                        if(page=='status'){

                            hellosign.getAllStatuses(profile.requests, function(statuses){

                                //console.log(statuses);
                                var index = {};

                                profile.requests.map(function(rq){
                                    if(rq.category=='hr')
                                        index[rq.requestId] = {created: rq.createdat, dst:'hr_requests'};
                                    if(rq.category=='realestate')
                                        index[rq.requestId] = {created: rq.createdat, dst:'realestate_requests'};
                                    if(rq.category=='legal')
                                        index[rq.requestId] = {created: rq.createdat, dst:'legal_requests'};
                                    if(rq.category=='custom')
                                        index[rq.requestId] = {created: rq.createdat, dst:'custom_requests'};

                                });
                                statuses.map(function(st){
                                    var obj = st.signature_request;

                                    //console.log(obj.signatures)

                                    obj.names = '';
                                    obj.signatures.map(function(sig){
                                        if(!obj.names)
                                            obj.names+=sig.signer_name;
                                        else
                                            obj.names+=', '+sig.signer_name;

                                        obj.statusCode = sig['status_code'];
                                        obj.status= toTitleCase(sig['status_code'].replace('_',' '));

                                    });

                                    if(obj['is_complete']){
                                        obj.icon='/img/complete.png';
                                    }else if(obj['is_declined']){
                                        obj.icon='/img/declined.png';
                                    }else{
                                        obj.icon='/img/pending.png';
                                    }

                                    var crt = moment.unix(index[obj.signature_request_id].created);

                                    obj.createdMonth = crt.format('MMM').toUpperCase();
                                    obj.createdDate = crt.format('DD');
                                    profile[index[obj.signature_request_id].dst].push(obj);
                                });

                                res.render('app-updated', data);
                            });

                        }else {
                            res.render('app-updated', data);
                        }

                    });

                }else{
                    res.redirect('/')
                }

            });

        });

    router.route('/embeddedTemplates')
        .post(upload.single('file'), function(req, res){

            var data = req.body;
            data.company = req.headers.referer.split('/')[3];

            if(req.file) {
                data.files = [req.file.path];
                data.filename = req.file.originalname;
            }

            console.log(req.file);

            data.company = req.headers.referer.split('/')[3];

            entity.findOne({url:data.company}, function(err, doc){

                data.client_id = doc.client_id;

                hellosign.getEmbeddedTemplateEdit(data, function(response){

                    res.send(response);

                })
            });

        });

    router.route('/getCustomTemplates')
        .post(function(req, res){

            var url = req.headers.referer.split('/')[3];

            console.log(url);

            var data = {
                url:url,
                id:req.body.id
            };

            hellosign.getCustomTemplates(data, function(response){

                console.log(response);

                res.send(response
                );

            });

        });

    router.route('/oneOff')
        .post(upload.single('file'), function(req, res){

            var data = req.body;

            if(req.file)
                data.files = [req.file.path];

            data.company = req.headers.referer.split('/')[3];

            entity.findOne({url:data.company}, function(err, doc) {

                data.client_id = doc.client_id;

                hellosign.sendOneOff(data, function (response) {

                    res.send(response);

                })

            });

        });

    router.route('/fromTemplate')
        .post(function(req, res){

            var tid = req.body.templateId;

            hellosign.getTemplate(tid, function(response){
                res.send(response);
            })

        });

    router.route('/sendRequestFromTemplate')
        .post(function(req, res){
            var data = req.body;
            data.company = req.headers.referer.split('/')[3];

            hellosign.sendRequestFromTemplate(data, function(response){
                hellosign.recordRequest(data, response, function(){
                    console.log(data);
                    res.send(response)
                });
            })
        });

    router.route('/getEmbeddedSigning')
        .post(function(req, res){

            defaults.findOne({_id:'defaultSettings'}, function(err, doc){

                if(err)
                    console.log(err);

                var data = {
                    id:doc.embeddedTemplate.templateId
                };

                data.company = req.headers.referer.split('/')[3];

                entity.findOne({url:data.company}, function(err, doc) {

                    data.client_id = doc.client_id;

                    hellosign.getEmbeddedSigning(data, function (response) {
                        res.send(response);
                    });

                });

            });

        });

    router.route('/getEmbeddedReassign')
        .post(function(req, res){

            defaults.findOne({_id:'defaultSettings'}, function(err, doc){

                if(err)
                    console.log(err);

                var data = {
                    id:doc.embeddedTemplate.templateId
                };

                data.company = req.headers.referer.split('/')[3];

                entity.findOne({url:data.company}, function(err, doc) {

                    data.client_id = doc.client_id;

                    hellosign.getEmbeddedReassign(data, function (response) {
                        res.send(response);
                    });
                });
            });

        });

    router.route('/mergeFields')
        .post(function(req, res){

            var data = req.body;

            console.log(data);

            defaults.findOne({_id:'defaultSettings'}, function(err, doc){

                if(err)
                    console.log(err);

                data.id = doc.mergeTemplate.templateId;

                data.company = req.headers.referer.split('/')[3];

                entity.findOne({url:data.company}, function(err, doc) {

                    data.client_id = doc.client_id;

                    hellosign.getMergeFields(data, function (response) {
                        res.send(response);
                    });
                });
            });
        });

    router.route('/previewMergeFields')
        .post(function(req, res){

            var data = req.body;

            console.log(data);

            defaults.findOne({_id:'defaultSettings'}, function(err, doc){

                if(err)
                    console.log(err);

                data.id = doc.mergeTemplate.templateId;

                data.company = req.headers.referer.split('/')[3];

                entity.findOne({url:data.company}, function(err, doc) {

                    data.client_id = doc.client_id;

                    hellosign.previewMergeFields(data, function (response) {
                        res.send(response);
                    });
                });
            });
        });

    router.route('/callback')
        .post(callback.single('json'), function(req, res){

            console.log('This is the callback body');

            res.status(200);
            res.send('Hello API Event Received');

            var data = req.body.json;

            if(data.event){
                if(data.event.event_type=='template_created'){

                    console.log(data.event.event_metadata);

                    entity.findOne({'templates.templateId':data.event.event_metadata.template_id}, function(err, doc){
                        if(err)
                            console.log(err);
                        if(doc){

                            doc.templates.map(function(obj){
                                if(obj.templateId==data.event.event_metadata.template_id){
                                    obj.finalized = true;
                                }
                            });

                            doc.save();

                        }
                    })

                }

                if(data.event.event_type=='signature_request_sent'){

                    console.log('Logging event metadata now:');
                    console.log(data.event.event_metadata);

                }
            }

        });

    router.route('/*')
        .get(function(req, res){
            res.redirect('/');
        })

};

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}