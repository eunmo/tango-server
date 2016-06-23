(function () {
	'use strict';

	var mongojs = require('mongojs');

	module.exports = function (router, db) {

		router.put ('/sync', function (req, res) {
			var input = req.body;
			
			db.words.find ().sort ({ Level: 1, index: 1 }, function (err, data) {
				var i, j;
				var word;

				res.json (data);

				for (i in input) {
					word = input[i];

					db.words.update (
						{ Level: word.Level, index: word.index },
						{ $set: {
								learned: word.learned,
								streak: word.streak,
								lastCorrect: word.lastCorrect
							}
						}
					);
				}
			});
		});
	};
}());
