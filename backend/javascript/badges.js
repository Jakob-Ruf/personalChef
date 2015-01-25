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

	newCooked: function(db, user, difficulty){
		var date = new Date();
		db.collection('users').find({'_id': user}).toArray(function (err, users){
			if (err) {
				console.log(err);
			} else {
				if (!users.length){
					console.log('Jemand hat alle Bages geklaut');
				} else {
					var user = users[0];
					// console.log(user);
					var time = ex.checkSpecialTime(db, user);
					var date = ex.checkSpecialDate(db, user);
					// var bday = ex.checkBirthday(db, user);
					if (time || date){
						for (var i = user.badges.length - 1; i >= 0; i--) {
							if (user.badges[i].category == "date" && date){
								for (var j = user.badges[i].badges[j].length - 1; j >= 0; j--) {
									if (user.badges[i].badges[j]._id == date){
										console.log(user.badge[i].badges[j]._id);
										if (!user.badges[i].badges[j].earned){
											user.badges[i].badges[j].earned = true;
											user.badges[i].badges[j].earnedDate = date.getDate() + "." + date.getMonth()+1;
										}; // if already earned
									}; // if badge-id
								};						
							} else if (user.badges[i].category == "time" && time){
								for (var j = user.badges[i].badges[j].length - 1; j >= 0; j--) {
									if (user.badges[i].badges[j]._id == time){
										console.log(user.badge[i].badges[j]._id);
										if (!user.badges[i].badges[j].earned){
											user.badges[i].badges[j].earned = true;
											user.badges[i].badges[j].earnedDate = date.getDate() + "." + date.getMonth()+1;
										}; // if already earned
									}; // if badge-id
								};	
							// } else if (user.badges[i].category == "date" && bday){
							// 	for (var j = user.badges[i].badges[j].length - 1; j >= 0; j--) {
							// 		if (user.badges[i].badges[j]._id == date){
							// 			console.log(user.badge[i].badges[j]._id);
							// 			if (!user.badges[i].badges[j].earned){
							// 				user.badges[i].badges[j].earned = true;
							// 				user.badges[i].badges[j].earnedDate = date.getDate() + "." + date.getMonth()+1;
							// 			}; // if already earned
							// 		}; // if badge-id
							// 	};	
							};
						};
					};
				};
			};
		});
		// ex.checkCookedAmount(db, user, difficulty);
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
	checkSpecialDate: function(db, user){
		for (var i = 0; i < user.badges.length; i++){
			if (user.badges[i].category == "date"){
				for (var j = 0; j < user.badges[i].badges.length; j++){
					if (user.badges[i].badges[j]._id == "dateRare"){
						user.badges[i].badges[j].earned = true;
						user.badges[i].badges[j].earnedDate = "24.02";
					};
				};
			}; 
		};
	},


	addCreated: function(db, p_user, p_amount){
		p_db.collection('users').update({'_id': p_user, 'badges.category': 'created', 'badges.badges._id': p_badge}, {$inc: {'badges.0.badges.$.amount': 1}}, function (err, result){
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
	},


	checkSpecialTime: function(db, user){
		var date = new Date();
		var hrs = date.getHours();
		if (hrs > 6 && hrs < 10 ) {
			return 'timeBreakfast';
			// ex.addBadge(db, user, 'timeBreakfast', "time");
		} else if (hrs > 11 && hrs < 14 ) {
			return 'timeLunch';
			// ex.addBadge(db, user, 'timeLunch', "time");
		} else if (hrs > 18 && hrs < 21 ) {
			return 'timeDinner';
			// ex.addBadge(db, user, 'timeDinner', "time");
		} else if (hrs > 0 && hrs < 5 ) {
			return 'timeDrunk';
			// ex.addBadge(db, user, 'timeDrunk', "time");
		};
		return false;
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

	checkSpecialDate: function(db, user){
		// alle Badges der date-Kategorie abrufen
		db.collection('badges').find({'category':'date'}).toArray( function (err, items){
			if (err){
				console.log(Date().toString() + ": Fehler bei der Datenbankabfrage");
			} else {
				if (!items.length){
					console.log(Date().toString() + ": Keine Badges gefunden.");
				} else {
					// überprüfen, ob badge-Datum dem aktuellen Datum entspricht
					var a = new Date();
					var dateString = a.getDate() + "." + a.getMonth()+1;
					for (var i = items.length - 1; i >= 0; i--) {
						if (items[i].date == dateString){
							console.log(items[i].date + " ist heute! " + items[i].description);
							ex.addBadge(db, user, items[i]._id);
						};
					};
				};
			};
		});
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