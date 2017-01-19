/**
 * Created by aitor on 4/1/17.
 */
var mongoose = require('mongoose');

Schema = mongoose.Schema;

var adSchema = new Schema({
        _id: {
            type: String
        },
        title: {
            type: String
        },
        price: {
            type: String
        },
        description: {
            type: String
        },
        username: {
            type: String
        },
        imgurl: {
            type: String
        },
        seen:{
            type:String
        }
    },
    {
        _id: false,
        versionKey: false // You should be aware of the outcome after set to false (elimina __V)
    });

module.exports = mongoose.model('Ad', adSchema);