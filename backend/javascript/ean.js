var http = require('http');


var exports = {
	getRecipe: function( req, res, ean){
		// build URL
		url = "http://opengtindb.org/?ean=" + ean + "&cmd=query&queryid=472256359"

		return http.get(url, 
			function(response) {
		        // Continuously update stream with data
		        var body = '';
		        response.on('data', function(d) {
		            body += d
		        });
		        response.on('end', function() {
		        	// Format body when stream is catched completely
					var eanString = body;
					//Name
					var ltype = eanString.substring(eanString.indexOf("name=")+5, eanString.indexOf("detailname")-1);
					//Detailname
					var lDetailname = eanString.substring(eanString.indexOf("detailname=")+11, eanString.indexOf("vendor")-1);
					//Vendor
					var lvendor = eanString.substring(eanString.indexOf("vendor=")+7, eanString.indexOf("maincat")-1);


					// Build JSON
					var jsonData = {};

					//Clear all values
					jsonData["name"] = "";
					jsonData["type"] = "";
					jsonData["vendor"]= "";
					jsonData["contents"] = "";

					// Set all values
					jsonData["name"] = lDetailname;
					jsonData["type"] = ltype;
					jsonData["vendor"]= lvendor;


					//Handle incredients

					var ltext = eanString.substring(eanString.indexOf("descr=")+6, eanString.indexOf("name_en"));
					if (ltext.length < 3){
						eanString = eanString.substring(eanString.indexOf("validated=")+17, eanString.length);
						ltext = eanString.substring(eanString.indexOf("descr=")+6, eanString.indexOf("name_en"));
					}

					// Unternehmen entfernen
					lstart = ltext.indexOf("\n")+2;
					ltext = ltext.substring(lstart, ltext.length);

					jsonData["contents"] = [];

					while (ltext.length > 0){
						// Auf Subkategorie überprüfen
						if ((ltext.indexOf(":") > (ltext.indexOf(" "))) && (ltext.indexOf(":") > (ltext.indexOf("\n"))) || (ltext.indexOf(":") == -1)){
							var lincredient = {};
							// Incredient bauen
						 	lincredient["name"] = ltext.substring(0, ltext.indexOf(" "));
						 	ltext = ltext.substring(ltext.indexOf(" ")+1, ltext.length);

						 	// Auf Ungleich-Zeichen achten
							if ((ltext.indexOf("<") < 2) && (ltext.indexOf("<") != -1)){
								ltext = ltext.substring(ltext.indexOf("<")+2, ltext.length);
							}

						 	lincredient["amount"] = ltext.substring(0, ltext.indexOf(" "));
						 	ltext = ltext.substring(ltext.indexOf(" ")+1, ltext.length);

						 	if (ltext.indexOf("\n") == -1){
						 		lincredient["unit"] = ltext;
						 		ltext = "";
						 	}else{
						 		lincredient["unit"] = ltext.substring(0, ltext.indexOf("\n"));
						 		ltext = ltext.substring(ltext.indexOf("\n")+1, ltext.length);
						 	}
					 	
						 	jsonData["contents"].push(lincredient);
						}else{
							ltext = ltext.substring(ltext.indexOf("\n")+1, ltext.length);
						}
					} 


		        	// Return JSON 
		            //res.send(jsonData.toString("utf8"));
		            res.send(jsonData);
		        });
		    });

		
	}
};

module.exports = exports;