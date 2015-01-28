angular.module('rezeptApp.ingredient', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/ingredient/:_id', {
		templateUrl: 'ingredient/ingredient.html',
		controller: 'IngredientController as ingCtrl',
		reloadOnSearch: true});
}])

.controller('IngredientController', ['$scope','$routeParams','ean', function($scope,$routeParams,ean)
{

		// Abruf der EAN
		var d = ean.get({ id: $routeParams._id }, function() {/*Success*/},function()
		{
			/*Umleitung, falls Fehlermeldung*/
			window.location = '#/nfError';
		});

		/* Auszuführende Funktion wenn alle Daten vorliegen */
		d.$promise.then(function(data)
		{
			/* Ausblenden der Ladeanimation */
			document.getElementById('loading').style.display = 'none';
			document.getElementById('ingredients_content').style.display = 'block';
			/* Setzen der anzuzeigenden Daten */
			$scope.ingredientDetail = data;
			console.log(data);
		});

		this.rec = function()
		{
			window.location = '#/rezepte/r:' + $scope.ingredientDetail.Type ;
		}

		this.recNf = function()
		{
			window.location = '#/rezepte/';
		}

		this.fridge = function()
		{
			window.location = '#/fridge/' + $scope.ingredientDetail.Type ;
		}

		this.fridgeNf = function()
		{
			window.location = '#/fridge/';
		}

}])
