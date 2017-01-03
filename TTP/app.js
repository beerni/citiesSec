/**
 * Created by bernatmir on 10/12/16.
 */
/**
 * Created by bernatmir on 4/10/16.
 */
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var routes = require('./routes/index');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose    = require('mongoose');
var fs = require('fs');
var https = require('https');


var app = express();

/*mongoose.connect("mongodb://localhost/kdcDB", function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a la base de datos");
    }
});*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


var options = {
    key: fs.readFileSync('kdc-key.pem'),
    cert: fs.readFileSync('kdc-cert.pem')
};


https.createServer(options, app).listen(8085, function () {
    console.log('Started TTP on port 8085 !');
});

//var usuario = require('./models/user.js');

module.exports = app;

/*var server = require('http').Server(app);

 // Start server
 server.listen(8085, function() {
 console.log("TTP running on http://localhost:8085");
 });*/
