var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true});

var exports = {

	postImageUpload: function (req, res, type){
		console.log(Date().toString() + ": Dateiupload mit Namen  " + type);
		var fileType = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
		var fileExtension = "";
	    var filename = "";
	    var that = this;
	    var path = "";
	    if (type == "recipes"){
			path = './imgs/recipes/';
	    } else if (type == "users"){
	    	path = './imgs/users/';
		} else {
	    	console.log(Date().toString() + ": Fehler bei der Angabe des Collection-Typs: " + type);
			return; 
		};

		// übergeben der Anfrage an Busboy
		req.pipe(req.busboy);

		// Reaktion auf file-Event
	    req.busboy.on('file', function (fieldname, file, filename){
	        // Übergeben des Dateinamens an äußeren Scope
	        that.filename = filename;
	        // Überprüfung, ob einkommende Datei dem verlangten Format entspricht
	        var splits = filename.split('.');
	        that.fileExtension = splits[splits.length-1];
	        if (fileType.indexOf(that.fileExtension) == -1){
	            console.log("Dateityp nicht unterstützt");
	            res.send("Dateityp nicht unterstützt", 400);
	        } else {
	            // Schreiben der Datei ins Dateisystem
	            console.log(Date().toString() + ": Schreiben der Datei " + that.filename + " begonnen.");
	            file.pipe(fs.createWriteStream(path + that.filename)); 
	        }; // if
	    }); // on file

	    // Reaktion auf finish-Event, Aufruf der bildverarbeitenden Funktion
	    req.busboy.on('finish', function(){
	        console.log(Date().toString() + ": Datei " + that.filename + " wurde fertig geschrieben.");
    		exports.imageManip(that.filename, type, req.db, that.fileExtension);
        	res.send(200);
	    }); // on finish
	}, // imageUpload


	
	



	imageManip: function(file, type, db, fileExt){
		exports.resizeImage(file, "imageThumb", type, db, fileExt);
		exports.resizeImage(file, "image", type, db, fileExt);
	}, // imageManip



	resizeImage: function(fileName, typeField, typeCollection, db, fileExt){
		var oldDate = new Date();
		var width = 80;
		var height = 80;
		var path = './imgs/' + typeCollection + '/thumbnails/';
		if (typeField == "image"){
			width = 700;
			height = 400;
			path = 'imgs/' + typeCollection + '/original/';
		};

		// Errechnen der Größe des Originalbilds
		imageMagick('./imgs/' + typeCollection + '/' + fileName).size(function (err, value){
			if (err) console.log(err);
			if (value){
				if (value.width < width || value.height < height){
					// unverändertes Speichern, wenn das Bild die gewünschten Dimensionen unterschreitet
					imageMagick('./imgs/' + typeCollection + '/' + fileName)
					.autoOrient()
					.write(path + fileName, function (err){
						if (!err) {
							console.log(Date().toString() + ": " + fileName + " wurde nicht umgerechnet, da es schon kleiner als die gewünwschten Maße war. Wird jetzt zur Datenbank hinzugefügt");
							exports.addToDB(fileName, typeCollection, db, fileExt, typeField, oldDate);
						} else {
							console.log(err);
						};
					});			
				} else {
					cwidth = width;
					cheight = height;
					// Umberechnung des Bilds auf gewünschte Dimensionen
					if (value.width > value.height){
						width == null;
					} else {
						height = null;
					}; // if
					imageMagick('./imgs/' + typeCollection + '/' + fileName)
					.resize(width, height, '^')
					.gravity('Center')
					.crop(cwidth, cheight)
					.write(path + fileName, function (err){
						if (!err) {
							console.log(Date().toString() + ": " + fileName + " wurde umgerechnet zu " + typeField + " und wird jetzt zur Datenbank hinzugefügt " + oldDate);
							exports.addToDB(fileName, typeCollection, db, fileExt, typeField, oldDate);
						} else {
							console.log(err);
						};
					});
				}; // if (value.width...)
			} else {
				console.log(Date().toString() + ": Bild konnte incht gefunden werden");
			};	// if (value)	
		}); //imageMagick
	},  //resizeImage



	addToDB: function (file, typeCollection, db, fileExt, field, oldDate){
		var name = file.substring(0, file.indexOf('.' + fileExt));
		// Anhängen eines Zeitstempels an die Bilder-URL, damit der Browser das Bild als neues behandelt und nicht das im Cache vorhandene lädt
		var date = new Date().getTime();
		var pathNormal = "http://personalchef.ddns.net/git/backend/imgs/" + typeCollection + "/original/" + file + "?v=" + date;
		var pathThumb = "http://personalchef.ddns.net/git/backend/imgs/" + typeCollection + "/thumbnails/" + file + "?v=" + date;
		
		if (field == 'image'){
			db.collection(typeCollection).update({'_id': name}, {$set: {image: pathNormal}}, function(err, result){
				if (err){
					console.log(err);
				} else if (result) {
					console.log("123 " + oldDate);
					exports.deleteFile(db, typeCollection, file, oldDate);
				};
			});
		} else if (field == 'imageThumb') {
			db.collection(typeCollection).update({'_id': name}, {$set: {imageThumb: pathThumb}}, function(err, result){
				if (err){
					console.log(err);
				} else if (result) {
					console.log("1234 " + oldDate);
					exports.deleteFile(db, typeCollection, file, oldDate);
				};
			});
		};

		if (typeCollection == 'users' && field == 'imageThumb'){
			db.collection('recipes').update({'creator': name},{$set: {'creatorThumb': pathThumb}}, {multi: true}, function (err, result){
				if (err) console.log(err);
				if (result){
					console.log(Date().toString() + ": Thumbnails für die Eigenkreationen von Nutzer " + name + " wurde bei " + result + " Rezepten angepasst");
				};
			});
		};
	}, //addToDB




	deleteFile: function(db, typeCollection, fileName, oldDate){
		var filepath = "./imgs/" + typeCollection + "/" + fileName;
		var id = fileName.substring(0, fileName.indexOf('.'));
		db.collection(typeCollection).find({'_id': id}, {'image': 1, 'imageThumb': 1}).toArray(function (err, items) {
			if (err) {
				console.log(err);
			} else if (!items.length) {
				console.log(Date().toString() + ": Dokument " + fileName + " wurde nicht in Collection " + typeCollection + " gefunden. (images.deleteFile)");
			} else {
				var imagePath = items[0].image;
				var imageThumbPath = items[0].imageThumb;
				console.log("243123 " + oldDate);
				if (isOlder(imagePath, oldDate) && isOlder(imageThumbPath, oldDate)){
					fs.unlink(filepath, function(err){
						if (err) {
							console.log(Date().toString() + ": Fehler beim Löschen der Datei " + fileName);
						} else {
							console.log(Date().toString() + ": Datei " + fileName + " wurde gelöscht");
						};
					});
				} else {
					console.log(Date().toString() + ": Datei wird noch nicht gelöscht, da noch darauf gewartet wird, dass das Umrechnen beendet wird.");
				};
			};
		});
	}
};



function isOlder(db_path, date){
	var splitted = db_path.split('?v=');
	return date.getTime() < splitted[1];
};

module.exports = exports;