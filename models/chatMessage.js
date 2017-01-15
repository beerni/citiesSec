/**
 * Created by scii on 10/01/17.
 */
var mongoose = require('mongoose');


Schema = mongoose.Schema;
var chat = mongoose.model('Chat');

var chatMessageSchema = new Schema({

    username: {
        type: String
    },
    message: {
        type: String
    },
    chatid: {
        type: mongoose.Schema.Types.ObjectId, ref: "Chat"
    },
    crypted: {
        type: Boolean
    }
});

module.exports = mongoose.model('chatMessage', chatMessageSchema);