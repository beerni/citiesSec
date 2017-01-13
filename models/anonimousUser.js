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
    bits: {
            type: String
    },
    n: {
            value: [{type: Number}],
            sign: {type: Boolean},
            isSmall: {type: Boolean}
    },
    e: {
            value: {type: Number},
            sign: {type: Boolean},
            isSmall: {type: Boolean}
    }
});

module.exports = mongoose.model('AnonimousUser', anonimousUserSchema);