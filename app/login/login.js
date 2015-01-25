angular.module('rezeptApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zum eigenen Userprofil mit Aktualisierung bei Aufruf */
	$routeProvider.when('/login', {
		templateUrl: 'login/login.html',
		controller: 'LoginController as loginCtrl',
		reloadOnSearch: true});
}])

.controller('LoginController',['$scope','login','register','$timeout','user', function($scope,login,register,$timeout,user)
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

	var disableMenu = document.getElementsByClassName("sidebar-toggle");
	disableMenu[0].style.display = "none";
	document.getElementById('signup_submit').style.display = "none";

	var hidePopup = function()
	{
		document.getElementById("popup").className = "";
	}

	$scope.userLogin = function(user)
	{
		var popUp = document.getElementById("popup");
		popUp.innerHTML = '<i class="fa fa-spinner fa-spin fa-3x" style="color=white; text-align=center;"></i>';
		popUp.className = "active";
		var userLogin = login.save(user, function() {/*Success*/},function()
		{
			
			popUp.innerHTML = "Es trat ein Fehler bei der Anmeldung auf. Bitte prüfe die Richtigkeit deiner Angaben!"
			popUp.className = "active";
			$timeout(hidePopup, 5000);
			console.log("Fehler bei der Anmeldung");
		});

		userLogin.$promise.then(function(data)
		{
			if (data != "") 
			{
				popUp.className = "";
				window.location = '#/home/' + user.username;
			};
		});
	}

	$scope.userReg = function(user)
	{
		var popUp = document.getElementById("popup");
		popUp.innerHTML = '<i class="fa fa-spinner fa-spin fa-3x" style="color=white; text-align=center;"></i>';
		popUp.className = "active";
		var userRegister = register.save(user, function() {/*Success*/},function()
		{
			popUp.innerHTML = "Es trat ein Fehler bei der Registrierung auf. Bitte versuche es erneut!"
			popUp.className = popUp.className + "active";
			$timeout(hidePopup, 5000);
			console.log("Fehler bei Signup");
		});

		userRegister.$promise.then(function(data)
		{
			if (data != "") 
			{
				window.location = '#/home/' + user.username;
			};
				//TODO Verarbeitung der Antwort mit Weiterleitung auf die richtige Seite
		});
	}



	this.switch_ls = function() {
		var lgn = document.getElementById("login_form");
		var sgnp = document.getElementById("signup");
		var head = document.getElementById("header");
		if (sgnp.style.display == "block") {
			lgn.style.display = "block";
			sgnp.style.display = "none";
			head.innerHTML = "Einloggen";
		}
		else
		{

			lgn.style.display = "none";
			sgnp.style.display = "block";
			head.innerHTML = "Registrieren";
		}
	}

	this.checkPass = function()
	{
		var pass1 = document.getElementById('signup_pwd');
		var pass2 = document.getElementById('signup_pwd_rep');
		var btn   = document.getElementById('signup_submit');

	    // Festlegen der Farben
	    var goodColor = "#66cc66";
	    var badColor = "#ff6666";
	    // Vergleich der Passwortfelder
	    if(pass1.value == pass2.value)
	    {
	    	btn.style.display = 'block';
	    	pass1.style.backgroundColor = goodColor;
	    	pass2.style.backgroundColor = goodColor;

	    }
	    else
	    {
	    	btn.style.display = 'none';
	    	pass1.style.backgroundColor = badColor;
	    	pass2.style.backgroundColor = badColor;
	    }
	}
}]);