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
    		exports.imageManip(1, that.filename, type);
        	exports.addToDB(that.filename, type, req.db, that.fileExtension);
        	res.send(200);
	    }); // on finish
	}, // imageUpload

	imageManip: function(mode, file, type){
		if (mode == 0){
			var options = {
				"cwd": "/var/www/root/git/backend/imgs/recipes"
			};
			glob('*.*', options, function (err, files){
				for (var i = files.length - 1; i >= 0; i--) {
					console.log("Resizing image: " + files[i]);
					exports.resizeImage(files[i], "thumbnail");
					exports.resizeImage(files[i], "normal");
				};
			}); // glob	

			// set the workdir for glob		
			options = {
				"cwd": "/var/www/root/git/backend/imgs/users"
			};

			// 
			glob('*.*', options, function (err, files){
				for (var i = files.length - 1; i >= 0; i--) {
					console.log("Resizing image: " + files[i]);
					exports.resizeImage(files[i], "thumbnail");
					exports.resizeImage(files[i], "normal");
				};
			}); // glob
		} else if (mode == 1) {
			exports.resizeImage(file, "thumbnail", type);
			exports.resizeImage(file, "normal", type);
		} // if
	}, // imageManip

	addToDB: function (file, type, db, fileExt){
		var name = file.substring(0, file.indexOf('.' + fileExt));
		
		// Anhängen eines Zeitstempels an die Bilder-URL, damit der Browser das Bild als neues behandelt und nicht das im Cache vorhandene lädt
		var date = new Date().getTime();
		var pathNormal = "http://personalchef.ddns.net/git/backend/imgs/" + type + "/original/" + file + "?v=" + date;
		var pathThumb = "http://personalchef.ddns.net/git/backend/imgs/" + type + "/thumbnails/" + file + "?v=" + date;
		db.collection(type).update({'_id': name}, {$set: {"image": pathNormal, "imageThumb": pathThumb}}, function (err, result){
			if (err){
				console.log(Date().toString() + ": Error while writing new image to db");
				console.log(err);
			} else {
				if (result == 0){
					console.log(Date().toString() + ": No entries were affected by db operation. No such entry in " + type + " with the name " + name);
				} else {
					console.log(Date().toString() + ": Added image paths to db entries");
				};
			}; // if
		}); // update
		if (type == 'users'){
			db.collection('recipes').update({'creator': name},{$set: {'creatorThumb': pathThumb}}, {upsert:true, multi: true}, function (err, result){
				if (err) console.log(err);
				if (result){
					console.log(Date().toString() + ": The creatorThumb was modified for " + result + " recipes by user " + name);
				};
			});
		};
	}, //addToDB


	resizeImage: function(file, mode, type){
		var width = 80;
		var height = 80;
		var path = './imgs/' + type + '/thumbnails/';
		if (mode == "normal"){
			width = 700;
			height = 400;
			path = 'imgs/' + type + '/original/';
		};

		imageMagick('./imgs/' + type + '/' + file).size(function (err, value){
			if (err) console.log(err);
			if (value){
				if (value.width < width || value.height < height){
					console.log(Date().toString() + ": Image " + file + " is already smaller than destined dimensions. Aborting.");
					imageMagick('./imgs/' + type + '/' + file)
					.autoOrient()
					.write(path + file, function (err){
						if (!err) {
							console.log(Date().toString() + ": " + file + " wasn't resized due to being smaller than specs.");
						} else {
							console.log(err);
						};
					});			
				} else {
					if (value.width > value.height){
						width == null;
					} else {
						height = null;
					}; // if
					imageMagick('./imgs/' + type + '/' + file)
					.resize(width, height)
					.autoOrient()
					.write(path + file, function (err){
						if (!err) {
							console.log(Date().toString() + ": " + file + " was resized to " + mode);
						} else {
							console.log(err);
						};
					});
				}; // if (value.width...)
			} else {
				console.log(Date().toString() + ": Image was not found");
			};	// if (value)	
		}); //imageMagick
	} //resizeImage
};


module.exports = exports;