var express = require('express');
var router = express.Router();


require('./api_v1/auth')(router)


module.exports = router;