tangoApp.controller('NavCtrl', function ($rootScope, $scope, $http) {
	
	$scope.levels = [];	

	$http.get('select/levels').success(function (data) {
		$scope.levels = data;
		$scope.levels.push('all');
	});
});

tangoApp.controller('MainCtrl', function ($rootScope, $scope, $http) {

	$scope.meta = [];
	$scope.streaks = [];
	$scope.levels = [];	
	$scope.langs = [];
	$scope.langMetas = [];
	$scope.newWordCount = 0;
	$scope.selectedLevel = '';
	$scope.selectedLang = '';
	$scope.selectedDay = null;

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

	$http.get('level_summary').success(function (data) {
		var i, j;
		var row;
		var levels = {};
		var level;
		for (i in data) {
			row = data[i];
			if (levels[row.Level] === undefined) {
				level = { name: row.Level, streaks: [], learned: 0, total: 0, newWordCount: 0 };

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
				level.newWordCount += row.count;
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
		
		langMap = {};
		for (i in $scope.levels) {
			level = $scope.levels[i];
			lang = getLang(level.name);

			if (langMap[lang] === undefined) {
				langMap[lang] = { lang: lang, total: 0, learned : 0, newWordCount: 0  };
			}

			langMap[lang].total += level.total;
			langMap[lang].learned += level.learned;
			langMap[lang].newWordCount += level.newWordCount;
		}

		for (i in langMap) {
			$scope.langMetas.push(langMap[i]);
		}
		$scope.langMetas.sort(function(a, b) { return (a.lang < b.lang) ? -1 : ((a.lang > b.lang) ? 1 : 0); });
	});
});

tangoApp.controller('MetaCtrl', function ($rootScope, $scope, $http) {

	$scope.meta = [];
	$scope.streaks = [];
	$scope.levels = [];	
	$scope.langs = [];
	$scope.langMetas = [];
	$scope.newWordCount = 0;
	$scope.selectedLevel = '';
	$scope.selectedLang = '';
	$scope.selectedDay = null;

	function fixDate (date, streak) {
		var baseDate = new Date(date);
		var dateOffset = baseDate.getDate() + streak;

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

	$http.get('meta').success(function (data) {
		var i, j;
		var now = new Date();
		var newDate, streaks;

		for (i = 0; i <= 10; i++) {
			newDate = fixDate(new Date(now), 0);
			newDate.setDate(newDate.getDate() + i);
			streaks = [];

			for (j = 0; j < Math.min(10, 11 - i); j++) {
				streaks.push({ sum: 0, levels: {}, langs: { E: 0, F: 0, J: 0 }});
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
			testDay = fixDate(row.lastCorrect, streak);
			now = fixDate(new Date(), 0);
			index = Math.max((testDay - now) / 86400000, 0);

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
	});

	$http.get('level_summary').success(function (data) {
		var i, j;
		var row;
		var levels = {};
		var level;
		for (i in data) {
			row = data[i];
			if (levels[row.Level] === undefined) {
				level = { name: row.Level, streaks: [], learned: 0, total: 0, newWordCount: 0 };

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
				level.newWordCount += row.count;
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
		
		langMap = {};
		for (i in $scope.levels) {
			level = $scope.levels[i];
			lang = getLang(level.name);

			if (langMap[lang] === undefined) {
				langMap[lang] = { lang: lang, total: 0, learned : 0, newWordCount: 0  };
			}

			langMap[lang].total += level.total;
			langMap[lang].learned += level.learned;
			langMap[lang].newWordCount += level.newWordCount;
		}

		for (i in langMap) {
			$scope.langMetas.push(langMap[i]);
		}
		$scope.langMetas.sort(function(a, b) { return (a.lang < b.lang) ? -1 : ((a.lang > b.lang) ? 1 : 0); });
	});

	$scope.clearSelected = function () {
		$scope.selectedLevel = '';
		$scope.selectedLang = '';
		$scope.selectedDay = null;
	};

	$scope.selectLevel = function (level) {
		var selectedLevel = $scope.selectedLevel;
		$scope.clearSelected();
		if (selectedLevel !== level) {
			$scope.selectedLevel = level;
		}
	};
	
	$scope.selectLang = function (lang) {
		var selectedLang = $scope.selectedLang;
		$scope.clearSelected();
		if (selectedLang !== lang) {
			$scope.selectedLang = lang;
		}
	};
	
	$scope.selectDay = function (day) {
		if ($scope.selectedLang === '')
			return;

		$scope.selectedDay = day;
	};

	$scope.filter = function (level) {
		if ($scope.selectedLevel !== '') {
			if ($scope.selectedLevel !== level.name)
				return false;
		} else if ($scope.selectedLang !== '') {
			if ($scope.selectedLang !== getLang(level.name))
				return false;
		} else {
			return false;
		}

		return true;
	};

	$scope.getFilteredStreak = function (level, index) {
		if ($scope.selectedDay !== null) {
			if ($scope.selectedDay.streaks[index] &&
					$scope.selectedDay.streaks[index].levels[level.name]) {
				return $scope.selectedDay.streaks[index].levels[level.name];
			}
			return 0;
		}

		return level.streaks[index];
	};

	$scope.getSelectedSumUH = function (level) {
		var sum = 0;
		var i;

		if ($scope.selectedDay !== null) {
			var day = $scope.selectedDay;
			for (i = 0; i < day.streaks.length; i++) {
				if (day.streaks[i].levels[level.name]) {
					sum += day.streaks[i].levels[level.name];
				}
			}
			return sum;
		}

		return level.total - level.learned;
	}

	$scope.getSelectedSumLH = function (day) {
		var sum = 0;
		var i;

		if ($scope.selectedLevel !== '') {
			for (i = 0; i < day.streaks.length; i++) {
				if (day.streaks[i].levels[$scope.selectedLevel]) {
					sum += day.streaks[i].levels[$scope.selectedLevel];
				}
			}
			return sum;
		} else if ($scope.selectedLang !== '') {
			for (i = 0; i < day.streaks.length; i++) {
				if (day.streaks[i].langs[$scope.selectedLang]) {
					sum += day.streaks[i].langs[$scope.selectedLang];
				}
			}
			return sum;
		}

		if (day === null)
			return 0;

		return day.sum;
	}

	$scope.getSelectedSumV = function (streak) {
		var sum = 0;
		var i;

		if ($scope.selectedLevel !== '') {
			for (i = 0; i < $scope.meta.length; i++) {
				if ($scope.meta[i].streaks[streak] &&
						$scope.meta[i].streaks[streak].levels[$scope.selectedLevel]) {
					sum += $scope.meta[i].streaks[streak].levels[$scope.selectedLevel];
				}
			}
			return sum;
		} else if ($scope.selectedLang !== '') {
			for (i = 0; i < $scope.meta.length; i++) {
				if ($scope.meta[i].streaks[streak] &&
						$scope.meta[i].streaks[streak].langs[$scope.selectedLang]) {
					sum += $scope.meta[i].streaks[streak].langs[$scope.selectedLang];
				}
			}
			return sum;
		} else if ($scope.selectedDay !== null) {
			if ($scope.selectedDay.streaks[streak]) {
				return $scope.selectedDay.streaks[streak].sum;
			}
			return sum;
		}

		return $scope.streaks[streak];
	}

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
				r -= streak;
				b -= streak;
				break;
			
			default:
				break;
		}

		var css = 'background-color: rgb(' + r + ',' + g + ',' + b + ')';

		if (streak >= 128) {
			css += '; color: white';
		}

		return css;
	};
});

tangoApp.controller('WordCtrl', function ($rootScope, $scope, $http, $routeParams) {

	$scope.selectedLevel = $routeParams.level;
	$scope.words = [];
	$scope.orderBy = '';
	$scope.order = 0;

	$http.get('select/' + $routeParams.level).success(function (data) {
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
		$http.put('update/word', word)
		.then(function (res) {
			word.inEdit = false;
		});
	};

	$scope.changeOrderBy = function () {
		$scope.order = ($scope.order + 1) % 3;
		if ($scope.order === 0) {

			if ($scope.selectedlevel === 'all') {
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

tangoApp.controller('AddCtrl', function ($rootScope, $scope, $http, $location, $routeParams) {

	$scope.words = [];
	$scope.lang = $routeParams.lang;

	function getLevelName() {
		var lang = $scope.lang;
		var today = new Date();
		var yymm = today.toISOString().substring(2, 7).replace(/-/g,'');

		return lang + yymm;
	}

	$scope.levelName = getLevelName();

	$scope.change = function () {
		$scope.levelName = getLevelName();
	};
	
	$scope.newLine = function () {
		$scope.words.push({ word: '', yomigana: '', meaning: '' });
	};

	$scope.newLine();

	$scope.newWordInput = function (word) {
		var sqIndex = word.word.indexOf('[');
		if (sqIndex !== -1) {
			word.yomigana = word.word.substr(0, sqIndex).trim();
			word.word = word.word.substr(sqIndex + 1).replace(']', '').trim();

			if (window.innerWidth > 543)
				$scope.newWordAdded($scope.words.indexOf(word));
		}

		var tbIndex = word.word.indexOf('（');
		if (tbIndex !== -1) {
			word.yomigana = word.word.substr(tbIndex + 1).replace('）', '').trim();
			word.word = word.word.substr(0, tbIndex).replace(' ', '').trim();

			if (window.innerWidth > 543)
				$scope.newWordAdded($scope.words.indexOf(word));
		}

		var mdIndex = word.word.lastIndexOf('·');
		if (mdIndex !== -1) {
			word.word = word.word.substr(mdIndex + 1).trim();
		}

		word.word = word.word.replace('’', '\'');
	};

	$scope.newWordAdded = function (index) {
		if ($scope.words.length === index + 1) {
			$scope.newLine();
		}
		
		var word = $scope.words[index];
		word.meaning = word.meaning.replace(' ⧫ ', ', ');
	};

	$scope.search = function (word) {
		if ($scope.lang === 'J')
			$scope.word = word.word + ']' + word.yomigana;
		else
			$scope.word = word.word;
	}

	$scope.submit = function () {
		var words = [];

		for (var i in $scope.words) {
			var word = $scope.words[i];

			if (word.word !== '') {
				words.push(word);
			}
		}

		if (words.length > 0) {
			$http.put('add/' + $scope.levelName, words)
				.then(function (res) {
					$location.url('/');
				});
		}
	};
});
