var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
	'firstName' : String,
	'lastName' : String,
	'email' : String,
	'password' : String,
	isAdmin: {
		type: Boolean,
		default: false
	  }
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email'});
module.exports = mongoose.model('User', UserSchema);
