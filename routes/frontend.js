var express = require('express');
var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
	  res.render('index');
});

router.get('/logout', function(req, res) {
	res.render('logout');
});

module.exports = router;