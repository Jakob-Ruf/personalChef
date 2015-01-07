angular.module('rezeptApp.rezeptList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
		/* Routing zur Rezeptliste mit Aktualisierung bei Aufruf */
		$routeProvider.when('/rezepte', {
			templateUrl: 'rezeptListe/rezeptListe.html',
			controller: 'rezeptListController as rezeptLCtrl',
			reloadOnSearch: true});
}])

.controller('rezeptListController', function($scope, rec_list){
	this.switchState = 0;
	this.rezeptListe = rec_list.query();

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
		window.location = '#/rezept/' + this.rezeptListe[i]._id;
	}
});