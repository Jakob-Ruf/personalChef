var ex = {

	getFList: function(req, res){
		var db = req.db;
		db.collection('badges').find().toArray(function (err, items){
			if (err) {
				res.send(500);
			} else {
				if (!items.length) {
					res.send(404);
				} else {
					res.header('Content-Type','application/json; charset=utf-8');
					res.json(items);
				};
			};
		});
	},

	newCooked: function(p_db, p_user, difficulty){
		var db = p_db
		var date = new Date();
		db.collection('users').find({'_id': p_user}).toArray(function (err, users){
			if (err) {
				console.log(err);
			} else {
				if (!users.length){
					console.log('Jemand hat den Nutzer geklaut. badges.newCooked ' + p_user);
				} else {
					var obj_user = users[0];
					var id_time = ex.checkSpecialTime(db, p_user);
					var id_date = ex.checkSpecialDate(db, obj_user);
					console.log(id_time + " - " + id_date);

					for (var i = obj_user.badges.length - 1; i >= 0; i--) {
						// Schleife bis Kategorie date
						if (obj_user.badges[i].category == "date" && id_date){
							// Schleife bis badge-id == id_date
							for (var j = obj_user.badges[i].badges.length - 1; j >= 0; j--) {
								if (obj_user.badges[i].badges[j]._id == id_date){
									// nur ausführen, wenn nicht bereits verliehen
									if (!obj_user.badges[i].badges[j].earned){
										console.log(obj_user.badges[i].badges[j]._id);
										obj_user.badges[i].badges[j].earned = true;
										obj_user.badges[i].badges[j].earnedDate = date.getDate() + "." + date.getMonth()+1;
									}; // if already earned
								}; // if badge-id
							};	
						// Schleife bis Kategorie time
						} else if (obj_user.badges[i].category == "time" && id_time){
							for (var j = obj_user.badges[i].badges.length - 1; j >= 0; j--) {
								// Schleife bis badge-id == id_time
								if (obj_user.badges[i].badges[j]._id == id_time){
									// nur ausführen, wenn nicht bereits verliehen
									if (!obj_user.badges[i].badges[j].earned){
										console.log(obj_user.badges[i].badges[j]._id);
										obj_user.badges[i].badges[j].earned = true;
										obj_user.badges[i].badges[j].earnedDate = date.getDate() + "." + date.getMonth()+1;
									}; // if already earned
								}; // if badge-id
							};	
						} else if (obj_user.badges[i].category == "cooked"){
							// Iteration über alle Badges der Kategorie cooked
							for (var j = obj_user.badges[i].badges.length - 1; j >= 0; j--) {
								// Inkrementierung für cookedGeneral
								if (obj_user.badges[i].badges[j]._id == "cookedGeneral"){
									obj_user.badges[i].badges[j].amount++;
								// bedingte Inkrementierung für cookedDIFFICULTY
								} else if (obj_user.badges[i].badges[j]._id == "cookedEasy" && difficulty == 1){
									obj_user.badges[i].badges[j].amount++;
								} else if (obj_user.badges[i].badges[j]._id == "cookedNormal" && difficulty == 2){
									obj_user.badges[i].badges[j].amount++;	
								} else if (obj_user.badges[i].badges[j]._id == "cookedHard" && difficulty == 3){
									obj_user.badges[i].badges[j].amount++;
								};
							};
						};
					}; // äußere Schleife
					// zurückschreiben der berechneten Were in die Datenbank
					db.collection('users').update({'_id': p_user}, {$set: {'badges': obj_user.badges}}, function (err, result){
						if (err) {
							console.log(err);
						} else {
							if (result){
								console.log(Date().toString() + ": Badges wurden angepasst für Nutzer " + p_user);
							} else {
								console.log(Date().toString() + ": Badges wurden NICHT angepasst für Nutzer " + p_user + " (badges.newCooked)");
							}
						}
					})
				};
			}; // Fehlerbehandlung
		}); // Datenbankabfrage
	},

	newCreated: function(db, p_user, recipe){
		console.log(Date().toString() + ": Neues Rezept erstellt von Nutzer " + p_user);
		db.collection('users').find({'_id': p_user}).toArray(function (err, items){
			if (err){
				console.log(Date().toString() + ": Fehler bei der Datenbankabfrage. Badges.newCreated");
			} else {
				if (!items.length){
					console.log(Date().toString() + ": Nutzer nicht gefunden. badges.newCreated " + p_user);
				} else {
					var rec_amount = items[0].recipes.length;
					ex.addCreated(db, p_user, rec_amount);
				};
			};
		});
	},


	// Synchrone Funktionen, die 
	checkSpecialDate: function(db, obj_user){
		var retVal = false;
		var date = new Date();
		// Schleife, bis zur Kategorie date
		for (var i = 0; i < obj_user.badges.length; i++){
			if (obj_user.badges[i].category == "date"){
				// Schleife, bis day und month mit heutigem Datum übereinstimmen
				for (var j = 0; j < obj_user.badges[i].badges.length; j++){
					if (obj_user.badges[i].badges[j].day == date.getDate() && obj_user.badges[i].badges[j].month == date.getMonth()+1){
						retVal = obj_user.badges[i].badges[j]._id;
					};
				};
			}; 
		};
		return retVal;
	},

	checkSpecialTime: function(db, p_user){
		console.log("checkSpecialTime");
		var retVal = false;
		var date = new Date();
		var hrs = date.getHours();
		if (hrs >= 6 && hrs < 10 ) {
			ex.incTimeCooked(db, p_user, 1,0,0,0);
			retVal = 'timeBreakfast';
		} else if (hrs >= 11 && hrs < 14 ) {
			ex.incTimeCooked(db, p_user, 0,1,0,0);
			retVal = 'timeLunch';
		} else if (hrs >= 18 && hrs < 21 ) {
			ex.incTimeCooked(db, p_user, 0,0,1,0);
			retVal = 'timeDinner';
		} else if (hrs >= 0 && hrs < 5 ) {
			ex.incTimeCooked(db, p_user, 0,0,0,1);
			retVal = 'timeDrunk';
		};
		return retVal;
	},

	addCreated: function(db, p_user, p_amount){
		// p_db.collection('users').update({'_id': p_user, 'badges.category': 'created', 'badges.badges._id': p_badge}, {$inc: {'badges.0.badges.$.amount': 1}}, function (err, result){
		// 	if (err) {
		// 		console.log(Date().toString() + ": Fehler bei der Datenbankabfrage");
		// 	} else {
		// 		if (!result){
		// 			console.log(Date().toString() + ": Kein Nutzer betroffen " + p_user);
		// 		} else {
		// 			console.log(Date().toString() + ": Badge " + p_badge + " wurde an Nutzer " + p_user + " verliehen.");
		// 		};
		// 	};
		// });
	},

	incTimeCooked: function(db, p_user, timeBreakfast, timeLunch, timeDinner, timeDrunk){
		db.collection('users').update({'_id': p_user}, {$inc: {cookedBreakfast: timeBreakfast, cookedLunch: timeLunch, cookedDinner: timeDinner, cookedDrunk: timeDrunk}}, {upsert:true}, function (err, result){
			if (err){
				console.log(err);
			} else {
				if (result){
					console.log(Date().toString() + ": Zeitstatistik wurde inkrementiert");
				} else {
					console.log(Date().toString() + ": Es hatte keinen Effekt badges.incTimeCooked");
				};
			};
		});
	},



	checkCookedAmount: function(p_db, p_user, difficulty){
		p_db.collection('users').find({'_id': p_user}).toArray(function (err, items){
			if (err) {
				console.log(Date().toString() + ": Fehler bei der Datenbankabfrage badges.checkCookedAmount");
			} else {
				if (!items.length){
					console.log(Date().toString() + ": Nutzer nicht gefunden. badges.checkCookedAmount " + p_user);
				} else {
					var user = items[0];
					ex.checkCookedAmountGeneral(p_db, user);
					ex.checkCookedAmountDiff(p_db, user, difficulty);
				};
			};
		});
	},


	checkCookedAmountGeneral: function(p_db, obj_user){
		console.log("Checking cooked amount for user " + obj_user._id);
		// obj_user.cooked.
	},


	checkBirthday: function(db, user, dateString){
		return 'dateBirthday';
	},


	addBadge: function(p_db, p_user, p_badge, p_category){
		var date = new Date();
		var date2 = date.getDate() + "." + date.getMonth()+1 + "." + date.getFullYear();
		console.log(p_user + " - " + p_badge);
		p_db.collection('users').update({'_id': p_user, 'badges.category': p_category, 'badges.badges._id': p_badge}, {$set: {'badges.0.badges.$.earnedDate': date2, 'badges.0.badges.$.earned': true}}, function (err, result){
			if (err) {
				console.log(Date().toString() + ": Fehler bei der Datenbankabfrage");
			} else {
				if (!result){
					console.log(Date().toString() + ": Kein Nutzer betroffen " + p_user);
				} else {
					console.log(Date().toString() + ": Badge " + p_badge + " wurde an Nutzer " + p_user + " verliehen.");
				};
			};
		});
	}
}

module.exports = ex;