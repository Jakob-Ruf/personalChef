var fs = require('fs');

function log (text){
	text = Date().toString + ": " + text + "\n";
    fs.appendFile('log.txt', text, function(err){
    	if (err) {
    		return console.error(err);
    	};
    });
}