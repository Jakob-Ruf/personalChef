var exports = {

	addBadge: function (badgeID, userID, points, db){
		db.collection('badges').find({'_id': badgeID}).toArray( function (err, badge){
			if (err === null){
				if (badge.length == 0){
					console.log(Date().toString() + ": No badge found with ID " + badgeID);
				} else {
					db.collection('users').update({'_id': userID}, {$push: "badges": {"_id": badgeID, "image": badge[0].image, "name": badge[0].name, "points": badge[0].points}}, {upsert: true}, function (err, result){
						if (err) throw err;
					});
				};
			} else {
				console.log(Date().toString() + ": Error while querying database");
			};
		});
	}
}

module.exports = exports;