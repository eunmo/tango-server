(function () {
  'use strict';

  var express = require('express');
  var path = require('path');
  var fs = require('fs');
	var mongojs = require('mongojs');
	var db = mongojs('tango', ['words']);

  var router = express.Router();

  var routeDir = path.resolve('server/routes');

  fs.readdirSync(routeDir)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
      require(path.join(routeDir, file))(router, db);
    });

  /* GET home page. */
  router.get('/', function (req, res) {
    res.render('index');
  });

  module.exports = router;
}());
