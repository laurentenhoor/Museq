var jwt = require('jwt-simple');
var config = require('../../config/database');

function getToken(headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

module.exports.getUserFromRequest = function(req) {	
	var token = getToken(req.headers);
	if (token) {
		var decoded = jwt.decode(token, config.secret);
		return decoded.name
	} else {
		return null;
	}
}