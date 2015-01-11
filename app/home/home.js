angular.module('rezeptApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zur Startseite mit Neuladen der Seite beim Aufrufen der Startseite */
	$routeProvider.when('/', {
		templateUrl: 'home/home.html',
		controller: 'homeController as homeCtrl',
		reloadOnSearch: true});
}])

.controller('homeController', function($scope, rec_start)
{
	var rezepteHome = rec_start.query();
	rezepteHome.$promise.then(function(data)
	{
		document.getElementById("loading").style.display = "none";
		$scope.rezepteHome = data;
	});


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
});