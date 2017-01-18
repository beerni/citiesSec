/**
 * Created by scii on 8/01/17.
 */
var mongoose = require('mongoose');


Schema = mongoose.Schema;
//var chat = mongoose.model('Ad');

var chatSchema = new Schema({

    username: [{
        type: String
    }],
    idProduct: {
        type: String
    },
    productName: {
        type: String
    }
});

module.exports = mongoose.model('Chat', chatSchema);
