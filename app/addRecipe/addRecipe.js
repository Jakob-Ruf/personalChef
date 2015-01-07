angular.module('rezeptApp.addRecipe', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zum Rezepterstellen ohne Aktualisierung bei Aufruf */
	$routeProvider.when('/addRezept', {
		templateUrl: 'addRecipe/addRecipe.html',
		controller: 'newRecipeController as newRCtrl',
		reloadOnSearch: false});
}])

.controller('newRecipeController', function($scope, rec_add)
{
	this.newRec = {
		_id: '',
		time: '',
		description: '',
		difficulty: '1',
		creator: 'Sterling Archer',
		image: '',
		ingredients: []
	};
	this.newIng = {
		_id: '',
		amount: '',
		unit: 'St.'
	};

	this.addIngredient = function()
	{
		this.newRec.ingredients.push(this.newIng);
		this.newIng = {
			_id: '',
			amount: '',
			unit: 'St.'
		};

	};

	this.showFinal = function()
	{
		/* Anzeigen von Namen, Zutaten und Textarea */
		document.getElementById('new_rec_name').style.display = 'block';
		document.getElementById('new_r_ingredient').style.display = 'block';
		document.getElementById('new_r_description').style.display = 'block';
		/* Ausblenden der Inputfelder */
		document.getElementById('add_r_ingredient_input').style.display = 'none';
		document.getElementById('add_r_name_input').style.display = 'none';
		document.getElementById('add_r_description_input').style.display = 'none';
	};

	this.newRecipeSend = function()
	{	;
		rec_add.save(this.newRec);
		window.location = '#/rezept/' + this.newRec._id;
	};

	this.remove = function(i)
	{
		this.newRec.ingredients.splice(i, 1);
	};

	this.edit = function(i)
	{
		document.getElementById('add_r_description_input').style.display = 'none';
		document.getElementById('new_r_ingredient').style.display = 'block';
		document.getElementById('add_r_ingredient_input').style.display = 'block';
		document.getElementById('new_r_description').style.display = 'none';
		this.newIng = this.newRec.ingredients[i];
		this.newRec.ingredients.splice(i, 1);
	};

	this.newRecipeDescription = function()
	{
		/* Pushen der aktuellen Zutat, falls sie ausgefüllt ist, aber nicht gespeichert wurde */
		if (this.newIng._id != '' && this.newIng.amount != '' ) 
		{
			this.newRec.ingredients.push(this.newIng);
			this.newIng = {
				_id: '',
				amount: '',
				unit: 'St.'
			};
		};
		/* Anzeigen von Namen, Zutaten und Textarea */
		document.getElementById('new_rec_name').style.display = 'block';
		document.getElementById('new_r_ingredient').style.display = 'block';
		document.getElementById('add_r_description_input').style.display = 'block';
		/* Ausblenden der Inputfelder */
		document.getElementById('add_r_ingredient_input').style.display = 'none';
		document.getElementById('add_r_name_input').style.display = 'none';
		document.getElementById('new_r_description').style.display = 'none';
	};

	$scope.newRecipeName = function(difficulty)
	{
		/* Anzeigen von Namen und Zutaten */
		document.getElementById('new_rec_name').style.display = 'block';
		document.getElementById('new_r_ingredient').style.display = 'block';
		document.getElementById('add_r_ingredient_input').style.display = 'block';
		/* Ausblenden der Inputfelder */
		document.getElementById('add_r_name_input').style.display = 'none';
		document.getElementById('add_r_description_input').style.display = 'none';
		document.getElementById('new_r_description').style.display = 'none';

		/* Schwierigkeit farbig darstellen */
		if (difficulty == 1) 
		{
			document.getElementById('new_rec_pic').style.borderBottom= '5px solid green';
		}
		else if (difficulty == 2) 
		{
			document.getElementById('new_rec_pic').style.borderBottom = '5px solid #ff8c00';
		}
		else if (difficulty == 3) 
		{
			document.getElementById('new_rec_pic').style.borderBottom = '5px solid rgba(192, 57, 43,1.0)';
		}
	};

	$scope.newRecipeNameEdit = function()
	{
		/* Anzeigen von Nameninput */
		document.getElementById('add_r_name_input').style.display = 'block';
		/* Ausblenden des Restes */
		document.getElementById('new_rec_name').style.display = 'none';
		document.getElementById('new_r_ingredient').style.display = 'none';
		document.getElementById('add_r_ingredient_input').style.display = 'none';
		document.getElementById('add_r_description_input').style.display = 'none';
		document.getElementById('new_r_description').style.display = 'none';
	};
});