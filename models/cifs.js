/**
 * Created by bernatmir on 28/12/16.
 */
var mongoose = require('mongoose');


Schema = mongoose.Schema;

var cifSchema = new Schema({

    hashedCIF: {
        type: String
    }
});

module.exports = mongoose.model('CIFs', cifSchema);