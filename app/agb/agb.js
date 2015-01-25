angular.module('rezeptApp.agb', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zum eigenen Userprofil mit Aktualisierung bei Aufruf */
	$routeProvider.when('/agb', {
		templateUrl: 'agb/agb.html',
		controller: 'AgbController as agbCtrl',
		reloadOnSearch: true});
}])

.controller('AgbController',['$scope','agb','register','$timeout','user', function($scope,login,register,$timeout,user)
{






}]);