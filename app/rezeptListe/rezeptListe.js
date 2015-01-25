angular.module('rezeptApp.rezeptList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zur Startseite mit Neuladen der Seite beim Aufrufen der Startseite */
	$routeProvider.when('/rezepte/:id', {
		templateUrl: 'rezeptListe/rezeptListe.html',
		controller: 'RezeptListController as rezeptLCtrl',
		reloadOnSearch: true});
}])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zur Rezeptliste mit Aktualisierung bei Aufruf */
	$routeProvider.when('/rezepte', {
		templateUrl: 'rezeptListe/rezeptListe.html',
		controller: 'RezeptListController as rezeptLCtrl',
		reloadOnSearch: true});
}])

.controller('RezeptListController', function($scope, rec_list,$routeParams,user){

	if (!user.loggedIn)
	{
		window.location = '#/login';
	}
	
	this.switchState = 0;

	var d = rec_list.query();
	d.$promise.then(function(data)
	{
		console.log(data);
		document.getElementById("loading").style.display = "none";
		$scope.rezeptListe = data;
		if ($routeParams.id) 
		{
			var temp = $routeParams.id.split(":");
			var inp = document.getElementsByClassName("recL_filter_input");
			if (temp[0] == "r") 
			{
				$scope.rec_searchText = temp[1];
				inp[0].value = temp[1];
			} 
		};
	});

	this.switch = function()
	{
		var inp = document.getElementsByClassName("recL_filter_input");
		if (this.switchState == 1)
		{		
			inp[0].value = "";
			inp[1].value = "";
			this.switchState = 0;
		}
		else
		{
			inp[0].value = "";
			inp[1].value = "";
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

	this.redirect = function(rec)
	{
		window.location = '#/rezept/' + rec._id;
	}
});