//Express Application Dependencies

var bodyParser = require('body-parser');
var express = require('express');

// Express Server Configuration 
var app = express();

// Use bodyparser for requests with json data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");
    
    //"http://webresumeproject-bofcarbon1.c9users.io:8080");
    //"http://webresumemaintproject-bofcarbon1.c9users.io:8080");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'application/json');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Routes
require('./routes/routes.js')(app);

// Start the Express Server
app.listen(8082);
console.log('Listening on port: 8082');

