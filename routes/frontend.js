var express = require('express');
var router = express.Router();
var path = require('path');

// define the home page route
router.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

router.get('/logout', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/logout.html'));
});

module.exports = router;