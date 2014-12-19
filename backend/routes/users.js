var express = require('express');
var router = express.Router();
var mailer = require("nodemailer");


// Verfügbare calls:
// http://78.42.34.2/knowhow.php?tab=6


router.post('/test', function (req, res){

});


router.post('/mail', function (req, res){
    var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "jakob.throwaway@gmail.com",
            pass: "GidGxG573oD4aUnGhiMv"
        }
    });

    var mail = {
        from: "personal Chef <personalChef@gmail.com>",
        to: req.body.to,
        subject: "Your weekly cooking report",
        text: "Node.js New world for me",
        html: "<h1>Mail von personalChef</h1>"
    };

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
            res.send(500);
        }else{
            console.log("Message sent: " + response.message);
            res.send(200);
        }

        smtpTransport.close();
    });
});


router.get('/test/:id', function (req, res){
    var db = req.db;
    db.collection('users').find({"_id": req.params.id}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                res.json(items[0]);
            };
        } else {
            res.send(500);
        };
    });
});

// Method for getting userlist
// responds with 404 if no user is found
// responds with 500 if error with dbcalls
// responds with JSONArray if success
router.get('/list', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": List of users requested");
    db.collection('users').find({}, {_id:1, favorites:1, image:1, badges:1 }).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items);
            }
        } else {
            res.send(500);
        };
    });
});


router.post('/user', function (req, res){
    var db = req.db;
    // returns result if requesting user is mutual friends with requested user
    db.collection('users').find({'_id': req.body.requester, "friends": {$elemMatch: {"_id": req.body.requested, "status": "mutual"}} }).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                // get only limited user data 
                db.collection('users').find({"_id": req.body.requested},{_id:1, favorites:1, image:1, badges:1}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            res.send(404);
                        } else {
                            res.json(items[0]);
                        };
                    } else {
                        res.send(500);
                    };
                });
            } else {
                // return the "complete" userdata
                db.collection('users').find({"_id": req.body.requested}, {_id:1,email:1,date_joined:1,date_birthday:1,current_streak_total:1,highest_streak_total:1,current_streak_healthy:1,highest_streak_healthy:1,favorites:1,friends:1,badges:1,fridge:1}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            res.send(404);
                        } else {
                            res.json(items[0]);
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

// Method for getting short userlist
// responds with 404 if no user is found
// responds with 500 if error with dbcalls
// responds with JSONArray if success
router.get('/shortlist', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": Short list of users requested");
    db.collection('users').find({},{"_id":1}).toArray(function (err, items) {
        if (err === null){
            if( items.length == 0){
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items);
            }
        } else {
            res.send(500);
        }
    });
});

// Method for getting user information
// responds with 500 if error with request
// responds with 404 if no user found
// responds with JSON if user found
router.get('/:uname', function(req, res) {
    var db = req.db;
    console.log(Date().toString() + ": Request of user " + req.params.uname);
    db.collection('users').find({"_id": req.params.uname},{_id:1, favorites:1, image:1, badges:1}).toArray(function (err, items) {
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                res.header("Content-Type: application/json; charset=utf-8");
                res.json(items[0]);
            }
        } else {
            res.send(500);
        };
    });
});


// Method for adding users 
// responds with 409 if user_id is already taken (Statuscode for CONFLICT)
// inserts user with request body into database and responds with 200 if everything was ok
// responds with 500 if error with dbcalls
router.post('/add', function(req, res){
    var db = req.db;
    console.log(Date().toString() + ": Requested adding of user " + req.body._id);
    db.collection('users').find({'_id': req.body._id}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                db.collection('users').insert(req.body, function (err, result){
                    if (err === null){
                        db.collection('users').update({"_id": req.body._id},{$set:{"image":"backend/imgs/users/dummy.png"}}, function(err, result){
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

// Method for changing amount of ingredients in the fridge / deleting ingredient from fridge 
// responds with 404 if user or ingredient was not found
// responds with 500 if error with DBcalls
// changes DB entry and responds with 200 if every little thing was gonna be alright
router.post('/fridge', function (req, res){
    var db = req.db;
    db.collection('users').find({"_id": req.body._id}).toArray(function (err, items){
        if ( err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                db.collection('ingredients').find({"_id": req.body.ingredient}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            res.send(404);
                        } else {
                            if (req.body.amount == 0){
                                console.log(Date().toString() + ": Deleting ingredient " + req.body.ingredient + " for user " + req.body._id);
                                db.collection('users').update({"_id": req.body._id}, {$pull: { "fridge": {"_id": req.body.ingredient}}}, function (err, result){
                                    if (err === null){
                                        res.send(200);
                                    } else {
                                        res.send(500);
                                    };
                                });
                            } else {
                                console.log(Date().toString() + ": Setting amount of " + req.body.ingredient + " to " + req.body.amount + " for user " + req.body._id);
                                db.collection('users').update({"_id": req.body._id, "fridge._id": req.body.ingredient}, { $set: {"fridge.$.amount": req.body.amount}}, function (err, result){
                                    if (err === null){
                                        res.send(200);
                                    } else {
                                        res.send(500);
                                    }
                                });
                            };
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

// Method for inserting ingredient into fridge 
// responds with 404 if user or ingredient was not found in DB
// responds with 500 if error with DBcalls
// changes DB entry and responds with 200 if every little thing was gonna be alright
router.post('/fridgeNew', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": Requested adding of ingredient " + req.body.ingredient + " to the fridge of user " + req.body._id);
    db.collection('users').find({"_id": req.body._id}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404)
            } else {
                db.collection('ingredients').find({'_id': req.body.ingredient}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            res.send(404);
                        } else {
                            db.collection('users').update({"_id": req.body._id}, {$push: {'fridge': {'_id': req.body.ingredient, 'amount': req.body.amount}}}, function (err, result){
                                if (err === null){
                                    res.send(200);
                                } else {
                                    res.send(500);
                                };
                            });
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


// Method for manipulating friendship
// responds with 404 if user is not found
// responds with 500 if error with dbcalls
// responds with 200 if success
router.post('/friend', function (req, res){
    var db = req.db;
    console.log(Date().toString() + ": Requested adding of user " + req.body.receiver + " to friendslist of user " + req.body.initiator);
    // check if initiator exists
    db.collection('users').find({"_id": req.body.initiator}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                // check if receiver exists
                db.collection('users').find({"_id": req.body.receiver}).toArray(function (err, items){
                    if (err === null){
                        if (items.length == 0){
                            res.send(404);
                        } else {
                            // check which activity was given in request
                            switch (req.body.activity) {
                                case "accept":
                                    console.log(req.body.initiator + " accepted friendship with " + req.body.receiver + ". :)");
                                    db.collection('users').update(
                                        {"_id": req.body.receiver,"friends._id": req.body.initiator},
                                        {$set: {"friends.$.status":"mutual"}}, function (err, count, status){
                                            if (err !== null){
                                                res.send(500);
                                            } else {
                                                res.send(200);
                                            };
                                        });
                                    db.collection('users').update(
                                        {"_id": req.body.initiator,"friends._id": req.body.receiver},
                                        {$set: {"friends.$.status":"mutual"}}, function (err, count, status){
                                            if (err !== null){
                                                res.send(500);
                                            } else {
                                                res.send(200);
                                            };
                                        });
                                    break;
                                case "reject":
                                    console.log(req.body.initiator + " rejected the friendship request from " + req.body.receiver + ".");
                                    db.collection('users').update(
                                        {"_id": req.body.initiator,"friends._id": req.body.receiver},
                                        {$set: {"friends.$.status":"rejected"}}, function (err, count, status){
                                            if (err !== null){
                                                res.send(500);
                                            } else {
                                                res.send(200);
                                            };
                                        });
                                    break;
                                case "request":
                                    console.log(req.body.initiator + " requested friendship with " + req.body.receiver + ".");
                                    db.collection('users').update({"_id": req.body.initiator},{$push: {'friends':{"_id": req.body.receiver,"status":"pending_out"}}}, function (err, count, status){
                                        if (err !== null){
                                            res.send(500);
                                        } else {
                                            res.send(200);
                                        };
                                    });
                                    db.collection('users').update({"_id": req.body.receiver},{$push: {'friends':{"_id": req.body.initiator,"status":"pending_in"}}}, function (err, count, status){
                                        if (err !== null){
                                            res.send(500);
                                        } else {
                                            res.send(200);
                                        };
                                    });
                                    break;
                                case "end":
                                    console.log("Friendship between" + req.body.receiver + " and " + req.body.initiator + " ended. :(");
                                    db.collection('users').update({"_id":req.body.initiator}, {$pull : { "friends": { "_id": req.body.receiver}}}, function (err, count, status){
                                        if (err !== null){
                                            res.send(500);
                                        } else {
                                            res.send(200);
                                        };
                                    });
                                    db.collection('users').update({"_id":req.body.receiver}, {$pull : { "friends": { "_id": req.body.initiator}}}, function (err, count, status){
                                        if (err !== null){
                                            res.send(500);
                                        } else {
                                            res.send(200);
                                        };
                                    });
                                    break;
                                default:
                                    res.send(406);
                            };
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



// Method for adding or deleting favorite recipe
// responds with 404 if user or recipe is not found
// responds with 406 if activity not accepted
// responds with 500 if error with dbcalls
// responds with 200 if success
router.post('/favorite', function (req, res){
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
                                db.collection('users').update({"_id": req.body.user},{$push: {'favorites':{"_id": req.body.recipe}}}, function (err, count, status){
                                    if (err !== null){
                                        res.send(500);
                                    } else {
                                        res.send(200);
                                    };
                                });
                            } else if ( req.body.activity == "delete"){
                                db.collection('users').update({"_id":req.body.user}, {$pull : { "favorites": { "_id": req.body.recipe}}}, function (err, count, status){
                                    if (err !== null){
                                        res.send(500);
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
                    };
                });
            };
        } else {
            res.send(500);
        };
    });
});


// Method for adding or deleting badge
// responds with 404 if user or badge is not found
// responds with 406 if activity not accepted
// responds with 500 if error with dbcalls
// responds with 200 if success
router.post('/badge', function (req, res){
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
                                    } else {
                                        res.send(200);
                                    };
                                });
                            } else if (req.body.activity == "delete") {
                                db.collection('users').update({"_id":req.body.user}, {$pull : { "badges": { "_id": req.body.badge}}}, function (err, count, status){
                                    if (err !== null){
                                        res.send(500);
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
                    };
                });
            };
        } else {
            res.send(500);
        };
    });
});

// Method for setting password
// responds with 404 if user is not found
// responds with 500 if error with dbcalls
// responds with 200 if success
router.post('/password', function (req, res){
    var db = req.db;
    db.collection('users').find({"_id": req.body.user}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                db.collection('users').update({"_id": req.body.user}, { $set: {"password": req.body.password}}, function (err, result){
                    if (err === null){
                        res.send(200);
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

router.post('/settings', function (req, res){
    var db = req.db;
    db.collection('users').find({"_id": req.body.user}).toArray(function (err, items){
        if (err === null){
            if (items.length == 0){
                res.send(404);
            } else {
                if (req.body.portions != ""){
                    db.collection('users').update({"_id": req.body.user}, {$set : {"settings.portions": req.body.portions}}, function (err, result){
                        if (err !== null){
                            res.send(500);
                        } else {
                            if (req.body.unit != ""){
                               db.collection('users').update({"_id": req.body.user}, {$set : {"settings.unit": req.body.unit}}, function (err, result){
                                    if (err !== null){
                                        res.send(500);
                                    } else {
                                        if (req.body.unit != ""){
                                           db.collection('users').update({"_id": req.body.user}, {$set : {"settings.colorscheme": req.body.colorscheme}}, function (err, result){
                                                if (err !== null){
                                                    res.send(500);
                                                } else {
                                                    res.send(200);
                                                };
                                            }); 
                                        };
                                    };
                                }); 
                            };
                        };
                    });
                };
            };
        } else {
            res.send(500);
        };
    });
});


router.post('/fridgeRecipes', function (req, res){
    var db = req.db;
    var threshold = 0;
    if (req.body.threshold === null){
        threshold = 0.2;
    } else {
        threshold = req.body.threshold;
    };
    // get the fridge of the requesting user
    db.collection('users').find({"_id": req.body._id},{"fridge":1}).toArray(function (err, users){
        if (err === null){
            if (users.length == 0){
                console.log(req.body._id + " not found");
                res.send(123);
            } else {
                var user = users[0];
                // get all recipes
                db.collection('recipes').find().toArray(function (err, recipes){
                    if (err === null){
                        if (recipes.length == 0){
                            res.send(321);
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
                            res.json(returnVal);
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

router.post('/report', function (req, res){
    var db = req.db;
    db.collection('users').update({"_id": req.body._id}, {$set: {"reported": true}}, function (err, result){
        if (err === null){
            if ( result == 0 ){
                console.log("No users was affected. Is _id right?: " + req.body._id);
            } else {
                console.log("User " + req.body._id + " was reported");
            };
        } else {
            res.send(500);
        };
    });
});


// Reacts to DELETE Request to /users/deletuser/ID
// router.delete('deletuser/:uid', function(req, res){
//     log("Requested deletion of user with id " + req.params.uid);
// 	var db = req.db;
// 	var userToDelete = req.params.id;
// 	db.collection('users').removeById(userToDelete, function(err, result){
// 		res.send((result === 1 ) ? { msg: ''} : { msg: 'error ' + err});
// 	});
// });



module.exports = router;