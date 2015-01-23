angular.module('loginApp', ['ngResource','loginServices'])


	.controller('LoginController',['$scope','login','register','$timeout', function($scope,login,register,$timeout)
	{
		$scope.usrLogin = {
			username: '',
			password: ''
		}

		$scope.usrReg = {
			username: '',
			password: '',
			email: ''
		}

		var hidePopup = function()
		{
			document.getElementById("popup").className = "";
		}

		$scope.userLogin = function(user)
		{

		var userLogin = login.save(user, function() {/*Success*/},function()
		{
			var d = document.getElementById("popup");
			d.innerHTML = "Es trat ein Fehler bei der Anmeldung auf. Bitte prüfe die Richtigkeit deiner Angaben!"
			d.className = d.className + "active";
			$timeout(hidePopup, 5000);
			console.log("Fehler bei der Anmeldung");
		});

		userLogin.$promise.then(function(data)
		{
			if (data != "") 
			{
				window.location = 'app/#/home/'+ user.username;
			};
		});
		}

		$scope.userReg = function(user)
		{
		var userRegister = register.save(user, function() {/*Success*/},function()
		{
			var d = document.getElementById("popup");
			d.innerHTML = "Es trat ein Fehler bei der Registrierung auf. Bitte versuche es erneut!"
			d.className = d.className + "active";
			$timeout(hidePopup, 5000);
			console.log("Fehler bei Signup");
		});

		userRegister.$promise.then(function(data)
		{
			if (data != "") {
				window.location = 'app/#/home/'+ user.username;
			};
			//TODO Verarbeitung der Antwort mit Weiterleitung auf die richtige Seite
		});
		}

	}]);