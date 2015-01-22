var express = require('express');
var router = express.Router();

router.get('/list', function (req, res) {
    var db = req.db;
    db.collection('ingredients').find().toArray(function (err, items) {
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items);
            };
        } else {
            res.send(500);
        };
    });
});

router.get('/shortlist', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": Requested short ingredient list");
    db.collection('ingredients').find({}, {'_id': 1}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0) {
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items);
            };
        } else {
            res.send(500);
        };
    });
});


router.get('/:iid', function (req, res) {
    var db = req.db;
    db.collection('ingredients').find({"_id": req.params.iid}).toArray(function (err, items) {
        if (err === null){
            if (items.length == 0) {
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items[0]);
            };
        } else {
            res.send(500);
        };
    });
});


router.post('/add', function(req, res){
	var db = req.db;
    console.log(Date().toString() + ": Requested adding of ingredient " + req.body._id);
    db.collection('ingredients').find({'_id': req.body._id}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                db.collection('ingredients').insert(req.body, function(err, result){
                    if (err === null){
                        res.send(200);
                    } else {
                        res.send(500);
                    };
                });
            } else {
                res.send(409);
            };
        } else {
            res.send(500);
        };
    });
});



module.exports = router;