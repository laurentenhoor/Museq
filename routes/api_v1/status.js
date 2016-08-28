module.exports = function(router, passport) {

	var authUtil = require('./authUtil');
	var Status = require('../../models/status');
	var Beat = require('../../models/beat');

	router.get('/status', function(req, res) {

		// TODO
		// case 1: waiting for # more votes until next generation, you have voted for this, 
		//		   create a mutation in advance, or play around in sandbox mode
		// case 2: not enough mutations in generation #, please create one here!'

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
				
				Beat.count({'version.generation': status.generation}, function(err, amount) {
					
					if (amount < 3) {
						status.voting = false;
					}
					
					res.json(status);
					
				});
				
			};

		});

	});

}