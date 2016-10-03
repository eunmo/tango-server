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
		
		router.get ('/level_summary', function (req, res) {
			db.words.aggregate ([
				{
					$group: {
						_id: { Level: '$Level', streak: '$streak', learned: '$learned' },
						count: { $sum : 1 }
					}
				},
				{
					$project: {
						_id: 0,
						Level: '$_id.Level', streak: '$_id.streak', learned: '$_id.learned',
						count: 1
					}
				}
			], function (err, data) {
				res.json (data);
			});
		});
	};
}());
		
