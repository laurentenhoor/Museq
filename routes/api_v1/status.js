module.exports = function(router, passport) {

	var authUtil = require('./authUtil');
	var Status = require('../../models/status');
	var Beat = require('../../models/beat');

	router.get('/status', passport.authenticate('jwt', { session: false}), function(req, res) {
	
		var user = authUtil.getUserFromRequest(req);
		
		Status.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, status) {

			if (!status) {
				console.log('no status')
				status = new Status({}).save(function(err, status) {
					returnStatus(status)
				});
			} else {
				returnStatus(status);
			};

			function returnStatus(status) {
				
				Beat.find({'version.generation': status.generation}, function(err, beats) {
				
					console.log(beats)
					
					var voted = false;
					var mutated = false;
					
					// Look for logged in username in the authors and voters of beats
					beats.forEach(function(beat) { 
						if (beat.votes.users.indexOf(user) > -1) {
							voted = true;
						}
						if (beat.username == user) {
							mutated = true;
						}
					});
					
					// Re-enable voting if entries are manually deleted from DB
					if (beats.length < 3) {
						status.voting = false;
					}
				
					var data = {
						user: user,
						generation: status.generation,
						voting: status.voting,
						voted: voted,
						mutated: mutated
					};
					
					res.json(data);
					
				});
				
			};

		});

	});

}