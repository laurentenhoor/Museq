module.exports = function(router, passport) {

	var authUtil = require('./authUtil');
	var Status = require('../../models/status');
	var Beat = require('../../models/beat');
	var User = require('../../models/user');

	router.get('/status', function(req, res, next) {

		console.log('GET /status');

		passport.authenticate('jwt', function(err, user, info) {

			if (err) { 
//				res.json({success: false});
				return; 
			}
			if (!user) { 				 
				res.json({success: false, msg: 'User does not exist (anymore)'});
				return;
			}

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

						var voted = false;
						var mutated = false;
						var voters = [];

						// Look for logged in username in the authors and voters of beats
						beats.forEach(function(beat) {

							if (!beat.votes.users) {
								beat.votes.users = [];
							}
							if (beat.votes.users.indexOf(user) > -1) {
								voted = true;
							}
							if (beat.username == user) {
								mutated = true;
							}
							beat.votes.users.forEach(function(user) {
								voters.push(user);
							});
						});

						// Re-enable voting if entries are manually deleted from DB
						if (beats.length < 3) {
							status.voting = false;
						}

						Beat.findOne({'version.generation': status.generation-1, 'version.winner': true}, function(err, beat) {

							User.findOne({name: user}, function(err, user) {

								if (!status.notifications) {
									status.notifications = [];
								}
								
								var notification = false; 
								console.log(user.email)
								if (!user.email) {
									notification = false;
								} else if (status.notifications.indexOf(user.email) > -1) {
									notification = true;
								}

								var data = {
										success: true,
										user: user.name,
										generation: status.generation,
										voting: status.voting,
										voted: voted,
										voters: voters,
										variants: beats.length,
										winnerPrevGen: beat.username,
										mutated: mutated,
										email: user.email,
										notification: notification
								};

								console.log(data)

								res.json(data);	

							});


						})





					});

				};

			});


		})(req, res, next);// authenticate


	});// GET status

}