angular.module('rezeptApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zur Startseite mit Neuladen der Seite beim Aufrufen der Startseite */
	$routeProvider.when('/home/:id', {
		templateUrl: 'home/home.html',
		controller: 'HomeController as homeCtrl',
		reloadOnSearch: true});
}])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zur Startseite mit Neuladen der Seite beim Aufrufen der Startseite */
	$routeProvider.when('/home', {
		templateUrl: 'home/home.html',
		controller: 'HomeController as homeCtrl',
		reloadOnSearch: true});
}])

.controller('HomeController', function($scope, rec_start,$routeParams,user_get,user)
{
	/* Variable mit der Anfrage */
	var rezepteHome = rec_start.query();
	if ($routeParams.id) {
		user.name = $routeParams.id;
		console.log(user.name);
	};
	/* Auszuführende Funktion wenn alle Daten vorliegen */
	rezepteHome.$promise.then(function(data)
	{
		/* Ausblenden der Ladeanimation */
		document.getElementById("loading").style.display = "none";
		/* Setzen der anzuzeigenden Daten */
		$scope.rezepteHome = data;
	});

	if (!user.name) {
		window.location = '../index.html';
	};


	this.redirect = function(i, $event)
	{
		if ($event) {
			$event.stopImmediatePropagation();
		};
		window.location = '#/rezept/' + $scope.rezepteHome[i]._id;
	}

	$scope.overlayHomeId = function(value)
	{
		return 'home_overlay_' + value;
	};

	$scope.openHomeOverlay = function(value)
	{
		var cl = 'home_overlay_' + value;
		var elements = document.getElementsByClassName('overlay');
		elements[value].style.display = 'block';
	};

	$scope.closeHomeOverlay = function(value)
	{
		var cl = 'home_overlay_' + value;
		var elements = document.getElementsByClassName('overlay');
		elements[value].style.display = 'none';
	};

	this.do_search = function(input)
	{
		window.location = '#/rezepte/r:' + input;
	}
});