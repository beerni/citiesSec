/**
 * Created by aitor on 4/1/17.
 */
var express = require('express');
var formidable = require('formidable');
var fs = require('fs-extra');
var crypto = require('crypto');
var Ad = require('../models/ad.js');
var router = express.Router();
var base_url = "https://localhost:8080";

//Add an ad
router.post('/add', function (req, res) {
    if (!req.body.imgurl) req.body.imgurl = base_url + 'img/ad-img/default_img.png';
    var ad = new Ad({
        _id: crypto.randomBytes(16).toString("hex"),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        username: req.body.username,
        imgurl: req.body.imgurl
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
                fs.unlink(tmp_path, function (callback) {});
            });
        }
    });

    Ad.findById(req.params.id, function (err, ad) {
        ad.imgurl = base_url + '/web/img/ad-img/' + filname;

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
router.get('/:id', function (req, res) {
    Ad.findById(req.params.id, function (err, ad) {
        if (err) return res.send(500, err.message);
        res.status(200).json(ad);
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