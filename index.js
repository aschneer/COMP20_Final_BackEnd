var express = require('express');
var assert = require('assert');
var bodyParser = require('body-parser');
var validator = require('validator');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/';
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(mongoUri, function(er, connection) {
    assert.equal(null, er);
    db = connection;
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next) {
    res.send("steve!");
});

// sends an offer to the database
app.post('/sendOffer', function(req, res, next) {
    var data = req.body;
    if (data.hasOwnProperty('provider') && data.hasOwnProperty('food') && data.hasOwnProperty('address') && data.hasOwnProperty('when')) {
        // Insert

        // db.collection('offers', function(er, offers) {
        //     assert.equal(null, er);

        // });
        res.sendStatus(200);
    } else {
        res.send('bad sendOffer POST yo');
    }
});

// removes offer from unclaimed; adds it to claimed
app.post('/claimOffer', function(req, res, next) {
    var data = req.body;
    if (data.hasOwnProperty('_id') && data.hasOwnProperty('login')) {
        res.sendStatus(200);
    } else {
        res.send('bad claimOffer POST yo');
    }
});

// returns list of claimed offers for a specific login
app.get('/myOffers.json', function(req, res, next) {
    var query = req.query;
    if (data.hasOwnProperty('login')) {
        res.sendStatus(200);
    } else {
        res.send('bad myOffers GET yo');
    }
});

// returns the untimedout offers for a specific provider, either claimed or unclaimed
app.get('/providerOffers.json', function(req, res, next) {
    var query = req.query;
    if (query.hasOwnProperty('provider') && query.hasOwnProperty('claimed')) {
        res.sendStatus(200);
    } else {
        res.send('bad unclaimedOffers.json GET yo')
    }
});

// sends all unclaimed, untimedout offers
app.get('/allOffers', function(req, res, next) {
    res.send('all offers!');
});


app.listen(app.get('port'));