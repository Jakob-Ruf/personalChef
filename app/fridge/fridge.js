'use strict';

angular.module('rezeptApp.fridge', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/fridge', {
		templateUrl: 'fridge/fridge.html',
		controller: 'FridgeController as fridgeCtrl',
		reloadOnSearch: false});
}])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/fridge/:_id', {
		templateUrl: 'fridge/fridge.html',
		controller: 'FridgeController as fridgeCtrl',
		reloadOnSearch: true});
}])

.controller('FridgeController', ['fridge_get','fridge_put','ingredient_list','$scope','user','$routeParams','$timeout', function(fridge_get, fridge_put,ingredient_list, $scope,user,$routeParams,$timeout)
{
	if (!user.loggedIn)
	{
		window.location = '#/login';
	}
	
	/* Switch zur Anzeige von Autocomplete */
	var autoSwitch = false;

	this.editItem = {
		_id: user.name,
		ingredient: '',
		amount: ''
	};

	var refreshData = function(times)
	{
		document.getElementById("loading").style.display = "block";
		var items = document.getElementsByClassName("fridge_item");
		for(var i =0, il = items.length;i<il;i++)
		{
			items[i].style.display = "none";
		}
		for (var i = 0; i < times; i++) 
		{
			/* Abrufen des Inhaltes */
			/* TODO User dynamisch anpassen */
			var d = fridge_get.get({id: user.name});
			d.$promise.then(function(data)
			{
				document.getElementById("loading").style.display = "none";
				$scope.fridge = data.fridge;
				for(var i =0, il = items.length;i<il;i++)
				{
					items[i].style.display = "block";
				}
				if ($routeParams._id) 
				{
					var temp = $routeParams._id
					document.getElementById('fridge_input').value = temp;
				};
			});
		}
	}

	var loadIngr = function()
	{
		var ingReq = ingredient_list.query();
		ingReq.$promise.then(function(data)
		{
			$scope.ingredientList = data;
		})
	}
	loadIngr();

	/* Daten initial abrufen */
	refreshData(1);

	// Funktion zum Ausblenden des PopUps
	var hidePopup = function()
	{
		document.getElementById("popup").className = "";
	}

	var clearInput = function()
	{
		document.getElementById('fridge_input').value = "";
		document.getElementById('fridge_input_amount').value = "";
		document.getElementById('fridge_input_unit').value = "";
		if (typeof $scope.fridge_input_text != 'undefined') 
		{
			$scope.fridge_input_text = {};
		}
	}

	this.add = function()
	{
		var popUp = document.getElementById("popup");
		popUp.innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x" style="color=white; text-align=center;"></i>';
		popUp.className = "active";
		this.editItem.ingredient = document.getElementById('fridge_input').value
		this.editItem.amount = document.getElementById('fridge_input_amount').value;

		var loadToFridge = fridge_put.save({},this.editItem);
		loadToFridge.$promise.then(function(data)
			{
				clearInput();
				/* Neuladen der Daten, damit die Anzeige aktuell ist */
				refreshData(1);
				hidePopup();
			});
	}

	this.select = function(i)
	{
		document.getElementById('fridge_input').value = i._id;
		document.getElementById('fridge_input_unit').value = i.unit;
		document.getElementById('fridge_input_amount').focus();
		document.getElementById('fridge_autocomplete_list').style.display = 'none';
		if (i.unit == "St.")
		{
			document.getElementById('fridge_input_amount').step = 1;
		}
		else
		{
			document.getElementById('fridge_input_amount').step = 100;
		}
	}

	this.edit = function(i)
	{
		document.getElementById('fridge_input').value = $scope.fridge[i]._id;
		document.getElementById('fridge_input_unit').value = $scope.fridge[i].unit;
		document.getElementById('fridge_input_amount').value = parseInt($scope.fridge[i].amount);
		if ($scope.fridge[i].unit == "St.")
		{
			document.getElementById('fridge_input_amount').step = 1;
		}
		else
		{
			document.getElementById('fridge_input_amount').step = 100;
		}
	}

	this.switch_autocomplete = function(a)
	{
		if (a) 
		{
			document.getElementById('fridge_autocomplete_list').style.display = 'block';
			autoSwitch = true;
		}
		else
		{
			document.getElementById('fridge_autocomplete_list').style.display = 'none';
			autoSwitch = false;
		}
	}
	/* Vorräte reduzieren */
	this.minus = function(i)
	{
		var popUp = document.getElementById("popup");
		popUp.innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x" style="color=white; text-align=center;"></i>';
		popUp.className = "active";
		this.editItem.ingredient = $scope.fridge[i]._id;
		/* Unterscheidung zwsichen Stück und gr/ml */
		if ($scope.fridge[i].unit == 'St.') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) - 1;
		} 
		else if ($scope.fridge[i].unit == 'g' || 'ml') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) - 100;
		}

		var loadToFridge = fridge_put.save({},this.editItem);
		loadToFridge.$promise.then(function(data)
			{
				clearInput();
				hidePopup();
			});
		$scope.fridge[i].amount = this.editItem.amount;
	}

	/* Vorräte erhöhen */
	this.plus = function(i)
	{
 		var popUp = document.getElementById("popup");
		popUp.innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x" style="color=white; text-align=center;"></i>';
		popUp.className = "active";
		this.editItem.ingredient = $scope.fridge[i]._id;
		/* Unterscheidung zwsichen Stück und gr/ml */
		if ($scope.fridge[i].unit == 'St.') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) + 1;
		} 
		else if ($scope.fridge[i].unit == 'g' || 'ml') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) + 100;
		}
		var loadToFridge = fridge_put.save({},this.editItem);
		loadToFridge.$promise.then(function(data)
			{
				clearInput();
				hidePopup();
			});
		$scope.fridge[i].amount = this.editItem.amount;
	}

	/* Vorrat entfernen */
	this.remove = function(i)
	{
		this.editItem.ingredient = $scope.fridge[i]._id;
		this.editItem.amount = 0;
		var loadToFridge = fridge_put.save({},this.editItem);
		loadToFridge.$promise.then(function(data)
		{
			clearInput();
			/* Neuladen der Daten, damit die Anzeige aktuell ist */
			refreshData(1);
		});
	}

	this.getRecipes = function()
	{
		window.location = '#/rezepte/f:';
	}
}])
