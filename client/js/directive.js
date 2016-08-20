tangoApp.directive('navi', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/navi.html'
	};
});

tangoApp.directive('search', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: ['$scope', '$http', function SearchCtrl ($scope, $http) {
			$scope.search = function () {
				$http.get ('search/' + $scope.query).success (function (data) {
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

			$scope.clear = function () {
				$scope.query = "";
				$scope.words = [];
			};

			$scope.clear ();
		}],
		templateUrl: 'partials/directive-search.html'
	};
});
