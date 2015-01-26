'use strict';

angular.module('rezeptApp.recImgUpload', ['ngRoute','angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/recImg/:_id', {
		templateUrl: 'recImgUpload/recImgUpload.html',
		controller: 'RecImgController as recImgCtrl',
		reloadOnSearch: true});
}])

.controller('RecImgController',['$routeParams','rec_get', '$scope','$upload', 'user', function($routeParams, rec_get, $scope, $upload, user){

	if (!user.loggedIn)
	{
		window.location = '#/login';
	}
	
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

	// Funktion zum Ausblenden des PopUps
	var hidePopup = function()
	{
		document.getElementById("popup").className = "";
	}

	var name = $routeParams._id;
	$scope.uploadPic = function(files) {

		if (files != null) 
		{
			var popUp = document.getElementById("popup");
			popUp.innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x" style="color=white; text-align=center;"></i>';
			popUp.className = "active";

			document.getElementById('picture_submit').style.display = 'none';
			
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
				// Ändern des PopUps und setzen von Timeout
				popup.innerHTML = "Bitte beachte, dass das Bild zuerst noch verarbeitet werden muss und es deshalb ein bisschen dauern kann, bis das neue Bild angezeigt wird!";
				$timeout(hidePopup, 5000);
		    });
		};
	}
}]);