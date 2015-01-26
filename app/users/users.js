angular.module('rezeptApp.users', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/users/:_id', {
		templateUrl: 'users/users.html',
		controller: 'usersController as usersCtrl',
		reloadOnSearch: true});
}])

.controller('usersController', ['$scope','user_get','$routeParams','user', function($scope,user_get,$routeParams,user)
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
		$scope.user.recipe_count = data.recipes.length;
		fillStats();

	});

	var fillStats = function()
	{
		// Anzahl erstellte Rezepte
		$scope.user.recipe_count = $scope.user.recipes.length;

		// Anzahl der Tage Mitglied
		var tempDate = $scope.user.profile.date_joined.month + "/" + $scope.user.profile.date_joined.day + "/" + $scope.user.profile.date_joined.year;
		var date1 = new Date(tempDate);
		var date2 = new Date();
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		$scope.user.days_Member = diffDays;

		// Durchschnittliche Rezepte pro Tag
		$scope.user.avg_created = $scope.user.recipe_count / diffDays;

		// Durchschnittlich gekocht
		$scope.user.avg_cooked = $scope.user.cookedAmount / diffDays;
	}

	this.own_redirect = function(i)
	{
		window.location = '#/rezept/' + $scope.user.recipes[i]._id;
	}

	this.fav_redirect = function(i)
	{
		window.location = '#/rezept/' + $scope.user.likes[i]._id;
	}

	this.badgeEarned = function(badge)
	{
		if (badge.earned == true) {
			return "earned";
		};
	}

}])

