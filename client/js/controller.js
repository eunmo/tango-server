tangoApp.controller ('WordCtrl', function ($rootScope, $scope, $http) {

	$scope.levels = [];	
	$scope.words = [];

	$http.get ('select/levels').success (function (data) {
		$scope.levels = data;
		$scope.levels.push ('all');
	});

	$scope.getLevel = function (level) {
		$scope.selectedLevel = level;
		$http.get ('select/' + level).success (function (data) {
			$scope.words = data;
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
});
