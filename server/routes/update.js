(function () {
	'use strict';

	var mongojs = require('mongojs');

	module.exports = function (router, db) {

		router.put ('/update/word', function (req, res) {
			var input = req.body;
			
			db.words.update(
				{ _id: mongojs.ObjectId (input._id) },
				{ $set: { word: input.word, yomigana: input.yomigana, meaning: input.meaning } },
				null,
				function (err, data) {
					res.sendStatus (200);
				}
			);
		});
	};
}());
