var rezeptServices = angular.module('rezeptServices', ['ngResource']);

rezeptServices.factory('rec_start', ['$resource',
  function($resource){
    return $resource('http://personalChef.ddns.net:546/recipes/startscreen', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

rezeptServices.factory("rec_add", function($resource) {
  return $resource("http://personalChef.ddns.net:546/recipes/add");
})
