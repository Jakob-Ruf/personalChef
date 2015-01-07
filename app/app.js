'use strict';

angular.module('rezeptApp', [
	'ngRoute',
	'ngTouch',
	'ngResource',
	'mobile-angular-ui',
	'rezeptServices',
	'rezeptApp.home',
	'rezeptApp.fridge',
	'rezeptApp.rezeptList',
	'rezeptApp.addRecipe',
	'rezeptApp.rezept',
	'rezeptApp.user',
	'rezeptApp.notFound'
	])

.controller('generalController', function($scope)
{
	$scope.fridge = [
	{ name: 'Eier', count: 6, unit: 'st'},
	{ name: 'Zucker', count: 500, unit: 'gr'},
	{ name: 'Apfel', count: 3, unit: 'st'},
	{ name: 'Milch', count: 1, unit: 'ml'},
	{ name: 'Mehl', count: 400, unit: 'gr'},
	{ name: 'Olivenöl', count: 6, unit: 'ml'}
	];

	$scope.getTimes=function(n)
	{
		return new Array(n);
	};

	/* @todo: Löschen... */
	$scope.log=function(n)
	{
		
	};

	/* Einfärben der nötigen Sterne */
	$scope.ratingIsActive = function(starId, rezept)
	{
		if (starId <= rezept.ratings_average) 
		{
			return 'r_active';
		}
		else
		{
			return 'r_inactive';
		};
	};

});