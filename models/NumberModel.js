var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var NumberSchema = new Schema({
	'number' : {
		type: String,
		index:true,
		unique: true,
		required: true,
		validate: {
			validator: function(v) {
			  return /^((7[273])|(8[234]))[0-9]{5}$/.test(v);
			},
			message: props => `${props.value} is not a valid digicel number!`
		  }
	},
	'submittedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'dateAdded' : Date
});

module.exports = mongoose.model('Number', NumberSchema);
