(function () {
	'use strict';

	module.exports = function (router, db) {
		
		router.get ('/search/:_word', function (req, res) {
			var word = req.params._word;
			db.words
			  .find ({ $or: [ { word: { $regex: word } },
											  { yomigana: { $regex: word } },
												{	meaning: { $regex: word } } ] })
			  .sort ({ Level: 1, index: 1 }, function (err, data) {
				res.json (data);
			});
		});
	};
}());
