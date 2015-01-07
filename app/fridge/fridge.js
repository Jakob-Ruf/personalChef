'use strict';

angular.module('rezeptApp.fridge', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/fridge', {
      templateUrl: 'fridge/fridge.html',
      controller: 'fridgeController as fridgeCtrl',
      reloadOnSearch: true});
}])

.controller('fridgeController', ['fridge_get','fridge_put','ingredient_list', function(fridge_get, fridge_put,ingredient_list){
	/* Abrufen der möglichen Zutaten */
	this.ingredientList = ingredient_list.query();
	/* Switch zur Anzeige von Autocomplete */
	var autoSwitch = 0;
	/* TODO User dynamisch anpassen */
this.fridge = fridge_get.get({id: 'Paul Pimmel'},function(){/*Success*/},function()
{
	/*TODO Weiterleitung auf eine Fehlerseite*/
	console.log("buh")
});

/* TODO User dynamisch anpassen */
this.editItem = {
	_id: 'Paul Pimmel',
	ingredient: '',
	amount: ''
};

this.refreshData = function(times)
{
	for (var i = 0; i < times; i++) 
	{
	this.fridge = fridge_get.get({id: 'Paul Pimmel'},function(){/*success*/},function()
	{
		/*TODO Weiterleitung auf eine Fehlerseite*/
		console.log("buh")
	})
}
}

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
	document.getElementById('fridge_input').value = this.fridge.fridge[i]._id;
	document.getElementById('fridge_input_unit').value = this.fridge.fridge[i].unit;
	document.getElementById('fridge_input_amount').value = parseInt(this.fridge.fridge[i].amount);
	if (this.fridge.fridge[i].unit == "St")
	{
		document.getElementById('fridge_input_amount').step = 1;
	}
	else
	{
		console.log("a");
		document.getElementById('fridge_input_amount').step = 100;
	}
}

this.switch_autocomplete = function()
{
	if (autoSwitch == 0) 
	{
		document.getElementById('fridge_autocomplete_list').style.display = 'block';
		autoSwitch = 1;
	}
	else
	{
		document.getElementById('fridge_autocomplete_list').style.display = 'none';
		autoSwitch = 0;
	}
}
/* Vorräte reduzieren */
this.minus = function(i)
{
	this.editItem.ingredient = this.fridge.fridge[i]._id;
	/* Unterscheidung zwsichen Stück und gr/ml */
	if (this.fridge.fridge[i].unit == 'St') 
	{
		this.editItem.amount = parseInt(this.fridge.fridge[i].amount) - 1;
	} 
	else if (this.fridge.fridge[i].unit == 'g' || 'ml') 
	{
		this.editItem.amount = parseInt(this.fridge.fridge[i].amount) - 100;
	}
	fridge_put.save({},this.editItem);
	this.fridge.fridge[i].amount = this.editItem.amount;
	clearInput();
}

/* Vorräte erhöhen */
this.plus = function(i)
{
	this.editItem.ingredient = this.fridge.fridge[i]._id;
	/* Unterscheidung zwsichen Stück und gr/ml */
	if (this.fridge.fridge[i].unit == 'St') 
	{
		this.editItem.amount = parseInt(this.fridge.fridge[i].amount) + 1;
	} 
	else if (this.fridge.fridge[i].unit == 'g' || 'ml') 
	{
		this.editItem.amount = parseInt(this.fridge.fridge[i].amount) + 100;
	}
	fridge_put.save({},this.editItem);
	this.fridge.fridge[i].amount = this.editItem.amount;
	clearInput();
}

/* Vorrat entfernen */
this.remove = function(i)
{
	this.editItem.ingredient = this.fridge.fridge[i]._id;
	this.editItem.amount = 0;
	fridge_put.save({},this.editItem);
	this.ingredientList = ingredient_list.query();
	this.refreshData(5);
	clearInput();
}
}])
