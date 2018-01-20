(function () {
  'use strict';

  var express = require ('express');
  var path = require ('path');
  var fs = require ('fs');

  module.exports = function (db, start) {
		var router = express.Router ();

		fs.readdirSync (__dirname)
			.filter (function (file) {
				return (file.indexOf ('.') !== 0) && (file !== 'index.js');
			})
		.forEach (function (file) {
			require (path.join (__dirname, file)) (router, db);
		});

		/* GET home page. */
		router.get ('/', function (req, res) {
			res.render (start);
		});

	 	return router;
	};
}());
