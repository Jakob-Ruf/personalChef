var rezeptServices = angular.module('rezeptServices', ['ngResource']);

rezeptServices.factory('rec_start', ['$resource', function($resource){
    return $resource('http://personalChef.ddns.net:546/recipes/startscreen', {}, {
      query: {method:'GET', params:{}, isArray:true, headers:{'Content-Type':'application/json; charset=UTF-8'}}
    });
  }]);

/* Factory zum Hinzufügen von Rezepten */
rezeptServices.factory("rec_add", ['$resource', function($resource) {
  return $resource("http://personalChef.ddns.net:546/recipes/add");
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
  return $resource('http://personalchef.ddns.net:546/users/fridge');
}]);

/* Factory zum Abrufen der Liste mit den Zutaten um Vorschläge zu liefern */
rezeptServices.factory('ingredient_list', ['$resource', function($resource){
  return $resource('http://personalchef.ddns.net:546/ingredients/list');
}])

/* Factory zum Abrufen der Userdaten */
rezeptServices.factory('user_get', ['$resource', function($resource){
  return $resource('http://personchef.ddns.net:546/users/:id');
}])