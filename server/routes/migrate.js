(function () {
	'use strict';

	function replace(string) {
		return string.replace(/'/g, "\\\'");
	}

	module.exports = function (router, db, mysql) {
		
		router.get('/migrate/:_Level', function (req, res) {
			var Level = req.params._Level;
			var lang = Level.charAt(0);

			if (lang === 'N')
				lang = 'J';

			db.words.find({ Level: Level }, async function (err, data) {
				if (data.length === 0) {
					res.json([data.length, lang]);
					return;
				}

				var values = [];
				data.forEach(word => {
					var time = new Date(word.lastCorrect);
      		var lastCorrect = time.toISOString().slice(0, 19).replace('T', ' ');
					var value = "(\'" + lang + "\',\'" + Level + "\'," + word.index +
						",\'" + replace(word.word) +
						"\',\'" + replace(word.yomigana) + "\',\'" + replace(word.meaning) +
						"\'," + word.learned + "," + word.streak + ",\'" + lastCorrect + "\')";
					values.push(value);

				});

				var insert = "INSERT INTO words (`lang`, `level`, `index`, `word`, `yomigana`, `meaning`, `learned`, `streak`, `lastCorrect`) VALUES " + values.join(',');

				await mysql.promisifyQuery(insert);

				res.json([data.length, values.length, lang]);
			});
		});
	};
}());
