(function() {
  'use strict';

  module.exports = function(router, mysql) {
    router.put('/update/word', async function(req, res) {
      var input = req.body;

      const query =
        'UPDATE words' +
        ' SET `word`="' +
        input.word +
        '", `yomigana`="' +
        input.yomigana +
        '", `meaning`="' +
        input.meaning +
        '" WHERE `level`="' +
        input.level +
        '" AND `index`=' +
        input.index;

      await mysql.promisifyQuery(query);
      res.sendStatus(200);
    });
  };
})();
