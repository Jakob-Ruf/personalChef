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
	if (user.name == "") {
		window.location = '#/home';
	};
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
});



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