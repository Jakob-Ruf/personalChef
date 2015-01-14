angular.module('rezeptApp.user', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	/* Routing zum eigenen Userprofil mit Aktualisierung bei Aufruf */
	$routeProvider.when('/user', {
		templateUrl: 'user/user.html',
		controller: 'UserController as userCtrl',
		reloadOnSearch: true});
}])

.controller('UserController', ['$scope', function($scope){
	this.user = {
		_id: 'Sterling Archer',
		badges: [
		{
			_id: '123123',
			date_earned: {
				day: '12',
				month: '12',
				year: '2014'
			}
		},
		{
			_id: '1231111',
			date_earned: {
				day: '12',
				month: '12',
				year: '2014'
			}
		}
		],
		favorites: [
		{
			_id: 'Spritzgebäck'
		},
		{
			_id: 'Spaghetti Bolognese'
		}
		],
		fridge: [
		{
			_id: 'Bier',
			amount: '123',
			unit: 'ml'
		},
		{
			_id: 'Zwiebel',
			amount: '12',
			unit: 'St'
		},
		{
			_id: 'Apfel',
			amount: '123',
			unit: 'St'
		}
		],
		friends: [
		{
			_id: 'Paul Pimmel',
			status: 'mutual'
		}
		],
		likes: [
		{
			_id: 'Spritzgeb\u00e4ck'
		}
		],
		profile: {
			date_birthday: {
				day: '24',
				month: '12',
				year: '1912'
			},
			date_joined: {
				day: '24',
				month: '12',
				year: '2014'
			},
			email: 'archer_s@isis.com',
			password: 'ocelotsrule123'
		},
		recipes: [
		{
			_id: 'Spaghetti Bolognese',
			likes_amount: '0',
			ratings_average: '0'
		}
		]
	}

	this.own_redirect = function(i)
	{
		window.location = '#/rezept/' + this.user.recipes[i]._id;
	}

	this.fav_redirect = function(i)
	{
		window.location = '#/rezept/' + this.user.favorites[i]._id;
	}

	this.redirect_edit_img = function()
	{
		window.location = '#/userImg';
	}
	
}]);