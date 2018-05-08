tangoApp = angular.module('tangoApp', ['ngRoute'])
.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/partials/main.html',
		controller: 'MainCtrl'
	})
	.when('/add/:lang', {
		templateUrl: '/partials/add.html',
		controller: 'AddCtrl'
	})
	.when('/search', {
		template: '<search></search>'
	})
	.when('/level/:level', {
		templateUrl: '/partials/words.html',
		controller: 'WordCtrl'
	})
	.when('/meta', {
		templateUrl: '/partials/meta.html',
		controller: 'MetaCtrl'
	})
	.otherwise({
		redirectTo: '/'
  });
});

tangoApp.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.Pragma = 'no-cache';
}]);

