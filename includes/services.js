var rezeptServices = angular.module('rezeptServices', ['ngResource']);

rezeptServices.factory('user', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);