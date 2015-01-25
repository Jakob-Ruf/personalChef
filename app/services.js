var rezeptServices = angular.module('rezeptServices', ['ngResource']);

/* Factory zum Abruf der Startseite */
rezeptServices.factory('rec_start', ['$resource', function($resource){
  var resource = $resource("http://personalChef.ddns.net:546/recipes/startscreen",{},{
    query:{
      method:'GET',
      isArray:true,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}]);

/* Factory zum Hinzufügen von Rezepten */
rezeptServices.factory("rec_add", ['$resource', function($resource) {
  var resource = $resource("http://personalChef.ddns.net:546/recipes/add",{},{
    post:{
      method:"POST",
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}]);

/* Factory zum Abruf der Rezeptliste */
rezeptServices.factory('rec_list', ['$resource', function($resource) {
	return $resource("http://personalchef.ddns.net:546/recipes/list");
}]);

/* Factory zum Abruf einzelner Rezepte */
rezeptServices.factory('rec_get', ['$resource', function($resource){
  return $resource('http://personalchef.ddns.net:546/recipes/:id');
}]);

/* Factory zum Abruf des Kühlschranks einzelner Personen */
rezeptServices.factory('fridge_get', ['$resource', function($resource){
  return $resource('http://personalchef.ddns.net:546/users/fridge/:id');
}]);

/* Factory zum Ändern des Kühlschrankinhaltes */
rezeptServices.factory('fridge_put', ['$resource', function($resource){
    var resource = $resource("http://personalchef.ddns.net:546/users/fridge",{},{
    post:{
      method:'POST',
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}]);

/* Factory zum Abrufen der Liste mit den Zutaten um Vorschläge zu liefern */
rezeptServices.factory('ingredient_list', ['$resource', function($resource){
    var resource = $resource("http://personalchef.ddns.net:546/ingredients/list",{},{
    query:{
      method:'GET',
      isArray:true,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}])

/* Factory zum Abrufen der Userdaten */
rezeptServices.factory('user_get', ['$resource', function($resource){
  return $resource('http://personalchef.ddns.net:546/users/:id');
}])

/* Factory zum Bewerten von Rezepten */
rezeptServices.factory('rec_rate', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/recipes/rate",{},{
    post:{
      method:'POST',
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}])

/* Factory zum Melden von Rezepten */
rezeptServices.factory('rec_alert', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/recipes/report",{},{
    post:{
      method:'POST',
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}])

/* Factory zum Kommentieren von Rezepten */
rezeptServices.factory('rec_comment', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/recipes/comment",{},{
    post:{
      method:'POST',
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}])

/* Factory zum Liken von Rezepten */
rezeptServices.factory('rec_like', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/recipes/like",{},{
    post:{
      method:'POST',
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}])

/* Factory zum Mitteilen, dass ein Rezept gekocht wurde */
rezeptServices.factory('rec_cooked', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/recipes/cooked",{},{
    post:{
      method:'POST',
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}])



