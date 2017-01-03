/**
 * Created by bernatmir on 19/12/16.
 */
var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");
var usuario = require('../models/user.js');
var cifs = require ('../models/cifs.js');

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

    /*usuario.find({login: userLog.login}, function (err, user) {
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
    });*/
});


module.exports = router;