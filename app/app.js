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
	'rezeptApp.users',
	'rezeptApp.userImgUpload',
	'rezeptApp.recImgUpload',
	'rezeptApp.notFound',
	'rezeptApp.ingredient',
	'rezeptApp.tutorial'
	])

/* Erstellen einer globalen Variablen für den User */
.value('user', {
	name: "",
	image: ""
})

.controller('GeneralController',['$scope','user','user_get', function($scope, user, user_get)
{
var userInfo = user_get.get({ id: "Sterling Archer" }, function() {/*Success*/},function()
{
	console.log("Fehler beim Abrufen des Nutzers");
});

userInfo.$promise.then(function(data)
{
	console.log(data);
	$scope.profile = {
	name : data._id,
	image : data.image
};
	user.name = data._id;
	user.image = data.image;
});

if (user.name == "") {
	window.location = '#/';
};

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

}]);