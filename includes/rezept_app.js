(function() {
	var app = angular.module('rezept', 
		[
		'ngRoute',
		'ngTouch',
		'ngResource',
		'rezeptServices',
		'mobile-angular-ui'
		]);


	app.config(function($routeProvider, $locationProvider) 
	{
		/* Routing zur Startseite mit Neuladen der Seite beim Aufrufen der Startseite */
		$routeProvider.when('/', {
			templateUrl: 'includes/html/home.html',
			reloadOnSearch: true});
		/* Routing zum eigenen Userprofil mit Aktualisierung bei Aufruf */
		$routeProvider.when('/user', {
			templateUrl: 'includes/html/user.html',
			controller: 'userController as userCtrl',
			reloadOnSearch: true});
		/* Routing zum eigenen Kühlschrank mit Aktualisierung bei Aufruf */
		$routeProvider.when('/fridge', {
			templateUrl: 'includes/html/fridge.html',
			controller: 'fridgeController as fridgeCtrl',
			reloadOnSearch: true});
		/* Routing zur Rezeptliste mit Aktualisierung bei Aufruf */
		$routeProvider.when('/rezepte', {
			templateUrl: 'includes/html/rezeptListe.html',
			controller: 'rezeptListController as rezeptLCtrl',
			reloadOnSearch: true});
		/* Routing zum Rezepterstellen ohne Aktualisierung bei Aufruf */
		$routeProvider.when('/addRezept', {
			templateUrl: 'includes/html/addRecipe.html',
			reloadOnSearch: false});
		/* Routing zu den eigenen Einstellungen mit Aktualisierung bei Aufruf */
		$routeProvider.when('/settings', {
			templateUrl: 'includes/html/settings.html',
			reloadOnSearch: true});
		/* Routing zum Impressum ohne Aktualisierung bei Aufruf */
		$routeProvider.when('/impressum', {
			templateUrl: 'includes/html/impressum.html',
			reloadOnSearch: false});
		/* Routing falls etwas nicht gefunden wurden ohne Aktualisierung bei Aufruf */
		$routeProvider.when('/nfError', {
			templateUrl: 'includes/html/notFound.html',
			reloadOnSearch: false});
		/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
		$routeProvider.when('/rezept/:_id', {
			templateUrl: 'includes/html/rezept.html',
			controller: 'rezeptController as recCtrl',
			reloadOnSearch: true});
		/* Umleitung auf die Startseite, falls keiner der definierten Parameter getroffen wurde */
		$routeProvider.otherwise({redirectTo: '/'});
	})

app.controller('rezeptController', ['$routeParams','rec_get',function($routeParams, rec_get) 
{
this.recipe = rec_get.get({ id: $routeParams._id }, function() {/*Success*/},function()
{
	/*Umleitung, falls Fehlermeldung*/
	window.location = '#/nfError';
});
}])

app.controller('fridgeController', ['fridge_get','fridge_put','ingredient_list', function(fridge_get, fridge_put,ingredient_list){
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
	document.getElementById('fridge_input_amount').value = this.fridge.fridge[i].amount;
	if (this.ingredientList[i].unit == "St")
	{
		document.getElementById('fridge_input_amount').step = 1;
	}
	else
	{
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

app.controller('userController', ['$scope', function($scope){
	this.user = {
		_id: 'Sterling Archer',
		badges: [
		{
			_id: '123123',
			date_earned: {
				day: '12',
				month: '12',
				year: '2014'
			}
		},
		{
			_id: '1231111',
			date_earned: {
				day: '12',
				month: '12',
				year: '2014'
			}
		}
		],
		favorites: [
		{
			_id: 'Spritzgeb\u00e4ck'
		},
		{
			_id: 'Spaghetti Bolognese'
		}
		],
		fridge: [
		{
			_id: 'Bier',
			amount: '123',
			unit: 'ml'
		},
		{
			_id: 'Zwiebel',
			amount: '12',
			unit: 'St'
		},
		{
			_id: 'Apfel',
			amount: '123',
			unit: 'St'
		}
		],
		friends: [
		{
			_id: 'Paul Pimmel',
			status: 'mutual'
		}
		],
		likes: [
		{
			_id: 'Spritzgeb\u00e4ck'
		}
		],
		profile: {
			date_birthday: {
				day: '24',
				month: '12',
				year: '1912'
			},
			date_joined: {
				day: '24',
				month: '12',
				year: '2014'
			},
			email: 'archer_s@isis.com',
			password: 'ocelotsrule123'
		},
		recipes: [
		{
			_id: 'Spaghetti Bolognese',
			likes_amount: '0',
			ratings_average: '0'
		}
		]
	}

	this.own_redirect = function(i)
	{
		window.location = '#/rezept/' + this.user.recipes[i]._id;
	}

	this.fav_redirect = function(i)
	{
		window.location = '#/rezept/' + this.user.favorites[i]._id;
	}
	
}])

app.controller('newRecipeController', function($scope, rec_add)
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

app.controller('homeController', function($scope, rec_start)
{
	$scope.rezepteHome = rec_start.query();

	this.redirect = function(i, $event)
	{
		if ($event) {
			$event.stopImmediatePropagation();
		};
		window.location = '#/rezept/' + $scope.rezepteHome[i]._id;
	}

	$scope.overlayHomeId = function(value)
	{
		return 'home_overlay_' + value;
	};

	$scope.openHomeOverlay = function(value)
	{
		var cl = 'home_overlay_' + value;
		var elements = document.getElementsByClassName('overlay');
		elements[value].style.display = 'block';
	};

	$scope.closeHomeOverlay = function(value)
	{
		var cl = 'home_overlay_' + value;
		var elements = document.getElementsByClassName('overlay');
		elements[value].style.display = 'none';
	};
});

app.controller('rezeptListController', function($scope, rec_list){
	this.switchState = 0;
	this.rezeptListe = rec_list.query();
	console.log(this.rezeptListe);

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

app.controller('generalController', function($scope)
{
	$scope.fridge = [
	{ name: 'Eier', count: 6, unit: 'st'},
	{ name: 'Zucker', count: 500, unit: 'gr'},
	{ name: 'Apfel', count: 3, unit: 'st'},
	{ name: 'Milch', count: 1, unit: 'ml'},
	{ name: 'Mehl', count: 400, unit: 'gr'},
	{ name: 'Olivenöl', count: 6, unit: 'ml'}
	];

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

});

})();