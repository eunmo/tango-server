(function() {
  'use strict';

  var express = require('express');
  var http = require('http');
  var path = require('path');
  var ejs = require('ejs');
  var bodyParser = require('body-parser');

  var mongojs = require('mongojs');
  var db = mongojs('tango-es', ['words']);
  var routes = require('./routes/index')(db, 'index-es');

  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');

  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(express.static(path.join(__dirname, '../client')));

  app.use('/', routes);

  var server = app.listen(3011, function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  module.exports = app;
})();
