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

### Struktur der Applikation ###
Die Applikation wurde im Front-End möglichst modular gestaltet. So kommen sich parrallelarbeitende Entwickler möglichst wenig in die Quere und können gleichzeitig unterschiedliche Ansichten des Front-Ends entwickeln.

Die App besitzt einen umschließenden Ordner (app), welcher die notwendigen Ressourcen enthält. Bilder welche sich nicht dynamisch in der Laufzeit verändern werden im Ordner "resource" abgelegt. Die nötigen AngularJS-Bibliotheken befinden sich im Ordner "components" und verwendete Schriften sind im Ordner "fonts" zu finden.
Jede individuelle Ansicht der App besitzt einen eigenen Ordner. Darin befinden sich die HTML-Seite, die dazugehörige CSS-Datei und die für diese Seite verantwortliche Javascript-Datei, welche das entsprechende Modul mit dem Controller der Seite enthält. Zusätzlich lässt sich so eine bessere Übersicht ermöglichen, da jegliche Inhalte zu einer Ansicht nur in einem Ordner zu suchen sind.

Die Javascript- und CSS-Dateien werden in der index.html der App eingebunden. Initialisiert werden die Module in der app.js.
```
#!Javascript
/* Laden der zugehörigen Module */
angular.module('rezeptApp', [
	'ngRoute',
	'ngTouch',
	'ngResource',
	'mobile-angular-ui',
	'rezeptServices',
	'rezeptApp.home',
	'rezeptApp.fridge',
	'rezeptApp.rezeptList',
	'rezeptApp.addRecipe',
	'rezeptApp.rezept',
	'rezeptApp.user',
	'rezeptApp.users',
	'rezeptApp.userImgUpload',
	'rezeptApp.recImgUpload',
	'rezeptApp.notFound',
	'rezeptApp.ingredient',
	'rezeptApp.tutorial'
	])
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

#### Der aktuellen Anzeige weitere Elemente hinzufügen ####

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

### Generelles ###

Das Backend wurde über NodeJS mit einem ExpressJS-Framework realisiert. Die Datenhaltung erfolgt in einer MongoDB. Gehostet wird das Ganze auf einem privat verfügbaren RaspberryPi. Der Zugang zu diesem wurde über einen DynDNS-Service realisiert, sodass die Erreichbarkeit auch bei einem Wechsel der IP-Adresse gewährleistet ist.

### Kommunikation mit dem Front-End ###

Das Front-End sendet REST-Calls an das Backend. Diese werden von der entsprechenden Middleware an die richtige Stelle geroutet.

Ausschnitt aus der app.js
```
#!javascript

require('./routes/routes.js')(app);

```

Die routes-Datei enthält die einzelnen Routen, die die Anfragen wiederum an die entsprechenden Funktionen weitergeben. Die Funktionen sind nach dem Datenbankobjekt, das sie hauptsächlich betreffen geordnet und in einzelnen Dateien im javascript-Ordner abgelegt.
Die opt-Funktion besteht zum Erlauben von CORS-Requests, da vom initiierenden Browser zuerst eine OPTIONS-Anfrage geschickt wird, die mit den richtigen Headern beantwortet werden muss, bevor die eigentliche POST-Anfrage geschickt wird.

Ausschnitt aus routes.js
```
#!javascript
var users = require('../javascript/users.js');
[...]

module.exports = function(app){

	// users
	// gets
	app.get('/users/shortlist', function (req,res){
		users.getShortlist(req,res);
	});

	// posts
	app.post('/users/fridge', function (req, res){
		users.postFridge(req, res, req.params.iid);
	});
	app.options('/users/fridge', function (req, res){
		opt(req, res);
	});

[...]
};

function opt(req, res){
	res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 'content-type');
    res.header("Access-Control-Allow-Methods", 'POST');
	res.send(200);
};

```

### Verwendete Node-Module ###

* **Connect-Busboy** für das Handling von Datei-Uploads (Nutzer- und Rezeptbilder)
* **gm** + **imagemagick** für das Umrechnen und Zuschneiden der hochgeladenen Bilder
* **mongodb** + **mongoskin** für die Verbindung zur Datenbank. Mongoskin ist eine schlanke Middleware für MongoDB mit asynchronen Operationen
* **node-schedule** für Tasks im Backend, die regelmäßig ausgeführt werden sollen
* **sha1** für das Hashing der Nutzerpasswörter 
* **morgan** zum Loggen der eingehenden Anfragen

- - - -
## Kontakt zu den Programmierern ##

* Repository Owner: @jakobruf

* Projektteam: @cujasch, @dmller, @Lucas_Schlemm


- - - -