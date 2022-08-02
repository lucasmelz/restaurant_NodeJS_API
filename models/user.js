var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    firstName :{
        type: String,
        default: ''
    },
    lastName:{
        type: String,
        default: ''
    },
    facebookId:String,
    admin:{
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', User);

