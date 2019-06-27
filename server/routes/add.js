(function() {
  'use strict';

  function replace(string) {
    return string.replace(/'/g, "\\'");
  }

  module.exports = function(router, mysql) {
    router.put('/add/:_level', async function(req, res) {
      var words = req.body;
      var level = req.params._level;

      const query1 =
        'SELECT COALESCE(MAX(`index`),0) + 1 as newid FROM words WHERE `level`="' +
        level +
        '"';
      var result = await mysql.promisifyQuery(query1);
      const newid = result[0].newid;

      var values = [];
      words.forEach((word, index) => {
        values.push(
          "('" +
            level.charAt(0) +
            "','" +
            level +
            "'," +
            (newid + index) +
            ",'" +
            replace(word.word) +
            "','" +
            replace(word.yomigana) +
            "','" +
            replace(word.meaning) +
            "')"
        );
      });

      const insert =
        'INSERT INTO words (`lang`, `level`, `index`, `word`, `yomigana`, `meaning`) VALUES ' +
        values.join(',');

      await mysql.promisifyQuery(insert);
      res.sendStatus(200);
      return;
    });
  };
})();
