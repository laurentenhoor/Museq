var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusSchema = new Schema({
	generation : {
		type: Number,
		default: 1
	},
	created : {
		type: Date,
		required: true,
		default: Date.now
	},
	voting : {
		type: Boolean,
		default: false,
	},
	winner : {
		type: Schema.Types.ObjectId,
		default: null
	} 
});

module.exports = mongoose.model('Status', StatusSchema);