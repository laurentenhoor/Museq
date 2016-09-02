var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
	res.sendfile('./public/index.html');
});

router.get('/logout', function(req, res) {
	res.sendfile('./public/logout.html');
});

module.exports = router;