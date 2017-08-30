module.exports = {

    mongodb:{
        host: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST || 'mongodb://localhost/hellosign'?useMongoClient: true
    },

    hellosignKey: process.env.HELLO_KEY,
    hellosignID: process.env.HELLO_ID
};
