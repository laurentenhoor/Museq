module.exports = function(router, passport) {
	
	var Beat = require('../../models/beat');
	var User = require('../../models/user');
	var Status = require('../../models/status');
	
	var notify = require('./notify');
	var authUtil = require('./authUtil');
	
	router.get('/beat', function(req, res) {

		console.log('GET /beat');
		
		Beat.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, data) {
			res.json( data );
		});
		
	});
	
	function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	
	router.post('/notify_me', passport.authenticate('jwt', { session: false}), function(req, res) {

		
		var user = authUtil.getUserFromRequest(req);
		var email = req.body.email;

		if (!validateEmail(email)) {
			res.json({success: false, msg: 'Please enter a valid email address.'});
			return;
		}

		User.findOneAndUpdate({name: user}, {email: email}, function(err) {

			if (err) {
				res.json({success: false, msg: 'Error'});
				return;
			}

			Status.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, status) {

				Status.update({_id: status._id}, {$addToSet: { notifications: email }}, function(err, status) {

					console.log(err)
					if (err) {
						res.json({success: false, msg: err});
						return;
					} 
					res.json({success: true});

				});
			});


		});
		
		
	});



	router.get('/latest_winner', function(req, res) {
		
		console.log('GET /latest_winner');
		
		Status.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, status) {

			var previousGeneration = status.generation-1;

			Beat.findOne({'version.generation': previousGeneration, 'version.winner': true}, function(err, data) {
				res.json( data );
			});

		});

	});


	router.get('/beats_to_vote', passport.authenticate('jwt', { session: false}), function(req, res) {

		console.log('GET /beats_to_vote');

		Status.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, status) {

			Beat.find({'version.generation': status.generation}, function(err, beats) {

				console.log(status);
				console.log(beats);

				res.json(beats);
			});

		});

	});

	router.post('/vote', passport.authenticate('jwt', { session: false}), function(req, res) {

		console.log('POST /vote');

		var user = authUtil.getUserFromRequest(req);

		var beatId = req.body.beatId;

		if (typeof beatId === 'undefined') {
			res.send({success: false, message: 'No beatId received'});
			return;
		}

		Beat.findOne({_id: beatId}, function(err, beat) {

			if(err) {
				res.json({success: false, message: "Unable to find beat!"});
				return;
			}
			
			beat.vote(user, function(success) {

				if (!success) {
					res.json({success: false, message: "Unable to vote!"});
					return;
				}
				res.json({success: true, message: "Successfully voted!"});
				
				// Look if we have a winner after this vote
				Beat.findOne({_id: beatId}, function(err, beat) {

					console.log(beat.votes.amount + ' votes for this beat...');

					// Winning beat requirement!!
					if(beat.votes.amount >= 2) {

						Status.findOne({generation: beat.version.generation}, function(err, status){

							notify.general(status.notifications);
							Status.findOneAndUpdate({generation: beat.version.generation}, {winner: beatId, notifications: null}, function(err){});

						});

						Beat.update({_id: beatId}, {'version.winner': true}, function(err) {});
						new Status({generation: beat.version.generation+1}).save()
					}
					
					
				});
			
			});

		});

	});

	// Save beat
	router.post('/beat', passport.authenticate('jwt', { session: false}), function(req, res) {

		console.log('POST /beat');

		var user = authUtil.getUserFromRequest(req);
		var beat = req.body;

		console.log(beat)

		Beat.count({'version.generation': beat.version.generation}, function(err, variantCount) {

			var newVariant = variantCount+1;

			var newBeat = new Beat({
				username: user,
				instruments: beat.instruments,
				version : {
					generation: beat.version.generation,
					variant : newVariant
				}
			});

			newBeat.save(function(err) {
				if (err) {
					return res.json({success: false, msg: 'Failed to save beat.'});
				}

				if (newVariant >= 3) {

					Status.findOne({generation: beat.version.generation}, function(err, status){

						notify.general(status.notifications);

						Status.findOneAndUpdate({generation: beat.version.generation}, {voting : true, notifications : null}, function(err) {				

							if (err) {
								res.json({success: true, msg: 'Successful saved beat BUT unable to store generation status.'});
							}
							res.json({success: true, msg: 'Successful saved beat and updated generation status.'});

						});

					});

				} else {
					res.json({success: true, msg: 'Successful saved beat.'});
				}


			});

		});

	});	


};