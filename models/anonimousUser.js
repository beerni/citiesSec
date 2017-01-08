/**
 * Created by bernatmir on 28/12/16.
 */
var mongoose = require('mongoose');


Schema = mongoose.Schema;

var anonimousUserSchema = new Schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    publicKey: {
        type: String
    }
});

module.exports = mongoose.model('AnonimousUser', anonimousUserSchema);