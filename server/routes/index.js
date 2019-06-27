(function() {
  'use strict';

  var express = require('express');
  var path = require('path');
  var fs = require('fs');
  var mysql = require('../db');

  module.exports = function(start) {
    var router = express.Router();

    fs.readdirSync(__dirname)
      .filter(function(file) {
        return file.indexOf('.') !== 0 && file !== 'index.js';
      })
      .forEach(function(file) {
        require(path.join(__dirname, file))(router, mysql);
      });

    /* GET home page. */
    router.get('/', function(req, res) {
      res.render(start);
    });

    return router;
  };
})();
