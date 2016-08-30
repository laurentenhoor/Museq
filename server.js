var express = require('express');
var app = express();

var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.database);

var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var passport = require('passport');
app.use(passport.initialize());

app.set('view engine', 'jade');

var frontend_routes = require('./routes/frontend');
var api_v1_routes = require('./routes/api_v1');

app.use('/', frontend_routes);
app.use('/api/v1', api_v1_routes)

app.use(express.static(__dirname + '/public'));

var portNr = 3000;
app.listen(portNr, function () {
  console.log('Museq listening on port '+portNr+'!');
});