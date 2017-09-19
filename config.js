var config = {
    mongodb:{},
    hellosignKey: process.env.HELLO_KEY || '40b740615f6f87a49c72f6beefd4c880d476ee1c58994955a42bf33ad596e3b2',
    hellosignID: process.env.HELLO_ID || '94cd46c0b0f52e25225f4406bdaa2b07'
};

//Use environment variables for mongodb url. If not available, default to local mongodb installation
if(process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_HOST){
    config.mongodb.host = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST;
}else{
    config.mongodb.host = 'mongodb://localhost/hellosign';
}

module.exports = config;