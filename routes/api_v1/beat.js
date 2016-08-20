module.exports = function(router, passport) {
	
	var authUtil = require('./authUtil');
	var Beat = require('../../models/beat')
	
	router.get('/beat/latest', passport.authenticate('jwt', { session: false}), function(req, res) {
		res.send('Successful authorization of: '+ authUtil.getUserFromRequest(req));
	});

	router.post('/beat', function(req, res) {

		console.log('post /beat');
		var user = authUtil.getUserFromRequest(req);
		console.log(user);
		var beat = req.body;
		console.log(beat);
		
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