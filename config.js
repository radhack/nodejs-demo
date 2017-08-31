module.exports = {

    mongodb:{
        host: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST?useMongoClient:true || 'mongodb://localhost/hellosign'
    },

    hellosignKey: process.env.HELLO_KEY,
    hellosignID: process.env.HELLO_ID
};
