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
    res.set('Content-Type', 'text/html');
    var page = '<!DOCTYPE HTML><html>';
    page += '<head style="margin:0 0;width:100%;height:100%;">';
    page += '<title>Web Programming Spring 2015 Team 3 Food db</title>';
    page += '</head>';
    page += '<body style="background:#444444;width:600px;height:100%;margin:0 auto;">';
    page += '<h1 style="width:100%;padding-top:1rem;margin:0 auto;">Food Offers Logged</h1>';
    db.collection('offers', function(er, offers) {
        // assert.equal(er, null);
        offers.find({}, {limit:20 /*, sort: [['created_at',-1]]*/}).toArray(function(err, log) {
            // assert.equal(null, err);
            page += '<ol>'
            for (var i = 0; i < log.length; i++) {
                s = '<span style="color:#e67e22">' + log[i].provider + '</span> ';
                s += 'offered <span style="color:#e74c3c">' + log[i].food + '</span> ' 
                s += 'at <span style="color:#27ae60">' + log[i].address + '</span>'; 
                page += '<li>' + s + '</li>';
            }
            page += '</ol>'
        });
    });
    page += "</body></html>";    
    res.send(page);
});

// sends an offer to the database
app.post('/sendOffer', function(req, res, next) {
    var data = req.body;
    if (data.hasOwnProperty('provider') && data.hasOwnProperty('food') && data.hasOwnProperty('address') && data.hasOwnProperty('when')) {
        // Insert

        // db.collection('offers', function(er, offers) {
        //     assert.equal(null, er);

        // });
        res.status(200);
        res.send("so much steve");
    } else {
        console.log('not it all');
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