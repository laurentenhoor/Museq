var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BeatSchema = new Schema({
	username: {
		type: String,
		required: false
	},
	created: {
		type: Date,
		default: Date.now,
		unique: false,
		required: true
	},
	instruments: {
		type: [Schema.Types.Mixed],
		required: true
	}
});

module.exports = mongoose.model('Beat', BeatSchema);