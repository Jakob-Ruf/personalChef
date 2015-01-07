angular.module('rezeptApp.rezept', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/rezept/:_id', {
		templateUrl: 'rezept/rezept.html',
		controller: 'rezeptController as recCtrl',
		reloadOnSearch: true});
}])

.controller('rezeptController', ['$routeParams','rec_get',function($routeParams, rec_get) 
{
this.recipe = rec_get.get({ id: $routeParams._id }, function() {/*Success*/},function()
{
	/*Umleitung, falls Fehlermeldung*/
	window.location = '#/nfError';
});
}])