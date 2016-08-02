(function () {
	'use strict';

	module.exports = function (router, db) {
		router.get ('/meta', function (req, res) {
			db.words.find ({ learned: true, streak: { $lte: 10 } },
										 { _id: 0, streak: 1, lastCorrect: 1, learned: 1 },
										 function (err, data) {
				res.json (data);
			});
		});
	};
}());
		
