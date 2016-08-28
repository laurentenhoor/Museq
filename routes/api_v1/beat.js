module.exports = function(router, passport) {

	var authUtil = require('./authUtil');
	var Beat = require('../../models/beat');
	var Status = require('../../models/status');

	router.get('/beat', function(req, res) {

		Beat.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, data) {
			res.json( data );
		});

	});

	router.get('/latest_winner', passport.authenticate('jwt', { session: false}), function(req, res) {

		Status.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, status) {

			var previousGeneration = status.generation-1;

			Beat.findOne({'version.generation': previousGeneration, 'version.winner': true}, function(err, data) {
				res.json( data );
			});

		});

	});


	router.get('/beats_to_vote', passport.authenticate('jwt', { session: false}), function(req, res) {


		Status.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, status) {

			Beat.find({'version.generation': status.generation}, function(err, beats) {
				
				console.log(status);
				console.log(beats);
				
				res.json(beats);
			});

		});
		
	});

	router.post('/vote', passport.authenticate('jwt', { session: false}), function(req, res) {

		var user = authUtil.getUserFromRequest(req);

		var beatId = req.body.beatId;

		if (beatId) {

			Beat.findOne({_id: beatId}, function(err, beat) {
				
				beat.vote(user, function(success) {
					
					if (success) {
						
						res.json({success: true, message: "Successfully voted!"})
						
						Beat.findOne({_id: beatId}, function(err, beat) {
							
							console.log(beat.votes.amount);
							
							// Winning beat!!
							if(beat.votes.amount >= 2) {
								Status.findOneAndUpdate({generation: beat.version.generation}, {winner: beatId}, function(err){});
								Beat.update({_id: beatId}, {'version.winner': true}, function(err) {});
								new Status({generation: beat.version.generation+1}).save()
							}
							
						});
					} else {
						res.json({success: false, message: "Unable to vote!"})	
					}
					
				});
		
			});

		} else {
			res.send({success: false, message: 'No beatId received'});
		}

	});

	// Save beat
	router.post('/beat', passport.authenticate('jwt', { session: false}), function(req, res) {

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

					Status.findOneAndUpdate({generation: beat.version.generation}, {voting : true}, function(err) {				

						if (err) {
							res.json({success: true, msg: 'Successful saved beat BUT unable to store generation status.'});
						}
						res.json({success: true, msg: 'Successful saved beat and updated generation status.'});

					});

				} else {
					res.json({success: true, msg: 'Successful saved beat.'});
				}


			});

		});

	});	


};