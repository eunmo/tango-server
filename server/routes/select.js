(function() {
  'use strict';

  module.exports = function(router, mysql) {
    router.get('/select/new', function(req, res) {
      var query =
        'SELECT * FROM words WHERE `learned` = false ORDER BY `level`, `index`';
      mysql.jsonQuery(query, res);
    });

    router.get('/select/:_level', function(req, res) {
      var level = req.params._level;
      var query =
        'SELECT * FROM words WHERE `level` = "' + level + '" ORDER BY `index`';
      mysql.jsonQuery(query, res);
    });
  };
})();
