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
	$scope.langs = [];
	$scope.newWordCount = 0;
	$scope.selectedLevel = '';
	$scope.selectedLang = '';

	function fixDate (date, streak) {
		var baseDate = new Date (date);
		var dateOffset = baseDate.getDate () + streak;

		if (baseDate.getHours() < 5) {
			dateOffset -= 1;
		}

		baseDate.setDate(dateOffset);
		return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
	}

	function getLang (level) {
		var head = level.charAt(0);
		var lang;

		switch (head) {
			case 'N':
				lang = 'J';
				break;

			default:
				lang = head;
				break;
		}

		return lang;
	}

	$http.get ('meta').success (function (data) {
		var i, j;
		var now = new Date();
		var newDate, streaks;

		for (i = 0; i <= 10; i++) {
			newDate = fixDate (new Date (now), 0);
			newDate.setDate (newDate.getDate() + i);
			streaks = [];

			for (j = 0; j < Math.min(10, 11 - i); j++) {
				streaks.push ({ sum: 0, levels: {}, langs: { E: 0, F: 0, J: 0 }});
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

		var row, streak, testDay, index, lang;
		for (i in data) {
			row = data[i];
			streak = Math.max(row.streak, 1);
			testDay = fixDate (row.lastCorrect, streak);
			now = fixDate (new Date (), 0);
			index = (testDay - now) / 86400000;

			if (index >= 0) {
				$scope.streaks[10 - streak] += 1;
				$scope.meta[index].streaks[10 - streak].sum += 1;
				$scope.meta[index].sum += 1;

				if ($scope.meta[index].streaks[10 - streak].levels[row.Level] === undefined) {
					$scope.meta[index].streaks[10 - streak].levels[row.Level] = 0;
				}

				$scope.meta[index].streaks[10 - streak].levels[row.Level] += 1;

				lang = getLang(row.Level);
				$scope.meta[index].streaks[10 - streak].langs[lang] += 1;
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

		var langMap = {};
		var lang;
		for (i in $scope.levels) {
			level = $scope.levels[i];
			lang = level.name.charAt(0);

			if (langMap[lang] === undefined) {
				langMap[lang] = { lang: lang, levels: [] };
			}

			langMap[lang].levels.push(level);
		}

		for (i in langMap) {
			$scope.langs.push(langMap[i]);
		}
		$scope.langs.sort(function(a, b) { return (a.lang < b.lang) ? -1 : ((a.lang > b.lang) ? 1 : 0); });
	});

	$scope.selectLevel = function (level) {
		if ($scope.selectedLevel === level) {
			$scope.selectedLevel = '';
			$scope.selectedLang = getLang(level);
		} else if ($scope.selectedLang === getLang(level)) {
			$scope.selectedLang = '';
		} else {
			$scope.selectedLevel = level;
			$scope.selectedLang = '';
		}
	};

	$scope.filter = function (level) {
		if ($scope.selectedLevel !== '') {
			if ($scope.selectedLevel !== level.name)
				return false;
		} else if ($scope.selectedLang !== '') {
			if ($scope.selectedLang !== getLang(level.name))
				return false;
		}

		return true;
	};

	$scope.fullLanguage = function (lang) {
		switch (lang) {
			case 'J':
				return 'Japanese';

			case 'F':
				return 'French';

			case 'E':
				return 'English';
		}

		return lang;
	};

	$scope.getUpperColor = function (level, streak) {
		var r, g, b;
		r = g = b = 255;

		var lang = level.name.charAt(0);
		switch (lang) {
			case 'N':
			case 'J':
				g -= streak;
				b -= streak;
				break;

			case 'F':
				r -= streak;
				g -= streak;
				break;

			case 'E':
			default:
				r -= streak;
				b -= streak;
				break;
		}

		var css = 'background-color: rgb(' + r + ',' + g + ',' + b + ')';

		if (streak >= 128) {
			css += '; color: white';
		}

		return css;
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
