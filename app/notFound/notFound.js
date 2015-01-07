angular.module('rezeptApp.notFound', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
		/* Routing falls etwas nicht gefunden wurden ohne Aktualisierung bei Aufruf */
		$routeProvider.when('/nfError', {
			templateUrl: 'notFound/notFound.html',
			reloadOnSearch: false});
}])