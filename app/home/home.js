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

.controller('HomeController', function($scope,rec_start,$routeParams,user_get,user,$timeout)
{
	if ($routeParams.id) 
	{
		// Einblenden des Menubuttons
		var disableMenu = document.getElementsByClassName("sidebar-toggle");
		disableMenu[0].style.display = "block";

		user.name = $routeParams.id;

		var userInfo = user_get.get({ id: user.name}, function() {/*Success*/},function()
		{
			console.log("Fehler beim Abrufen des Nutzers");
			// Falls die Funktion ohne gesetzten Nutzernamen aufgerufen wird, redirect zum login
			window.location = '#/login';
			user.name = "";
		});

		userInfo.$promise.then(function(data)
		{
			if (data == "") {
				user.name = "";
				window.location = '#/login';
			};
			user.loggedIn = true;
			user.image = data.image;
			getHomeRecipes();
		});
	}
	else if (!user.loggedIn)
	{
		window.location = '#/login';
	}

	var getHomeRecipes = function ()
	{
		/* Variable mit der Anfrage */
		var rezepteHome = rec_start.query();

		/* Auszuführende Funktion wenn alle Daten vorliegen */
		rezepteHome.$promise.then(function(data)
		{
			/* Ausblenden der Ladeanimation */
			document.getElementById("loading").style.display = "none";
			/* Setzen der anzuzeigenden Daten */
			$scope.rezepteHome = data;
		});
	}

	if (user.loggedIn) 
	{
		getHomeRecipes();
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
};
this.do_scanBarcode = function()
{
        cordova.exec(success, failure, "ScanditSDK", "scan",
         ["I0fdfU5DxbyV6lshLMEiQr4WxlVkiniNkDEpHD9f97o",
          {"beep": true,
          "1DScanning" : true,
          "2DScanning" : true}]);
};
function success(resultArray) {
    window.location = '#/ingredient/' + resultArray[0];
}

function failure(error) {
    alert("Failed: " + error);
}
});