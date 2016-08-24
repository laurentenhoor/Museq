var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BeatSchema = new Schema({
	username: {
		type: String,
		required: false
	},
	created: {
		type: Date,
		required: true,
		default: Date.now
	},
	version : {
		type: Number,
		required: true
	},
	variant : {
		type : Number,
		required : true
	},
	votes : {
		amount : {
			type: Number,
			default: 0
		},
		users : {
			type: [String],
			default: [],
		},
		
	},
	instruments: {
		type: [Schema.Types.Mixed],
		required: true
	}
});

BeatSchema.methods.vote = function (user) {
	var beat = this;
	
	if (!beat.votes.users){
		console.error('Unable to find voting fields in database...')
		return null;
	}
	
    if ((beat.votes.users.indexOf(user) > -1)) {
    	console.error(user + " already voted!")
    	return null;
    } else {
    	beat.update({
    		$push: {'votes.users': user}, 
    		$inc: {'votes.amount': 1}
    	}, {
    		upsert:true
    	}, function(err, msg) {
    		console.log(user + ' voted for beat ' + beat._id);
    		return msg.ok;
    	});
    	
    }    
};
 

module.exports = mongoose.model('Beat', BeatSchema);