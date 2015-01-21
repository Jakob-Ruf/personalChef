angular.module('loginApp', ['ngResource','loginServices'])


	.controller('LoginController',['$scope','login','register', function($scope,login,register)
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

		$scope.userLogin = function(user)
		{

		var userLogin = login.save(user, function() {/*Success*/},function()
		{
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