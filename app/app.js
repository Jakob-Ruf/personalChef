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
	'rezeptApp.userImgUpload',
	'rezeptApp.notFound'
	])

.controller('generalController', function($scope)
{

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