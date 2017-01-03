var express = require('express');
var router = express.Router();
var bignum = require('bignum');

var keys = require('./keys.js');
serverKeys =keys.getKeys();
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

router.post('/sign',function (req, res) {
    var blindMessageSigned = serverKeys.privateKey.sign(bignum(req.body.data, 16));
    res.status(200).send({data: blindMessageSigned.toString(16)});
});

router.post('/verify',function (req, res) {
    var verified = serverKeys.privateKey.verify(bignum(req.body.data)).toString(16);
});
module.exports = router;