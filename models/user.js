/**
 * Created by bernatmir on 11/12/16.
 */
var mongoose = require('mongoose');


Schema = mongoose.Schema;

var userSchema = new Schema({

    socialReason: {
        type: String
    },
    hashedCIF: {
        type: String
    },
    salt: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);