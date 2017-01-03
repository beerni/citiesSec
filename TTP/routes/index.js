/**
 * Created by bernatmir on 4/10/16.
 */
var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");
var rsa = require('./rsa');
var keys = rsa.generateKeys(512);
var bignum = require('bignum');
var request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var proofOfPublication={};
function compareHash(info, cb) {
    var concat = info.A + '|' + info.B + '|' + info.username +'|' + info.password;
    var eMarket = bignum(info.eMarket);
    var nMarket= bignum(info.nMarket);
    var originHash = CryptoJS.SHA256(concat).toString();
    var originServer = bignum(info.proof);
    var decrypted = originServer.powm(eMarket,nMarket).toString(16);
    if(decrypted.localeCompare(originHash)==0){
        console.log('Equal hashes from proof!');
        console.log(decrypted.toString(16));
        console.log(originHash.toString(16));
        cb();
    }
    else
        console.log('mismatch');

}

router.post('/ttp/proof', function (req, res) {
    compareHash(req.body, function () {
        var A = 'TTP';
        var B= 'User';
        var username = req.body.username;
        var password = req.body.password;
        var concat = A + '|' + B + '|' + username + '|' + password;
        var proofUser = CryptoJS.SHA256(concat);
        proofUser = bignum(proofUser.toString(),16);
        var proofUserEnc = keys.privateKey.sign(proofUser);
        proofOfPublication = {
            A:A,
            B:B,
            username:username,
            password:password,
            proof: proofUserEnc.toString(),
            eTTP: keys.publicKey.e.toString(),
            nTTP:keys.publicKey.n.toString()
        };
        res.status(200).send(proofOfPublication);
    })
});

router.get('/ttp/publication', function (req, res) {
    console.log(proofOfPublication);
    res.status(200).send(proofOfPublication);
})



module.exports = router;