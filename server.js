const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config/config');
let middleware = require('./app/middlewares/middleware');

// create express app
const app = express();




function main() {

    let app = express(); // Export app for other routes to use
    const port = process.env.PORT || 3000;



    app.use(bodyParser.urlencoded({ // Middleware
        extended: true
    }));
    app.use(bodyParser.json());


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


    var cors = require('cors');
    app.use(cors());
    // Routes & Handlers
    require('./app/routes/app.routes.js')(app);
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();




