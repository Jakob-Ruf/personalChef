'use strict';

angular.module('rezeptApp.userImgUpload', ['ngRoute','angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/userImg', {
		templateUrl: 'userImgUpload/userImgUpload.html',
		controller: 'userImgController as userImgCtrl',
		reloadOnSearch: true});
}])

.controller('userImgController',['$scope','$upload', function($scope, $upload){

	$scope.uploadPic = function(files) {
		if (files != null) 
		{
			var name = "";
			var file = files[0];
			/* Auslesen des Dateityps. Notwendig für Namensanpassung des Bildes */
			if (file.type == "image/png") 
			{
				name = "Sterling Archer.png";
			}
			else if (file.type == "image/jpeg")
			{
				name = "Sterling Archer.jpg";
			}
			console.log(file);
			$upload.upload(
			{
				url: 'http://personalchef.ddns.net:546/users/upload',
				method: 'POST',
		        //headers: {'Authorization': 'xxx'}, // only for html5
		        file: file,
		        fileName: name
    		}).progress(function(evt) 
    		{
    			file.progress = parseInt(100.0 * evt.loaded / evt.total);
    		}).success(function() 
    		{
		        // Erfolgreicher upload sorgt für Weiterleitung zum Profil
		        window.location = '#/user';
    		});
		};
	}
}]);