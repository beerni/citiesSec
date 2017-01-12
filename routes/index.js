var express = require('express');
var router = express.Router();
var bignum = require('bignum');
var jwtauth = require('../config/jwtauth');


var keys = require('./keys.js');
serverKeys = keys.getKeys();
publicKeys = keys.getPublicKey();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/publicKey', function (req, res) {
    res.status(200).send({
        bits: publicKeys.bits.toString(),
        n: publicKeys.n.toString(),
        e: publicKeys.e.toString()
    });
});

router.post('/sign', function (req, res) {
    var blindMessageSigned = serverKeys.privateKey.sign(bignum(req.body.data, 16));
    res.status(200).send({data: blindMessageSigned.toString(16)});
});

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
router.post('/sign/verify', function (req, res) {
    var verified = serverKeys.privateKey.verify(bignum(req.body.data)).toString(16);
    verified = hex2a(verified);
    if (verified.includes('clientKey')) {
        //Es firmada por mi, empieza el reto:
        res.status(200).send('Challenge');
    }
    else {
        res.status(400).send('Error')
    }
});

router.post('/challenge', function (req, res) {
    var challengeEnc = bignum(req.body.data.challenge);
    var challengeDes = challengeEnc.powm(bignum(req.body.data.e), bignum(req.body.data.n));
    if(hex2a(challengeDes.toString(16)).includes('Challenge')){
        //Challenge verified by the server
        res.status(200).send('Verified');
    }
    else {
        res.status(400).send('Error')
    }
});

router.post('/validate',jwtauth, function (req, res) {
    res.status(200).send('OK');
});
module.exports = router;