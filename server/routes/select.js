(function () {
	'use strict';

	module.exports = function (router, db) {
		
		router.get ('/select/levels', function (req, res) {
			db.words.distinct ("Level", null, function (err, data) {
				res.json (data);
			});
		});

		router.get ('/select/all', function (req, res) {
			db.words.find ().sort ({ Level: 1, index: 1 }, function (err, data) {
				res.json (data);
			});
		});
		
		router.get ('/select/cleanup', function (req, res) {
			db.words
				.find ({ Level: { $ne: 'N0' }, streak: { $lte: 1 }})
				.sort ({ Level: 1, index: 1 }, function (err, data) {
					res.json (data);
				});
		});

		router.get ('/select/:_level', function (req, res) {
			var level = req.params._level;
			db.words.find ({ Level: level }).sort ({ index: 1 }, function (err, data) {
				res.json (data);
			});
		});
	};
}());
