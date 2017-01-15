/**
 * Created by scii on 12/01/17.
 */
var express = require('express');
var router = express.Router();
var chat = require('../models/chat.js');
var chatMsg = require('../models/chatMessage');
var ad = require('../models/ad.js');

router.get('/:username', function (req, res, next) {
    if(req.params.username==undefined){
        res.status(404).send("Not found");
    }else{
        chat.find({username: req.params.username}).exec(function (err, chateo) {
            if(err){res.status(500).send("Internal server error")}
            else{
                res.send(chateo);
            }
        })
    }
});
router.get('/msg/:username', function(req,res,next){
    if(req.params.username==undefined){
        res.status(404).send("Not found");
    }else{
        chat.find({username: req.params.username}).exec(function (err, chateo) {
            if(err){res.status(500).send("Internal server error")}
            else{
                for(var i = 0; i<chateo.length;i++){
                    chatMsg.find({chatid: chateo[i]._id}).exec(function(err, mensajes){
                        if(err){
                            res.status(500).send("Internal server error");
                        }else{

                            console.error(mensajes);
                            if(mensajes.length!=0){
                                res.send(mensajes);
                            }
                        }
                    })
                };
            }
        })
    }
});
router.get('/id/:id', function(req,res,next){
    if(req.params.id==undefined){
        res.status(404).send("Not found");
    }else{
        chat.findOne({_id: req.params.id}).exec(function (err, chateo) {
            if(err){res.status(500).send("Internal server error")}
            else{
                if(chateo==undefined){
                    res.status(404).send('Not found');
                }else{
                    res.send(chateo);
                }
            }
        })
    }
});

router.get('/idProduct/:id/:username/:username2', function(req,res,next){
    if(req.params.id==undefined){
        res.status(404).send("Not found");
    }else{
    ad.findOne({_id: req.params.id}).exec(function(err,ad){
        if(err){res.status(500).send("Internal server error")}
        else{
            if(ad==undefined){
                res.status(500).send("Not Found")
            }
            chat.find({idProduct: req.params.id, username: req.params.username}).exec(function (err, chateo) {
                    if(err){res.status(500).send("Internal server error")}
                    else {
                        console.log(chateo);
                        console.log(req.params.username);
                        console.log(req.params.username2);
                        console.log(req.params.id);
                        console.log(ad.title);
                        if (chateo.length == 0) {
                            var newChat = new chat();
                            newChat.username.push(req.params.username);
                            newChat.username.push(req.params.username2);
                            newChat.idProduct = req.params.id;
                            newChat.productName = ad.title;
                            newChat.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            res.send(newChat)
                        }else{
                            res.send(chateo[0]);
                        }
                    }
            })
            }
        })
        }
    });

module.exports = router;