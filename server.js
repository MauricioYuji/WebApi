const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config/config');
let middleware = require('./app/middlewares/middleware');

// create express app
const app = express();




class HandlerGenerator {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        // For the given username fetch user from DB
        let mockedUsername = 'admin';
        let mockedPassword = 'password';

        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                let token = jwt.sign({ username: username },
                    config.secret,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
    index(req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }
}

function main() {

    let app = express(); // Export app for other routes to use
    let handlers = new HandlerGenerator();
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
    app.post('/login', handlers.login);
    app.get('/', middleware.checkToken, handlers.index);
    require('./app/routes/app.routes.js')(app);
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();




