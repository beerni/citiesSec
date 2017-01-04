//Node modules requires
var https = require('https');
var fs = require('fs');
var path = require('path');
var express = require ('express');
var request = require('request');
var url = require('url');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var jwt = require('jwt-simple');

mongoose.connect("mongodb://localhost/secretMarketDB", function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a la base de datos");
    }
});
app.set('jwtTokenSecret', 'secret');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public/web')));

var routes = require('./routes');
var user = require('./routes/user');
app.use('/api/user', user);
app.use('/api', routes);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
};

//Passport
app.use(session({ secret: 'mysecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

https.createServer(options, app).listen(8080, function () {
    console.log('Started!');
});

module.exports = app;
