'use strict';

angular.module('rezeptApp.userImgUpload', ['ngRoute','angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/userImg', {
		templateUrl: 'userImgUpload/userImgUpload.html',
		controller: 'UserImgController as userImgCtrl',
		reloadOnSearch: true});
}])

.controller('UserImgController',['$scope','$upload','user','$timeout', function($scope, $upload,user,$timeout){

	
	document.getElementById('loading').style.display = 'none';
	var setImg = function()
	{
		$scope.img = user.image;
	}

	$timeout(setImg, 500);
	var redirect = function()
	{
		window.location = '#/user';
	}

	$scope.uploadPic = function(files) {
		if (files != null) 
		{
			var name = "";
			var file = files[0];
			/* Auslesen des Dateityps. Notwendig für Namensanpassung des Bildes */
			if (file.type == "image/png") 
			{
				name = user.name+".png";
			}
			else if (file.type == "image/jpeg")
			{
				name = user.name+".jpg";
			}
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
		        var temp = document.getElementsByClassName('new_rec_img_upload');
		        temp[0].style.display = 'none';
		        document.getElementById('loading').style.display = 'block';
		        $timeout(redirect,5000);
		    });
		};
	}


}]);