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
var anonimousUser = require('./models/anonimousUser');

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
        var idChat;
        chat.find({_id: data.id}).exec(function(err,chati) {
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
                                    idChat = chati[i]._id;
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
                    newChat.idProduct = data.idProduct;
                    newChat.productName = data.name;
                    newChat.save(function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                    cha = newChat.username;
                    idChat = newChat._id;
                }
            }

            p = bignum.prime(64 / 2);
            g = 5;
            for (var i = 0; i < cha.length; i++) {
                if (cha[i] == data.user) {
                    for (var j = 0; j < users[i].ws.length; j++) {
                        users[i].ws[j].emit('diffieInit', {prime: p.toString(), mod: g,id: data.id,user: data.useri, idChat: idChat});
                    }
                    conn.emit('diffieInit', {prime: p.toString(), mod: g, id: data.id, user: data.user, idChat: idChat});
                    exit = true;
                }
            }
            if (exit != true) {
                anonimousUser.findOne({username: data.user}).exec(function(err, userr){
                    if(err){}
                    else{
                        if(userr.length!=0){
                            conn.emit('notConnected', {e:userr[0].e, n:userr[0].n, user: data.user, id:data.id, idChat:idChat})
                        }
                    }
                })
            }
        });
    });
    conn.on('publicKeyChat', function(data){
        var newmessage = new chatMessage();
        newmessage.username = data.user;
        newmessage.chatid = data.id;
        newmessage.message = data.msg;
        newmessage.crypted = true;
        newmessage.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
    })
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
            anonimousUser.findOne({username: data.user}).exec(function(err, userr){
                if(err){}
                else{
                    if(userr=undefined){
                        conn.emit('notConnected', {e:userr[0].e, n:userr[0].n, user: data.user, id:data.id, idChat:idChat})
                    }
                }
            })
        }
    });
    conn.on('messageChat', function(data){
        var exit = false;
        var userrr = '';
        var idChat = '';
        chat.find({_id: data.id}).exec(function(err, use){
            if(err){}
            else {
                if (use.length != 0) {
                    for (var s = 0; s < use[0].username.length; s++) {

                        if (use[0].username[s] == data.useri) {
                            userrr = use[0].username[s];
                        }
                    }
                }
                for (var i = 0; i < users.length; i++) {
                    if (users[i].user == userrr) {
                        for (var j = 0; j < users[i].ws.length; j++) {
                            users[i].ws[j].emit('messageChat', {msg: data.msg, user: data.user, id: data.id});
                        }
                        exit = true;
                        conn.emit('messageChat', {msg: data.msg, user: data.user, id: data.id});
                    }
                }
                if (exit != true) {
                    console.log("no esta");
                    anonimousUser.findOne({username: data.useri}).exec(function (err, userr) {
                        if (err) {
                        }
                        else {
                            if (userr != undefined) {
                                conn.emit('publicKeyChat', {
                                    public: {e: userr.e, n: userr.n},
                                    user: data.user,
                                    id: data.id,
                                    msg: data.msg,
                                    useri: data.useri
                                });
                            }
                        }
                    })
                }
            }
        })

    })
    conn.on('disconnect', function(data){
        for(var i = 0; i< users.length; i++){
            /*for(var j =0; j < users[j].ws.length; j++){

                if(users[i].ws[j]==conn){
                    users[i].ws.splice(j,1);
                    if(users[i].ws==""){
                        users.splice(i,1)
                    }
                    break;
                }
            }*/
            if(users[i].user==data.user){
                users.splice(i,1);
            }
        }
    })
});
module.exports = app;