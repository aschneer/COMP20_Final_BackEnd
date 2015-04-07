var express = require('express');
var assert = require('assert');
var bodyParser = require('body-parser');
var validator = require('validator');

var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/';
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(mongoUri, function(er, connection) {
    assert.equal(null, er);
    db = connection;
});

app.get('/', function(req, res) {
    res.send("steve!");
});

// sends an offer to the database
app.post('/sendOffer', function(req, res) {
    res.send('sendoffer!');
});

// removes offer from unclaimed; adds it to claimed
app.post('/claimOffer', function(req, res) {
    res.send('claim offer!');
});

// returns the unclaimed, untimedout offers for a specific provider
app.get('/unclaimedOffers.json', function(req, res) {
    res.send("provider's offers!");
});

// sends all untimedout, claimed offers for a specific provider
app.get('/claimedOffers', function(req, res) {
    res.send('claimed offers!')
});


// sends all unclaimed, untimedout offers
app.get('/allOffers', function(req, res) {
    res.send('all offers!');
});


app.listen(app.get('port'));