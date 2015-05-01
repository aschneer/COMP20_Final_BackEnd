var express = require('express');
var assert = require('assert');
var bodyParser = require('body-parser');
var validator = require('validator');
var sendgrid = require('sendgrid')('hunter-', 'mingodb20');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/';
var db;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(mongoUri, function(er, connection) {
	assert.equal(null, er);
	db = connection;
});

var validateQuantity = function(data) {
	if (data.hasOwnProperty('quantity') && !isNaN(data.quantity) && (data.quantity > 0)) {
		return parseInt(data.quantity);
	} else {
		return 1;
	}
};

var sendEmail = function(email_to, sub, text) {
	var payload = {
		to      :  email_to,
		from    : 'foodaroundcomp20@gmail.com',
		subject : sub,
		text    : text
	}
	sendgrid.send(payload);
};

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res, next) {
	var page;
	page = '<!DOCTYPE HTML><html>';
	page += '<head style="margin:0 0;width:100%;height:100%;">';
	page += '<title>Web Programming Spring 2015 Team 3 Food db</title>';
	page += '</head>';
	page += '<body style="background:#444444;width:600px;height:100%;margin:0 auto;">';
	res.set('Content-Type', 'text/html');

	db.collection('offers', function(er, offers) {
		assert.equal(er, null);
		offers.find().toArray(function(err, log) {
			assert.equal(null, err);

			page += '<h1 style="width:100%;padding-top:1rem;margin:0 auto;">Food Offers Logged</h1>';
			page += '<ol>';
			for (var i = 0; i < log.length; i++) {
				// DB_ADD_FIELD_MARKER.
				s = '<span style="color:#e67e22">' + log[i].seller + '</span> ';
				s += 'offered <span style="color:#e74c3c">' + log[i].food + '</span> ';
				s += 'at <span style="color:#e74c3c">' + log[i].lat + '</span>, ';
				s += '<span style="color:#e74c3c">' + log[i].lng + '</span>, ';
				s += '<span style="color:#27ae60">' + log[i].address + '</span> ';
				s += 'quantity <span style="color:#27ae60">' + log[i].quantity + '</span> ';
				s += 'ready at <span style="color:#27ae60">' + log[i].when + '</span>';
				s += 'for $<span style="color:#27ae60">' + log[i].price + '</span>';
				page += '<li>' + s + '</li>';
			}
			page += '</ol>';

			// Add in Claims
			db.collection('claims', function(er, claims) {
				assert.equal(er, null);
				claims.find().toArray(function(err, log) {
					assert.equal(null, err);

					page += '<h1 style="width:100%;padding-top:1rem;margin:0 auto;">Claims claimed</h1>';
					page += '<ol>';
					for (var i = 0; i < log.length; i++) {
						// DB_ADD_FIELD_MARKER.
						s = 'seller <span style="color:#e67e22">' + log[i].seller + '</span> ';
						s += 'buyer <span style="color:#e67e22">' + log[i].buyer + '</span> ';
						s += 'claimed <span style="color:#e74c3c">' + log[i].food + '</span> ';
						s += 'at <span style="color:#27ae60">' + log[i].address + '</span>, ';
						s += '<span style="color:#27ae60">' + log[i].lat + '</span>, ';
						s += '<span style="color:#27ae60">' + log[i].lng + '</span> ';
						s += 'at $<span style="color:#27ae60">' + log[i].when + '</span>, ';
						s += 'for $<span style="color:#27ae60">' + log[i].price + '</span>';
						page += '<li>' + s + '</li>';
					}
					page += '</ol>';

					// Add in Users
					db.collection('users', function(er, users) {
						assert.equal(er, null);
						users.find().toArray(function(err, log) {
							assert.equal(null, err);

							page += '<h1 style="width:100%;padding-top:1rem;margin:0 auto;">Users Signed Up</h1>';
							page += '<ol>';
							for (var i = 0; i < log.length; i++) {
								s = 'user <span style="color:#e67e22">' + log[i].username + '</span> ';
								s += 'with name <span style="color:#e74c3c">' + log[i].name + '</span> ';
								page += '<li>' + s + '</li>';
							}
							page += '</ol>';
							page += "</body></html>";
							res.send(page);
						});
					});
				});
			});
		});
	});
});

// sends an offer to the database
app.post('/sendOffer', function(req, res, next) {
	var toInsert = {};
	var data = req.body;
	// DB_ADD_FIELD_MARKER.
	if (data.hasOwnProperty('seller') && data.hasOwnProperty('food') && data.hasOwnProperty('address') && data.hasOwnProperty('lat') && data.hasOwnProperty('lng') && data.hasOwnProperty('when') && data.hasOwnProperty('price')) {
		// DB_ADD_FIELD_MARKER.
		toInsert.seller = data.seller;
		toInsert.food = data.food;
		toInsert.lat = data.lat;
		toInsert.lng = data.lng;
		toInsert.address = data.address;
		toInsert.when = data.when;
		toInsert.quantity = validateQuantity(data);
		toInsert.price = data.price;

		db.collection('users', function(er, users) {
			users.findOne({'username': data.seller }, function(err, user) {
				if (err || !user) {
					res.status(404);
					res.send('Username not found');
				} else {
					db.collection('offers', function(er, offers) {
						assert.equal(null, er);
						offers.findOne(toInsert, function(err, cursor) {
							assert.equal(null, err);
							if (!cursor) {
								offers.insert(toInsert, function(errr, result) {
									assert.equal(errr, null);
									assert.equal(1, result.result.n);
									assert.equal(1, result.ops.length);

									sendEmail(user.email, 'New FoodAround Offer Posted', 'Offer item' + toInsert.food + ' ready at ' + toInsert.when + ' for $' + toInsert.price + ' is now on FoodAround.');
								});
							} else {
								offers.update(cursor, toInsert, function(errr) {
									assert.equal(errr, null);
								});
							}
						});
					});
					res.sendStatus(200);
				}
			});
		});
	} else {
		res.status(400);
		res.send('bad sendOffer POST yo');
	}
});

// removes offer from unclaimed; adds it to claimed
app.post('/claimOffer', function(req, res, next) {
	var data = req.body;
	var toInsert = {};

	if (data.hasOwnProperty('_id') && data.hasOwnProperty('buyer')) {
		db.collection('users', function(er, users) {
			users.findOne({'username': data.buyer }, function(err, user) {
				if (err || !user) {
					res.status(404);
					res.send('Username not found');
				} else {
					// Update offer in offers db
					db.collection('offers', function(errr, offers) {
						assert.equal(errr, null);
						offers.find({}).toArray(function(errrr, cursor) {
							assert.equal(errrr, null);
							var found = false;
							for (var i = 0; i < cursor.length; i++) {
								if (cursor[i]._id == data._id) {
									var offer = cursor[i];
									found = true;
									// DB_ADD_FIELD_MARKER.
									toInsert.seller     = offer.seller;
									toInsert.address    = offer.address;
									toInsert.lat		= offer.lat;
									toInsert.lng		= offer.lng;
									toInsert.food       = offer.food;
									toInsert.when       = offer.when;
									toInsert.price		= offer.price;

									if (offer.quantity > 1) {
										toInsert.quantity = offer.quantity - 1;
										offers.update({_id: offer._id}, toInsert, function(errrrr){
											assert.equal(errrrr, null);
										});
									} else {
										offers.remove(offer, function(errrr) {   
											assert.equal(errrr, null);
										});
									}

									// insert into the claims db
									db.collection('claims', function(errrr, claims) {
										assert.equal(null, errrr);
										toInsert.buyer = data.buyer;
										toInsert.quantity = validateQuantity(data);

										claims.insert(toInsert, function(errrrr, result) {
											assert.equal(null, errrrr);
											assert.equal(1, result.result.n);
											assert.equal(1, result.ops.length);

											sendEmail(user.email, 'You Claimed a FoodAround Offer!', 'Offer item ' + toInsert.food + ' ready at ' + toInsert.when + ' posted by' + toInsert.seller + ' claimed .');
										});
									});
									res.sendStatus(200);
								}
							}

							if (!found) {
								res.status(404);
								res.send('Offer not found');
							}
						});
					});
				}
			});
		});
	} else {
		res.status(400);
		res.send('bad claimOffer POST yo');
	}
});

// returns list of claimed offers for a specific login or all offers
//
// MUST DELETE OUTDATED STUFF HERE
app.get('/offers', function(req, res, next) {
	var query = req.query;
	if (query.hasOwnProperty('mode') && query.hasOwnProperty('claimed')) {
		if (query.mode === "buy") {
			if (query.claimed === "true") {
				if (query.hasOwnProperty('username')) {
					// SEND ALL OFFERS CLAIMED BY USER
					db.collection('claims', function(er, claims) {
						assert.equal(er, null);
						claims.find({'buyer': query.username}).toArray(function(err, log) {
							assert.equal(null, err);
							res.send(log);
						});
					});
				} else {
					res.status(400);
					res.send("Error: must provide username for claimed offers in buy mode");
				}
			} else {
				// SEND ALL OFFERS
				db.collection('offers', function(er, offers) {
					assert.equal(er, null);
					offers.find({}).toArray(function(err, log) {
						assert.equal(null, err);
						res.send(log);
					});
				});
			}
		} else { // SELL
			if (query.hasOwnProperty('username')) {
				if (query.claimed === "true") {
					// SEND ALL OFFERS POSTED BY USER, CLAIMED
					db.collection('claims', function(er, claims) {
						assert.equal(er, null);
						claims.find({'seller': query.username}).toArray(function(err, log) {
							assert.equal(null, err);
							res.send(log);
						});
					});
				} else {
					// SEND ALL OFFERS POSTED BY USER
					db.collection('offers', function(er, offers) {
						assert.equal(er, null);
						offers.find({'seller': query.username }).toArray(function(err, log) {
							assert.equal(null, err);
							res.send(log);
						});
					});
					
				}
			} else {
				res.status(400);
				res.send("Error: must provide username for offers in sell mode");
			}
		}
	} else {
		res.status(400);
		res.send('Error: must provide mode and claimed status.');
	}
});

// 
app.post('/signUp', function(req, res, next) {
	var toInsert = {};
	var data = req.body;
	if (data.hasOwnProperty('username') && data.hasOwnProperty('name') && data.hasOwnProperty('email') && data.hasOwnProperty('password')) {
		if (!validator.isAlpha(data.name.replace(/\s+/g, ''))) {
			res.status(400);
			res.send("Error: name can only contain letters.");
		} else if (!validator.isEmail(data.email)) {
			res.status(400);
			res.send("Error: invalid email address.");
		} else {
			toInsert.username = data.username; 
			toInsert.name = data.name;
			toInsert.password = data.password;
			toInsert.email = data.email;
			toInsert.phone = data.phone;

			db.collection('users', function(er, users) {
				assert.equal(null, er);
				users.findOne({"username": toInsert.username}, function(err, cursor) {
					assert.equal(null, err);
					if (!cursor) {
						users.insert(toInsert, function(errr, result) {
							assert.equal(errr, null);
							assert.equal(1, result.result.n);
							assert.equal(1, result.ops.length);

							sendEmail(toInsert.email, 'New FoodAround Account', 'Username ' + toInsert.username + ' is now on FoodAround.');
						});
					} else {
						res.status('400');
						res.send('Username already exists');
					}
				});
			});
		}
	} else {
		res.status(400);
		res.send("Error: One or more missing input fields.");
	}
});

app.post('/signIn', function(req, res, next) {
	var data = req.body;
	if (data.hasOwnProperty('username') && data.hasOwnProperty('password')) {
		// Update offer in offers db
		db.collection('users', function(er, users) {
			assert.equal(er, null);
			users.findOne({'username': data.username, 'password': data.password }, function(err, user) {
				if (!err && user) {
					res.sendStatus(200);
				} else {
					res.status(500);
					res.send('Error: invalid username or password.');
				}
			});
		});
	} else {
		res.status(300);
		res.send('Error: please provide a username and password.');
	}
});

// Route to clear database.
app.get("/dbClear",function(req,res){
	//Grab route query parameters.
	res.set("Content-Type","text/html");
	var data = req.query;
	if (data.hasOwnProperty('password') && data.hasOwnProperty('collection')) {
		if (data.password === "mingodb") {
			if ((data.collection === 'users') || (data.collection === 'offers') || (data.collection === 'claims')) {
				db.collection(data.collection, function(er, coll){
					assert.equal(null, er);
					coll.remove({}, {}, function(err) {
						assert.equal(null, err);
						res.status(200);
						res.send("Success: '" + data.collection + "' collection cleared.");
					});
				});
			} else if (data.collection === 'all') {
				db.collection('users', function(er, coll){
					assert.equal(null, er);
					coll.remove({}, {}, function(err) {
						assert.equal(null, err);
						db.collection('offers', function(er, coll){
							assert.equal(null, er);
							coll.remove({}, {}, function(err) {
								assert.equal(null, err);
								db.collection('claims', function(er, coll){
									assert.equal(null, er);
									coll.remove({}, {}, function(err) {
										assert.equal(null, err);
										res.status(200);
										res.send("Success: users, claims, and offers collections cleared.");
									});
								});
							});
						});
					});
				});
			}
			else {
				res.status(404);
				res.send("Error: Collection does not exist.");
			}
		} else {
			res.status(403);
			res.send("Error: Access denied.");            
		}
	} else {
		res.status(400);
		res.send("Error: Invalid fields.");
	}
});

app.listen(app.get('port'));