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
var chatt = require('./routes/chat');

app.use('/api', routes);
app.use('/api/user', user);
app.use('/api/ad', ad);
app.use('/api/chat', chatt);

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

var chat = require('./models/chat.js');
var chatMessage = require('./models/chatMessage.js');

var app2 = http2.createServer(options);
io = require('socket.io').listen(app2);
app2.listen(3040);
var users = [];
var user = {};
user.user='';
user.ws = [];
io.on('connection', function(conn){
    conn.emit('connection','user connected');
    conn.on('username', function(data, callback){
        if(data==null)
            callback(false);
        else{
            var exit = false;
            for(var i = 0; i<users.length; i++) {
                if(users[i].user == data){
                    users[i].ws.push(conn);
                    callback(false);
                    exit = true;
                }
            }

        }
        if (exit!=true){
            callback(true);
            user.user = data;
            user.ws.push(conn);
            users.push(user);
        }
        console.log(data);
    });
    conn.on('diffieInit', function(data){
        var exit = false;
        var cha;
        chat.find({idProduct: data.id}).exec(function(err,chati) {
            if (err) {
            }
            else {
                var num = 0;
                if (chati.length != 0) {
                    for (var i = 0; i < chati.length; i++) {
                        for (var j = 0; j < chati[i].username.length; j++)
                            if (chati[i].username[j] == data.user || chati[i].username[j] == data.useri) {
                                num = num+1;
                                if(num==2){
                                    cha = chati[i].username;
                                }
                            }
                    }
                    if (num < 2) {
                        num = 0;
                    }
                }
                if (num < 2) {
                    var newChat = new chat();
                    newChat.username.push(data.user);
                    newChat.username.push(data.useri);
                    newChat.idProduct = data.id;
                    newChat.productName = data.name;
                    newChat.save(function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                    cha = newChat.username;
                }
            }

            p = bignum.prime(64 / 2);
            g = 5;
            for (var i = 0; i < cha.length; i++) {
                if (cha[i] == data.user) {
                    for (var j = 0; j < users[i].ws.length; j++) {
                        users[i].ws[j].emit('diffieInit', {prime: p.toString(), mod: g,id: data.id,user: data.useri});
                    }
                    conn.emit('diffieInit', {prime: p.toString(), mod: g, id: data.id, user: data.user});
                    exit = true;
                }
            }
            if (exit != true) {

            }
        });
    });
    conn.on('diffie', function(data){
        var exit = false;
        for (var i = 0; i < users.length; i++) {
            if (users[i].user == data.user) {
                for (var j = 0; j < users[i].ws.length; j++) {
                    users[i].ws[j].emit('diffie', {prime: data.prime, mod: data.mod,id: data.id,user: data.user, module: data.module});
                }
                conn.emit('diffie', {prime: data.prime, mod: data.mod,id: data.id,user: data.user, module: data.module});
                exit = true;
            }
        }
        if (exit != true) {

        }
    });
    conn.on('messageChat', function(data){
        var exit = false;
        for (var i = 0; i < users.length; i++){
            if(users[i].user == data.user){
                for(var j = 0; j<users[i].ws.length;j++){
                    users[i].ws[j].emit('messageChat', {msg: data.msg, user: data.user, id: data.id});
                }
                exit = true;
                conn.emit('messageChat', {msg: data.msg, user:data.user, id: data.id});
            }
        }
        if(exit!=true){

        }

    })
});
module.exports = app;