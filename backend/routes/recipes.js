var express = require('express');
var router = express.Router();

// Method for getting list of recipes
// responds with 500 if error with request
// responds with 404 if no recipe found
// responds with JSON-Array if recipes found
router.get('/list', function (req, res) {
    var db = req.db;
    db.collection('recipes').find({},{"_id":1,"comments":1,"creator":1,"description":1,"difficulty":1,"image":1,"ingredients":1,"likes_amount":1, "ratings_average":1, "popularity":1}).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
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

// Method for getting list of recipes with just recipe names
// responds with 500 if error with request
// responds with 404 if no recipe found
// responds with JSON-Array if recipes found
router.get('/shortlist', function (req, res) {
    var db = req.db;
    db.collection('recipes').find({}, {"_id":1}).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
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

// Method for getting recipe of the day
// responds with 500 if error with request
// responds with 404 if no recipe found
// responds with JSON if recipe found
router.get('/oftheday', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": Requested recipe of the day");
    db.collection('recipes').find({"title": "Rezept des Tages"}, {"_id":1,"comments":1,"creator":1,"description":1,"difficulty":1,"image":1,"ingredients":1,"likes_amount":1, "ratings_average":1}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
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


// Method for getting recipe of the day and communities' choice 
// responds with 500 if error with request
// responds with 404 if no recipe found
// responds with JSON-Array if recipes found
router.get('/startscreen', function (req, res){
    var db = req.db;
    var returnValue = [];
    db.collection('recipes').find({'title':"Rezept des Tages"},{"_id":1,"title":1,"time":1,"ratings_average":1,"likes_amount":1, "ingredients":1, "image":1}).toArray(function (err, items1) {
        if (err === null){
            if (items1.length == 0){
                console.log("RdT nicht gefunden");
                res.send(404);
            } else {
                returnValue.push(items1[0]);
                // res.send(returnValue);
                db.collection('recipes').find({'title':'Wahl der Community'},{"_id":1,"title":1,"time":1,"ratings_average":1,"likes_amount":1, "ingredients":1, "image":1}).toArray( function (err, items2){
                    if (err === null){
                        if (items2.length == 0){
                            console.log("WdC nicht gefunden");
                            res.send(404);
                        } else {
                            res.header("Content-Type: application/json; charset=utf-8");
                            returnValue.push(items2[0]);
                            res.send(returnValue);
                        };
                    } else {
                        res.send(500);
                    };
                });
            };
        } else {
            res.send(500);
        };
    });
});

// Method for getting recipe with given name
// responds with 500 if error with request
// responds with 404 if recipe not found
// responds with JSON if recipe found
router.get('/withIngredient/:iid', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": Requested recipes with ingredient " + req.params.iid);
    db.collection('ingredients').find({"_id": req.params.iid},{"_id":1,"comments":1,"creator":1,"description":1,"difficulty":1,"image":1,"ingredients":1,"likes":1, "ratings_average":1}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                db.collection('recipes').find({"ingredients.name": req.params.iid}, {"_id": 1}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            res.send(404);
                        } else {
                            res.json(items);
                        };
                    } else {
                        res.send(500);
                    };
                });
            }
        } else {
            res.send(500);
        };
    });
});


router.get('/flist', function (req, res){
	var db = req.db;
	db.collection('recipes').find().toArray( function (err, items){
		res.json(items);
	});
});

// Method for getting recipe with given name
// responds with 500 if error with request
// responds with 404 if recipe not found
// responds with JSON if recipe found
router.get('/:rid', function (req, res) {
    var db = req.db;
    console.log(Date().toString() + ": Requested recipe " + req.body._id);
    db.collection('recipes').find({"_id": req.params.rid},{"_id":1,"comments":1,"creator":1,"description":1,"difficulty":1,"image":1,"ingredients":1,"likes":1, "ratings_average":1}).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
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



// router.options('/add', function (req, res){
//     var db = req.db;
//     console.log(req.body);
//     console.log(Date().toString() + ": Requested adding of recipe " + req.body._id);
//     db.collection('recipes').find({"_id": req.body._id}).toArray(function (err, items) {
//         if (err === null){
//             if (items.length == 0){
//                 db.collection('recipes').insert(req.body, function (err, result){
//                     if (err === null){
//                         res.send(200);
//                     } else {
//                         res.send(500);
//                     }
//                 });
//             } else {
//                 res.send(409);
//             };
//         } else {
//             res.send(500);
//         };
//     });
// });


router.post('/add', function (req, res){
    var db = req.db;
    var dummyUrl = ""
    // console.log(req.body);
    console.log(Date().toString() + ": Requested adding of recipe " + req.body._id);
    db.collection('recipes').find({"_id": req.body._id}).toArray(function (err, items) {
        if (err === null){
            if (items.length == 0){
                db.collection('recipes').insert(req.body, function (err, result){
                    if (err === null){
                    	db.collection('recipes').update({"_id": req.body._id},{$set:{"image":"backend/imgs/recipes/dummy.jpg"}}, function (err, result){
                    		if (err === null){
                    			if (result == 0){
                    				res.send(200);
                    			} else {
                    				res.send(404);
                    			};
                    		} else {
                    			res.send(500);
                    		}
                    	});
                    } else {
                        res.send(500);
                    }
                });
            } else {
                res.send(409);
            };
        } else {
            res.send(500);
        };
    });
});


router.post('/report', function (req, res){
	var db = req.db;
	db.collection('recipes').update({"_id": req.body._id}, {$set: {"reported": true}}, function (err, result){
		if (err === null){
			if ( result == 0 ){
				console.log("No recipe was affected. Is _id right?: " + req.body._id);
			} else {
				console.log("Recipe " + req.body._id + " was reported");
			};
		} else {
			res.send(500);
		};
	});
});


router.post('/rate', function (req, res){
    var db = req.db;
    // ratings ought to be between 1 and 5
    if (1 <= req.body.rating && req.body.rating <= 5){
        db.collection('users').find({'_id': req.body.user}).toArray(function (err, items){
        if (err == null){
            if (items.length == 0){
                // user not found, aborting
                console.log(req.body.user + " was not found");
                res.send(404);
            } else {
                db.collection('recipes').find({"_id": req.body.recipe}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            // recipe not found, aborting
                            console.log(req.body.recipe + " was not found");
                            res.send(404);
                        } else {
                            db.collection('recipes').update({"_id": req.body.recipe, "ratings._id": req.body.user}, {$set: {'ratings.$.rating': req.body.rating}}, function (err, result){
                                if (err === null){
                                    if (result == 0){
                                        // no prior rating found. pushing new subdocument
                                        db.collection('recipes').update({"_id": req.body.recipe}, {$push: {"ratings": {"_id": req.body.user, "rating": req.body.rating}}}, function (err, result){
                                            if (err === null){
                                                if (result == 0){
                                                    // no recipe was affected. this should not occur
                                                    // console.log(req.body.user + " used rate. It was not very effective");
                                                    res.send(500);
                                                } else {
                                                    // rating successful
                                                    // console.log(req.body.user + " used rate. It was very effective.");
                                                    res.send(200);
                                                };
                                            } else {
                                                res.send(500);
                                            };
                                        });
                                    } else {
                                        res.send(200);
                                    };
                                } else {
                                    res.send(500);
                                };
                            });
                        };
                    } else {
                        res.send(500);
                    };
                })  
            };
        } else {
            res.send(500);
        };
    });
    } else {
        res.send(400);
    };
});

router.post('/like', function (req, res){
	var db = req.db;
    db.collection('recipes').update({"_id": req.body.recipe}, {$push: {'likes': {'_id': req.body.user}}}, function (err, result){
        if (err === null){
        	if (result == 0){
        		res.send(404);
        	} else {
			    db.collection('users').update({"_id": req.body.user}, {$push: {'likes': {"_id": req.body.recipe}}}, function (err, result){
			        if (err === null){
			        	if (result == 0){
			        		res.send(404);
			        	} else {
			            	res.send(200);
			        	}
			        } else {
			            res.send(500);
			        };
			    });
        	}
        } else {
            res.send(500);
        };
    });
});





// router.get('/api/:aid/:akey/:rid', function(req, res){
// 	var db = req.db;
// 	db.collection('api').find({"_id": req.params.aid}).toArray(function (err, items){
// 		var db_apikey = items[0].apikey;
//  		var p_apikey = req.params.akey;
//         if (db_apikey == p_apikey){
//             db.collection('recipes').find({"_id": req.params.rid}).toArray(function (err2, items2){
//                 res.json(items2);
//             });
//         } else {
//             res.send("Unauthorized access. This incident will be reported.");
//         }
// 	});
// });

module.exports = router;