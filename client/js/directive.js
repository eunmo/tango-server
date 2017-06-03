tangoApp.directive('navi', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/navi.html'
	};
});

tangoApp.directive('naviEs', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/navi-es.html'
	};
});

tangoApp.directive('search', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: { expire: '=' },
		controller: ['$scope', '$http', '$timeout', function SearchCtrl ($scope, $http, $timeout) {
			$scope.timeout = null;

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
					
					if ($scope.expire) {
						$scope.cancelTimeout ();	
						$scope.timeout = $timeout (function () { $scope.clear (true); }, 10000);
					}
				});
			};

			$scope.cancelTimeout = function () {
				if ($scope.timeout !== null) {
					$timeout.cancel ($scope.timeout);
					$scope.timeout = null;
				}
			};

			$scope.clear = function (byTimeout) {
				$scope.query = "";
				$scope.words = [];
				
				if (byTimeout) {
					$scope.timeout = null;
				}
				else {
					$scope.cancelTimeout ();
				}
			};

			$scope.beginEdit = function (word) {
				word.inEdit = true;
			};

			$scope.cancel = function (word) {
				word.inEdit = false;
			};

			$scope.commit = function (word) {
				$http.put ('update/word', word)
					.then ($scope.cancel);
			};

			$scope.clear ();
		}],
		templateUrl: 'partials/directive-search.html'
	};
});
