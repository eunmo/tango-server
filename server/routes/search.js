(function () {
	'use strict';

	module.exports = function (router, db, mysql) {
		
		router.get ('/search/:_word', function (req, res) {
			var word = req.params._word;

			var array = word.split(/[\[（·]/).map(e => { return e.replace(']', '').replace('）', '').trim() });
			var filters = [];

			for (var i = 0; i < array.length; i++) {
				word = array[i];
				filters.push("`word` LIKE \"%" + word + "%\"");
				filters.push("`yomigana` LIKE \"%" + word + "%\"");
				filters.push("`meaning` LIKE \"%" + word + "%\"");
			}

			const query = "SELECT * FROM words WHERE " + filters.join(" OR ") +
				" ORDER BY `level`, `index`";

			mysql.jsonQuery(query, res);
		});
	};
}());
