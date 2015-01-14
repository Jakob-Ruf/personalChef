angular.module('rezeptApp.rezeptList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
		/* Routing zur Rezeptliste mit Aktualisierung bei Aufruf */
		$routeProvider.when('/rezepte', {
			templateUrl: 'rezeptListe/rezeptListe.html',
			controller: 'RezeptListController as rezeptLCtrl',
			reloadOnSearch: true});
}])

.controller('RezeptListController', function($scope, rec_list){
	this.switchState = 0;

	var d = rec_list.query();
	d.$promise.then(function(data)
	{
		document.getElementById("loading").style.display = "none";
		$scope.rezeptListe = data;
	});

	this.switch = function()
	{
		if (this.switchState == 1)
		{
			this.switchState = 0;
		}
		else
		{
			this.switchState = 1;
		}
	};

	this.switchInput = function(i)
	{
		if (this.switchState == i) 
		{
			return 'active';
		}
		else
		{
			return ;
		}
	}

	this.redirect = function(i)
	{
		window.location = '#/rezept/' + $scope.rezeptListe[i]._id;
	}
});