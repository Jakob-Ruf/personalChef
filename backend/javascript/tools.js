var fs = require('fs');

var exports = {
	updateRatingsAndLikes: function (db){
	    db.collection('recipes').find({},{'_id':1}).toArray(function (err, items){
	        if (err === null){
	            if (items.length == 0){
	                console.log(Date().toString() + ": No recipes found");
	            } else {
	                for (var i = items.length - 1; i >= 0; i--) {
	                	exports.calculate(db, items[i]._id);
	                };
	                console.log(Date().toString() + ": Popularity for " + items.length + " recipes was updated");
	            };
	        } else {
	            console.log(Date().toString() + ": Error while querying the database");
	        };
	    });
	}, // updateRatingsAndLikes

	calculate: function (db, recipe){
		db.collection('recipes').find({'_id': recipe},{'ratings':1,'likes':1}).toArray(function (err, item){
			var likes_amount = 0;
	        var ratings_amount = 0;
	        var ratings_average = 0;
	        var popularity = 0;
	        var ratings_part = 0;
	        var likes_part = 0;
	        if (item[0].likes){
	            likes_amount = item[0].likes.length;
	            likes_part = 10 * Math.log(likes_amount + 1);
	        };
	        if (item[0].ratings) {
	            ratings_amount = item[0].ratings.length;
	            var sum = 0;
	            for (var j = item[0].ratings.length - 1; j >= 0; j--) {
	                sum += item[0].ratings[j].rating;
	            };
	            ratings_average = sum / ratings_amount;
	            ratings_average = ratings_average.toFixed(1)*1;
	            if (isNaN(ratings_average)){
	            	ratings_average = 1;
	            }
	            ratings_part = (ratings_average * 1.5 * Math.log(ratings_amount+2));
	        };
	        // popularity = (ratings_average * 0.5 * Math.log(ratings_amount+2)) * Math.log(likes_amount+2) + 1;
	        popularity = ratings_part + likes_part + 1;
	        // console.log("Popularity: " + ratings_average + " * 0.5 *Math.log(" + ratings_amount + " + 2)) * Math.log(" + likes_amount + " + 2) + 1 = " + popularity);
	        popularity = popularity.toFixed(4)*1;
	        console.log(item[0]._id + ": " + popularity);
	        db.collection('recipes').update({"_id": item[0]._id},{$set: {"ratings_average": ratings_average, "ratings_amount": ratings_amount, "likes_amount": likes_amount, "popularity": popularity}}, function (err, result){
	            if (err === null){ 
	            } else {
	            	console.log(err); 
	            };
	        });
		});
	}, //calculate


	updateStartScreen: function (db){
		db.collection('recipes').update({},{$set:{"title":""}}, function (err, result){
			if (err === null){
				db.collection('recipes').find({},{'popularity':1},{sort:{'popularity':-1,limit:1}}).toArray(function (err, recipes){
					if (err === null){
						if (recipes.length == 0){
							res.send(404);
						} else {
							db.collection('recipes').update({'_id': recipes[0]._id},{$set:{"title":"Wahl der Community"}}, function (err, result){
								if (err === null){
									console.log(Date().toString() + ": Wahl der Community: " + recipes[0]._id);
									db.collection('recipes').find({"title": {$ne: "Wahl der Community"}}).toArray( function(err, items2){
										if (err === null){
                                            if (items2.length == 0){
                                                console.error("No recipes found");
                                            } else {
                                                // Wahl der Community zu zufälligem Rezept hinzufügen
                                                var index = Math.floor((Math.random() * items2.length)); 
                                                var id = items2[index]._id;
                                                db.collection('recipes').update({"_id": id}, {$set: {'title': 'Rezept des Tages'}}, function (err, result2){
                                                    if (err === null){
                                                        console.log(Date().toString() + ": Neues Rezept des Tages: " + id);
                                                    } else {
                                                        console.error(err);
                                                    };
                                                });
                                            };
                                        } else {
                                            console.error(err);
                                        };
									}); 											
								} else {
									console.log(Date().toString() + ": Fehler bei Setzen der Wahl der Community");
									console.log(err);
								};
							});
						};
					} else {
						res.send(500);
					};
				});
			} else {
				console.log(Date().toString() + ": " + err);
			};
		});
	}, // updateStartScreen



	checkForDiscrepancies: function (db){
		db.collection('ingredients').find({},{'_id':1}).toArray(function (err, ingredients){
			if (err === null){
				db.collection('recipes').find({},{'ingredients':1,'description':1}).toArray(function (err, recipes){
					if (err === null){
						for (var i = recipes.length - 1; i >= 0; i--) {
							var ingredientError = false;

							// check for errors in description length
							var descriptionError = false;
							if (recipes[i].description.length < 100){
								descriptionError = true;
								// console.log("Description of recipe " + recipes[i]._id + " has only " + recipes[i].description.length + " letters.");
							};

							// check for errors in ingredients
							for (var j = recipes[i].ingredients.length - 1; j >= 0; j--) {
								var ingredientFound = false;
								for (var k = ingredients.length - 1; k >= 0; k--) {
									if (ingredients[k]._id == recipes[i].ingredients[j]._id){
										ingredientFound = true;
										break;
									};
								};
								if (!ingredientFound){
									ingredientError = true;
									// console.log(recipes[i].ingredients[j]._id + " does not exist. Reporting");
								};
							};

							// add report tag to recipe
							if (ingredientError || descriptionError){
								db.collection('recipes').update({'_id': recipes[i]._id},{$set:{"reported":true}}, function (err, result){
									if (err === null){
									} else {
										console.log(Date().toString() + ": Error in checkForDiscrepancies");
									};
								});
							};
						};
						console.log(Date().toString() + ": " + recipes.length + " recipes were checked for discrepancies");
					} else {
						console.log(Date().toString() + ": Error in checkForDiscrepancies");
					};
				});
			} else {
				console.log(Date().toString() + ": Error in checkForDiscrepancies");
			};
		});
	}
};

module.exports = exports;