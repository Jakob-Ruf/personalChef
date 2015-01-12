var userService = angular.module('userService', []);

userService.factory('setUser', ['user','user_get', function(user, user_get)
{
var userInfo = user_get.get({ id: "Sterling Archer" }, function() {/*Success*/},function()
{
	console.log("Fehler beim Abrufen des Nutzers");
});

userInfo.$promise.then(function(data)
{
	user.name = userInfo._id;
	user.img = userInfo.image;
});

return true;
}]);
