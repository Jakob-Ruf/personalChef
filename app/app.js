'use strict';

angular.module('rezeptApp', [
	'ngRoute',
	'ngTouch',
	'ngResource',
	'mobile-angular-ui',
	'rezeptServices',
	'loginServices',
	'rezeptApp.home',
	'rezeptApp.fridge',
	'rezeptApp.rezeptList',
	'rezeptApp.addRecipe',
	'rezeptApp.rezept',
	'rezeptApp.user',
	'rezeptApp.users',
	'rezeptApp.userImgUpload',
	'rezeptApp.recImgUpload',
	'rezeptApp.notFound',
	'rezeptApp.ingredient',
	'rezeptApp.tutorial',
	'rezeptApp.login'
	])


/* Erstellen einer globalen Variablen für den User */
.value('user', {
	name: "",
	image: "",
	loggedIn: false
})

.controller('GeneralController',['$scope','user','user_get','$timeout', function($scope,user,user_get,$timeout)
{
	$scope.profile = 
	{
		image: user.image,
		name: user.name
	}

	if (!user.loggedIn) {
		window.location = '#/login';
	};

	var loadPicture = function()
	{
		if (user.image == "") 
		{
			$timeout(loadPicture,500);
		}
		else
		{
			$scope.profile.image = user.image;
			$scope.profile.name = user.name;
		}
	}
	loadPicture();


$scope.getTimes=function(n)
{
	return new Array(n);
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

this.logOut = function()
{
	console.log("logout");
	user.name = "";
	user.image = "";
	user.loggedIn = false;
	window.location = '#/login';
}

}]);