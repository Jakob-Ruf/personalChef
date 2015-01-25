var fs = require('fs');
var glob = require('glob');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true});

var exports = {

	postImageUpload: function (req, res, type){
		console.log(Date().toString() + ": Incoming " + type + " image upload");
		var fileType = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
		var fileExtension = "";
	    var filename = "";
	    // var destinedFilename = "NoName";
	    var that = this;
	    var path = "";
	    if (type == "recipes"){
			path = './imgs/recipes/';
	    } else if (type == "users"){
	    	path = './imgs/users/';
		} else {
	    	console.log(Date().toString() + ": Unsupported method: " + type);
			return; 
		};

		// pipe the request into busboy
		req.pipe(req.busboy);

		// reacts to file event
	    req.busboy.on('file', function (fieldname, file, filename){
	        // check if file matches fileType
	        that.filename = filename;
	        var splits = filename.split('.');
	        that.fileExtension = splits[splits.length-1];
	        if (fileType.indexOf(that.fileExtension) == -1){
	            console.log("Unsupported file type");
	            res.send(400);
	        } else {
	            // write to filesystem
	            console.log(Date().toString() + ": Writing file " + that.filename);
	            file.pipe(fs.createWriteStream(path + that.filename)); 
	        }; // if
	    }); // on file

	    // reacts to finish event
	    req.busboy.on('finish', function(){
	        console.log(Date().toString() + ": Finished writing file for " + that.filename);
    		exports.imageManip(that.filename, type, req.db, that.fileExtension);
        	res.send(200);
	    }); // on finish
	}, // imageUpload


	
	



	imageManip: function(file, type, db, fileExt){
		exports.resizeImage(file, "imageThumb", type, db, fileExt);
		exports.resizeImage(file, "image", type, db, fileExt);
	}, // imageManip



	resizeImage: function(fileName, typeField, typeCollection, db, fileExt){
		var width = 80;
		var height = 80;
		var path = './imgs/' + typeCollection + '/thumbnails/';
		if (typeField == "image"){
			width = 700;
			height = 400;
			path = 'imgs/' + typeCollection + '/original/';
		};

		// errechnen der Größe des Originalbilds
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
							exports.addToDB(fileName, typeCollection, db, fileExt, typeField);
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
							console.log(Date().toString() + ": " + fileName + " wurde umgerechnet zu " + typeField + " und wird jetzt zur Datenbank hinzugefügt");
							exports.addToDB(fileName, typeCollection, db, fileExt, typeField);
						} else {
							console.log(err);
						};
					});
				}; // if (value.width...)
			} else {
				console.log(Date().toString() + ": Image was not found");
			};	// if (value)	
		}); //imageMagick
	},  //resizeImage



	addToDB: function (file, typeCollection, db, fileExt, field){
		var name = file.substring(0, file.indexOf('.' + fileExt));
		// Anhängen eines Zeitstempels an die Bilder-URL, damit der Browser das Bild als neues behandelt und nicht das im Cache vorhandene lädt
		var date = new Date().getTime();
		var pathNormal = "http://personalchef.ddns.net/git/backend/imgs/" + typeCollection + "/original/" + file + "?v=" + date;
		var pathThumb = "http://personalchef.ddns.net/git/backend/imgs/" + typeCollection + "/thumbnails/" + file + "?v=" + date;
		
		if (field == 'image'){
			db.collection(typeCollection).update({'_id': name}, {$set: {image: pathNormal}}, function(err, result){
				if (err){
					console.log(err);
				};
			});
		} else if (field == 'imageThumb') {
			db.collection(typeCollection).update({'_id': name}, {$set: {imageThumb: pathThumb}}, function(err, result){
				if (err) {
					console.log(err);
				};
			});
		};





		// db.collection(typeCollection).update({'_id': name}, {$set: {"image": pathNormal, "imageThumb": pathThumb}}, function (err, result){
		// 	if (err){
		// 		console.log(Date().toString() + ": Error while writing new image to db");
		// 		console.log(err);
		// 	} else {
		// 		if (result == 0){
		// 			console.log(Date().toString() + ": No entries were affected by db operation. No such entry in " + typeCollection + " with the name " + name);
		// 		} else {
		// 			console.log(Date().toString() + ": Added image paths to db entries");
		// 		};
		// 	}; // if
		// }); // update


		if (typeCollection == 'users' && field == 'imageThumb'){
			db.collection('recipes').update({'creator': name},{$set: {'creatorThumb': pathThumb}}, {multi: true}, function (err, result){
				if (err) console.log(err);
				if (result){
					console.log(Date().toString() + ": The creatorThumb was modified for " + result + " recipes by user " + name);
				};
			});
		};
	} //addToDB
};


module.exports = exports;