var express = require('express');
var router = express.Router();
var images = require('../javascript/images');
var tools = require('../javascript/tools');


router.post('/upload', function (req, res){
    images.imageUpload(req, res, "recipes");
});

// Method for getting list of recipes
// responds with 500 if error with request
// responds with 404 if no recipe found
// responds with JSON-Array if recipes found
router.get('/list', function (req, res) {
    var db = req.db;
    db.collection('recipes').find({},{"_id":1,"comments":1,"creator":1,"description":1,"difficulty":1,"image":1,"imageThumb":1,"ingredients":1,"likes_amount":1, "ratings_average":1, "popularity":1}).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items);
            };
        } else {
            res.send(500);
            throw err;
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
            throw err;
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
            throw err;
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
                        throw err;
                    };
                });
            };
        } else {
            res.send(500);
            throw err;
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
                            res.header("Content-Type: application/json; charset=utf-8");
                            res.json(items);
                        };
                    } else {
                        res.send(500);
                        throw err;
                    };
                });
            }
        } else {
            res.send(500);
            throw err;
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
    console.log(Date().toString() + ": Requested recipe " + req.params.rid);
    db.collection('recipes').find({"_id": req.params.rid},{"_id":1,"comments":1,"creator":1,"creatorThumb":1,"description":1,"difficulty":1,"time":1, "image":1,"ingredients":1,"likes":1, "ratings_average":1}).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items[0]);
            };
        } else {
            res.send(500);
            throw err;
        };
    });
});


router.post('/add', function (req, res){
    var db = req.db;
    var dummyUrl = ""
    console.log(Date().toString() + ": Requested adding of recipe " + req.body._id);
    // check if all fields exist
    console.log(req.body);
    if ( req.body._id === null || req.body.creator === null || req.body.description === null || req.body.difficulty === null || req.body.time === null){
        res.send(400);
    } else {
        // check if all fields are filled
        if (req.body._id == "" || req.body.creator == "" || req.body.description.length < 100 || req.body.difficulty == "" || req.body.time == ""){
            // check if recipe with _id already exists
            db.collection('recipes').find({"_id": req.body._id}).toArray(function (err, items) {
                if (err === null){
                    if (items.length == 0){
                        // check if creating user exists in db
                        db.collection('users').find({'_id': req.body.creator},{'_id':1,'imageThumb':1}).toArray(function (err, users){
                            if (err === null){
                                if (users.length < 1){
                                    res.send(404);
                                } else {
                                    // insert the image into the db
                                    var user = users[0];
                                    db.collection('recipes').insert(req.body, function (err, result){
                                        if (err === null){
                                            // set the image to a dummy image
                                            db.collection('recipes').update({"_id": req.body._id},{$set:{"image":"backend/imgs/recipes/dummy.jpg","creatorThumb": user.imageThumb}}, function (err, result){
                                                if (err === null){
                                                    if (result == 0){
                                                        db.collection('users').update({'_id': req.body.creator}, {$push: {'recipes': {'_id': req.body._id, 'ratings_average': 0, 'likes_amount': 0}}}, function (err, result){
                                                            if (err === null){
                                                                if (result == 0){
                                                                    res.send({'_id': '404'});
                                                                } else {
                                                                    res.send(200);
                                                                };
                                                            } else {
                                                                res.send(500);
                                                                throw err;
                                                            };
                                                        });
                                                    } else {
                                                        res.send(404);
                                                    };
                                                } else {
                                                    res.send(500);
                                                    throw err;
                                                }
                                            });
                                        } else {
                                            res.send(500);
                                            throw err;
                                        }
                                    });
                                }
                            } else {
                                res.send(500);
                                throw err;
                            };
                        });
                    } else {
                        res.send(409);
                    };
                } else {
                    res.send(500);
                    throw err;
                };
            });
        } else {
            res.send(400);
        }        
    };
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
            throw err;
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
                                                        res.send(500);
                                                        throw err;
                                                    } else {
                                                    	// calculate the new popularity score for this recipe
                                                    	tools.calculate(db, req.body.recipe);
                                                        res.send(200);
                                                    };
                                                } else {
                                                    res.send(500);
                                                    throw err;
                                                };
                                            });
                                        } else {
                                            res.send(200);
                                        };
                                    } else {
                                        res.send(500);
                                        throw err;
                                    };
                                });
                            };
                        } else {
                            res.send(500);
                            throw err;
                        };
                    })  
                };
            } else {
                res.send(500);
                throw err;
            };
        });
    } else {
        res.send(400);
    };
});

router.post('/like', function (req, res){
	var db = req.db;
    // check if user exists
    db.collection('users').find({'_id': req.body.user},{'_id':1}).toArray( function ( err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                // inject like into recipe
                db.collection('recipes').update({"_id": req.body.recipe}, {$push: {'likes': {'_id': req.body.user}}}, function (err, result){
                    if (err === null){
                        if (result == 0){
                            res.send(404);
                        } else {
                            // insert like into user
                            db.collection('users').update({"_id": req.body.user}, {$push: {'likes': {"_id": req.body.recipe}}}, function (err, result){
                                if (err === null){
                                    if (result == 0){
                                        res.send(404);
                                    } else {
										tools.calculate(db, req.body.recipe);
                                        res.send(200);
                                    }
                                } else {
                                    res.send(500);
                                    throw err;
                                };
                            });
                        };
                    } else {
                        res.send(500);
                        throw err;
                    };
                });
            };
        } else {
            res.send(500);
            throw err;
        };
    });
});


module.exports = router;