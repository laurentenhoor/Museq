var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//connect to database
mongoose.connect('museq');
 
// pass passport for configuration
require('../config/passport')(passport);

// EXAMPLE: middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

router.post('/signup', function(req, res) {
	  if (!req.body.name || !req.body.password) {
		    res.json({success: false, msg: 'Please pass name and password.'});
		  } else {
		    var newUser = new User({
		      name: req.body.name,
		      password: req.body.password
		    });
		    // save the user
		    newUser.save(function(err) {
		      if (err) {
		        return res.json({success: false, msg: 'Username already exists.'});
		      }
		      res.json({success: true, msg: 'Successful created new user.'});
		    });
		  }
		});

module.exports = router;