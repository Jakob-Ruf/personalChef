var http = require('http');


var exports = {
	getRecipe: function( req, res, ean){
		//build URL
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

		        	//console.log(body);
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
					jsonData["Name"] = "";
					jsonData["Type"] = "";
					jsonData["Vendor"]= "";
					jsonData["incredients"] = "";

					// Set all values
					jsonData["Name"] = lDetailname;
					jsonData["Type"] = ltype;
					jsonData["Vendor"]= lvendor;


					//Handle incredients

					var ltext = eanString.substring(eanString.indexOf("descr="+6), eanString.indexOf("name_en"));
					if (ltext.length < 3){
						eanString = eanString.substring("validated="+17, eanString.length);
						ltext = eanString.substring(eanString.indexOf("descr="+6), eanString.indexOf("name_en"));
					}
					ltext = "descr=Lidl Stiftung\nKationen:\nNatrium 13,8 mg/l\nMagnesium 2,9 mg/l\nCalcium 28,0 mg/l\nAnionen:\nChlorid 33,0 mg/l\nSulfat 40,8 mg/l\nNitrat < 0,5 mg/l"
					
					// Unternehmen entfernen
					lstart = ltext.indexOf("\n")+2;
					ltext = ltext.substring(lstart, ltext.length);

					
					
					jsonData["incredients"] = [];

					while (ltext.length > 0){
						// Auf Subkategorie überprüfen
						if ((ltext.indexOf(":") > (ltext.indexOf(" "))) && (ltext.indexOf(":") > (ltext.indexOf("\n"))) || (ltext.indexOf(":") == -1)){
							var lincredient = {};
							// Incredient bauen
						 	lincredient["Name"] = ltext.substring(0, ltext.indexOf(" "));
						 	ltext = ltext.substring(ltext.indexOf(" ")+1, ltext.length);

						 	// Auf Ungleich-Zeichen achten
							if ((ltext.indexOf("<") < 2) && (ltext.indexOf("<") != -1)){
								ltext = ltext.substring(ltext.indexOf("<")+2, ltext.length);
							}

						 	lincredient["Amount"] = ltext.substring(0, ltext.indexOf(" "));
						 	ltext = ltext.substring(ltext.indexOf(" ")+1, ltext.length);

						 	if (ltext.indexOf("\n") == -1){
						 		lincredient["Unit"] = ltext;
						 		ltext = "";
						 	}else{
						 		lincredient["Unit"] = ltext.substring(0, ltext.indexOf("\n"));
						 		ltext = ltext.substring(ltext.indexOf("\n")+1, ltext.length);
						 	}
					 	
						 	jsonData["incredients"].push(lincredient);
						}else{
							ltext = ltext.substring(ltext.indexOf("\n")+1, ltext.length);
						}
					} 




		        	// Return JSON 
		            //res.send(body.toString("utf8"));
		            res.send(jsonData);
		        });
		    });

		
	}
};

module.exports = exports;