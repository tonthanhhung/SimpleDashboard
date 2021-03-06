// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var request = require('request');
// configuration =================


app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("Application Server listening on port 8080");


// routes ======================================================================

// api ---------------------------------------------------------------------
var apiHostname = 'http://www.countyhealthrankings.org';


app.get('/api/common/states', function(req, res) {
    request({
        uri: apiHostname + '/chr/data/states/2016',
        json: true,
        method: 'GET'
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body);
        }
    })
})

app.get('/api/common/counties/:stateId', function(req, res) {
    console.log(apiHostname + '/chr/data/county/2016/' + req.params.stateId + '/baca');
    request({
        uri: apiHostname + '/chr/data/county/2016/' + req.params.stateId + '/baca',
        json: true,
        method: 'GET'
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(response);
            res.json(body);
        }
    })
})

app.get('/api/health/compare/:year', function(req, res) {
    // http://www.countyhealthrankings.org/chr/data/compare/2015/6?counties=24_011+04_005+04_012+10_003+10_005+24_005
    var year = req.params.year;
    var counties = req.query.counties;
    console.log(apiHostname + '/chr/data/compare/' + year + '/48?counties=' + counties);
    request({
        uri: apiHostname + '/chr/data/compare/' + year + '/48?counties=' + counties,
        json: true,
        method: 'GET'
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body);
        }
    });
})

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
