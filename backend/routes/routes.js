var users = require('../javascript/users.js');
var recipes = require('../javascript/recipes.js');
var ingredients = require('../javascript/ingredients.js');
var images = require('../javascript/images.js');
var ean = require('../javascript/ean.js');
var ownAuth = require('../javascript/ownAuth.js');
var badges = require('../javascript/badges.js');


module.exports = function(app, passport){

	// users
	// gets
	app.get('/users/shortlist', function (req,res){
		users.getShortlist(req,res);
	});

	app.get('/users/list', function (req, res){
		users.getList(req, res);
	});

	app.get('/users/flist', function (req, res){
		users.getFlist(req, res);
	});

	app.get('/users/fridge/:iid', function (req, res){
		users.getFridge(req, res, req.params.iid);
	})

	app.get('/users/:uid', function (req, res){
		users.getByName(req, res, req.params.uid);
	});

	// posts
	app.post('/users/fridge', function (req, res){
		users.postFridge(req, res, req.params.iid);
	});
	app.options('/users/fridge', function (req, res){
		opt(req, res);
	});

	app.post('/users/favorite', function (req, res){
		users.postFavorite(req, res);
	});
	app.options('/users/favorite', function (req, res){
		opt(req, res);
	});

	app.post('/users/badge', function (req, res){
		users.postBadge(req, res);
	});
	app.options('/users/badge', function (req, res){
		opt(req, res);
	});

	app.post('/users/fridgeRecipes', function (req, res){
		users.postFridgeRecipes(req, res);
	});
	app.options('/users/fridgeRecipes', function (req, res){
		opt(req, res);
	});

	app.post('/users/report', function (req, res){
		users.postReport(req, res);
	});
	app.options('/users/report', function (req, res){
		opt(req, res);
	});

	app.post('/users/upload', function (req, res){
		images.postImageUpload(req, res, 'users');
	});
	app.options('/users/upload', function (req, res){
		opt(req, res);
	});


	// recipes
	// gets
	app.get('/recipes/shortlist', function (req, res){
		recipes.getShortlist(req, res);
	});	

	app.get('/recipes/flist', function (req, res){
		recipes.getFlist(req, res);
	});	

	app.get('/recipes/list', function (req, res){
		recipes.getList(req, res);
	});

	app.get('/recipes/startscreen', function (req, res){
		recipes.getStartScreen(req, res);
	});

	app.get('/recipes/withIngredient/:iid', function (req, res){
		recipes.getWithIngredient(req, res, req.params.iid);
	});

	app.get('/recipes/:iid', function (req, res){
		recipes.getByName(req, res, req.params.iid);
	});

	// posts
	app.post('/recipes/add', function (req, res){
		recipes.postAdd(req, res);
	});
	app.options('/recipes/add', function (req, res){
		opt(req, res);
	});

	app.post('/recipes/report', function (req, res){
		recipes.postReport(req, res);
	});
	app.options('/recipes/report', function (req, res){
		opt(req, res);
	});

	app.post('/recipes/rate', function (req, res){
		recipes.postRate(req, res);
	});
	app.options('/recipes/rate', function (req, res){
		opt(req, res);
	});

	app.post('/recipes/like', function (req, res){
		recipes.postLike(req, res);
	});
	app.options('/recipes/like', function (req, res){
		opt(req, res);
	});

	app.post('/recipes/upload', function (req, res){
		images.postImageUpload(req, res, 'recipes');
	});
	app.options('/recipes/upload', function (req, res){
		opt(req, res);
	});

	app.post('/recipes/comment', function (req, res){
		recipes.postComment(req, res);
	});
	app.options('/recipes/comment', function (req, res){
		opt(req, res);
	});

	app.post('/recipes/cooked', function (req, res){
		recipes.postCooked(req, res);
	});
	app.options('/recipes/cooked', function (req, res){
		opt(req, res);
	});


	// ingredients
	// gets
	app.get('/ingredients/shortlist', function (req, res){
		ingredients.shortlist(req, res);
	});
	
	app.get('/ingredients/list', function (req, res){
		ingredients.list(req, res);
	});
	
	app.get('/ingredients/:iid', function (req, res){
		ingredients.byName(req, res, req.params.iid);
	});
	
	// posts
	app.post('/ingredients/add', function (req, res){
		ingredients.add(req, res);
	});
	app.options('/recipes/comment', function (req, res){
		opt(req, res);
	});

	// ean
	app.get('/ean/:number', function (req, res){
		ean.getRecipe(req, res, req.params.number);
	});

	// badges
	app.get('/badges/flist', function (req, res){
		badges.getFList(req, res);
	});




	// remove for productive systems
	app.post('/badges/add', function (req, res){
		badges.addBadge(req.db, req.body.user, req.body.badge, req.body.category);
	});
	app.options('/badges/add', function (req, res){
		opt(req, res);
	});



	// auth

	app.post('/signup', function (req, res){
		console.log(req.body);
		ownAuth.signup(req, res);
	});
	app.options('/signup', function (req, res){
		opt(req, res);
	});
	
	app.post('/login', auth, function (req, res){
		ownAuth.login(req, res);
	});
	app.options('/login', function (req, res){
		opt(req, res);
	});


	app.get('/test/:id', function (req, res){
		var userfind = new RegExp('^' + req.params.id, 'i');
 		req.db.collection('users').find({'_id': userfind}).toArray(function(err, items){
 			if (err) console.log(err);
 			res.json(items);
 		});
	});

};

function auth(req, res, next){
	ownAuth.auth(req, res, next);
};

function opt(req, res){
	res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 'content-type');
    res.header("Access-Control-Allow-Methods", 'POST');
	res.send(200);
};