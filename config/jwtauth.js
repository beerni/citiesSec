/**
 * Created by bernatmir on 4/1/17.
 */
var anonimousModel = require('../models/anonimousUser.js');
var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
    var hasToken=false;
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        console.log('tenemos token');
        hasToken = true;
        try {
            var decoded = jwt.decode(token, 'secret');
            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400);
            }
            else {
                next();
            }
            /*anonimousModel.findOne({username: decoded.iss }, function(err, user) {
                req.user = user;
                console.log(req.user);
            });*/

        } catch (err) {
            console.log(err);
            return next();
        }
    } else {
        console.log('NO TOKEN');
        res.status(400).send('Token no válido');

    }
};