config = require('./config');

var express = require('express');
var app = express();
var server = require('http').Server(app);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.host);

app.use('/', express.static(__dirname + "/public"));
app.use('/uploads', express.static(__dirname + "/uploads"));

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({ extended: true }));

var router = express.Router();
app.use(router);

require('./routes/route.main.js')(router);

server.listen(process.env.PORT || 80);