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
		$routeProvider.when('/rezepte', {templateUrl: 'includes/html/rezept.html', reloadOnSearch: false});
		$routeProvider.when('/addRezept', {templateUrl: 'includes/html/addRecipe.html', reloadOnSearch: false});
		$routeProvider.when('/settings', {templateUrl: 'includes/html/settings.html', reloadOnSearch: false});
	});

	app.controller('newRecipeController', function($scope)
	{
		this.newRec = {
			_id: '',
			time: "",
			description: "",
			difficulty: "",
			user: "",
			image: "",
			ingredients: []
		};
		console.log(this.newRec);
		this.newIng = {};

		/*
		Ingredient array muss am Anfang initialisert werden, damit es befüllt werden kann....
		*/

		this.addIngredient = function()
		{
			this.newRec.ingredients.push(this.newIng);
      		this.newIng = {};
		};

		$scope.newRecipeName = function()
		{
			/* Anzeige des Eingegeben und des neuen Inputs - Ausblenden des alten Inputfeldes */
			document.getElementById("new_rec_name").style.display = "block";
			document.getElementById("add_r_name_input").style.display = "none";
			document.getElementById("new_r_ingredient").style.display = "block";
			document.getElementById("add_r_ingredient_input").style.display = "block";
		};

		$scope.newRecipeNameEdit = function()
		{
			/* Wiederanzeigen des Inputfeldes - Ausblenden des Eingegeben und des neuen Inputs */
			document.getElementById("new_rec_name").style.display = "none";
			document.getElementById("add_r_name_input").style.display = "block";
			document.getElementById("new_r_ingredient").style.display = "none";
			document.getElementById("add_r_ingredient_input").style.display = "none";
		};
	});

app.controller('rezeptController', function($scope, Users)
{

	$scope.rezeptListe = Users.query();
	var user_list = $scope.users;


		/*$scope.rezeptListe = [
		{ 
			title: 	"Rezept des Tages", 
			name: 	"Spaghetti", 
			time: 	"20", 
			rating: "4", 
			likes: 	"42", 
			image: 	"media/img/nudeln.jpg", 
			ingredients:[
				{
					name: "Nudeln",
					amount: "500",
					unit: "gr",
					available: true
				},
				{
					name: "Salz",
					amount: "20",
					unit: "gr",
					available: false
				}
			]},
		{ 
			title: "Lieblingsrezept der Community",
			name: "Burger",
			time: "25",
			rating:"5",
			likes:"24",
			image:"media/img/burgers.jpg",
			ingredients:[
				{
					name: "Rinderhack",
					amount: "500",
					unit: "gr"	
				}]
		}
		];*/
		var rezeptList = $scope.rezeptListe;

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

		$scope.log=function(n)
		{
			console.log(user_list);
			console.log(rezeptList);
		};

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

		$scope.ratingIsActive = function(rezeptId, starId)
		{
			if (starId <= rezeptList[rezeptId].rating) 
			{
				return "r_active";
			}
			else
			{
				return "r_inactive";
			};
		};



		$scope.openHomeInfo = function (value) 
		{
			if (value == 0) 
			{

				ngDialog.open(
				{ 
					template: 'includes/html/home_overlay.html'
				});
				console.log(rezeptList[value].name);
				/*document.getElementById("home_overlay_header").innerHTML = rezeptList[value].name;*/


				/*console.log(document.getElementById("home_overlay_header"));*/
			}
			var element = document.getElementById("home_overlay_header");
			console.log(element);
			element.innerHTML = "New Header";
		};
	});

})();