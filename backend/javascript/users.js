var exports = {
	testFunction: function(req, res){
		var db = req.db;
		db.collection('users').find({},{'_id':1}).toArray( function (err, items){
			if (err) console.log(err);
			if (items.length == 0){
				res.send('Nothing found');
			} else {
				res.json(items);
			}
		});
	},

	getShortlist: function(req, res){
	    var db = req.db;
	    db.collection('users').find({},{"_id":1}).toArray(function (err, items) {
	        if (err === null){
	            if ( items.length == 0){
	                res.send(404);
	            } else {
	                res.header("Content-Type: application/json; charset=utf-8");
	                res.json(items);
	            }
	        } else {
	            res.send(500);
	            console.log(err);
	        }
	    });
	},

	getByName: function(req, res, id){
	    var db = req.db;
	    console.log(Date().toString() + ": Request of user " + id);
	    db.collection('users').find({"_id": id},{_id:1, "profile.birthday": 1, favorites:1, image:1, badges:1, cooked: 1, cookedAmount: 1, dateJoined: 1, recipes:1, likes: 1}).toArray(function (err, items) {
	        if (err === null){
	            if (items.length == 0){
	                res.send(404);
	            } else {
	                res.header("Content-Type: application/json; charset=utf-8");
	                res.json(items[0]);
	            }
	        } else {
	            res.send(500);
	            throw err;
	        };
	    });
	},

	getList: function(req, res){
	    var db = req.db;
	    console.log(Date().toString() + ": List of users requested");
	    db.collection('users').find({}, {_id:1, favorites:1, image:1, badges:1, imageThumb:1, recipes:1 }).toArray(function (err, items) {
	        if (err === null){
	            if( items.length == 0){
	                res.send(404);
	            } else {
	                res.header("Content-Type: application/json; charset=utf-8");
	                res.json(items);
	            }
	        } else {
	            res.send(500);
	            throw err;
	        };
	    });
	},

	getFlist: function(req, res){
	    var db = req.db;
	    db.collection('users').find().toArray(function (err, items){
	        if (err === null){
	            res.json(items);
	        }
	    });
	},

	getFridge: function(req, res, id){
		var db = req.db;
		db.collection('users').find({'_id': id},{'fridge':1}).sort({'fridge._id':1}).toArray( function (err, items){
	        if (err === null){
	            if (items.length == 0){
	                res.send(404);
	            } else {
	                res.json(items[0]);
	            }
	        } else {
	            console.log(err);
	            res.send(500);
	        };
	    });
	},

	postFridge: function(req, res, id){
		var db = req.db;
	    db.collection('users').find({"_id": req.body._id}).toArray(function (err, users){
	        if ( err === null){
	            if (users.length == 0){
	                res.send(404);
	            } else {
	                manipulateFridge(req, res, users[0]);
	                function manipulateFridge(req, res, user){
	                    db.collection('ingredients').find({"_id": req.body.ingredient}).toArray(function (err, ingredients){
	                        if (err === null){
	                            if (ingredients.length == 0){
	                                res.send(404);
	                            } else {
	                                if (req.body.amount == 0){
	                                    // deleting array element from fridge due to not being existent any more
	                                    db.collection('users').update({"_id": req.body._id}, {$pull: { "fridge": {"_id": req.body.ingredient}}}, function (err, result){
	                                        if (err === null){
	                                            res.send(200);
	                                        } else {
	                                            res.send(500);
	                                            throw err;
	                                        };
	                                    });
	                                } else {
	                                    var b_found = false;
	                                    for (var i = 0; i < user.fridge.length; i++){
	                                        if (user.fridge[i]._id == req.body.ingredient){
	                                            b_found = true;
	                                        }
	                                    };
	                                    if (b_found){
	                                        // alter existing entry
	                                        db.collection('users').update({"_id": req.body._id, "fridge._id": req.body.ingredient}, { $set: {"fridge.$.amount": req.body.amount}}, function (err, result){
	                                            if (err === null){
	                                                res.send(200);
	                                            } else {
	                                                res.send(500);
	                                                throw err;
	                                            }
	                                        });
	                                    } else {
	                                        // create new array entry
	                                        db.collection('users').update({"_id": req.body._id}, {$push: {'fridge': {'_id': req.body.ingredient, 'amount': req.body.amount, 'unit': ingredients[0].unit}}}, function (err, result){
	                                            if (err === null){
	                                                res.send(200);
	                                            } else {
	                                                res.send(500);
	                                                throw err;
	                                            };
	                                        });
	                                    };
	                                };
	                            };
	                        } else {
	                            res.send(500);
	                            throw err;
	                        };
	                    });
	                };
	            };
	        } else {
	            res.send(500);
	            throw err;
	        };
	    });
	},

	postFavorite: function(req, res){
	    var db = req.db;
	    db.collection('users').find({"_id": req.body.user}).toArray(function (err, items){
	        if (err === null){
	            if (items.length == 0){
	                res.send(404);
	            } else {
	                db.collection('recipes').find({"_id": req.body.recipe}).toArray(function (err, items){
	                    if (err === null){
	                        if (items.length == 0){
	                            res.send(404);
	                        } else {
	                            if (req.body.activity == "add"){
	                                db.collection('users').update({"_id": req.body.user},{$push: {'favorites':{"_id": req.body.recipe, 'ratings_average': items[0].ratings_average, 'likes_amount': items[0].likes_amount}}}, function (err, count, status){
	                                    if (err !== null){
	                                        res.send(500);
	                                        throw err;
	                                    } else {
	                                        res.send(200);
	                                    };
	                                });
	                            } else if ( req.body.activity == "delete"){
	                                db.collection('users').update({"_id":req.body.user}, {$pull : { "favorites": { "_id": req.body.recipe}}}, function (err, count, status){
	                                    if (err !== null){
	                                        res.send(500);
	                                        throw err;
	                                    } else {
	                                        res.send(200);
	                                    };
	                                });
	                            } else {
	                                res.send(406); 
	                            };
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
	},

	postBadge: function(req, res){
		var db = req.db;
	    db.collection('users').find({"_id": req.body.user}).toArray(function (err, items){
	        if (err === null){
	            if (items.length == 0){
	                res.send(404)
	            } else {
	                db.collection('badges').find({"_id": req.body.badge}).toArray(function (err, items){
	                    if (err === null){
	                        if (items.length == 0){
	                            res.send(404)
	                        } else {
	                            if (req.body.activity == "add"){
	                                db.collection('users').update({"_id": req.body.user},{$push: {'badges':{"_id": req.body.badge, 'date_earned': Date()}}}, function (err, count, status){
	                                    if (err !== null){
	                                        res.send(500);
	                                        throw err;
	                                    } else {
	                                        res.send(200);
	                                    };
	                                });
	                            } else if (req.body.activity == "delete") {
	                                db.collection('users').update({"_id":req.body.user}, {$pull : { "badges": { "_id": req.body.badge}}}, function (err, count, status){
	                                    if (err !== null){
	                                        res.send(500);
	                                        throw err;
	                                    } else {
	                                        res.send(200);
	                                    };
	                                });
	                            } else {
	                                res.send(406);
	                            };
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
	},

	postFridgeRecipes: function(req, res){
		var db = req.db;
	    var threshold = 0;
	    if (req.body.threshold === null){
	        threshold = 0.5;
	    } else {
	        threshold = req.body.threshold;
	    };
	    // get the fridge of the requesting user
	    db.collection('users').find({"_id": req.body._id},{"fridge":1}).toArray(function (err, users){
	        if (err === null){
	            if (users.length == 0){
	                res.send(404);
	            } else {
	                var user = users[0];
	                // get all recipes
	                db.collection('recipes').find().toArray(function (err, recipes){
	                    if (err === null){
	                        if (recipes.length == 0){
	                            res.send(404);
	                        } else {
	                            // create array with the length of the number of recipes, create empty return array
	                            var result = [recipes.length];
	                            var returnVal = [];
	                            // loop over every recipe
	                            for (var i = recipes.length - 1; i >= 0; i--) {
	                                console.log("Number of ingredients for recipe " + recipes[i]._id + ": " + recipes[i].ingredients.length);
	                                // create subarray with length of number of ingredients
	                                result[i] = [recipes[i].ingredients.length];
	                                // loop over recipe's ingredients
	                                for (var j = recipes[i].ingredients.length - 1; j >= 0; j--) {
	                                    // loop over user's ingredients
	                                    for (var k = user.fridge.length - 1; k >= 0; k--) {
	                                        if (user.fridge[k]._id == recipes[i].ingredients[j]._id){
	                                            // if ingredient in fridge matches recipe ingredient, write 1 into result-array
	                                            console.log(user.fridge[k]._id + " == " + recipes[i].ingredients[j]._id + " ( " + recipes[i]._id + ") i=" + i + " j=" + j);
	                                            result[i][j] = 1;
	                                            break;
	                                        } else {
	                                            console.log(user.fridge[k]._id + " != " + recipes[i].ingredients[j]._id + " ( " + recipes[i]._id + ") i=" + i + " j=" + j);
	                                            // if ingredient in fridge matches recipe ingredient, write 0 into result-array
	                                            result[i][j] = 0;
	                                        };
	                                    };
	                                };
	                            };
	                            // loop over result array and composte the sum and create the text
	                            for (var i = result.length - 1; i >= 0; i--) {
	                                var text = "";
	                                var sum = 0;
	                                var quotient = 0;
	                                for (var j = result[i].length - 1; j >= 0; j--) {
	                                    sum += result[i][j];
	                                    text += result[i][j];
	                                };
	                                // compute the quotient 
	                                quotient = sum / result[i].length;
	                                // if quotient >= threshold write recipe to console and push recipe to returnVal
	                                console.log(recipes[i]._id + " " + text + " Summe: " + sum + " Quotient: " + quotient.toFixed(2) + "%");
	                                if (quotient*1 >= threshold){
	                                    returnVal.push(recipes[i]);
	                                };
	                            };
	                            res.header("Content-Type: application/json; charset=utf-8");
	                            res.json(returnVal);
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
	},

	postReport: function(req, res){
	    var db = req.db;
	    db.collection('users').update({"_id": req.body._id}, {$set: {"reported": true, "reportReason": req.body.reason}}, function (err, result){
	        if (err === null){
	            if ( result == 0 ){
	                console.log("No users was affected. Is _id right?: " + req.body._id);
	            } else {
	                console.log("User " + req.body._id + " was reported");
	            };
	        } else {
	            res.send(500);
	            throw err;
	        };
	    });
	}
};

module.exports = exports;