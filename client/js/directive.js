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
		scope: { expire: '=', word: '=' },
		controller: ['$scope', '$http', '$timeout', function SearchCtrl ($scope, $http, $timeout) {
			$scope.timeout = null;
			$scope.queryAnswered = false;

			$scope.search = function () {
				$scope.query = $scope.query.replace('’', '\'');
				$scope.oldQuery = $scope.query;

				$http.get('search/' + $scope.query).success(function (data) {
					$scope.words = data;
					$scope.queryAnswered = true;

					for (var i in $scope.words) {
						var word = $scope.words[i];

						if (word.streak <= 0) {
							word.minus = true;
						} else if (word.streak > 10) {
							word.done = true;
						}
					}
					
					if ($scope.expire) {
						$scope.cancelTimeout();	
						$scope.timeout = $timeout(function () { $scope.clear(true); }, 10000);
					}
				});
			};

			$scope.cancelTimeout = function () {
				if ($scope.timeout !== null) {
					$timeout.cancel($scope.timeout);
					$scope.timeout = null;
				}
			};

			$scope.clear = function (byTimeout) {
				$scope.query = "";
				$scope.words = [];
				$scope.queryAnswered = false;
				$scope.oldQuery = "";
				
				if (byTimeout) {
					$scope.timeout = null;
				}
				else {
					$scope.cancelTimeout();
				}
			};

			$scope.beginEdit = function (word) {
				word.inEdit = true;
			};

			$scope.cancel = function (word) {
				word.inEdit = false;
			};

			$scope.commit = function (word) {
				$http.put('update/word', word)
					.then($scope.search);
			};
			
			$scope.remove = function (word) {
				$http.put('remove/word', word)
					.then($scope.search);
			};

			$scope.clear();
		}],
		link: function (scope, elem, attr) {
			scope.$watch('word', function (newValue, oldValue) {
				scope.query = newValue;
			});
		},
		templateUrl: 'partials/directive-search.html'
	};
});
