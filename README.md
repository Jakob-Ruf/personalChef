# README #
Dies ist die Readme für das Projekt personalChef der Vorlesung "Mobile Applications - Frameworks"

## Front End ##

### Struktur der Applikation ###
Die Applikation wurde im Front-End möglichst modular gestaltet. So kommen sich parallelarbeitende Entwickler möglichst wenig in die Quere und können gleichzeitig unterschiedliche Ansichten des Front-Ends entwickeln.

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
Vor der WEiterleitung an die richtige Middleware wird allerdings noch die Datenbankverbindung in das Anfrage-Objekt gespeichert, sodass auch die Middleware darauf Zugriff hat. 

#### Ausschnitt aus der app.js ####
```
#!javascript

var mongo = require('mongoskin'); // Datenbank-Middleware (schlanker als Mongoose-Zugriffe)
var db = mongo.db("mongodb://localhost:27017/personalChef", {native_parser:true});   // Verbindung mit der Datenbank

[...]

app.use(function(req,res,next){
    [...]
    req.db = db; // DB an Request übergeben
    next(); // Weiterleitung an den zuständigen Router
});

require('./routes/routes.js')(app);

```

Die routes-Datei enthält die einzelnen Routen, die die Anfragen wiederum an die entsprechenden Funktionen weitergeben. Die Funktionen sind nach dem Datenbankobjekt, das sie hauptsächlich betreffen geordnet und in einzelnen Dateien im javascript-Ordner abgelegt.


Die opt-Funktion besteht zum Erlauben von CORS-Requests, da vom initiierenden Browser zuerst eine OPTIONS-Anfrage geschickt wird, die mit den richtigen Headern beantwortet werden muss, bevor die eigentliche POST-Anfrage geschickt wird.

#### Ausschnitt aus routes.js ####
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
* **iconv-lite** zum Umkodieren der Antwort des EAN-Servers von ISO-8859-4 zu UTF-8

### Datenbankoperationen ###

Für die Umsetzung von Datenbankoperationen wurde das mongoskin-Modul verwendet, da es ein sehr schlankes Modul ist und dabei aber jede notwendige Funktionalität liefert, die für diese App benötigt wurde.

### Datenbankaufrufe ###

Generell sind die einzelnen API-Aufrufe in eigene Funktionen gepackt, die dann vom Router routes.js aufgerufen werden, wenn eine entsprechende Anfrage an das Backend geschickt wird. Diese Funktionen erhalten jeweils das Request- und das Response-Objekt des Routers. Bei einer GET-Anfrage werden die Route-Parameter in die Funktion übergeben. Bei einer POST-Anfrage sind alle benötigten Daten in dem Request-Objekt enthalten.
Die entsprechenden Operationen werden in der Funktion mit Hilfe des mongoskin-Moduls ausgeführt. Die Ergebnisse werden dann an das Response-Objekt übergeben und abgeschickt. Dabei werden je nach Situation auch Fehlercodes zurückgegeben.

#### Ausschnitt aus recipes.js ####
```
#!javascript

    getByName: function(req, res, id){
        var db = req.db;
        console.log(Date().toString() + ": Requested recipe " + id);
        db.collection('recipes').find({"_id": id},{"_id":1,"comments":1,"creator":1,"creatorThumb":1,"description":1,"difficulty":1,"time":1, "image":1,"ingredients":1,"likes":1, "ratings_average":1}).toArray(function (err, items) {
            if (err === null){
                if( items.length == 0){
                    res.send(404);
                } else {
                    res.header("Content-Type: application/json; charset=utf-8");
                    res.json(items[0]);
                };
            } else {
                console.log(err);
                res.send(500);
            };
        });
    },

```

### Berechnung der Rezeptbeliebtheit ###

Um herauszufinden, welches Rezept auf der Startseite der App angezeigt werden soll, wird ein gewisser Popularitätswert aus der Anzahl der Bewertungen und der Likes sowie der durchschnittlichen Bewertung berechnet. Diese Berechnung wird jedes Mal angestoßen, wenn einer dieser Werte verändert wird, also wenn ein Nutzer ein Rezept favorisiert oder bewertet.

Popularität = (1.5 * Bewertungsdurchschnitt * log(Bewertungsanzahl+2) + (10 * log(Likezahl+1)) + 1

Jede Nacht um 00:01 Uhr wird das Rezept mit der höchsten Popularität ausgewählt und auf der Startseite zusammen mit einem anderen, zufällig ausgewählten Rezept angezeigt.

### Verleihung der Badges ###

Da die Manipulation von mehrfach verschachtelten Daten in der MongoDB leider nicht einfach zu lösen ist, diese aber für die Darstellung im Frontend in diesem Format benötigt ist, wurde bei der Verleihung der Badges darauf ausgewichen, zuerst den Nutzer aus der Datenbank zu laden, dann die Badges mit Hilfe von Schleifen anzupassen und schließlich die aktualisierten Daten wieder in die Datenbank zu schreiben. Die Verletzung der Isolation ist hierbei als nicht kritisch einzuschätzen, da jeweils nur der betroffene Nutzer selbst die Verleihung der Badges durch seine eigenen Aktionen anstoßen kann und dadurch mehrere gleichzeitig erfolgende Anfragen auf den gleichen Nutzer sehr unwahrscheinlich werden.


### Bilderupload, Umrechnung und Löschen ###

Der Dateiupload wird über eine POST-Anfrage an eine von zwei URLs durchgeführt (je nachdem, ob es ein Nutzer- oder Rezeptbild ist). Bei beiden Uploads wird die selbe Methode mit einem anderen Parameter aufgerufen, der bestimmt, wo das Bild gespeichert und eingetragen wird.
Der einkommende Bilderupload wird darauf überprüft, ob es sich um ein annehmbared Dateiformat handelt und dann entsprechend in einem Ordner auf dem Backend gespeichert. Hierzu wird die Anfrage in Busboy verarbeitet. Busboy reagiert dann auf das file-Event und erstellt einen Schreib-Stream für das Bild. Mit dem finish-Event wird die Bearbeitung der Bilder angestoßen.
Bei der Bearbeitung wird das Bild in zwei verschiedene Größen umgerechnet, um Speicherplatz und Bandbreite zu sparen (Normale Größe und Thumbnail). Für die Umrechnung der Bilder wurden die Nodemodule gm (graphicsmagick) und imagemagick verwendet.
Wenn die Umrechnung fertiggestellt ist, wird der Pfad der Bilder in der Datenbank angepasst. Hierbei wird ein Zeitstempel als URL-Parameter angehängt, der dazu führt, dass das Frontend erkennt, dass es sich nicht mehr um das selbe Bild handelt und somit der Caching-Mechanismus ausgehebelt wird.


#### Ausschnitt aus images.js ####

```
#!javascript

    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename){
        [...]
        file.pipe(fs.createWriteStream(path + that.filename)); 
    }); // on file

    req.busboy.on('finish', function(){
        console.log(Date().toString() + ": Datei " + that.filename + " wurde fertig geschrieben.");
        exports.imageManip(that.filename, type, req.db, that.fileExtension);
        res.send(200);
    }); // on finish


    var date = new Date().getTime();
    var pathNormal = "http://personalchef.ddns.net/git/backend/imgs/" + typeCollection + "/original/" + file + "?v=" + date;

```






- - - -

## Kontakt zu den Programmierern ##

* Repository Owner: @jakobruf

* Projektteam: @cujasch, @dmller, @Lucas_Schlemm


- - - -
