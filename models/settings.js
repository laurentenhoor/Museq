var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingsSchema = new Schema({
	version : {
		type: Number,
		default: 1
	},
	created : {
		
	}
});

module.exports = mongoose.model('Settings', SettingsSchema);