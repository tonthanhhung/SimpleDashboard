// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
// var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var request = require('request');
// configuration =================

// mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");


// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/show', function(req, res) {

    var dataRs;
    request({
        uri: 'http://www.countyhealthrankings.org/chr/data/compare/2015/06?counties=24_011+04_005+04_012+10_003+10_005+24_005',
        json: true,
        method: 'GET'
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // Print the google web page.
            res.json(body); // return all todos in JSON format
        }
    })

});
// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
