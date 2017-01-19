/**
 * Created by bernatmir on 2/1/17.
 */
var express = require('express');
var router = express.Router();
var paillier = require('./paillier');
var rsa = require('../rsa');


var keys = rsa.generateKeys(512);
var  paillierKeys = paillier.generateKeys(512);

exports.getKeys = function () {
    return keys;
};
exports.getPublicKey = function () {
    return keys.publicKey;
};

exports.getPrivateKey = function () {
    return keys.privateKey;
};
exports.paillierKeys = function () {
    return paillierKeys;
}
exports.getPrivateKeyPaillier = function () {
    return paillierKeys.privateKey;
};

