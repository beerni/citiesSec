//Node modules requires
var http        = require('http');
var fs = require('fs');
var path = require('path');
var express = require ('express');
var request = require('request');
var url = require('url');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public/www')));

var routes = require('./routes');
app.use('/', routes);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('port',process.env.PORT || 8080);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;


/*

 var express = require('express');
 var path = require('path');
 var favicon = require('serve-favicon');
 var logger = require('morgan');
 var cookieParser = require('cookie-parser');
 var bodyParser = require('body-parser');
 var http        = require('http');
 var app = express();

 app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: false}));
 app.use(express.static(path.join(__dirname, 'public/noteWrangler')));


 var routes = require('./routes');
 app.use('/', routes);

 app.use(function (req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
 });

 app.set('port',process.env.PORT || 8080);
 http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });

 module.exports = app;
 */
