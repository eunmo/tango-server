(function () {
	'use strict';

	var mongojs = require('mongojs');

	module.exports = function (router, db) {

		router.put ('/add/:_Level', function (req, res) {
			var words = req.body;
			var Level = req.params._Level;

			db.words.find ({ Level: Level }).sort ({ index: -1 }).limit(1, function (err, data) {
				var baseIndex = 1;

				if (data.length > 0) {
					baseIndex = data[0].index + 1;
				}

				for (var i in words) {
					var word = words[i];
					var newWord = {
						Level: Level,
						index: baseIndex + Number(i),
						word: word.word,
						yomigana: word.yomigana,
						meaning: word.meaning,
						learned: false,
						streak: 0
					};

					db.words.insert (newWord);
				}

				res.sendStatus (200);
			});
		});
	};
}());
