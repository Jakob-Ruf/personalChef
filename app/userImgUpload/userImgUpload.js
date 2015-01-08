'use strict';

angular.module('rezeptApp.userImgUpload', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/userImg', {
      templateUrl: 'userImgUpload/userImgUpload.html',
      controller: 'userImgController as userImgCtrl',
      reloadOnSearch: true});
}])

.controller('userImgController', function(){
	document.getElementById("upl_user_name").value = "Sterling Archer";
});