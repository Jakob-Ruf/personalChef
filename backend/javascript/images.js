var fs = require('fs');
var glob = require('glob');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true});

var exports = {

	imageUpload: function (req, res, type){
		console.log(Date().toString() + ": Incoming " + type + " image upload");
		var fileType = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
		var fileExtension = "";
	    var filename = "";
	    var destinedFilename = "NoName";
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

		req.busboy.on('field', function(key, value, keyTruncated,valueTruncated){
			if (key == "name"){
				that.destinedFilename = value;	
			};
		});

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
	        };
	    }); // on file

	    // reacts to finish event
	    req.busboy.on('finish', function(){
	        console.log(Date().toString() + ": Finished writing file for " + that.filename);
	        console.log(Date().toString() + ": Renaming it to " + that.destinedFilename + "." + that.fileExtension);
	        rename(path, that.filename, that.destinedFilename, that.fileExtension, type);

	        function rename(path, oldName, newName, fileExt, type){
		        fs.rename(path + oldName, path + newName + "." + fileExt, function(){
		        	console.log(Date().toString() + ": Finished renaming file to " + newName + "." + fileExt);
		        	exports.imageManip(1, newName + "." + fileExt, type);
		        	exports.addToDB(newName + "." + fileExt, type, req.db, newName);
		        	res.send(200);
		        });	        	
	        } // rename-closure
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
			options = {
				"cwd": "/var/www/root/git/backend/imgs/users"
			};
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
		}
	}, // imageManip

	addToDB: function (file, type, db, name){
		var pathNormal = "backend/imgs/" + type + "/original/" + file;
		var pathThumb = "backend/imgs/" + type + "/thumbnails/" + file;
		db.collection(type).update({'_id': name}, {$set: {"image": pathNormal, "imageThumb": pathThumb}}, function (err, result){
			if (err){
				console.log(Date().toString() + ": Error while writing new image to db");
				console.log(err);
			} else {
				if (result == 0){
					console.log(Date().toString() + ": No recipes were affected by db operation. " + name);
				} else {
					console.log(Date().toString() + ": Added image paths to db entries");
				};
			};
		});
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
			} else if (value.width > value.height){
				width == null;
			} else {
				height = null;
			};
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
		}); //imageMagick
	}
};


module.exports = exports;