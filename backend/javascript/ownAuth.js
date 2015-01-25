var constants = require('../javascript/constants.js');
var sha = require('sha1');

var exports = {

	signup: function(req, res, next){
		var db = req.db;
		var date = new Date();
		console.log(req.body);
		// überprüfen ob alle verlangten Felder ausgefüllt sind
		if (!req.body.username || !req.body.password || !req.body.email){
			res.send("Bitte alle Felder ausfüllen", 400);
			return;
		} else {
			// erstellen eines temporären Nutzerobjekts mit Dummyfeldern
			var user = {};
			user._id = req.body.username.trim();
			user.profile = {};
			user.profile.password = sha(req.body.password);
			user.profile.email = shorten(req.body.email);
			user.cooked = [];
			user.cookedAmount = 0;
			user.fridge = [];
			user.image = constants.imgUserDummyOriginal;
			user.imageThumb = constants.imgUserDummyThumb;
			user.likes = [];
			user.profile.date_joined = {
				'day': date.getDate(),
				'month': date.getMonth()+1,
				'year': date.getFullYear()
			};
			user.recipes = [];

			console.log(user);
			// Abruf aller Badges zum Einfügen in den Benutzer
			db.collection('badges').find({}).toArray(function (err, badges){
				if (err){
					console.log(err);
					res.send(500);
				} else {
					if (!badges.length){
						res.send(404);
					} else {
						// hinzufügen der badges zum User-Objekt
						user.badges = badges;
						// überprüfe, ob der Nutzer bereits existiert
						db.collection('users').find({'_id': username}).toArray(function (err, users){
							if (err){
								res.send(500);
							} else {
								if (users.length){
									res.send({}, 401);
								} else {
									// schreibe den Nutzer in die Datenbank
									db.collection('users').insert(user, function (err, result){
										if (err) {
											console.log(err);
											res.send(500);
										} else {
											if (!result){
												console.log('Nutzer wurde nicht erstellt. Unbekannter Fehler');
												res.send(500);
											} else {
												console.log('Nutzer ' + user._id + ' wurde erstellt');
												res.send(user);
												res.send(200);
											};
										};
									});
								};
							};
						});
					};
				};
			});
		};
	},

	login: function(req, res){
		var db = req.db
		var json = {};
		var username = req.body.username.trim();
		var password = sha(req.body.password);
		db.collection('users').find({'_id': username}, {'_id': 1, 'profile.password': 1}).toArray(function (err, users){
			if (err){
				console.log(err);
				console.log('Fehler bei der Abfrage');
				res.send(json, 500);
			} else {
				if (!users.length){
					console.log('Nutzer nicht gefunden');
					res.send(json)
				} else {
					var user = users[0];
					if (user.profile.password == password) {
						json.username = username;
						json.password = req.body.password;
						console.log('Nutzer ' + json.username + " wurde eingeloggt");
						res.send(json)
					} else {
						res.send(json, 401);
					}
				}
			}
		})
	},

	auth: function(req, res, next){
		var db = req.db
		var json = {};
		var username = req.body.username.trim();
		var password = sha(req.body.password);
		db.collection('users').find({'_id': username}, {'_id': 1, 'profile.password': 1}).toArray(function (err, users){
			if (err){
				res.send(json, 500);
			} else {
				if (!users.length){
					console.log(Date().toString() + ': Nutzer nicht gefunden');
					res.send(json, 404)
				} else {
					var user = users[0];
					if (user.profile.password == password) {
						console.log(Date().toString() + ': Nutzer ' + username + " wurde eingeloggt");
						next();
					} else {
						res.send(json, 401);
					}
				}
			}
		})
	}
};

function shorten(email){
	if (email.indexOf('+') == -1){
		return email;
	} else {
		var splitted = email.split('+');
		var splitted2 = splitted[1].split('@');
		var newmail = splitted[0] + '@' + splitted2[1];
		return newmail;
	};
};

module.exports = exports;