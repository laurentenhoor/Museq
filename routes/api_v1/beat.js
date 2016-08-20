module.exports = function(router, passport) {
	
	var authUtil = require('./authUtil');
	
	router.get('/beat/latest', passport.authenticate('jwt', { session: false}), function(req, res) {
		res.send('Successful authorization of: '+ authUtil.getUserFromRequest(req));
	});

	router.post('/beat', function(req, res) {
		
		console.log('post /beat');
		
		beat = req.body;
			
		console.log(beat);
		
		res.json({sucess: 'true'});
		
	});
			
}