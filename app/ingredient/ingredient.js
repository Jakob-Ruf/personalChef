angular.module('rezeptApp.ingredient', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/ingredient/:_id', {
		templateUrl: 'ingredient/ingredient.html',
		controller: 'IngredientController as ingCtrl',
		reloadOnSearch: true});
}])

.controller('IngredientController', ['$scope', function($scope)
{
	$scope.ingredientDetail = {
		ean: 12345678,
		name: "Nestle Aquarel",
		type: "Mineralwasser",
		producer: "Nestle",
		contents:[
		{
			name: "Natrium",
			amount: "13.8",
			unit: "mg/l"
		},
		{
			name: "Magnesium",
			amount: "2.9",
			unit: "mg/l"
		},
		{
			name: "Calcium",
			amount: "28.0",
			unit: "mg/l"
		},
		{
			name: "Chlorid",
			amount: "33.0",
			unit: "mg/l"
		},
		{
			name: "Sulfat",
			amount: "40.0",
			unit: "mg/l"
		},
		{
			name: "Nitrat",
			amount: "unter 0.5",
			unit: "mg/l"
		}]
	};	
}])
