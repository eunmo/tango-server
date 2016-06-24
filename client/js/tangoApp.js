tangoApp = angular.module ('tangoApp', ['ngRoute'])
.config (function ($routeProvider) {
	$routeProvider
	.when ('/', {
		templateUrl: '/partials/meta.html',
		controller: 'MetaCtrl'
	})
	.when ('/level/:level', {
		templateUrl: '/partials/words.html',
		controller: 'WordCtrl'
	})
	.otherwise ({
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

