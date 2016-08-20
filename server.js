var express = require('express');
var app = express();

var mongoose    = require('mongoose');
var passport	= require('passport');
var jwt         = require('jwt-simple');

var config      = require('./config/database');
var portNr 		= 80;

var frontend_routes 	= require('./routes/frontend');
var api_v1_routes 		= require('./routes/api_v1');

app.use('/', frontend_routes);
app.use('/api/v1', api_v1_routes)

app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.set('view engine', 'jade');

app.listen(portNr, function () {
  console.log('Museq listening on port '+portNr+'!');
});
