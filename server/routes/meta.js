(function() {
  'use strict';

  module.exports = function(router, mysql) {
    router.get('/meta', function(req, res) {
      const query =
        'SELECT `streak`, `lastCorrect`, `learned`, `level` FROM words WHERE `streak` < 11';
      mysql.jsonQuery(query, res);
    });

    router.get('/level_summary', function(req, res) {
      const query =
        'SELECT `level`, `streak`, count(*) as count FROM words GROUP BY `level`, `streak`';
      mysql.jsonQuery(query, res);
    });

    router.get('/lang_summary', function(req, res) {
      const query =
        'SELECT `lang`, `streak`, count(*) as count FROM words GROUP BY `lang`, `streak`';
      mysql.jsonQuery(query, res);
    });
  };
})();
