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
					
					//Handle incridients


					var jsonData = {};
					jsonData["Name"] = lDetailname;
					jsonData["Type"] = ltype;
					jsonData["Vendor"]= lvendor;




		        	// Return productname 
		            //res.send(body.toString("utf8"));
		            res.send(jsonData);
		        });
		    });

		
	}
};

module.exports = exports;