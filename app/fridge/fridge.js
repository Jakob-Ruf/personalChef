'use strict';

angular.module('rezeptApp.fridge', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/fridge', {
		templateUrl: 'fridge/fridge.html',
		controller: 'FridgeController as fridgeCtrl',
		reloadOnSearch: true});
}])

.controller('FridgeController', ['fridge_get','fridge_put','ingredient_list','$scope','user', function(fridge_get, fridge_put,ingredient_list, $scope,user){
	/* Switch zur Anzeige von Autocomplete */
	var autoSwitch = false;

	this.editItem = {
		_id: user.name,
		ingredient: '',
		amount: ''
	};

	this.ingredientList = ingredient_list.query();


	this.refreshData = function(times)
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
			});
		}

	}

	/* Daten initial abrufen */
	this.refreshData(1);

	var clearInput = function()
	{
		document.getElementById('fridge_input').value = "";
		document.getElementById('fridge_input_amount').value = "";
		document.getElementById('fridge_input_unit').value = "";
	}

	this.add = function()
	{
		this.editItem.ingredient = document.getElementById('fridge_input').value
		this.editItem.amount = document.getElementById('fridge_input_amount').value;
		fridge_put.save({},this.editItem);
		clearInput();
		/* Neuladen der Daten, damit die Anzeige aktuell ist */
		this.refreshData(5);
	}

	this.select = function(i)
	{
		document.getElementById('fridge_input').value = this.ingredientList[i]._id;
		document.getElementById('fridge_input_unit').value = this.ingredientList[i].unit;
		document.getElementById('fridge_input_amount').focus();
		document.getElementById('fridge_autocomplete_list').style.display = 'none';
		if (this.ingredientList[i].unit == "St")
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
		if ($scope.fridge[i].unit == "St")
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
		this.editItem.ingredient = $scope.fridge[i]._id;
		/* Unterscheidung zwsichen Stück und gr/ml */
		if ($scope.fridge[i].unit == 'St') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) - 1;
		} 
		else if ($scope.fridge[i].unit == 'g' || 'ml') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) - 100;
		}
		fridge_put.save({},this.editItem);
		$scope.fridge[i].amount = this.editItem.amount;
		clearInput();
	}

	/* Vorräte erhöhen */
	this.plus = function(i)
	{
		this.editItem.ingredient = $scope.fridge[i]._id;
		/* Unterscheidung zwsichen Stück und gr/ml */
		if ($scope.fridge[i].unit == 'St') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) + 1;
		} 
		else if ($scope.fridge[i].unit == 'g' || 'ml') 
		{
			this.editItem.amount = parseInt($scope.fridge[i].amount) + 100;
		}
		fridge_put.save({},this.editItem);
		$scope.fridge[i].amount = this.editItem.amount;
		clearInput();
	}

	/* Vorrat entfernen */
	this.remove = function(i)
	{
		this.editItem.ingredient = $scope.fridge[i]._id;
		this.editItem.amount = 0;
		fridge_put.save({},this.editItem);
		this.refreshData(5);
		clearInput();
	}
}])
