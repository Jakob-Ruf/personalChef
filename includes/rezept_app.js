
var app = angular.module('rezept', 
	[
	'ngRoute',
	'ngTouch',
	'mobile-angular-ui'
	]);


app.config(function($routeProvider) 
{
	$routeProvider.when('/', {templateUrl: 'includes/html/home.html', reloadOnSearch: false});
	$routeProvider.when('/rezepte', {templateUrl: 'includes/html/rezept.html', reloadOnSearch: false});
	$routeProvider.when('/settings', {templateUrl: 'includes/html/settings.html', reloadOnSearch: false});
});

app.controller('rezeptController', function($rootScope, $scope)
{
});