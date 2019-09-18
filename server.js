const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config/config');
let middleware = require('./app/middlewares/middleware');
var request = require('request');

// create express app
const app = express();




function main() {

    let app = express(); // Export app for other routes to use
    const port = process.env.PORT || 3000;


    var bodyParser = require('body-parser');
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



    // Configuring the database
    const dbConfig = require('./config/database.config.js');
    const mongoose = require('mongoose');

    mongoose.Promise = global.Promise;

    // Connecting to the database
    mongoose.connect(dbConfig.url, {
        useNewUrlParser: true
    }).then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

    request('https://realemail.expeditedaddons.com/?api_key=NDMOZ4E5280608QT54C17AY16UPVX3JLHI39W9GF27RSBK&email=email@example.org&fix_typos=false', function (error, response, body) {
        //console.log('Status:', response.statusCode);
        //console.log('Headers:', JSON.stringify(response.headers));
        //console.log('Response:', body);
    });

    var cors = require('cors');
    app.use(cors());
    // Routes & Handlers
    require('./app/routes/app.routes.js')(app);
    app.use(express.static(__dirname + '/public/images'));
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
    
}

main();




