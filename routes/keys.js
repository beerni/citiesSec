/**
 * Created by bernatmir on 2/1/17.
 */
var express = require('express');
var router = express.Router();
var rsa = require('../rsa');


var keys = rsa.generateKeys(512);

exports.getKeys = function () {
    return keys;
};
exports.getPublicKey = function () {
    return keys.publicKey;
};

exports.getPrivateKey = function () {
    return keys.privateKey;
};

