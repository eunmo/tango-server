tangoApp.controller ('WordCtrl', function ($rootScope, $scope, $http) {

	$scope.levels = [];	
	$scope.words = [];
	$scope.orderBy = '';
	$scope.order = 0;

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
