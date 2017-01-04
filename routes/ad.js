/**
 * Created by aitor on 4/1/17.
 */
var express = require('express');
var router = express.Router();
var Ad = require('../models/ad.js');
const crypto = require("crypto");


//Add an ad
router.post('/add', function (req, res) {
    console.log(req.body.username);
    var add = new Ad({
        _id: crypto.randomBytes(16).toString("hex"),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        username: req.body.username
    });

    add.save(function (err, users) {
        if (err) return res.send(500, err.message);
        res.status(200).json(users);
    });
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

module.exports = router;