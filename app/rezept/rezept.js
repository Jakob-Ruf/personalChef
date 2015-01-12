angular.module('rezeptApp.rezept', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/rezept/:_id', {
		templateUrl: 'rezept/rezept.html',
		controller: 'rezeptController as recCtrl',
		reloadOnSearch: true});
}])

.controller('rezeptController', ['$routeParams','rec_get','$scope','user',function($routeParams, rec_get,$scope,user) 
{

var d = rec_get.get({ id: $routeParams._id }, function() {/*Success*/},function()
{
	/*Umleitung, falls Fehlermeldung*/
	window.location = '#/nfError';
});

/* Auszuführende Funktion wenn alle Daten vorliegen */
d.$promise.then(function(data)
{
	/* Ausblenden der Ladeanimation */
	document.getElementById("loading").style.display = "none";
	/* Setzen der anzuzeigenden Daten */
	$scope.recipe = data;
	/* Schwierigkeit farbig darstellen */
	difficulty(data.difficulty);
	console.log($scope.recipe);
});
/* Schwierigkeit farbig darstellen */
var difficulty = function(diff)
{
	if (diff == 1) 
	{
		document.getElementById('re_pic').style.borderBottom= '5px solid green';
	}
	else if (diff == 2) 
	{
		document.getElementById('re_pic').style.borderBottom = '5px solid #ff8c00';
	}
	else if (diff == 3) 
	{
		document.getElementById('re_pic').style.borderBottom = '5px solid rgba(192, 57, 43,1.0)';
	}
}

this.redirect_user = function()
{
	if($scope.recipe.creator == user.name)
	{
		window.location = '#/user';
	}
	else
	{
		window.location = '#/nfError';
	}
}

this.addComment = function(comment)
{
	var temp = {
		comment: "",
		author: "",
	};
	temp.content = comment;
	temp.author = user.name;
	document.getElementById("rec_new_comment").value = "";
	$scope.recipe.comments.push(temp);
}

}])