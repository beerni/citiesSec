/**
 * Created by scii on 12/01/17.
 */
var express = require('express');
var router = express.Router();
var chat = require('../models/chat.js');

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


module.exports = router;