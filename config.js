var config = {
    mongodb:{},
    hellosignKey: process.env.HELLO_KEY,
    hellosignID: process.env.HELLO_ID
};

//Use environment variables for mongodb url. If not available, default to local mongodb installation
if(process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_HOST){
    config.mongodb.host = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST;
}else{
    config.mongodb.host = 'mongodb://localhost/hellosign';
}

module.exports = config;

