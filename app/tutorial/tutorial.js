angular.module('rezeptApp.tutorial', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
		/* Routing zur Rezeptliste mit Aktualisierung bei Aufruf */
		$routeProvider.when('/tutorial', {
			templateUrl: 'tutorial/tutorial.html',
			controller: 'TutorialController as tutorialLCtrl',
			reloadOnSearch: true});
}])

.controller('TutorialController', ['$scope', function($scope){
	$scope.nextMessage = function(value){
		var lhide = "message"+value;
		var lshow = "message"+(value+1);
		var d = document.getElementById(lhide);
		d.className = d.className + " hidden";

		document.getElementById(lshow).className = "";
	}
	$scope.loadPage = function(value){
		var lhide = "page"+(value-1);
		var lshow = "page"+value;		
		var d = document.getElementById(lhide);
		d.className = d.className + " hidden";

		document.getElementById(lshow).className = "";
	}
var height = document.getElementById("page1").clientHeight;
document.getElementById("tut_dark").clientHeight = height;
}]);
