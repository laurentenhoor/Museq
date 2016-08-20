module.exports = function(router, passport) {
	
	var authUtil = require('./authUtil');
	
	router.get('/song/latest', passport.authenticate('jwt', { session: false}), function(req, res) {
			res.send('Successful authorization of: '+ authUtil.getUserFromRequest(req));
		});
			
}