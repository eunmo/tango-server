(function () {
	'use strict';

	var mongojs = require('mongojs');

	function formatDate(date) {
		var time = new Date(date);
		return time.toISOString().slice(0, 19).replace('T', ' ');
	}

	module.exports = function (router, db, mysql) {

		router.put ('/sync', async function (req, res) {
			var input = req.body;

			const query = "SELECT * FROM words WHERE `streak` < 11 ORDER BY `level`, `index`";
			var data = await mysql.promisifyQuery(query);

			var map = {};
			data.forEach(word => {map[word.level + word.index] = word});

			var updates = [];
			var learnedCount = 0;
			input.forEach(word => {
				if (word.learned === false || word.streak <= 0 || word.level === undefined)
					return;

				var storedWord = map[word.level + word.index];

				if (storedWord === undefined)
					return;

				var storedDate = formatDate(storedWord.lastCorrect);
				var inputDate = formatDate(word.lastCorrect);

				if (storedDate !== inputDate) {
					updates.push("UPDATE words" +
						" SET `learned`=" + word.learned +
						", `streak`=" + word.streak +
						", `lastCorrect`=\"" + inputDate +
						"\" WHERE `level`=\"" + word.level +
						"\" AND `index`=" + word.index);

					if (word.streak === 11)
						learnedCount++;
				}
			});

			if (updates.length > 0) {
				await mysql.promisifyQuery(updates.join(';'));

				if (learnedCount > 0)
					data = await mysql.promisifyQuery(query);
			}
				
			res.json(data);
		});
	};
}());
