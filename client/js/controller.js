tangoApp.controller ('NavCtrl', function ($rootScope, $scope, $http) {
	
	$scope.levels = [];	

	$http.get ('select/levels').success (function (data) {
		$scope.levels = data;
		$scope.levels.push ('all');
	});
});

tangoApp.controller ('MetaCtrl', function ($rootScope, $scope, $http) {

	$scope.meta = [];
	$scope.streaks = [];
	$scope.levels = [];	
	$scope.newWordCount = 0;
	$scope.selectedLevel = '';

	function fixDate (date, streak) {
		var baseDate = new Date (date);
		var dateOffset = baseDate.getDate () + streak;

		if (baseDate.getHours() < 5) {
			dateOffset -= 1;
		}

		baseDate.setDate(dateOffset);
		return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
	}

	$http.get ('meta').success (function (data) {
		var i;
		var now = new Date();

		for (i = 0; i <= 10; i++) {
			var newDate = fixDate (new Date (now), 0);
			newDate.setDate (newDate.getDate() + i);
			var streaks = [];

			for (var j = 0; j < Math.min(10, 11 - i); j++) {
				streaks.push ({ sum: 0, levels: {}});
			}

			$scope.meta[i] = {
				date: newDate,
				streaks: streaks,
				sum: 0
			};
		}
	
		for (i = 0; i < 10; i++) {
			$scope.streaks[i] = 0;
		}

		for (i in data) {
			var row = data[i];
			var streak = Math.max(row.streak, 1);
			var testDay = fixDate (row.lastCorrect, streak);
			now = fixDate (new Date (), 0);
			var index = (testDay - now) / 86400000;

			if (index >= 0) {
				$scope.streaks[10 - streak] += 1;
				$scope.meta[index].streaks[10 - streak].sum += 1;
				$scope.meta[index].sum += 1;

				if ($scope.meta[index].streaks[10 - streak].levels[row.Level] === undefined) {
					$scope.meta[index].streaks[10 - streak].levels[row.Level] = 0;
				}

				$scope.meta[index].streaks[10 - streak].levels[row.Level] += 1;
			}
		}
	});

	$http.get ('level_summary').success (function (data) {
		var i, j;
		var row;
		var levels = {};
		var level;
		for (i in data) {
			row = data[i];
			if (levels[row.Level] === undefined) {
				level = { name: row.Level, streaks: [], learned: 0, total: 0 };

				for (j = 0; j < 10; j++) {
					level.streaks[j] = 0;
				}

				levels[row.Level] = level;
			}

			level = levels[row.Level];

			if (row.learned) {
				if (row.streak === 11) {
					level.learned += row.count;
				}
				else {
					level.streaks[10 - Math.max(row.streak, 1)] += row.count;
				}
			}
			else {
				$scope.newWordCount += row.count;
			}

			level.total += row.count;
		}

		for (i in levels) {
			$scope.levels.push(levels[i]);
		}
		$scope.levels.sort(function(a, b) { return (a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0); });
	});

	$scope.selectLevel = function (level) {
		if ($scope.selectedLevel === level) {
			$scope.selectedLevel = '';
		}
		else {
			$scope.selectedLevel = level;
		}
	};
});

tangoApp.controller ('WordCtrl', function ($rootScope, $scope, $http, $routeParams) {

	$scope.words = [];
	$scope.orderBy = '';
	$scope.order = 0;

	$http.get ('select/' + $routeParams.level).success (function (data) {
		$scope.words = data;

		for (var i in $scope.words) {
			var word = $scope.words[i];

			if (word.streak <= 0) {
				word.minus = true;
			} else if (word.streak > 10) {
				word.done = true;
			}
		}
	});

	$scope.beginEdit = function (word) {
		word.inEdit = true;
	};

	$scope.cancel = function (word) {
		word.inEdit = false;
	};

	$scope.commit = function (word) {
		$http.put ('update/word', word)
		.then (function (res) {
			word.inEdit = false;
		});
	};

	$scope.changeOrderBy = function () {
		$scope.order = ($scope.order + 1) % 3;
		if ($scope.order === 0) {

			if ($scope.Selectedlevel === 'all') {
				$scope.orderBy = 'Level, index';
			} else {
				$scope.orderBy = 'index';
			}
		} else if ($scope.order === 1) {
			$scope.orderBy = ['-learned', 'streak'];
		} else {
			$scope.orderBy = ['-learned', '-streak'];
		}
	};
});

tangoApp.controller ('CleanupCtrl', function ($rootScope, $scope, $http) {

	$scope.words = [];
	$scope.orderBy = '';
	$scope.order = 0;
	$scope.selectedLevel = 'all';

	$http.get ('select/cleanup').success (function (data) {
		$scope.words = data;

		for (var i in $scope.words) {
			var word = $scope.words[i];

			if (word.streak <= 0) {
				word.minus = true;
			} else if (word.streak > 10) {
				word.done = true;
			}
		}
	});

	$scope.changeOrderBy = function () {
		$scope.order = ($scope.order + 1) % 3;
		if ($scope.order === 0) {

			if ($scope.Selectedlevel === 'all') {
				$scope.orderBy = 'Level, index';
			} else {
				$scope.orderBy = 'index';
			}
		} else if ($scope.order === 1) {
			$scope.orderBy = ['-learned', 'streak'];
		} else {
			$scope.orderBy = ['-learned', '-streak'];
		}
	};
});

tangoApp.controller ('AddCtrl', function ($rootScope, $scope, $http, $location, $routeParams) {

	$scope.words = [];

	function getLevelName() {
		var lang = $routeParams.lang;
		var today = new Date();
		var yymm = today.toISOString().substring(2, 7).replace(/-/g,'');

		return lang + yymm;
	}

	$scope.levelName = getLevelName();
	
	$scope.newLine = function () {
		$scope.words.push ({ word: '', yomigana: '', meaning: '' });
	};

	$scope.newLine ();

	$scope.newWordInput = function (word) {
		var sqIndex = word.word.indexOf('[');

		if (sqIndex !== -1) {
			word.yomigana = word.word.substr (0, sqIndex).trim ();
			word.word = word.word.substr (sqIndex + 1).replace (']', '').trim ();
		}

		var mdIndex = word.word.lastIndexOf('·');

		if (mdIndex !== -1) {
			word.word = word.word.substr (mdIndex + 1).trim ();
		}
	};

	$scope.newWordAdded = function (index) {
		if ($scope.words.length === index + 1 && $scope.words.length > 1) {
			$scope.newLine ();
		}
	};

	$scope.submit = function () {
		var words = [];

		for (var i in $scope.words) {
			var word = $scope.words[i];

			if (word.word !== '') {
				words.push (word);
			}
		}

		if (words.length > 0) {
			$http.put('add/' + $scope.levelName, words)
				.then (function (res) {
					$location.url ('/');
				});
		}
	};
});
