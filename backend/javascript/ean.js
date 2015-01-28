var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');


var exports = {
	getRecipe: function( req, res, ean){
		var db = req.db;
		// build URL
		url = "http://opengtindb.org/?ean=" + ean + "&cmd=query&queryid=472256359"

		return http.get(url, 
			function(response) {
		        // Continuously update stream with data
		        var stringbody = "";
		        response.on('data', function(d) {
		        	var string = iconv.decode(d, 'ISO-8859-1');
		            stringbody += string;
		        });
		        response.on('end', function() {

		        	// Format body when stream is catched completely
					var eanString = stringbody;
					
					// Überprüfung, ob Zutat in EAN-Datenbank vorhanden ist
					if (eanString.indexOf("error=0") != -1){ 
						//Name
	                    var ltype = eanString.substring(eanString.indexOf("name=")+5, eanString.indexOf("detailname")-1);
	                    if (ltype.indexOf(",") != -1){
	                        ltype = ltype.substring(0, ltype.indexOf(","));
	                    };
	                    //Detailname
	                    var lDetailname = eanString.substring(eanString.indexOf("detailname=")+11, eanString.indexOf("vendor")-1);
	                    //Vendor
	                    var lvendor = eanString.substring(eanString.indexOf("vendor=")+7, eanString.indexOf("maincat")-1);


	                    // Build JSON
	                    var jsonData = {};

	                    jsonData.name = lDetailname;
	                    jsonData.type = ltype;
	                    jsonData.vendor = lvendor;

	                    // Überprüfung, ob Zutat in unserer Datenbank vorhanden ist
	                    db.collection('ingredients').find({'_id': jsonData.type}).toArray( function (err, items){
	                    	if (err) {
	                    		res.send(500);
	                    	} else if (!items.length){
	                    		jsonData.error = true;
	                    		console.log(Date().toString() + ": Zutat " + jsonData.type + " wurde in der Datenbank nicht gefunden.");
	                    		res.send(jsonData);
	                    	} else {
	                    		jsonData.error = false;
	                    		res.send(jsonData);
	                    	};
                    	});
                    } else { 
						var jsonData = {};
						jsonData.type = "";
						jsonData.vendor = "";
						jsonData.name = "";
						jsonData.error = true;
						res.send(jsonData);
					};
		        });
		    }
		);
	}
};

module.exports = exports;