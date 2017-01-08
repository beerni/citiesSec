/**
 * Created by scii on 8/01/17.
 */
var mongoose = require('mongoose');


Schema = mongoose.Schema;

var chatSchema = new Schema({

    username: [{
        type: String
    }],
    txt: {
        type: String
    },
    idProduct: {
        type: String
    }
});

module.exports = mongoose.model('Chat', chatSchema);