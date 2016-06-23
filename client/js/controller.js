tangoApp.controller ('WordCtrl', function ($rootScope, $scope, $http) {

	$scope.meta = [];
	$scope.streaks = [];
	$scope.levels = [];	
	$scope.words = [];
	$scope.orderBy = '';
	$scope.order = 0;

	function fixDate (date, streak) {
		var baseDate = new Date (date);
		var dateOffset = baseDate.getDate () + streak;

		if (baseDate.getHours() < 5) {
			dateOffset -= 1;
		}

		baseDate.setDate(dateOffset);
		return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
	}

	for (var i = 0; i < 10; i++) {
		$scope.streaks[i] = 0;
	}

	$http.get ('meta').success (function (data) {
		var i;
		var now = new Date();

		for (i = 0; i <= 10; i++) {
			var newDate = fixDate (new Date (now), 0);
			newDate.setDate (newDate.getDate() + i);
			var streaks = [];

			for (var j = 0; j < Math.min(10, 11 - i); j++) {
				streaks.push (0);
			}

			$scope.meta[i] = {
				date: newDate,
				streaks: streaks,
				sum: 0
			};
		}

		for (var i in data) {
			var row = data[i];
			var streak = row.streak;
			var lastCorrect = new Date (row.lastCorrect);
			var testDay = fixDate (lastCorrect, streak);
			var now = fixDate (new Date (), 0);
			var index = (testDay - now) / 86400000;

			$scope.meta[index].streaks[10 - streak] += 1;
			$scope.meta[index].sum += 1;
			$scope.streaks[10 - streak] += 1;
		}
	});

	$http.get ('select/levels').success (function (data) {
		$scope.levels = data;
		$scope.levels.push ('all');
	});

	$scope.getLevel = function (level) {
		$scope.words = [];
		$scope.selectedLevel = level;
		$scope.order = 2;
		$scope.changeOrderBy ();

		$http.get ('select/' + level).success (function (data) {
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
	};

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
