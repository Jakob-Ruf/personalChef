var fs = require('fs');
var glob = require('glob');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true});


module.exports = {

	imageUpload: function (req, res, type){
		console.log(Date().toString() + ": Incoming " + type + " image upload");
		var fileType = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
	    var filename = "";
	    var that = this;
	    var path = "";
	    if (type == "recipe"){
			path = './imgs/recipes/';
	    } else if (type == "user"){
	    	path = './imgs/users/';
		} else {
	    	console.log(Date().toString() + ": ")
			return; 
		};

		// pipe the request into busboy
		req.pipe(req.busboy);

		// reacts to file event
	    req.busboy.on('file', function (fieldname, file, filename){
	        that.filename = filename;
	        // check if file matches fileType
	        var splits = filename.split('.');
	        if (fileType.indexOf(splits[splits.length-1]) == -1){
	            console.log("Unsupported file type");
	            res.send(400);
	        } else {
	            // write to filesystem
	            console.log(Date().toString() + ": Writing file " + filename);
	            file.pipe(fs.createWriteStream(path + filename)); 
	        };
	    });

	    // reacts to finish event
	    req.busboy.on('finish', function(){
	        console.log(Date().toString() + ": Finished writing file of " + that.filename);
	        res.send(200);
	    });
	}, //imageUpload

	imageManip: function(){
		var options = {
			"cwd": "/var/www/root/git/backend/imgs/recipes"
		};
		glob('*.*', options, function (err, files){
			for (var i = files.length - 1; i >= 0; i--) {
				console.log("Resizing image: " + files[i]);
				// create thumbnail
				resizeImage(files[i], "thumbnail");
				// create normal sized image
				resizeImage(files[i], "normal");

				// closure for keeping file handle inside the callbacks
				function resizeImage(file, mode){
					var width = 80;
					var height = 80;
					var path = './imgs/recipes/thumbnails/';
					if (mode == "normal"){
						width = 700;
						height = 400;
						path = 'imgs/recipes/original/';
					};
					imageMagick('./imgs/recipes/' + file).size(function (err, value){
						if (value.width < width || value.height < height){
							console.log(Date().toString() + ": Image " + file + " is already smaller than destined dimensions. Aborting.");
							return;
						};
						if (value.width > value.height){
							width == null;
						} else {
							height = null;
						};
						imageMagick('./imgs/recipes/' + file)
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
				}; // resizeImage
			};
		}); // glob
	} // imageManip
}