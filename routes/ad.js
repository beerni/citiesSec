/**
 * Created by aitor on 4/1/17.
 */
var express = require('express');
var router = express.Router();
var Ad = require('../models/ad.js');
const crypto = require("crypto");


//Add an ad
router.post('/add', function (req, res) {
    var ad = new Ad({
        _id: crypto.randomBytes(16).toString("hex"),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        username: req.body.username
    });

    ad.save(function (err, a) {
        if (err) return res.send(500, err.message);
        res.status(200).json(a);
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