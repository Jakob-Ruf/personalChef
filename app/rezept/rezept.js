angular.module('rezeptApp.rezept', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zu einem bestimmten Rezept mit Aktualisierung bei Aufruf */
	$routeProvider.when('/rezept/:_id', {
		templateUrl: 'rezept/rezept.html',
		controller: 'RezeptController as recCtrl',
		reloadOnSearch: true});
}])

.controller('RezeptController', ['$routeParams','rec_get','$scope','user','rec_rate','rec_alert','rec_comment','rec_like','rec_cooked',function($routeParams, rec_get,$scope,user,rec_rate,rec_alert,rec_comment,rec_like,rec_cooked) 
{
	if (!user.loggedIn)
	{
		window.location = '#/login';
	}
	
	$scope.recLikes = { size: '', userLike: false};
	var d = rec_get.get({ id: $routeParams._id }, function() {/*Success*/},function()
	{
		/*Umleitung, falls Fehlermeldung*/
		window.location = '#/nfError';
	});

	var portionSize = 1;

	/* Auszuführende Funktion wenn alle Daten vorliegen */
	d.$promise.then(function(data)
	{
		/* Ausblenden der Ladeanimation */
		document.getElementById('loading').style.display = 'none';
		/* Setzen der anzuzeigenden Daten */
		$scope.recipe = data;
		$scope.ingredients = data.ingredients;
		/* Schwierigkeit farbig darstellen */
		difficulty(data.difficulty);
		/* Anzahl der Likes festlegen */
		$scope.recLikes.size = $scope.recipe.likes.length;
		/* Feststellen, ob der Nutzer schon geliket hat oder nicht */
		var likeHelper = 0;
		for (var i = 0; i < $scope.recLikes.size; i++) {
			if ($scope.recipe.likes[i]._id == user.name) 
			{
				likeHelper = 1;
			}
		};
	if (likeHelper == 1) {
		$scope.recLikes.userLike = true;
	}

	/* Standardportionsgröße wird auf 1 gesetzt */
	document.getElementById('rec_size_input').value = portionSize;

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
		window.location = '#/users/' + $scope.recipe.creator;
	}
}

this.addComment = function(comment)
{
	var temp = {
		content: comment,
		author:  user.name,
		activity: "add",
		recipe: $routeParams._id
	};
	document.getElementById("rec_new_comment").value = "";
	rec_comment.save(temp);
	$scope.recipe.comments.push(temp);
}

this.removeComment = function(comment, i)
{
	var temp = {
		id: comment.id,
		activity: "delete",
		recipe: $routeParams._id
	};
	$scope.recipe.comments.splice(i-1, 1);
	rec_comment.save(temp);
}


this.setLike = function(val)
{
	var temp = {
		recipe: $routeParams._id,
		user: user.name,
		activity: ""
	};

	if (val) 
	{
		$scope.recLikes.size += 1;
		temp.activity = "add";
	}
	else
	{
		$scope.recLikes.size -= 1;
		temp.activity = "delete";
	}
	$scope.recLikes.userLike = val;
	rec_like.save(temp);
	/*TODO: Post ins Backend*/
}

this.recRate = function(val)
{
	var temp = {
		user: user.name,
		recipe: $routeParams._id,
		rating: val
	};
	var p = rec_rate.save(temp);
	p.$promise.then(function(data)
	{
		/* POST war erfolgreich und ist abgeschlossen */
	});
}

this.checkUser = function(usr)
{
	if (usr == user.name) 
	{
		return true;
	}else
	{
		return false;
	}
}

this.showRemove = function(comment)
{
	if (comment.author == user.name) {
		return true;
	}
	else
	{
		return false;
	}
}

this.redirect_ImgUpload = function()
{
	window.location = '#/recImg/' + $routeParams._id;
}

this.recAlert = function(comm)
{
	var temp = {
		_id: $routeParams._id,
		comment: comm,
		author: user.name
	}
	var a = rec_alert.save(temp);
	a.$promise.then(function(data)
	{
		
	});
	document.getElementById("rec_new_comment").value = "";
}

/* Funktion zur Anpassung der Portiongröße */
this.calcIngr = function(val)
{
	if (val > 0) 
	{
		for (var i = 0; i < $scope.ingredients.length; i++) 
		{
			$scope.ingredients[i].amount = $scope.ingredients[i].amount / portionSize * val;
		};
		portionSize = val;
	};

}

/* Erneutes Laden der Portionsgröße, damit die Anzeige korrekt bleibt */
this.loadPortSize = function()
{
	document.getElementById('rec_size_input').value = portionSize;
}

this.recCooked = function()
{
	var temp = {
		recipe: $routeParams._id,
		user: user.name,
		difficulty: $scope.recipe.difficulty
	};
	var c = rec_cooked.save(temp);
	c.$promise.then(function(data)
	{
		console.log("Erfolgreich übertragen.. Antwort: " + data);
	})
}

}])