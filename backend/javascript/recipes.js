var tools = require('../javascript/tools.js');

var exports = {

	shortlist: function(req, res){
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
	            console.log(err);
	            res.send(500);
	        };
	    });
	},

	flist: function(req, res){
		var db = req.db;
		db.collection('recipes').find().toArray( function (err, items){
			res.json(items);
		});	
	},

	list: function(req, res){
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
	            console.log(err);
	            res.send(500);
	        };
	    });
	},

	startScreen: function(req, res){
		var db = req.db;
	    var returnValue = [];
		db.collection('recipes').find({'title':"Rezept des Tages"},{"_id":1,"title":1,"time":1,"ratings_average":1,"likes_amount":1, "ingredients":1, "image":1}).toArray(function (err, items1) {
	        if (err === null){
	            if (items1.length == 0){
	                console.log("RdT nicht gefunden");
	                res.send(404);
	            } else {
	                returnValue.push(items1[0]);
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
	        				console.log(Date().toString() + ": Fehler bei Abruf der WdC");
	                        console.log(err);
	                        res.send(500);
	                    };
	                });
	            };
	        } else {
	        	console.log(Date().toString() + ": Fehler bei Abruf des RdT");
	            console.log(err);
	            res.send(500);
	        };
	    });
	},

	withIngredient: function(req, res, id){
	    var db = req.db;
	    console.log(Date().toString() + ": Requested recipes with ingredient " + req.params.iid);
	    db.collection('ingredients').find({"_id": id},{"_id":1,"comments":1,"creator":1,"description":1,"difficulty":1,"image":1,"ingredients":1,"likes":1, "ratings_average":1}).toArray(function (err, items){
	        if (err === null){
	            if (items.length == 0){
	                res.send(404);
	            } else {
	                db.collection('recipes').find({"ingredients.name": id}, {"_id": 1}).toArray(function (err, items){
	                    if (err === null){
	                        if (items.length == 0){
	                            res.send(404);
	                        } else {
	                            res.header("Content-Type: application/json; charset=utf-8");
	                            res.json(items);
	                        };
	                    } else {
	                        console.log(err);
	                        res.send(500);
	                    };
	                });
	            }
	        } else {
	            console.log(err);
	            res.send(500);
	        };
	    });
	},

	byName: function(req, res, id){
		 var db = req.db;
	    console.log(Date().toString() + ": Requested recipe " + id);
	    db.collection('recipes').find({"_id": id},{"_id":1,"comments":1,"creator":1,"creatorThumb":1,"description":1,"difficulty":1,"time":1, "image":1,"ingredients":1,"likes":1, "ratings_average":1}).toArray(function (err, items) {
	        if (err === null){
	            if( items.length == 0){
	                res.send(404);
	            } else {
	                res.header("Content-Type: application/json; charset=utf-8");
	                res.json(items[0]);
	            };
	        } else {
	            console.log(err);
	            res.send(500);
	        };
	    });
	},

	add: function(req, res){
		var db = req.db;
	    var dummyUrl = ""
	    console.log(Date().toString() + ": Requested adding of recipe " + req.body._id);
	    // check if all fields exist
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
	                                                                console.log(err);
	                                                                res.send(500);
	                                                            };
	                                                        });
	                                                    } else {
	                                                        console.log(Date().toString() + ": Rezept mit ID " + req.body._id + " nicht gefunden.");
	                                                        res.send(404);
	                                                    };
	                                                } else {
	                                                    console.log(err);
	                                                    res.send(500);
	                                                }
	                                            });
	                                        } else {
	                                            console.log(err);
	                                            res.send(500);
	                                        }
	                                    });
	                                }
	                            } else {
	                                console.log(err);
	                                res.send(500);
	                            };
	                        });
	                    } else {
	                    	console.log(Date().toString() + ": Rezept mit ID " + req.body._id + " ist bereits vorhanden.");
	                        res.send(409);
	                    };
	                } else {
	                    console.log(err);
	                    res.send(500);
	                };
	            });
	        } else {
	        	console.log(req.body);
	            res.send(400);
	        };        
	    };	
	},

	report: function(req, res){
		var db = req.db;
		db.collection('recipes').update({"_id": req.body._id}, {$set: {"reported": true}}, function (err, result){
			if (err === null){
				if ( result == 0 ){
					console.log("No recipe was affected. Is _id right?: " + req.body._id);
				} else {
					console.log("Recipe " + req.body._id + " was reported");
				};
			} else {
	            console.log(err);
				res.send(500);
			};
		});
	},

	rate: function(req, res){
		var db = req.db;
		console.log(req.body);
		console.log(Date().toString() + ": Rating");
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
	                                console.log(req.body.recipe + " wurde nicht gefunden");
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
	                                                        console.log(err);
	                                                        res.send(500);
	                                                    } else {
	                                                    	// calculate the new popularity score for this recipe
	                                                    	tools.calculate(db, req.body.recipe);
	                                                        res.send(200);
	                                                    };
	                                                } else {
	                                                    console.log(err);
	                                                    res.send(500);
	                                                };
	                                            });
	                                        } else {
	                                            res.send(200);
	                                        };
	                                    } else {
	                                        console.log(err);
	                                        res.send(500);
	                                    };
	                                });
	                            };
	                        } else {
	                            console.log(err);
	                            res.send(500);
	                        };
	                    })  
	                };
	            } else {
	                console.log(err);
	                res.send(500);
	            };
	        });
	    } else {
	        res.send(400);
	    };
	},

	like: function(req, res){
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
	                                    console.log(err);
	                                };
	                            });
	                        };
	                    } else {
	                        res.send(500);
	                        console.log(err);
	                    };
	                });
	            };
	        } else {
	            res.send(500);
	            console.log(err);
	        };
	    });
	},

	comment: function(req, res){
		console.log(Date().toString() + ": Requested comment");
		var db = req.db;
		var user = req.body.user;
		var recipe = req.body.recipe;
		var comment = req.body.comment;
		var activity = req.body.activity;
		var indx = req.body.indx;
		console.log(Date().toString() + ": Requested comment with " + user + recipe + comment + activity + indx);

		if (activity == 'add'){
			db.collection('recipes').update({'_id': recipe},{$push : {'comments' : {'author': user, 'content': comment, 'time': 'hallo'}}}, function (err, result){
				if (err) {
					console.log(err);
					res.send(500);
				} else {
					if (result){
						console.log(Date().toString() + ': Rezept ' + recipe + ' hat neuen Kommentar "' + comment + '" von ' + user);
					} else {
						console.log(Date().toString() + ": Keine Rezepte wurden aktualisiert. Abbruch");
						res.send(404);
					};
				};
			});
		} else if (activity == 'delete'){
			// db.collection('recipes').update({'_id': recipe}, {$unset : {comments.indx:1}}, function (err, result){
			// 	if (err) {
			// 		console.log(err);
			// 		res.send(500);
			// 	} else {
			// 		if (result){
			// 			db.collection('recipes').update()
			// 		} else {
			// 			res.send(404);
			// 		}
			// 	}
			// });
		}
	}
};

module.exports = exports;