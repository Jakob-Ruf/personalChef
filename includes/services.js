var rezeptServices = angular.module('rezeptServices', ['ngResource']);

rezeptServices.factory('Users', ['$resource',
  function($resource){
    // return $resource('http://lvh.me:3000/users/list', {}, {
    //   query: {method:'GET', params:{}, isArray:true}
    // });
    // below is the ugly but working request
    return $resource('http://78.42.34.2:546/users/list', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);