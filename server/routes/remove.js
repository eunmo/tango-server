(function () {
	'use strict';

	var mongojs = require('mongojs');

	module.exports = function (router, db) {

		router.put ('/remove/word', function (req, res) {
			var input = req.body;
			
			db.words.remove(
				{ _id: mongojs.ObjectId (input._id) },
				null,
				function (err, data) {
					res.sendStatus (200);
				}
			);
		});
	};
}());
