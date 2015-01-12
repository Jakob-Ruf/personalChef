angular.module('rezeptApp.users', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/users/:_id', {
		templateUrl: 'users/users.html',
		controller: 'usersController as usersCtrl',
		reloadOnSearch: true});
}])
