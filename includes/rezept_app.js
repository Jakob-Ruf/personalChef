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
		$routeProvider.when('/', {templateUrl: 'includes/html/home.html', reloadOnSearch: false});
		$routeProvider.when('/user', {templateUrl: 'includes/html/user.html', reloadOnSearch: false});
		$routeProvider.when('/fridge', {templateUrl: 'includes/html/fridge.html', reloadOnSearch: false});
		$routeProvider.when('/rezepte', {templateUrl: 'includes/html/rezeptListe.html', reloadOnSearch: false});
		$routeProvider.when('/addRezept', {templateUrl: 'includes/html/addRecipe.html', reloadOnSearch: false});
		$routeProvider.when('/settings', {templateUrl: 'includes/html/settings.html', reloadOnSearch: false});
		$routeProvider.when('/impressum', {templateUrl: 'includes/html/impressum.html', reloadOnSearch: false});
	});

	app.controller('newRecipeController', function($scope, rec_add)
	{
		this.newRec = {
			_id: '',
			time: "",
			description: "",
			difficulty: 1,
			creator: "",
			image: "",
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
			document.getElementById("new_rec_name").style.display = "block";
			document.getElementById("new_r_ingredient").style.display = "block";
			document.getElementById("new_r_description").style.display = "block";
			/* Ausblenden der Inputfelder */
			document.getElementById("add_r_ingredient_input").style.display = "none";
			document.getElementById("add_r_name_input").style.display = "none";
			document.getElementById("add_r_description_input").style.display = "none";
		};

		this.newRecipeSend = function()
		{
			rec_add.save(this.newRec);
			window.location = "#/"
		};

		this.remove = function(i)
		{
			this.newRec.ingredients.splice(i, 1);
		};

		this.edit = function(i)
		{
			document.getElementById("add_r_description_input").style.display = "none";
			document.getElementById("new_r_ingredient").style.display = "block";
			document.getElementById("add_r_ingredient_input").style.display = "block";
			document.getElementById("new_r_description").style.display = "none";
			this.newIng = this.newRec.ingredients[i];
			this.newRec.ingredients.splice(i, 1);
		};

		this.newRecipeDescription = function()
		{
			/* Pushen der aktuellen Zutat, falls sie ausgefüllt ist, aber nicht gespeichert wurde */
			if (this.newIng._id != "" && this.newIng.amount != "") 
			{
				this.newRec.ingredients.push(this.newIng);
				this.newIng = {
					_id: '',
					amount: '',
					unit: 'St.'
				};
			};
			/* Anzeigen von Namen, Zutaten und Textarea */
			document.getElementById("new_rec_name").style.display = "block";
			document.getElementById("new_r_ingredient").style.display = "block";
			document.getElementById("add_r_description_input").style.display = "block";
			/* Ausblenden der Inputfelder */
			document.getElementById("add_r_ingredient_input").style.display = "none";
			document.getElementById("add_r_name_input").style.display = "none";
			document.getElementById("new_r_description").style.display = "none";
		};

		$scope.newRecipeName = function(difficulty)
		{
			/* Anzeigen von Namen und Zutaten */
			document.getElementById("new_rec_name").style.display = "block";
			document.getElementById("new_r_ingredient").style.display = "block";
			document.getElementById("add_r_ingredient_input").style.display = "block";
			/* Ausblenden der Inputfelder */
			document.getElementById("add_r_name_input").style.display = "none";
			document.getElementById("add_r_description_input").style.display = "none";
			document.getElementById("new_r_description").style.display = "none";

			/* Schwierigkeit farbig darstellen */
			if (difficulty == 1) 
			{
				document.getElementById("new_rec_pic").style.borderBottom= "5px solid green";
			}
			else if (difficulty == 2) 
			{
				document.getElementById("new_rec_pic").style.borderBottom = "5px solid #ff8c00";
			}
			else if (difficulty == 3) 
			{
				document.getElementById("new_rec_pic").style.borderBottom = "5px solid rgba(192, 57, 43,1.0)";
			}
		};

		$scope.newRecipeNameEdit = function()
		{
			/* Anzeigen von Nameninput */
			document.getElementById("add_r_name_input").style.display = "block";
			/* Ausblenden des Restes */
			document.getElementById("new_rec_name").style.display = "none";
			document.getElementById("new_r_ingredient").style.display = "none";
			document.getElementById("add_r_ingredient_input").style.display = "none";
			document.getElementById("add_r_description_input").style.display = "none";
			document.getElementById("new_r_description").style.display = "none";
		};
	});

app.controller('homeController', function($scope, rec_start)
{
	$scope.rezepteHome = rec_start.query();

	$scope.overlayHomeId = function(value)
	{
		return "home_overlay_" + value;
	};

	$scope.openHomeOverlay = function(value)
	{
		var cl = "home_overlay_" + value;
		var elements = document.getElementsByClassName(cl);
		elements[0].style.display = "block";
	};

	$scope.closeHomeOverlay = function(value)
	{
		var cl = "home_overlay_" + value;
		var elements = document.getElementsByClassName(cl);
		elements[0].style.display = "none";
	};
});

app.controller('rezeptListController', function($scope, rec_list){
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
			return "active";
		}
		else
		{
			return "";
		}
	}
	console.log(this.rezeptListe);
});

app.controller('generalController', function($scope)
{
	$scope.fridge = [
	{ name: "Eier", count: "6", unit: "st"},
	{ name: "Zucker", count: "500", unit: "gr"},
	{ name: "Apfel", count: "3", unit: "st"},
	{ name: "Milch", count: "1", unit: "ml"},
	{ name: "Mehl", count: "400", unit: "gr"},
	{ name: "Olivenöl", count: "6", unit: "ml"}
	];

	$scope.getTimes=function(n)
	{
		return new Array(n);
	};

	/* @todo: Löschen... */
	$scope.log=function(n)
	{
		console.log(user_list);
		console.log(rezepte_Home);
	};

	/* Einfärben der nötigen Sterne */
	$scope.ratingIsActive = function(starId, rezept)
	{
		if (starId <= rezept.ratings_average) 
		{
			return "r_active";
		}
		else
		{
			return "r_inactive";
		};
	};

});

})();