(function () {
	'use strict';

	var mongojs = require('mongojs');

	module.exports = function (router, db, mysql) {

		router.put ('/remove/word', async function (req, res) {
			var input = req.body;
			
			const query = "DELETE FROM words" +
				" WHERE `level`=\"" + input.level +
				"\" AND `index`=" + input.index;

			await mysql.promisifyQuery(query);
			res.sendStatus(200);
		});
	};
}());
