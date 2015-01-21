var loginServices = angular.module('loginServices', ['ngResource']);

/* Factory zum Abruf der Startseite */
loginServices.factory('login', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/login",{},{
  post:{
      method:"POST",
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}]);

loginServices.factory('register', ['$resource', function($resource){
  var resource = $resource("http://personalchef.ddns.net:546/signup",{},{
  post:{
      method:"POST",
      isArray:false,
      headers:{'Content-Type':'application/json; charset=UTF-8'} 
    },
  });
  return resource;
}]);

