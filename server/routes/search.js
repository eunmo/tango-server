(function () {
	'use strict';

	module.exports = function (router, db) {
		
		router.get ('/search/:_word', function (req, res) {
			var word = req.params._word;

			var array = word.split(/[\[\(·]/).map(e => { return e.replace(']', '').replace(')', '').trim() });
			var filters = [];

			for (var i = 0; i < array.length; i++) {
				word = array[i];
				filters.push({ word: { $regex: word } });
				filters.push({ yomigana: { $regex: word } });
				filters.push({ meaning: { $regex: word } });
			}

			db.words
			  .find ({ $or: filters })
			  .sort ({ Level: 1, index: 1 }, function (err, data) {
				res.json (data);
			});
		});
	};
}());
