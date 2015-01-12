var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/auth", {native_parser:true});



router.get('/test', function (req, res){
	db.collection('users').find().toArray(function (err, items){
		if (err) console.log(err);
		res.json(items);
	});
});

module.exports = router;