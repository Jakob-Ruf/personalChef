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
### Kommunikation mit dem Back End via REST ###
#### Erstellen eines Service mit Factories zur Kommunikation ####
#### Nutzen von promises ####

Die definierten Factories liefern über die entsprechende URL eine $promise. Mit dieser lässt sich erst etwas anfangen, wenn sie komplette aufgelöst wurde. Der Code würde aber weiter ausgeführt und es könnte sein, dass benötigte Daten noch nicht vorliegen. Also wird eine Funktion definiert, welche erst ausgeführt wird, wenn die Daten komplett auf dem Gerät des Nutzers vorhanden sind.

Wir definieren eine Variable, welche die Anfrage beinhaltet und wenn $promise final aufgelöst ist, wird die then-Funktion ausgeführt. In dem abgebildeten Fall wird eine Ladeanimation, welche wärend der Abfrage abläuft ausgeblendet, sobald die Kommunikation mit dem Server vorüber ist, alle Daten vorliegen und diese in einer Variable gespeichert wurden
```
#!JavaScript
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

- - - -
## Back End ##
- - - -
### Kontakt zu den Programmierern ###

* Repository Owner: @jakobruf

* Projektteam: @cujasch, @dmller, @Lucas_Schlemm


- - - -