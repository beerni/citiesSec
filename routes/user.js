/**
 * Created by bernatmir on 19/12/16.
 */
var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");
var usuario = require('../models/user.js');
var cifs = require ('../models/cifs.js');
var anonimousUsers = require('../models/anonimousUser.js');
var request = require("request");
var bignum = require('bignum');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



function generateSalt() {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    return salt.toString();
}
router.post('/register', function(req, res, next) {
    var newUser = req.body;
    cifs.find({hashedCIF:newUser.CIF}, function (err,user) {
        if (user.length != 0) {
            res.sendStatus(409);

        }
        else{
            var newCIF = new cifs({
                hashedCIF: newUser.CIF
            });

            newCIF.save(function (err) {
                if (err) res.status(500).send('Internal server error');
                else {
                    var salt = generateSalt();
                    var concat = newUser.CIF + '|' + salt;
                    var CIFHash = CryptoJS.SHA256(concat).toString();
                    var RegisterUser = new usuario({
                        socialReason: newUser.socialReason,
                        hashedCIF: CIFHash,
                        salt: salt
                    });
                    RegisterUser.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                        else
                            res.status(200).send('Registered');
                    });


                }

            })
        }
    });
});



function compareHash(info, cb) {
    var concat = info.A + '|' + info.B + '|' + info.username +'|' + info.password;
    var eTTP = bignum(info.eTTP);
    var nTTP= bignum(info.nTTP);
    var originHash = CryptoJS.SHA256(concat).toString();
    var originServer = bignum(info.proof);
    var decrypted = originServer.powm(eTTP,nTTP).toString(16);
    if(decrypted.localeCompare(originHash)==0){
        console.log('Equal hashes from proof!');
        console.log(decrypted.toString(16));
        console.log(originHash.toString(16));
        cb();
    }
    else
        console.log('mismatch');

}

router.post('/register/anonimous', function(req, res, next) {
    if(req.body.checkUsername) {
        //checking if username exists
        anonimousUsers.find({username: req.body.username}, function (err, user) {
            if (user.length != 0) {
                res.sendStatus(409);

            }
            else {
                res.sendStatus(200);
            }

        });
    }
    else {
        //Register new user
        var salt = generateSalt();
        var concat = req.body.password + '|' + salt;
        var password = CryptoJS.SHA256(concat).toString();
        var newUserAnonimous = new anonimousUsers({
            username: req.body.username,
            password: password,
            salt: salt
        });
        newUserAnonimous.save(function (err) {
            var A = 'Market';
            var B= 'TTP';
            var username = req.body.username;
            var password = req.body.password;
            var concat = A + '|' + B + '|' + username + '|' + password;
            var proofUser = CryptoJS.SHA256(concat);
            proofUser = bignum(proofUser.toString(),16);
            var proofUserEnc = serverKeys.privateKey.sign(proofUser);
            if (err) res.status(500).send('Internal server error');
            else{
                var proofOfUser = {
                    A:A,
                    B:B,
                    username:username,
                    password:password,
                    proof: proofUserEnc.toString(),
                    eMarket: serverKeys.publicKey.e.toString(),
                    nMarket : serverKeys.publicKey.n.toString()
                };
                request({
                    uri: "https://localhost:8085/ttp/proof",
                    method: "POST",
                    form: proofOfUser
                }, function(error, response, body) {
                    compareHash(JSON.parse(body), function () {
                        res.status(200).send('Registered anonoimous')
                    })
                });
            }

        });

    }
});


module.exports = router;