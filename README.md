# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

- - - -
## Front End ##

### Der aktuellen Anzeige weitere Elemente hinzufügen ###

Bestehende Arrays können mittels ng-model und einem damit verbundenen push um weitere Elemente erweitert werden. Diese Änderungen machen sich bei $scope-Variablen direkt in der Anzeige bemerkbar.
```
#!HTML
<!-- Form wird mit dazugehöriger Submit-Funktion definiert --> 
<form ng-submit="recCtrl.addComment(newComment)">
	<!-- Textarea und ng-model werden festgelegt --> 
	<textarea id="rec_new_comment" ng-model="newComment" required></textarea>
	<button type="submit">Absenden</button>
</form>
```
 Im entsprechende Controller wird der Kommentar den angezeigten Daten hinzugefügt.

```
#!Javascript
/* Funktion zum Hinzufügen von Kommentaren */
this.addComment = function(comment)
{
	/* Variable welche vor dem pushen gefüllt wird */
	var temp = {
		content: comment,
		author:  user.name,
		activity: "add",
		recipe: $routeParams._id
	};
	/* Zurücksetzen des Textfeldes */
	document.getElementById("rec_new_comment").value = "";
	/* Absenden des Kommentares an das Backend */
	rec_comment.save(temp);
	/* Hinzfügen des neuen Kommentares zum bestehenden Array */
	$scope.recipe.comments.push(temp);
}
```


### Kommunikation mit dem Back End via REST ###
#### Erstellen eines Service mit Factories zur Kommunikation ####
Die Kommunikation der angemeldeten Nutzer basiert auf einem zentralen Service (service.js), welcher beim Start der App in der app.js eingebunden wird. Dieser Service beinhaltet mehrere Factories, welche durch einen eindeutigen Namen identifiziert werden und in den notwendigen Fällen geladen angesprochen werden können. Eine Factory besitzt neben dem Namen noch definierte Methoden der Kommunikation mit dem Back-End, die erwartete Art der Antwort und benötigte Header.

Durch die zentrale Anlage der Factories in einem Service können die entsprechenden Ressourcen im Back-End leicht angesprochen werden, ohne diese jedes mal neu zu implementieren.
```
#!Javascript

/* Anlegen des Rezeptservices, welcher die Factories beinhaltet */
var rezeptServices = angular.module('rezeptServices', ['ngResource']);

/* Factory zum Abruf der Startseite */
rezeptServices.factory('rec_start', ['$resource', function($resource){
	/* Festlegen der zugehörigen Adresse im Back-End */
	var resource = $resource("http://personalChef.ddns.net:546/recipes/startscreen",{},
	{
		/* Festlegen möglicher Methoden zur Kommunikation mit den nötigen Einstellungen und Headern */
		query:
		{
      			method:'GET',
      			isArray:true,
      			headers:{'Content-Type':'application/json; charset=UTF-8'} 
    		},
	});
	/* Return der Adresse mit den definierten Methoden */
  	return resource;
}]);
```


#### Nutzen von promises ####

Die definierten Factories liefern über die entsprechende URL eine $promise. Mit dieser lässt sich erst etwas anfangen, wenn sie komplette aufgelöst wurde. Der Code würde aber weiter ausgeführt und es könnte sein, dass benötigte Daten noch nicht vorliegen. Also wird eine Funktion definiert, welche erst ausgeführt wird, wenn die Daten komplett auf dem Gerät des Nutzers vorhanden sind.

Wir definieren eine Variable, welche die Anfrage beinhaltet und wenn $promise final aufgelöst ist, wird die then-Funktion ausgeführt. In dem abgebildeten Fall wird eine Ladeanimation, welche wärend der Abfrage abläuft ausgeblendet, sobald die Kommunikation mit dem Server vorüber ist, alle Daten vorliegen und diese in einer Variable gespeichert wurden
```
#!Javascript
/* Variable mit der Anfrage */
var rezepteHome = rec_start.query();

/* Auszuführende Funktion wenn alle Daten vorliegen */
rezepteHome.$promise.then(function(data)
{
	/* Ausblenden der Ladeanimation */
	document.getElementById("loading").style.display = "none";

	/* Setzen der anzuzeigenden Daten */
	$scope.rezepteHome = data;
});
```
### Diverses im Front-End ###
#### Globale Variablen ####
In AngularJS lassen sich globale Werte festlegen, welche sich durch eine einfache Referenzierung in der Definition des Controllers, auch innerhalb des Controllers ansprechen lassen. So werden bei der Anmeldung die Variablen user.name und user.image befüllt. User.name wird benötigt um REST-Calls richtig zuzuordnen und user.image wird genutzt, um die Sidebar mit einem Nutzerbild zu versorgen.
```
#!Javascript

/* Erstellen einer globalen Variablen für den User */
angular.value('user', {
	name: "",
	image: ""
})

/* Einbinden des 'Users' in einem Controller */
angular.controller('GeneralController',['user', function(user)
{
...
}]);
```

- - - -
## Back End ##
- - - -
### Kontakt zu den Programmierern ###

* Repository Owner: @jakobruf

* Projektteam: @cujasch, @dmller, @Lucas_Schlemm


- - - -