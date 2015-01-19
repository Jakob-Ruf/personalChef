angular.module('rezeptApp.tutorial', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
		/* Routing zur Rezeptliste mit Aktualisierung bei Aufruf */
		$routeProvider.when('/tutorial', {
			templateUrl: 'tutorial/tutorial.html',
			controller: 'TutorialController as tutorialLCtrl',
			reloadOnSearch: true});
}])

.controller('TutorialController', ['$scope', function($scope){
	
}])