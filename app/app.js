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
	image: "",
	pwd: ""
})

.controller('GeneralController',['$scope','user','user_get', function($scope, user, user_get)
{

	load(1);
	function load (count)
	{
	var userInfo = user_get.get({ id: user.name}, function() {/*Success*/},function()
	{
		console.log("Fehler beim Abrufen des Nutzers");

		// Falls die Funktion ohne gesetzten Nutzernamen aufgerufen wird, redirect zum login
		if (count == 10) {
			window.location = '../index.html'
		};
		setTimeout(load(count+1),100);
	});

	userInfo.$promise.then(function(data)
	{
		if (data == "") {
			window.location = '../index.html'
		};
		$scope.profile = {
			name : data._id,
			image : data.image
		};
	});
}


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