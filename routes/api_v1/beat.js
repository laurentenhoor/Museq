module.exports = function(router, passport) {
	
	var authUtil = require('./authUtil');
	var Beat = require('../../models/beat')
	
	router.get('/beat/auth', passport.authenticate('jwt', { session: false}), function(req, res) {
		res.send('Successful authorization of: '+ authUtil.getUserFromRequest(req));
	});
	
	router.get('/beat', function(req, res) {
		
		Beat.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, data) {
		  res.json( data );
		});
		
	});

	router.get('/beats_to_vote', function(req, res) {
		
		var beats = [];
		
		Beat.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, data) {
			beats.push(data);
			res.json( beats );
		});
		
	});

	router.post('/beat', function(req, res) {

		var user = authUtil.getUserFromRequest(req);
		var beat = req.body;
		
		var newBeat = new Beat({
			username: user,
			instruments: beat
		});
		
		newBeat.save(function(err) {
			if (err) {
				return res.json({success: false, msg: 'Failed to save beat.'});
			}
			res.json({success: true, msg: 'Successful saved beat.'});
		});
		
	});
			
}