angular.module('rezeptApp.users', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/users/:_id', {
		templateUrl: 'users/users.html',
		controller: 'usersController as usersCtrl',
		reloadOnSearch: true});
}])

.controller('usersController', ['$scope','user_get','$routeParams', function($scope,user_get,$routeParams)
{
	if (!user.loggedIn)
	{
		window.location = '#/login';
	}
	
	var p = user_get.get({ id: $routeParams._id }, function() {/*Success*/},function()
	{
		/*Umleitung, falls Fehlermeldung*/
		window.location = '#/nfError';
	});

	/* Auszuführende Funktion wenn alle Daten vorliegen */
	p.$promise.then(function(data)
	{
		console.log(data);
		/* Ausblenden der Ladeanimation */
		document.getElementById('loading').style.display = 'none';
		/* Setzen der anzuzeigenden Daten */
		$scope.user = data;

	});

	this.own_redirect = function(i)
	{
		window.location = '#/rezept/' + $scope.user.recipes[i]._id;
	}

	this.fav_redirect = function(i)
	{
		window.location = '#/rezept/' + $scope.user.likes[i]._id;
	}

}])

