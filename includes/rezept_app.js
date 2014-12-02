(function() {
	var app = angular.module('rezept', 
		[
		'ngRoute',
		'ngTouch',
		'mobile-angular-ui'
		]);


	app.config(function($routeProvider, $locationProvider) 
	{
		$routeProvider.when('/', {templateUrl: 'includes/html/home.html', reloadOnSearch: false});
		$routeProvider.when('/fridge', {templateUrl: 'includes/html/fridge.html', reloadOnSearch: false});
		$routeProvider.when('/rezepte', {templateUrl: 'includes/html/rezept.html', reloadOnSearch: false});
		$routeProvider.when('/settings', {templateUrl: 'includes/html/settings.html', reloadOnSearch: false});
	});

	app.controller('rezeptController', function($scope)
	{

		$scope.rezeptListe = [
		{ title: "Rezept des Tages", name: "Spaghetti", time: "20", rating:"4", image:"media/img/nudeln.jpg"},
		{ title: "Lieblingsrezept der Community", name: "Burger", time: "25", rating:"5", image:"media/img/burgers.jpg"}
		];
		var rezeptList = $scope.rezeptListe;

		$scope.fridge = [
		{ name: "Eier", count: "6", unit: "st"},
		{ name: "Zucker", count: "500", unit: "gr"},
		{ name: "Apfel", count: "3", unit: "st"},
		{ name: "Milch", count: "1", unit: "ml"},
		{ name: "Mehl", count: "400", unit: "gr"},
		{ name: "Olivenöl", count: "6", unit: "ml"}
		];

		$scope.getTimes=function(n)
		{
			return new Array(n);
		};

		$scope.ratingIsActive=function(rezeptId, starId)
		{
			if (starId <= rezeptList[rezeptId].rating) 
			{
				return "r_active";
			}
			else
			{
				return "r_inactive";
			};
		};
	});

})();