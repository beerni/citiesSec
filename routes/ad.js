/**
 * Created by aitor on 4/1/17.
 */
var express = require('express');
var formidable = require('formidable');
var fs = require('fs-extra');
var crypto = require('crypto');
var Ad = require('../models/ad.js');
var router = express.Router();
var keys = require('./keys');
var base_url = "https://localhost:8080";
var paillierKeys = keys.paillierKeys();
var bignum = require('bignum');
//Add an ad
router.post('/add', function (req, res) {
    if (!req.body.imgurl) req.body.imgurl = base_url + '/img/ad-img/default_img.png';
    var ad = new Ad({
        _id: crypto.randomBytes(16).toString("hex"),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        username: req.body.username,
        imgurl: req.body.imgurl,
        seen: req.body.seen
    });
    ad.save(function (err, a) {
        if (err) return res.send(500, err.message);
        res.status(200).json(a);
    });
});

//Add image
router.post('/update/:id', function (req, res) {
    var form = new formidable.IncomingForm();
    var target_path;
    var filname = crypto.randomBytes(16).toString("hex");
    form.parse(req, function (err, fields, files) {
        var tmp_path = files.file.path; // file is the name html input that contain us route img
        var tipo = files.file.type; // type file

        if (tipo == 'image/png' || tipo == 'image/jpg' || tipo == 'image/jpeg') {
            target_path = './public/web/img/ad-img/' + filname + ".png";// route to add us file and concatenate filename
            fs.rename(tmp_path, target_path, function (callback) {
                fs.unlink(tmp_path, function (callback) {
                });
            });
        }
    });

    Ad.findById(req.params.id, function (err, ad) {
        ad.imgurl = base_url + '/img/ad-img/' + filname + '.png';

        ad.save(function (err, a) {
            if (err) return res.send(500, err.message);
            res.status(200).json(a);
        });
    })
});


//Get all ads
router.get('/getAll', function (req, res) {
    Ad.find(function (err, ads) {
        if (err) res.send(500, err.message);
        res.status(200).json(ads);
    });
});

//Get ad by id
router.post('/:id', function (req, res) {
    var newSeen = req.body.data;
    Ad.findById(req.params.id, function (err, ad) {
        if (err) return res.send(500, err.message);
        var n = paillierKeys.publicKey.n;
        var oldVisits = paillierKeys.privateKey.decrypt(bignum(ad.seen, 16));
        console.log('OLD VISITS');
        console.log(oldVisits.toString());
        var newVisit = paillierKeys.privateKey.decrypt(bignum(newSeen, 16));
        console.log('NEW VISIT')
        console.log(newVisit.toString());
        var suma = bignum(ad.seen, 16).mul(bignum(newSeen, 16)).mod(n.pow(2));
        var decryptedSum = paillierKeys.privateKey.decrypt(suma);
        console.log('TOTAL VISITS');
        console.log(decryptedSum.toString());
        //*******//
        var msg = decryptedSum.toString();
        var n2 = n.pow(2);
        console.log(paillierKeys.publicKey.g)
        var g = bignum(paillierKeys.publicKey.g);
        var r1 = bignum.rand(n);
        var bi1 = bignum(msg).mod(n);
        ad.seen = g.powm(bi1, n2).mul(r1.powm(n, n2)).mod(n2).toString(16);
        Ad.findOneAndUpdate({
            username: ad.username,
            description: ad.description,
            title: ad.title
        }, ad, {upsert: false}, function (err, doc) {
            if (err) return res.send(500, {error: err});
            var response = {
                seen: decryptedSum.toString(),
                imgurl: ad.imgurl,
                username: ad.username,
                description: ad.description,
                title: ad.title
            };
            res.status(200).json(response);
        });
        //*******//

    })
});

//Get ad by username
router.get('/user/:username', function (req, res) {
    Ad.find({username: req.params.username}, function (err, ad) {
        if (err) return res.send(500, err.message);
        res.status(200).json(ad);
    })
});

//Update ad
router.put('/:id', function (req, res) {
    Ad.findById(req.params.id, function (err, ad) {
        ad.title = req.body.title;
        ad.description = req.body.description;
        ad.price = req.body.price;

        ad.save(function (err, a) {
            if (err) return res.send(500, err.message);
            res.status(200).json(a);
        });
    })
});

//Delete ad by id
router.delete('/:id', function (req, res) {
    Ad.findById(req.params.id, function (err, ad) {
        if (err) return res.send(500, err.message);
        ad.remove(function (err) {
            if (!err) res.send("AD DELETED...!!!");
            else res.send(500, err.message);
        });
    })
});
module.exports = router;