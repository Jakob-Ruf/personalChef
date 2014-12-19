module.exports = 
{
	updateRatingsAndLikes: function (db){
	    db.collection('recipes').find({},{"ratings":1, "likes":1}).toArray(function (err, items){
	        if (err === null){
	            if (items.length == 0){
	                console.log(Date().toString() + ": No recipes found");
	            } else {
	                for (var i = items.length - 1; i >= 0; i--) {
	                    var likes_amount = 0;
	                    var ratings_amount = 0;
	                    var ratings_average = 0;
	                    var popularity = 0;
	                    if (items[i].likes){
	                        likes_amount = items[i].likes.length;
	                    };
	                    if (items[i].ratings) {
	                        ratings_amount = items[i].ratings.length;
	                        var sum = 0;
	                        for (var j = items[i].ratings.length - 1; j >= 0; j--) {
	                            sum += items[i].ratings[j].rating;
	                        };
	                        ratings_average = sum / ratings_amount;
		                    ratings_average = ratings_average.toFixed(1)*1;
		                    popularity = (ratings_average * 0.5 * Math.log(ratings_amount+2)) * Math.log(likes_amount+2) + 1;
	                        popularity = popularity.toFixed(4)*1;
	                        if (isNaN(popularity)){
	                        	popularity = 1;
	                        };
		                    // console.log("Pop: " + ratings_average + " * 0.5 * " + Math.log(ratings_amount+1) + " * " + Math.log(likes_amount+2) + " +1 = " + popularity);
	                    };
	                    db.collection('recipes').update({"_id": items[i]._id},{$set: {"ratings_average": ratings_average, "ratings_amount": ratings_amount, "likes_amount": likes_amount, "popularity": popularity}}, function (err, result){
	                        if (err === null){ 
	                        } else {
	                        	console.error(err); 
	                        };
	                    });
	                };
	                console.log(Date().toString() + ": Ratings for " + items.length + " recipes were updated");
	            };
	        } else {
	            console.log(Date().toString() + ": Error while querying the database");
	        };
	    });
	}, // updateRatingsAndLikes


	updateStartScreen: function (db){
		db.collection('recipes').update({'title': 'Rezept des Tages'}, {$set: {'title': ''}}, function (err, result){
	        if (err === null){
	            db.collection('recipes').find().toArray(function (err, items){
	                if (err === null){
	                    if (items.length == 0){
	                        console.error("No recipes found");
	                    } else {
	                        // Rezept des Tages zu zufälligem Rezept hinzufügen
	                        var index = Math.floor((Math.random() * items.length)); 
	                        var id = items[index]._id;
	                        db.collection('recipes').update({"_id": id}, {$set: {'title': 'Rezept des Tages'}}, function (err, result){
	                            if (err === null){
	                                db.collection('recipes').update({'title': 'Wahl der Community'}, {$set: {'title': ''}}, function (err, result){
	                                if (err === null){
	                                    db.collection('recipes').find({"title": {$ne: "Rezept des Tages"}}).toArray(function (err, items2){
	                                        if (err === null){
	                                            if (items2.length == 0){
	                                                console.error("No recipes found");
	                                            } else {
	                                                // Wahl der Community zu zufälligem Rezept hinzufügen
	                                                var index = Math.floor((Math.random() * items2.length)); 
	                                                var id = items2[index]._id;
	                                                db.collection('recipes').update({"_id": id}, {$set: {'title': 'Wahl der Community'}}, function (err, result2){
	                                                    if (err === null){
	                                                        console.log(Date().toString() + ": Neue Wahl der Community: " + id);
	                                                    } else {
	                                                        console.error(err);
	                                                    };
	                                                });
	                                            };
	                                        } else {
	                                            console.error(err);
	                                        };
	                                    })
	                                } else {
	                                    console.error(err);
	                                };
	                            });
	                                console.log(Date().toString() + ": Neues Rezept des Tages: " + id);
	                            } else {
	                                console.error(err);
	                            };
	                        });
	                    };
	                } else {
	                    console.error(err);
	                };
	            })
	        } else {
	            console.error(err);
	        };
	    });
	} // updateStartScreen








};