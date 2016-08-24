var express = require('express');
var router = express.Router();

var passport = require('passport');
require('../config/passport')(passport);

require('./api_v1/auth')(router, passport);
require('./api_v1/status')(router, passport);
require('./api_v1/beat')(router, passport);

module.exports = router;