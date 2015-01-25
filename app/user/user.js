angular.module('rezeptApp.user', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zum eigenen Userprofil mit Aktualisierung bei Aufruf */
	$routeProvider.when('/user', {
		templateUrl: 'user/user.html',
		controller: 'UserController as userCtrl',
		reloadOnSearch: true});
}])

.controller('UserController', ['$scope','user','user_get', function($scope,user,user_get){
	/* Prüfung ob der Nutzername bereits gesetzt wurde. Falls nicht redirect auf die Startseite */
	if (!user.loggedIn)
	{
		window.location = '#/login';
	}
	else
	{
		var userInfo = user_get.get({ id: user.name }, function() {/*Success*/},function()
		{
			console.log("Fehler beim Abrufen des Nutzers");
		});

		userInfo.$promise.then(function(data)
		{
			/* Ausblenden der Ladeanimation */
			document.getElementById('loading').style.display = 'none';
			console.log(data);
			$scope.user = data;
			$scope.user.recipe_count = data.recipes.length;
			$scope.userImage = data.image;
			user.image = data.image;
			$scope.profile.image = user.image;
			fillStats();
		});
	}


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

this.redirect_edit_img = function()
{
	window.location = '#/userImg';
}

this.badgeEarned = function(badge)
{
	if (badge.earned == true) {
		return "earned";
	};
}

}]);