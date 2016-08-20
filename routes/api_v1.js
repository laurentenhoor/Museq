var express = require('express');
var router = express.Router();

require('./api_v1/auth')(router);
require('./api_v1/track')(router);

module.exports = router;