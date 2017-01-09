//Node modules requires
var https = require('https');
var fs = require('fs');
var path = require('path');
var express = require('express');
var request = require('request');
var url = require('url');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var http2 = require('https');
var mongoose = require('mongoose');
var bignum = require('bignum');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var jwt = require('jwt-simple');

mongoose.Promise = global.Promise;
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
var ad = require('./routes/ad');

app.use('/api', routes);
app.use('/api/user', user);
app.use('/api/ad', ad);

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

var app2 = http2.createServer(options);
io = require('socket.io').listen(app2);
app2.listen(3040);
var users = [];
io.on('connection', function(conn){
    conn.emit('connection','user connected');
    conn.on('username', function(data, callback){
        if(data==null)
            callback(false);
        else{
            var exit = false;
            for(var i = 0; users.length; i++) {
                if(users[i] == data){
                    users[i].ws.push(conn);
                    callback(false);
                    exit = true;
                }
            }

        }
        if (exit!=true){
            callback(true);
            var user = {};
            user.username = data;
            user.ws = [];
            user.ws.push(conn);
            users.push(user);
            console.log(user.username);
       

        }
        console.log(data);
    });
    conn.on('diffieInit', function(data){
        p = bignum.prime(512 / 2);
        g = 10;
        for (var i = 0; i < users.length; i++) {
            if (users[i] == data.sendTo) {
                for (var j = 0; j < users[i].ws.length; j++) {
                    users[i].ws[j].emit('diffieInit', {prime: p, mod: g});
                }
                conn.emit('diffieInit', {prime: p, mod: g});
                exit = true;
            }
        }
        if(exit!=true){

        }
    });
    conn.on('messageChat', function(data){
        var exit = false;
        for (var i = 0; i < users.length; i++){
            if(users[i] == data.sendTo){
                for(var j = 0; j<users[i].ws.length;j++){
                    users[i].ws[j].emit('messageChat', data.msg);
                }
                exit = true;
            }else if(users[i]==data.sendBy){
                for(var j = 0; j<users[i].ws.length;j++){
                    users[i].ws[j].emit('messageChat', data.msg);
                }
            }
        }
        if(exit!=true){

        }

    })
});
module.exports = app;