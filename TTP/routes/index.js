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
var usuario = require('.././user.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function generateSalt() {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    return salt.toString();
}

router.post('/user', function (req, res) {
    var userLog = req.body;
    usuario.find({login: userLog.login}, function (err, user) {
        if (user.length != 0) {
            res.status(409).send('Conflict');
        }
        else {
            var salt = generateSalt();
            var concat = userLog.password + '|' + salt;
            var passwordHash = CryptoJS.SHA256(concat).toString();
            var newUser = new usuario({
                login: userLog.login,
                password: passwordHash,
                salt: salt
            });

            newUser.save(function (err) {
                if (err) res.status(500).send('Internal server error');
                else
                    res.status(200).send('Registered');
            });

        }
    });
});

router.post('/login', function (req, res) {
    var userLog = req.body;
    usuario.findOne({login: userLog.login}, function (err, user) {
        if (user.length != 0) {
            var concat = userLog.password + '|' + user.salt;
            var passwordHash = CryptoJS.SHA256(concat).toString();
            if (passwordHash.localeCompare(user.password) == 0) {
                console.log('matches')
                res.send('OK');
            }
            else {
                res.status(400).send('Bad password')
            }
        }
        else {
            res.status(404).send('Not found');
        }
    });
});
module.exports = router;