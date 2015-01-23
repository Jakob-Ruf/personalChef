'use strict';

angular.module('rezeptApp.recImgUpload', ['ngRoute','angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/recImg/:_id', {
		templateUrl: 'recImgUpload/recImgUpload.html',
		controller: 'RecImgController as recImgCtrl',
		reloadOnSearch: true});
}])

.controller('RecImgController',['$routeParams','rec_get', '$scope','$upload', 'user', function($routeParams, rec_get, $scope, $upload, user){


	document.getElementById('loading').style.display = 'none';
	var d = rec_get.get({id: $routeParams._id});
	d.$promise.then(function(data)
	{
		var recipe = data;
		$scope.recImg = recipe.image;
		var creator = recipe.creator;
		if (creator != user.name) {
			window.location = '#/home';
		}
	});

	var redirect = function()
	{
		window.location = '#/rezept/' + name;
	}

	var name = $routeParams._id;
	$scope.uploadPic = function(files) {

		if (files != null) 
		{
			var name = $routeParams._id;
			var type = "";
			var file = files[0];
			/* Auslesen des Dateityps. Notwendig für Namensanpassung des Bildes */
			if (file.type == "image/png") 
			{
				type = ".png";
			}
			else if (file.type == "image/jpeg")
			{
				type = ".jpg";
			}
			$upload.upload(
			{
				url: 'http://personalchef.ddns.net:546/recipes/upload',
				method: 'POST',
		        //headers: {'Authorization': 'xxx'}, // only for html5
		        file: file,
		        fileName: name + type
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