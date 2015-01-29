var tools = require('../javascript/tools.js');
var constants = require('../javascript/constants.js');
var badges = require('../javascript/badges.js');
var ingredients = require('../javascript/ingredients.js');

var exports = {

	// opt: function(req, res){
	// 	res.header("Access-Control-Allow-Origin", '*');
	//     res.header("Access-Control-Allow-Headers", 'content-type');
	//     res.header("Access-Control-Allow-Methods", 'POST');
	// 	res.send(200);
	// },

	getShortlist: function(req, res){
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

	// getFlist: function(req, res){
	// 	var db = req.db;
	// 	db.collection('recipes').find({},{},{$sort: {'_id': 1}}).toArray( function (err, items){
	// 		res.json(items);
	// 	});	
	// },

	getList: function(req, res){
	    var db = req.db;
	    db.collection('recipes').find({},{"_id":1,"creator":1,"imageThumb":1,"ingredients":1,"likes_amount":1, "ratings_average":1}).sort({'ratings_average': -1}).toArray(function (err, items) {
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

	getStartScreen: function(req, res){
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

	getWithIngredient: function(req, res, id){
	    var db = req.db;
	    console.log(Date().toString() + ": Anfrage des Rezepts mit Zutat " + req.params.iid);
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

	getByName: function(req, res, id){
		 var db = req.db;
	    console.log(Date().toString() + ": Anfrage an Rezept " + id);
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

	postAdd: function(req, res){
		var db = req.db;
	    var recipe = {};

	    console.log(Date().toString() + ": Rezept " + req.body._id + " wird hinzugefügt.");

	    // Überprüfen, ob alle notwendigen Felder übergeben wurden
	    if ( !req.body._id || !req.body.creator || !req.body.description || !req.body.difficulty || !req.body.time){
	    	console.log("Eines der Felder existiert nicht");
	        res.send(400);
	    } else {
	        // check if all fields are filled
	        if (req.body._id != "" && req.body.creator != "" && req.body.description != "" && req.body.difficulty != "" && req.body.time != ""){
				// wenn alle Felder gefüllt sind, Erstellung des Rezept-Objekts
			    recipe._id = req.body._id;
			    recipe.description = req.body.description;
			    recipe.difficulty = req.body.difficulty;
			    recipe.time = req.body.time;
			    recipe.creator = req.body.creator;
			    recipe.ingredients = req.body.ingredients;
			    recipe.image = constants.imgRecipeDummyOriginal;
			    recipe.imageThumb = constants.imgRecipeDummyThumb;
			    recipe.comments = [];
			    recipe.likes = [];
			    recipe.ratings_average = 0;
			    recipe.likes_amount = 0;
			    recipe.ratings_amount = 0;


			    for (var i = req.body.ingredients.length - 1; i >= 0; i--) {
			    	ingredients.newIngr(db, req.body.ingredients[i]._id, req.body.ingredients[i].unit);
			    };

	            // Überprüfung ob Rezept mit dem gleichen Namen bereits existiert
	            db.collection('recipes').find({"_id": req.body._id}).toArray(function (err, items) {
	                if (err === null){
	                    if (items.length == 0){
	                        // Überprüfung ob der erstellende Nutzer in der Datenbank existiert
	                        db.collection('users').find({'_id': req.body.creator},{'_id':1,'imageThumb':1}).toArray(function (err, users){
	                            if (err === null){
	                                if (users.length < 1){
	                                	console.log(Date().toString() + ": User mit id " + req.body.creator + " wurde in der Datenbank nicht gefunden. recipes.postAdd");
	                                    res.send(404);
	                                } else {
	                                    // Hinzufügen des CreatorThumbs in das Rezept-Objekt
	                                    var user = users[0];
	                                    recipe.creatorThumb = user.imageThumb;

	                                    // Hinzufügen des Rezept-Objekts in die Datenbank
	                                    db.collection('recipes').insert(recipe, function (err, result){
	                                    	if (err){
	                                    		console.log(Date().toString() + ": Fehler bei der Datenbankoperation. recipes.postAdd " + recipe._id);
	                                    		console.log(err);
	                                    		res.send(500);
	                                    	} else {
	                                    		if (!result){
	                                    			console.log(Date().toString() + ": Es wurde kein Rezept erstellt. " + recipe._id);
	                                    			res.send(500);
	                                    		} else {
	                                    			console.log(Date().toString() + ": Rezept mit der id " + recipe._id + " wurde erstellt");

	                                    			// Hinzufügen des Rezepts in recipes-Array des Erstellers
	                                    			db.collection('users').update({'_id': recipe.creator}, {$push: {'recipes': {'_id': recipe._id, 'ratings_average': 0, 'likes_amount': 0}}}, function (err, result){
                                                        if (err === null){
                                                            if (result == 0){
                                                                res.send(404);
                                                            } else {
                                                                res.send(200);
                                                            };
                                                        } else {
                                                            console.log(err);
                                                            res.send(500);
                                                        };
                                                    });
	                                    		};
	                                    	};
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
	        	console.log("Eines der Felder ist leider leer");
	        	console.log(req.body);
	            res.send(400);
	        };        
	    };	
	},

	postReport: function(req, res){
		var db = req.db;
		db.collection('recipes').update({"_id": req.body.recipe}, {$set: {"reported": true, "reportReason": req.body.reason}}, function (err, result){
			if (err === null){
				if ( result == 0 ){
					console.log("Kein Rezept betroffen. Is recipe richtig?:  " + req.body.recipe);
				} else {
					console.log('Rezept ' + req.body.recipe + ' wurde gemeldet mit der Begründung: "' + req.body.reason + '".');
					res.send(200);
				};
			} else {
	            console.log(err);
				res.send(500);
			};
		});
	},

	postRate: function(req, res){
		var db = req.db;
		console.log(Date().toString() + ": Rating");
	    // Bewertung muss zwischen 1 und 5 sein
	    var rating = req.body.rating*1;
	    if (1 <= rating && rating <= 5){
	        db.collection('users').find({'_id': req.body.user}).toArray(function (err, items){
	            if (err == null){
	                if (items.length == 0){
	                    console.log(req.body.user + " was not found");
	                    res.send(404);
	                } else {
	                    db.collection('recipes').find({"_id": req.body.recipe}).toArray(function (err, items){
	                        if (err === null){
	                            if (items.length == 0){
	                                console.log(req.body.recipe + " wurde nicht gefunden");
	                                res.send(404);
	                            } else {
	                                db.collection('recipes').update({"_id": req.body.recipe, "ratings._id": req.body.user}, {$set: {'ratings.$.rating': rating}}, function (err, result){
	                                    if (err === null){
	                                        if (result == 0){
	                                            // no prior rating found. pushing new subdocument
	                                            db.collection('recipes').update({"_id": req.body.recipe}, {$push: {"ratings": {"_id": req.body.user, "rating": rating}}}, function (err, result){
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
	                                            tools.calculate(db, req.body.recipe);
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

	postLike: function(req, res){
		var db = req.db;
	    // check if user exists
	    if (req.body.activity == "add"){
			db.collection('users').find({'_id': req.body.user},{'_id':1}).toArray( function ( err, items){
		        if (err === null){
		            if (items.length == 0){
		                res.send(404);
		            } else {
		                // insert like into recipe
		                db.collection('recipes').update({"_id": req.body.recipe}, {$addToSet: {'likes': {'_id':req.body.user}}}, function (err, result){
		                    if (err === null){
		                        if (result == 0){
		                            res.send(404);
		                        } else {
		                            // insert like into user
		                            db.collection('users').update({"_id": req.body.user}, {$addToSet: {'likes': {'_id':req.body.recipe}}}, function (err, result){
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
	    } else if (req.body.activity == "delete" ) {
	    	db.collection('recipes').update({'_id': req.body.recipe}, {$pull: {'likes': {'_id': req.body.user}}}, function (err, result){
	    		if (err){
	    			console.log(err);
	    			res.send(500);
	    		} else {
	    			if (result){
	    				db.collection('users').update({'_id' : req.body.user}, {$pull: {'likes': {'_id': req.body.recipe}}}, function (err, result){
	    					if (err){
	    						console.log(err);
	    						res.send(500);
	    					} else {
	    						if (result){
									tools.calculate(db, req.body.recipe);
	    							res.send(200);
	    						} else {
	    							console.log(Date().toString() + ": Nutzer " + req.body.user + " wurde nicht gefunden");
	    						};
	    					};
	    				});
	    			} else {
	    				console.log(Date().toString() + ": Rezept " + req.body.recipe + " wurde nicht gefunden");
	    			};
	    		};
	    	});
	    };	   
	},

	postComment: function(req, res){
		var db = req.db;
		var author = req.body.author;
		var recipe = req.body.recipe;
		var activity = req.body.activity;
		var date = new Date();
		var dateString = date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
		var id = date.getTime();

		if (activity == 'add'){
			var content = req.body.content;
			db.collection('recipes').update({'_id': recipe},{$push : {'comments' : {'id': id, 'author': author, 'content': content, 'time': dateString}}}, function (err, result){
				if (err) {
					console.log(err);
					res.send(500);
				} else {
					if (result){
						console.log(Date().toString() + ': Rezept ' + recipe + ' hat neuen Kommentar "' + content + '" von ' + author);
						res.send(200);
					} else {
						console.log(Date().toString() + ": Keine Rezepte wurden aktualisiert. Abbruch");
						res.send(404);
					};
				};
			});
		} else if (activity == 'delete'){
			db.collection('recipes').update({'_id': recipe}, {$pull : {'comments': {'id': req.body.id}}}, function (err, result){
				if (err) {
					console.log(err);
					res.send(500);
				} else {
					if (result){
						console.log(Date().toString() + ": Kommentar für Rezept " + recipe + " von Nutzer " + author + " wurde gelöscht");
						res.send(200);
						// db.collection('recipes').update()
					} else {
						res.send(404);
					};
				};
			});
		};
	},

	postCooked: function(req, res){
		var db = req.db;
		var user = req.body.user;
		var recipe = req.body.recipe;
		var difficulty = req.body.difficulty;
		var date = new Date();
		var date2 = date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
		var incr = [0,0,0];
		incr[difficulty-1] = 1;
		console.log(user + " - " + recipe + " - " + incr);
		db.collection('recipes').update( {'_id': recipe} , { $inc : { 'cookedAmount' : 1 } }, function (err, result){
			if (err) {
				res.send(500);
			} else {
				if (!result){
					res.send(404);
				} else {
					db.collection('users').update( { '_id' : user } , { $inc: { 'cookedEasy': incr[0], 'cookedNormal': incr[1], 'cookedHard': incr[2], 'cookedAmount': 1 }, $push: { 'cooked' : { '_id' : recipe, 'difficulty': difficulty, 'date': date2 } } }, function (err, result) {
						if (err) {
							res.send(500);
						} else {
							if (!result) {
								res.send(404);
							} else {
								badges.newCooked(db, user, difficulty);
								res.send(200);
							};
						};
					});
				};
			};
		});
	}
};

module.exports = exports;